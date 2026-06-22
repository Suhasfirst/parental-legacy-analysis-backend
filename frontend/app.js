// Configuration
const API_BASE_URL = 'https://parental-legacy-analysis-backend-production.up.railway.app';

// Chart instances
let barChartInstance = null;
let pieChartInstance = null;
let heatmapChartInstance = null;

// Analysis data
let analysisData = null;

// Elements
const fileInput = document.getElementById('fileInput');
const dropzone = document.getElementById('dropzone');
const uploadBtn = document.getElementById('uploadBtn');
const uploadLoading = document.getElementById('uploadLoading');
const statusMessage = document.getElementById('statusMessage');
const fileInfo = document.getElementById('fileInfo');
const fileName = document.getElementById('fileName');
const fileSize = document.getElementById('fileSize');
const resultsContainer = document.getElementById('resultsContainer');
const resultsPlaceholder = document.getElementById('resultsPlaceholder');
const chartsSection = document.getElementById('chartsSection');
const comparisonSection = document.getElementById('comparisonSection');
const insightsSection = document.getElementById('insightsSection');
const detailsSection = document.getElementById('detailsSection');

let selectedFile = null;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
});

function setupEventListeners() {
    // File input
    fileInput.addEventListener('change', handleFileSelect);

    // Dropzone
    dropzone.addEventListener('click', () => fileInput.click());
    dropzone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropzone.classList.add('dragover');
    });
    dropzone.addEventListener('dragleave', () => {
        dropzone.classList.remove('dragover');
    });
    dropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropzone.classList.remove('dragover');
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            fileInput.files = files;
            handleFileSelect();
        }
    });

    // Upload button
    uploadBtn.addEventListener('click', uploadAndAnalyze);

    // Action buttons
    document.getElementById('chartBtn').addEventListener('click', scrollToCharts);
    document.getElementById('reportBtn').addEventListener('click', downloadReport);
}

function handleFileSelect() {
    const file = fileInput.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'];
    const validExtensions = ['.xlsx', '.xls'];
    const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();

    if (!validTypes.includes(file.type) && !validExtensions.includes(fileExtension)) {
        showStatus('Only .xlsx and .xls files are supported', 'error');
        return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
        showStatus('File size must be less than 10MB', 'error');
        return;
    }

    selectedFile = file;
    fileName.textContent = file.name;
    fileSize.textContent = (file.size / 1024).toFixed(2) + ' KB';
    fileInfo.style.display = 'block';
    uploadBtn.disabled = false;
    uploadBtn.textContent = '📤 Upload & Analyze';
    statusMessage.style.display = 'none';
}

async function uploadAndAnalyze() {
    if (!selectedFile) {
        showStatus('Please select a file', 'error');
        return;
    }

    try {
        uploadLoading.style.display = 'block';
        uploadBtn.disabled = true;

        // Step 1: Upload file
        showStatus('Uploading file...', 'info');
        const formData = new FormData();
        formData.append('file', selectedFile);

        const uploadResponse = await axios.post(`${API_BASE_URL}/api/upload`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });

        if (!uploadResponse.data.success) {
            throw new Error(uploadResponse.data.error || 'Upload failed');
        }

        // Step 2: Analyze data
        showStatus('Analyzing data...', 'info');
        const analysisResponse = await axios.post(`${API_BASE_URL}/api/analyze`);

        if (!analysisResponse.data.success) {
            throw new Error(analysisResponse.data.error || 'Analysis failed');
        }

        analysisData = analysisResponse.data.data;

        // Display results
        displayResults();
        uploadLoading.style.display = 'none';
        showStatus('✅ Analysis complete!', 'success');

    } catch (error) {
        console.error('Error:', error);
        uploadLoading.style.display = 'none';
        showStatus('❌ ' + (error.response?.data?.error || error.message), 'error');
    } finally {
        uploadBtn.disabled = false;
        uploadBtn.textContent = '📤 Upload & Analyze';
    }
}

function displayResults() {
    resultsPlaceholder.style.display = 'none';
    resultsContainer.style.display = 'block';
    chartsSection.style.display = 'block';
    comparisonSection.style.display = 'block';
    insightsSection.style.display = 'block';
    detailsSection.style.display = 'block';

    // Update summary cards
    document.getElementById('motherTotal').textContent = analysisData.motherData.total.toFixed(2);
    document.getElementById('fatherTotal').textContent = analysisData.fatherData.total.toFixed(2);

    // Validation status
    const validationHtml = `
        <div class="flex gap-2">
            <span class="badge ${analysisData.validation.motherValid ? 'badge-success' : 'badge-warning'}">
                Mother: ${analysisData.validation.motherValid ? '✓ Valid' : '⚠ Invalid'}
            </span>
            <span class="badge ${analysisData.validation.fatherValid ? 'badge-success' : 'badge-warning'}">
                Father: ${analysisData.validation.fatherValid ? '✓ Valid' : '⚠ Invalid'}
            </span>
        </div>
    `;
    document.getElementById('validationStatus').innerHTML = validationHtml;

    // Highest/Lowest
    document.getElementById('motherHighest').textContent = 
        `${analysisData.motherData.highest.factor} (${analysisData.motherData.highest.value.toFixed(2)})`;
    document.getElementById('fatherHighest').textContent = 
        `${analysisData.fatherData.highest.factor} (${analysisData.fatherData.highest.value.toFixed(2)})`;

    // Render charts
    renderCharts();

    // Display comparison table
    displayComparisonTable();

    // Display insights
    displayInsights();

    // Display breakdown
    displayBreakdown();
}

function renderCharts() {
    setTimeout(() => {
        renderBarChart();
        renderPieChart();
        renderHeatmapChart();
    }, 100);
}

function renderBarChart() {
    const ctx = document.getElementById('barChart').getContext('2d');
    
    const labels = Object.keys(analysisData.comparison).map(k => 
        k.charAt(0).toUpperCase() + k.slice(1).replace('_', ' ')
    );
    const motherData = Object.values(analysisData.comparison).map(v => v.mother);
    const fatherData = Object.values(analysisData.comparison).map(v => v.father);

    if (barChartInstance) barChartInstance.destroy();

    barChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Mother',
                    data: motherData,
                    backgroundColor: 'rgba(255, 102, 178, 0.7)',
                    borderColor: 'rgba(255, 102, 178, 1)',
                    borderWidth: 2,
                    borderRadius: 4,
                    hoverBackgroundColor: 'rgba(255, 102, 178, 0.9)'
                },
                {
                    label: 'Father',
                    data: fatherData,
                    backgroundColor: 'rgba(102, 178, 255, 0.7)',
                    borderColor: 'rgba(102, 178, 255, 1)',
                    borderWidth: 2,
                    borderRadius: 4,
                    hoverBackgroundColor: 'rgba(102, 178, 255, 0.9)'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        usePointStyle: true,
                        padding: 20,
                        font: { size: 12, weight: 'bold' }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        callback: function(value) {
                            return value.toFixed(0);
                        }
                    }
                }
            }
        }
    });
}

function renderPieChart() {
    const ctx = document.getElementById('pieChart').getContext('2d');
    
    if (pieChartInstance) pieChartInstance.destroy();

    pieChartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Mother', 'Father'],
            datasets: [{
                data: [analysisData.motherData.total, analysisData.fatherData.total],
                backgroundColor: [
                    'rgba(255, 102, 178, 0.7)',
                    'rgba(102, 178, 255, 0.7)'
                ],
                borderColor: [
                    'rgba(255, 102, 178, 1)',
                    'rgba(102, 178, 255, 1)'
                ],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'bottom',
                    labels: {
                        usePointStyle: true,
                        padding: 20,
                        font: { size: 12, weight: 'bold' }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((context.parsed / total) * 100).toFixed(1);
                            return `${context.label}: ${context.parsed.toFixed(2)} (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}

function renderHeatmapChart() {
    const ctx = document.getElementById('heatmapChart').getContext('2d');
    
    const labels = Object.keys(analysisData.comparison).map(k => 
        k.charAt(0).toUpperCase() + k.slice(1).replace('_', ' ')
    );
    const motherData = Object.values(analysisData.comparison).map(v => v.mother);
    const fatherData = Object.values(analysisData.comparison).map(v => v.father);

    if (heatmapChartInstance) heatmapChartInstance.destroy();

    heatmapChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Mother',
                    data: motherData,
                    backgroundColor: 'rgba(255, 102, 178, 0.6)',
                    borderColor: 'rgba(255, 102, 178, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Father',
                    data: fatherData,
                    backgroundColor: 'rgba(102, 178, 255, 0.6)',
                    borderColor: 'rgba(102, 178, 255, 1)',
                    borderWidth: 1
                }
            ]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    labels: {
                        usePointStyle: true,
                        font: { size: 12, weight: 'bold' }
                    }
                }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    max: 100
                }
            }
        }
    });
}

function displayComparisonTable() {
    const tbody = document.getElementById('comparisonTableBody');
    tbody.innerHTML = '';

    Object.entries(analysisData.comparison).forEach(([factor, data]) => {
        const row = document.createElement('tr');
        const factorName = factor.charAt(0).toUpperCase() + factor.slice(1).replace('_', ' ');
        const winnerEmoji = data.winner === 'mother' ? '👩' : data.winner === 'father' ? '👨' : '🤝';
        const winnerText = data.winner.charAt(0).toUpperCase() + data.winner.slice(1);

        row.innerHTML = `
            <td class="font-semibold text-gray-900">${factorName}</td>
            <td class="text-center text-pink-600 font-bold">${data.mother.toFixed(2)}</td>
            <td class="text-center text-blue-600 font-bold">${data.father.toFixed(2)}</td>
            <td class="text-center text-gray-700">${Math.abs(data.difference).toFixed(2)}</td>
            <td class="text-center">
                <span class="badge badge-success">${winnerEmoji} ${winnerText}</span>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function displayInsights() {
    const insightsList = document.getElementById('insightsList');
    const recommendationsList = document.getElementById('recommendationsList');

    insightsList.innerHTML = '';
    recommendationsList.innerHTML = '';

    analysisData.insights.insights.forEach(insight => {
        const li = document.createElement('li');
        li.className = 'text-gray-700';
        li.textContent = insight;
        insightsList.appendChild(li);
    });

    analysisData.insights.recommendations.forEach(rec => {
        const li = document.createElement('li');
        li.className = 'text-gray-700';
        li.textContent = rec;
        recommendationsList.appendChild(li);
    });
}

function displayBreakdown() {
    const motherBreakdown = document.getElementById('motherBreakdown');
    const fatherBreakdown = document.getElementById('fatherBreakdown');

    motherBreakdown.innerHTML = '';
    fatherBreakdown.innerHTML = '';

    Object.entries(analysisData.motherData.factors).forEach(([factor, value]) => {
        const div = document.createElement('div');
        div.className = 'flex justify-between items-center bg-white p-3 rounded border border-pink-100';
        div.innerHTML = `
            <span class="text-gray-700 capitalize">${factor.replace('_', ' ')}</span>
            <span class="font-bold text-pink-700">${value.toFixed(2)}</span>
        `;
        motherBreakdown.appendChild(div);
    });

    Object.entries(analysisData.fatherData.factors).forEach(([factor, value]) => {
        const div = document.createElement('div');
        div.className = 'flex justify-between items-center bg-white p-3 rounded border border-blue-100';
        div.innerHTML = `
            <span class="text-gray-700 capitalize">${factor.replace('_', ' ')}</span>
            <span class="font-bold text-blue-700">${value.toFixed(2)}</span>
        `;
        fatherBreakdown.appendChild(div);
    });
}

function displayComparisonTable() {
    const tbody = document.getElementById('comparisonTableBody');
    tbody.innerHTML = '';

    Object.entries(analysisData.comparison).forEach(([factor, data]) => {
        const row = document.createElement('tr');
        const factorName = factor.charAt(0).toUpperCase() + factor.slice(1).replace('_', ' ');
        const winnerEmoji = data.winner === 'mother' ? '👩' : data.winner === 'father' ? '👨' : '🤝';
        const winnerText = data.winner.charAt(0).toUpperCase() + data.winner.slice(1);

        row.innerHTML = `
            <td class="font-semibold text-gray-900">${factorName}</td>
            <td class="text-center text-pink-600 font-bold">${data.mother.toFixed(2)}</td>
            <td class="text-center text-blue-600 font-bold">${data.father.toFixed(2)}</td>
            <td class="text-center text-gray-700">${Math.abs(data.difference).toFixed(2)}</td>
            <td class="text-center">
                <span class="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-bold">
                    ${winnerEmoji} ${winnerText}
                </span>
            </td>
        `;
        tbody.appendChild(row);
    });
}

async function downloadReport() {
    try {
        uploadBtn.disabled = true;
        showStatus('Generating PDF report...', 'info');

        const response = await axios.get(`${API_BASE_URL}/api/report`, {
            responseType: 'blob'
        });

        // Create blob link to download
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `Legacy-Analysis-Report-${new Date().toISOString().split('T')[0]}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.parentURL.removeChild(link);

        showStatus('✅ Report downloaded successfully!', 'success');
    } catch (error) {
        console.error('Error:', error);
        showStatus('❌ Failed to download report: ' + (error.response?.data?.error || error.message), 'error');
    } finally {
        uploadBtn.disabled = false;
    }
}

function scrollToCharts() {
    document.getElementById('chartsSection').scrollIntoView({ behavior: 'smooth' });
}

function showStatus(message, type) {
    statusMessage.textContent = message;
    statusMessage.className = `mt-4 p-4 rounded-lg text-sm border ${type === 'success' ? 'status-success' : type === 'error' ? 'status-error' : 'status-info'} fade-in`;
    statusMessage.style.display = 'block';
}
