let chart;

function generate_graph() {
  const domElement = document.getElementById('portfolio-graph');

  if (chart) {
    chart.remove();
    chart = null;
  }

  const chartProperties = {
    width: domElement.offsetWidth,
    height: domElement.offsetHeight,
    timeScale: {
      timeVisible: true,
      secondsVisible: false,
    },
  };

  chart = LightweightCharts.createChart(domElement, chartProperties);
  const candleSeries = chart.addCandlestickSeries();

  try {
    const cdata = portfolioChartData.map(d => ({
      time: d.timestamp / 1000,
      open: d.open,
      high: d.high,
      low: d.low,
      close: d.close,
    }));

    candleSeries.setData(cdata);
  } catch (err) {
    throw err;
  }
}

generate_graph();
window.addEventListener("resize", generate_graph);


async function removeCoin(event) {
  const id = event.target.closest('button').getAttribute('data-id');
  if (id) {
    try {
      const response = await fetch(`/profile/remove-coin/${id}`, {
          method: 'DELETE',
          headers: {
              'Content-Type': 'application/json',
          },
      });
      if (response.ok) {
        window.location.href = '/profile';
      } else {
        alert('Failed to remove coin');
      }
    } catch (err) {
      throw err;
    }
  }
}

function openEditModal(event) {
  const id = event.target.closest('button').getAttribute('data-id');
  const coinData = portfolioData.find(coin => coin.crypto_sol_id == id);

  if (coinData) {
      document.getElementById('crypto-quantity').value = coinData.quantity_owned;
      document.getElementById('crypto-id').value = id;
      document.getElementById('edit-modal').style.display = 'flex';
  }
}

function closeEditModal() {
  document.getElementById('edit-modal').style.display = 'none';
}

document.getElementById('edit-coin-form').addEventListener('submit', async function(event) {
  event.preventDefault();

  const updatedQuantity = document.getElementById('crypto-quantity').value.replace(',', '.');
  const id = document.getElementById('crypto-id').value;

  const response = await fetch(`/profile/edit-coin/${id}/${updatedQuantity}`, {
    method: 'PUT',
    headers: {
        'Content-Type': 'application/json',
    },
  })
  if (response.ok) {
    closeEditModal();
  }
});