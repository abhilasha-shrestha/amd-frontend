const BACKEND_URL = 'https://amd-backend-76r6.onrender.com';  // ✅ Backend URL

async function fetchCurrentData() {
  try {
    const response = await fetch(`${BACKEND_URL}/api/current-data`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    console.log('✅ Current Data Fetched:', data);
    return data;
  } catch (error) {
    console.error('❌ Error fetching current data:', error);
    return null;
  }
}

async function fetchPredictions(sensorData) {
  try {
    const response = await fetch(`${BACKEND_URL}/api/ai-predictions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sensorData),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    console.log('✅ AI Predictions Received:', data);
    return data;
  } catch (error) {
    console.error('❌ Error fetching AI predictions:', error);
    return null;
  }
}

async function fetchHistoricalData() {
  try {
    const response = await fetch(`${BACKEND_URL}/api/historical-data`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    console.log('✅ Historical Data Fetched:', data);
    return data;
  } catch (error) {
    console.error('❌ Error fetching historical data:', error);
    return [];
  }
}

async function fetchModelsStatus() {
  try {
    const response = await fetch(`${BACKEND_URL}/api/models-status`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    console.log('✅ Models Status Fetched:', data);
    return data;
  } catch (error) {
    console.error('❌ Error fetching models status:', error);
    return null;
  }
}

// Dummy function to prevent missing function error from index.html
function runAIAnalysis() {
  console.log('ℹ️ runAIAnalysis called.');
  // You can optionally call fetchPredictions() here if needed.
}

// Example Initialization Function
async function initDashboard() {
  const currentData = await fetchCurrentData();
  if (currentData) {
    await fetchPredictions({
      pH: currentData.pH,
      turbidity: currentData.turbidity,
      orp: currentData.orp,
    });
  }

  await fetchHistoricalData();
  await fetchModelsStatus();
}

// Auto-start dashboard on load
document.addEventListener('DOMContentLoaded', () => {
  initDashboard().catch((err) => {
    console.error('❌ Unexpected error in dashboard:', err);
  });
});



// Function to update the dashboard UI with current data
function updateDashboardUI(currentData, predictions) {
  // Update sensor values
  document.getElementById('ph-value').textContent = currentData.pH.toFixed(2);
  document.getElementById('turbidity-value').textContent = currentData.turbidity.toFixed(2);
  document.getElementById('orp-value').textContent = currentData.orp.toFixed(2);
  
  // Update progress bars
  document.getElementById('ph-progress').style.width = `${Math.min(100, (currentData.pH / 7) * 100)}%`;
  document.getElementById('turbidity-progress').style.width = `${Math.min(100, (currentData.turbidity / 1000) * 100}%`;
  document.getElementById('orp-progress').style.width = `${Math.min(100, (Math.abs(currentData.orp) / 200) * 100}%`;
  
  // Update last update time
  document.getElementById('last-update').textContent = new Date().toLocaleTimeString();
  
  // Update predictions if available
  if (predictions) {
    document.getElementById('maintenance-prediction').innerHTML = 
      `Limestone replacement needed in: <strong>${predictions.maintenance.days_until_replacement} days</strong><br>
       Confidence: ${predictions.maintenance.confidence}%`;
    
    document.getElementById('quality-prediction').innerHTML = 
      `Current Status: <strong>${predictions.quality.status}</strong><br>
       Recommendation: ${getRecommendation(predictions.quality.status)}`;
    
    document.getElementById('anomaly-prediction').innerHTML = 
      `System Status: <strong>${predictions.anomaly.status}</strong><br>
       ${predictions.anomaly.is_anomaly ? '⚠️ Anomaly detected!' : 'No anomalies detected'}`;
  }
}

// Helper function for recommendations
function getRecommendation(status) {
  switch(status) {
    case 'Safe': return 'No action needed';
    case 'Warning': return 'Monitor closely for next 24 hours';
    case 'Dangerous': return 'Immediate action required';
    default: return 'Status unknown';
  }
}

async function fetchCurrentData() {
  try {
    const response = await fetch(`${BACKEND_URL}/api/current-data`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    console.log('✅ Current Data Fetched:', data);
    return data;
  } catch (error) {
    console.error('❌ Error fetching current data:', error);
    // Return fallback data
    return {
      pH: 6.5,
      turbidity: 500,
      orp: -100,
      alert_code: 0,
      timestamp: new Date().toISOString()
    };
  }
}

async function fetchPredictions(sensorData) {
  try {
    const response = await fetch(`${BACKEND_URL}/api/ai-predictions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sensorData),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    console.log('✅ AI Predictions Received:', data);
    return data;
  } catch (error) {
    console.error('❌ Error fetching AI predictions:', error);
    // Return fallback predictions
    return {
      maintenance: { days_until_replacement: 5, confidence: 50 },
      quality: { status: 'Unknown', confidence: 0.5 },
      anomaly: { is_anomaly: false, status: 'Detection unavailable' }
    };
  }
}

async function fetchHistoricalData() {
  try {
    const response = await fetch(`${BACKEND_URL}/api/historical-data`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    console.log('✅ Historical Data Fetched:', data);
    return data;
  } catch (error) {
    console.error('❌ Error fetching historical data:', error);
    return [];
  }
}

async function fetchModelsStatus() {
  try {
    const response = await fetch(`${BACKEND_URL}/api/models-status`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    console.log('✅ Models Status Fetched:', data);
    return data;
  } catch (error) {
    console.error('❌ Error fetching models status:', error);
    return null;
  }
}

// Function to refresh all data
async function refreshData() {
  try {
    const currentData = await fetchCurrentData();
    let predictions = null;
    
    if (currentData) {
      predictions = await fetchPredictions({
        pH: currentData.pH,
        turbidity: currentData.turbidity,
        orp: currentData.orp,
      });
      updateDashboardUI(currentData, predictions);
    }
    
    await fetchHistoricalData();
    await fetchModelsStatus();
    
    // Show refresh confirmation
    const lastUpdate = document.getElementById('last-update');
    lastUpdate.textContent = new Date().toLocaleTimeString();
    lastUpdate.classList.add('highlight');
    setTimeout(() => lastUpdate.classList.remove('highlight'), 1000);
    
  } catch (error) {
    console.error('❌ Error refreshing data:', error);
  }
}

// Run AI Analysis function
async function runAIAnalysis() {
  try {
    const currentData = await fetchCurrentData();
    if (currentData) {
      const predictions = await fetchPredictions({
        pH: currentData.pH,
        turbidity: currentData.turbidity,
        orp: currentData.orp,
      });
      updateDashboardUI(currentData, predictions);
    }
  } catch (error) {
    console.error('❌ Error running AI analysis:', error);
  }
}

// Example Initialization Function
async function initDashboard() {
  const currentData = await fetchCurrentData();
  let predictions = null;
  
  if (currentData) {
    predictions = await fetchPredictions({
      pH: currentData.pH,
      turbidity: currentData.turbidity,
      orp: currentData.orp,
    });
    updateDashboardUI(currentData, predictions);
  }

  await fetchHistoricalData();
  await fetchModelsStatus();
}

// Auto-start dashboard on load
document.addEventListener('DOMContentLoaded', () => {
  initDashboard().catch((err) => {
    console.error('❌ Unexpected error in dashboard:', err);
  });
});