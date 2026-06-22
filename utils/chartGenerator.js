const axios = require('axios');

/**
 * Generate bar chart comparing mother and father
 */
async function generateBarChart(comparison) {
  try {
    const labels = Object.keys(comparison);
    const motherData = labels.map(label => comparison[label].mother);
    const fatherData = labels.map(label => comparison[label].father);

    const chartConfig = {
      type: 'bar',
      data: {
        labels: labels.map(l => l.charAt(0).toUpperCase() + l.slice(1)),
        datasets: [
          {
            label: 'Mother',
            data: motherData,
            backgroundColor: 'rgba(255, 102, 178, 0.7)',
            borderColor: 'rgba(255, 102, 178, 1)',
            borderWidth: 2
          },
          {
            label: 'Father',
            data: fatherData,
            backgroundColor: 'rgba(102, 178, 255, 0.7)',
            borderColor: 'rgba(102, 178, 255, 1)',
            borderWidth: 2
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          title: {
            display: true,
            text: 'Life Factors Comparison: Mother vs Father',
            font: { size: 18, weight: 'bold' }
          },
          legend: {
            display: true,
            position: 'top'
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            title: {
              display: true,
              text: 'Score'
            }
          }
        }
      }
    };

    // Use QuickChart API to generate image
    try {
      const quickChartUrl = 'https://quickchart.io/chart';
      const response = await axios.post(quickChartUrl, {
        chart: chartConfig,
        width: 1200,
        height: 600,
        format: 'png'
      }, {
        timeout: 5000,
        responseType: 'arraybuffer'
      });

      return { success: true, image: response.data };
    } catch (apiError) {
      // If QuickChart API fails, return chart config as JSON
      console.warn('QuickChart API unavailable, returning chart config');
      return { success: true, image: Buffer.from(JSON.stringify(chartConfig)), isJson: true };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Generate pie chart showing total contribution
 */
async function generatePieChart(motherTotal, fatherTotal) {
  try {
    const chartConfig = {
      type: 'pie',
      data: {
        labels: ['Mother', 'Father'],
        datasets: [
          {
            data: [motherTotal, fatherTotal],
            backgroundColor: [
              'rgba(255, 102, 178, 0.7)',
              'rgba(102, 178, 255, 0.7)'
            ],
            borderColor: [
              'rgba(255, 102, 178, 1)',
              'rgba(102, 178, 255, 1)'
            ],
            borderWidth: 2
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          title: {
            display: true,
            text: 'Total Contribution Distribution',
            font: { size: 18, weight: 'bold' }
          },
          legend: {
            display: true,
            position: 'bottom'
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const label = context.label || '';
                const value = context.parsed || 0;
                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                const percentage = ((value / total) * 100).toFixed(1);
                return `${label}: ${value.toFixed(2)} (${percentage}%)`;
              }
            }
          }
        }
      }
    };

    // Use QuickChart API
    try {
      const quickChartUrl = 'https://quickchart.io/chart';
      const response = await axios.post(quickChartUrl, {
        chart: chartConfig,
        width: 1000,
        height: 600,
        format: 'png'
      }, {
        timeout: 5000,
        responseType: 'arraybuffer'
      });

      return { success: true, image: response.data };
    } catch (apiError) {
      console.warn('QuickChart API unavailable, returning chart config');
      return { success: true, image: Buffer.from(JSON.stringify(chartConfig)), isJson: true };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Generate heatmap for parent comparison
 */
async function generateHeatmap(comparison) {
  try {
    const labels = Object.keys(comparison);
    const yLabels = labels.map(l => l.charAt(0).toUpperCase() + l.slice(1));

    const chartConfig = {
      type: 'bar',
      data: {
        labels: yLabels,
        datasets: [
          {
            label: 'Mother',
            data: labels.map(label => comparison[label].mother),
            backgroundColor: 'rgba(255, 102, 178, 0.6)',
            borderColor: 'rgba(255, 102, 178, 1)',
            borderWidth: 1
          },
          {
            label: 'Father',
            data: labels.map(label => comparison[label].father),
            backgroundColor: 'rgba(102, 178, 255, 0.6)',
            borderColor: 'rgba(102, 178, 255, 1)',
            borderWidth: 1
          }
        ]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          title: {
            display: true,
            text: 'Parent Comparison Heatmap',
            font: { size: 18, weight: 'bold' }
          },
          legend: {
            display: true
          }
        },
        scales: {
          x: {
            beginAtZero: true,
            max: 100
          }
        }
      }
    };

    // Use QuickChart API
    try {
      const quickChartUrl = 'https://quickchart.io/chart';
      const response = await axios.post(quickChartUrl, {
        chart: chartConfig,
        width: 1200,
        height: 600,
        format: 'png'
      }, {
        timeout: 5000,
        responseType: 'arraybuffer'
      });

      return { success: true, image: response.data };
    } catch (apiError) {
      console.warn('QuickChart API unavailable, returning chart config');
      return { success: true, image: Buffer.from(JSON.stringify(chartConfig)), isJson: true };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Get chart configuration as JSON (for client-side rendering)
 */
function getChartConfigs(analysis) {
  const labels = Object.keys(analysis.comparison);
  const motherData = labels.map(label => analysis.comparison[label].mother);
  const fatherData = labels.map(label => analysis.comparison[label].father);

  return {
    barChart: {
      type: 'bar',
      data: {
        labels: labels.map(l => l.charAt(0).toUpperCase() + l.slice(1)),
        datasets: [
          {
            label: 'Mother',
            data: motherData,
            backgroundColor: 'rgba(255, 102, 178, 0.7)',
            borderColor: 'rgba(255, 102, 178, 1)',
            borderWidth: 2
          },
          {
            label: 'Father',
            data: fatherData,
            backgroundColor: 'rgba(102, 178, 255, 0.7)',
            borderColor: 'rgba(102, 178, 255, 1)',
            borderWidth: 2
          }
        ]
      }
    },
    pieChart: {
      type: 'pie',
      data: {
        labels: ['Mother', 'Father'],
        datasets: [
          {
            data: [analysis.motherData.total, analysis.fatherData.total],
            backgroundColor: [
              'rgba(255, 102, 178, 0.7)',
              'rgba(102, 178, 255, 0.7)'
            ]
          }
        ]
      }
    },
    heatmap: {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Mother',
            data: motherData,
            backgroundColor: 'rgba(255, 102, 178, 0.6)'
          },
          {
            label: 'Father',
            data: fatherData,
            backgroundColor: 'rgba(102, 178, 255, 0.6)'
          }
        ]
      }
    }
  };
}

module.exports = {
  generateBarChart,
  generatePieChart,
  generateHeatmap,
  getChartConfigs
};

