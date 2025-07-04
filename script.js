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