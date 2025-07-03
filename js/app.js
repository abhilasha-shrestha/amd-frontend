const THINGSPEAK_CHANNEL_ID = '2995113';
const READ_API_KEY = 'ZVERTLH6UBMXQS3R';

let currentData = {};

async function fetchCurrentData() {
  try {
    const res = await fetch('/api/current-data');
    currentData = await res.json();
    updateDashboard();
    fetchAIPredictions();
    updateChart(currentData);
  } catch (err) {
    console.error(err);
  }
}

async function fetchAIPredictions() {
  try {
    const res = await fetch('https://amd-backend-y7du.onrender.com/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(currentData)
    });
    const predictions = await res.json();
    document.getElementById('qualityStatus').innerText = predictions.quality.status;
  } catch (err) {
    console.error(err);
  }
}

function updateDashboard() {
  document.getElementById('phValue').innerText = currentData.pH?.toFixed(2);
  document.getElementById('turbidityValue').innerText = currentData.turbidity?.toFixed(1);
  document.getElementById('orpValue').innerText = currentData.orp?.toFixed(0);
}

function exportToCSV() {
  fetch('/api/historical-data')
    .then(res => res.json())
    .then(data => {
      const headers = ['timestamp', 'pH', 'turbidity', 'orp', 'alert_code'];
      const csv = [headers.join(','), ...data.map(row => headers.map(h => row[h]).join(','))].join('\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'amd_data_export.csv';
      a.click();
    });
}

// Chart setup
const ctx = document.getElementById('realTimeChart').getContext('2d');
const chart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: [],
    datasets: [{ label: 'pH', data: [], borderColor: '#e74c3c' }]
  },
  options: {
    responsive: true,
    scales: { y: { min: 0, max: 14 } }
  }
});

function updateChart(data) {
  const label = new Date().toLocaleTimeString();
  chart.data.labels.push(label);
  chart.data.datasets[0].data.push(data.pH);
  if (chart.data.labels.length > 20) {
    chart.data.labels.shift();
    chart.data.datasets[0].data.shift();
  }
  chart.update();
}

setInterval(fetchCurrentData, 15000);
