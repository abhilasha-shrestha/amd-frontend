const THINGSPEAK_CHANNEL_ID = '2995113';
const READ_API_KEY = 'ZVERTLH6UBMXQS3R';

const UPDATE_INTERVAL = 15000;

let currentData = {
    pH: 4.2,
    turbidity: 850,
    orp: -120,
    alertCode: 1
};

function updateDashboard() {
    document.getElementById('ph-value').textContent = currentData.pH.toFixed(1);
    document.getElementById('turbidity-value').textContent = currentData.turbidity.toFixed(0);
    document.getElementById('orp-value').textContent = currentData.orp.toFixed(0);
    document.getElementById('last-update').textContent = new Date().toLocaleTimeString();
    updateAlerts(currentData.alertCode);
    updateAIPredictions();
}

function updateAlerts(alertCode) {
    const alertsContainer = document.getElementById('alerts-container');
    alertsContainer.innerHTML = '';
    switch(alertCode) {
        case 0:
            alertsContainer.innerHTML = `<div class="alert alert-safe"><span class="status-indicator status-safe"></span>✅ All parameters normal. System operating safely.</div>`;
            break;
        case 1:
            alertsContainer.innerHTML = `<div class="alert alert-warning"><span class="status-indicator status-warning"></span>⚠️ Low pH detected (${currentData.pH}). Monitor limestone levels.</div>`;
            break;
        case 2:
            alertsContainer.innerHTML = `<div class="alert alert-warning"><span class="status-indicator status-warning"></span>⚠️ High turbidity detected (${currentData.turbidity} NTU). Check filtration system.</div>`;
            break;
        case 3:
            alertsContainer.innerHTML = `<div class="alert alert-danger danger-pulse"><span class="status-indicator status-danger"></span>🚨 CRITICAL: Low pH (${currentData.pH}) AND high turbidity (${currentData.turbidity} NTU)!</div>`;
            break;
    }
}

function updateAIPredictions() {
    const maintenanceDays = Math.max(1, Math.floor(7 - (7 - currentData.pH) * 2));
    const qualityLevel = currentData.pH < 3 ? "Dangerous" : currentData.pH < 4.5 ? "Warning" : "Safe";
    const anomalyStatus = (currentData.pH < 2 || currentData.turbidity > 2000) ? "Anomaly Detected" : "Normal Operation";

    document.getElementById('maintenance-prediction').innerHTML = `
        Limestone replacement needed in: <strong>${maintenanceDays} days</strong><br>
        Confidence: ${Math.floor(85 + Math.random() * 10)}%
    `;
    document.getElementById('quality-prediction').innerHTML = `
        Current Status: <strong>${qualityLevel}</strong><br>
        Recommendation: ${qualityLevel === 'Safe' ? 'Continue monitoring' : 'Immediate attention required'}
    `;
    document.getElementById('anomaly-prediction').innerHTML = `
        System Status: <strong>${anomalyStatus}</strong><br>
        ${anomalyStatus === 'Normal Operation' ? 'No anomalies detected' : 'Unusual readings detected - check sensors'}
    `;
}

function simulateDataUpdate() {
    currentData.pH += (Math.random() - 0.5) * 0.2;
    currentData.turbidity += (Math.random() - 0.5) * 50;
    currentData.orp = -75 * currentData.pH + 0.9 * currentData.turbidity + 350 + (Math.random() - 0.5) * 20;

    if (currentData.pH < 4.5 && currentData.turbidity > 1000) {
        currentData.alertCode = 3;
    } else if (currentData.pH < 4.5) {
        currentData.alertCode = 1;
    } else if (currentData.turbidity > 1000) {
        currentData.alertCode = 2;
    } else {
        currentData.alertCode = 0;
    }

    updateDashboard();
}

function refreshData() {
    simulateDataUpdate();
    showNotification('Data refreshed successfully!');
}

function exportData() {
    showNotification('Data export initiated...');
}

function runAIAnalysis() {
    showNotification('Running AI analysis...');
    setTimeout(() => {
        updateAIPredictions();
        showNotification('AI analysis complete!');
    }, 2000);
}

function calibrateSensors() {
    showNotification('Sensor calibration initiated...');
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed; top: 20px; right: 20px;
        background: #28a745; color: white;
        padding: 15px 20px; border-radius: 5px;
        z-index: 1000; box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        document.body.removeChild(notification);
    }, 3000);
}

updateDashboard();
setInterval(simulateDataUpdate, UPDATE_INTERVAL);
console.log('Dashboard initialized. Replace YOUR_CHANNEL_ID with your actual ThingSpeak channel ID.');
