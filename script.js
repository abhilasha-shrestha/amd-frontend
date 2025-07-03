const BACKEND_URL = 'https://amd-backend-y7du.onrender.com';
const UPDATE_INTERVAL = 15000; // 15 seconds

let currentData = {
    pH: 4.2,
    turbidity: 850,
    orp: -120,
    alertCode: 1
};

// Fetch live sensor data from your backend
async function fetchRealData() {
    try {
        const response = await fetch(`${BACKEND_URL}/api/current-data`);
        const data = await response.json();
        
        currentData.pH = data.pH;
        currentData.turbidity = data.turbidity;
        currentData.orp = data.orp;
        currentData.alertCode = data.alert_code;
        updateDashboard();
    } catch (error) {
        console.error('❌ Error fetching real data:', error);
        showNotification('❌ Failed to fetch sensor data');
    }
}

// Call AI prediction endpoint with current sensor data
async function getAIPredictions(sensorData) {
    try {
        const response = await fetch(`${API_BASE_URL}/predict`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(sensorData)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const predictions = await response.json();
        return predictions;
    } catch (error) {
        console.error('AI prediction error:', error);
        return null;
    }
}

// Update the UI with current sensor values
function updateDashboard() {
    document.getElementById('ph-value').textContent = currentData.pH.toFixed(1);
    document.getElementById('turbidity-value').textContent = currentData.turbidity.toFixed(0);
    document.getElementById('orp-value').textContent = currentData.orp.toFixed(0);
    document.getElementById('last-update').textContent = new Date().toLocaleTimeString();
    updateAlerts(currentData.alertCode);
    updateAIPredictions();
}

// Display system alerts based on alertCode
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

// Optional UI button interactions
function refreshData() {
    fetchRealData();
    showNotification('🔄 Data refreshed successfully!');
}

function exportData() {
    showNotification('📤 Data export initiated...');
}

function runAIAnalysis() {
    showNotification('🤖 Running AI analysis...');
    updateAIPredictions();
}

function calibrateSensors() {
    showNotification('⚙️ Sensor calibration initiated...');
}

// Toast-style notification for the UI
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

// Start the dashboard
fetchRealData(); // Initial call
setInterval(fetchRealData, UPDATE_INTERVAL); // Re-fetch every 15 seconds
console.log('✅ Dashboard initialized. Using backend at:', BACKEND_URL);
