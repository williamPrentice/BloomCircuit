let chart;
let allData = [];

function downsampleData(data, maxPoints = 200) {
    if (data.length <= maxPoints) return data;

    const skip = Math.floor(data.length / maxPoints);
    return data.filter((_, i) => i % skip === 0);
}

function calculateData(hours) {
    const currentTime = new Date().getTime();
    const cutoffTime = currentTime - (hours * 60 * 60 * 1000);

    let rollingAverageValues = [];
    let timestamps = [];

    for (let i = 0; i < allData.length; i++) {
        const timestamp = parseInt(allData[i]._id.substring(0, 8), 16) * 1000;
        
        if (timestamp >= cutoffTime) {
            let sum = 0;
            let count = 0;

            for (let j = 0; j < 200; j++) {
                if (i - j >= 0) {
                    const moisture = allData[i - j].moisturePercentage;
                    if (typeof moisture === 'number' && moisture >= 0 && moisture <= 100) {
                        sum += moisture;
                        count++;
                    }
                }
            }
            rollingAverageValues.push(count > 0 ? sum / count : NaN);
            timestamps.push(new Date(timestamp).toLocaleString());
        }
    }

    // Downsample the resulting data and timestamps to have around 1000 data points
    rollingAverageValues = downsampleData(rollingAverageValues);
    timestamps = downsampleData(timestamps);

    console.log("Rolling Average Values:", rollingAverageValues); // Log rollingAverageValues array

    updateChart(timestamps, rollingAverageValues);
}

function updateChart(timestamps, rollingAverageValues) {
    const ctx = document.getElementById('myChart').getContext('2d');
    const annotations = generateAnnotations(timestamps);
    if (chart) {
        chart.destroy();
    }

    // Calculate the min and max from rollingAverageValues excluding NaN values
    const validValues = rollingAverageValues.filter(v => !isNaN(v));
    const minValue = Math.min(...validValues);
    const maxValue = Math.max(...validValues);
    const adjustedMinValue = minValue > 1 ? minValue - 1 : minValue;
    const adjustedMaxValue = maxValue < 99 ? maxValue + 1 : maxValue;

    console.log("Valid Values:", validValues); // Log validValues array
    console.log("Min Value:", minValue, "Adjusted Min Value:", adjustedMinValue); // Log min values
    console.log("Max Value:", maxValue, "Adjusted Max Value:", adjustedMaxValue); // Log max values

    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: timestamps,
            datasets: [{
                label: 'Soil Moisture Percentage over Time (Rolling Average)',
                data: rollingAverageValues,
                borderColor: '#609eed', 
                pointBackgroundColor: '#609eed', 
                fill: false
            }]
        },
        options: {
            scales: {
                y: {
                    min: Math.floor(adjustedMinValue),
                    max: Math.ceil(adjustedMaxValue),
                    ticks: {
                        stepSize: 1,
                        color: '#a9a9a9' /* Dim gray for ticks */
                    },
                    gridLines: {
                        color: 'rgba(169, 169, 169, 0.1)' /* subtle grid lines */
                    }
                },
                x: {
                    ticks: {
                        color: '#a9a9a9' 
                    },
                    gridLines: {
                        color: 'rgba(169, 169, 169, 0.1)' 
                    }
                }
            },
            legend: {
                labels: {
                    fontColor: '#a9a9a9'
                }
            },
            plugins: {
                legend: {
                    position: 'bottom', 
                    labels: {
                        color: '#a9a9a9',
                        padding: 20,
                        boxWidth: 15
                    }
                },
                annotation: {
                    annotations: annotations,
                }
            }
        }
    });
    
    
}

fetch('/data')
    .then(response => response.json())
    .then(data => {
        allData = data;
        calculateData(document.getElementById('timeRange').value);
    });

document.getElementById('timeRange').addEventListener('change', function() {
    calculateData(this.value);
});

function getLightStatus(timestamp) {
    const date = new Date(timestamp);
    const hour = date.getHours();  // Get the hour from the date object
    if (hour >= 13 && hour < 19) {  // Lights on from 6 AM to 6 PM
        return 'off';
    } else {
        return 'on';
    }
}

function generateAnnotations(timestamps) {
    const annotations = [];
    let currentStatus = getLightStatus(new Date(timestamps[0]).getTime());  // Initial light status
    let startDate = timestamps[0];

    for (let i = 1; i < timestamps.length; i++) {
        const currentTimestamp = new Date(timestamps[i]);
        const previousTimestamp = new Date(timestamps[i - 1]);
        const status = getLightStatus(currentTimestamp.getTime());

        // Check if the current timestamp comes after midnight of the previous timestamp
        const midnightAfterPrevTimestamp = new Date(previousTimestamp);
        midnightAfterPrevTimestamp.setHours(24, 0, 0, 0); // Set to midnight of the next day

        if (currentTimestamp >= midnightAfterPrevTimestamp) {
            // Calculate drawable height here
            let drawableHeight;
            if (chart && chart.scales && chart.scales['y']) {
                drawableHeight = chart.scales['y'].bottom - chart.scales['y'].top;
            } else {
                drawableHeight = 0;  // Default fallback if chart isn't properly initialized yet
            }

            annotations.push({
                type: 'line',
                mode: 'vertical',
                scaleID: 'x',
                value: timestamps[i],
                borderColor: '#4b0082', // Light purple color
                borderWidth: 2,
                label: {
                    content: currentTimestamp.toLocaleDateString(),
                    enabled: true,
                    position: 'top',
                    backgroundColor: '#4b0082',
                    borderColor: '#4b0082',
                    borderWidth: 1,
                    cornerRadius: 4,
                    yAdjust: -drawableHeight / 2  // Adjust dynamically here
                }
            });
        }

        if (status !== currentStatus) {
            annotations.push({
                type: 'box',
                xMin: startDate,
                xMax: timestamps[i],
                backgroundColor: currentStatus === 'on' ? 'rgba(255, 255, 0, 0.1)' : 'rgba(0, 0, 255, 0.1)',
                borderColor: 'transparent'
            });
            startDate = timestamps[i];
            currentStatus = status;
        }
    }

    // Push the last light status annotation for the remaining period
    annotations.push({
        type: 'box',
        xMin: startDate,
        xMax: timestamps[timestamps.length - 1],
        backgroundColor: currentStatus === 'on' ? 'rgba(255, 255, 0, 0.1)' : 'rgba(0, 0, 255, 0.1)',
        borderColor: 'transparent'
    });

    return annotations;
}

