// Update these colors to match your preferred palette.
const chartPalette = [
  "#60a5fa",
  "#f472b6",
  "#34d399",
  "#facc15",
  "#a78bfa",
];

const buildCanvas = (container) => {
  container.innerHTML = "";
  const canvas = document.createElement("canvas");
  container.appendChild(canvas);
  return canvas;
};

const renderTotalsBarChart = (container, data) => {
  const canvas = buildCanvas(container);

  return new Chart(canvas, {
    type: "bar",
    data: {
      labels: data.labels,
      datasets: [
        {
          label: "Total weighted score",
          data: data.values,
          backgroundColor: "rgba(96, 165, 250, 0.5)",
          borderColor: "rgba(96, 165, 250, 0.9)",
          borderWidth: 2,
        },
      ],
    },
    // Adjust axis formatting and legend styling here.
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          ticks: { color: "#cbd5f5" },
          grid: { color: "rgba(148, 163, 184, 0.2)" },
        },
        x: {
          ticks: { color: "#cbd5f5" },
          grid: { display: false },
        },
      },
      plugins: {
        legend: { labels: { color: "#e2e8f0" } },
      },
    },
  });
};

const renderCriteriaRadar = (container, data, selectedValueChains) => {
  const canvas = buildCanvas(container);
  const datasets = selectedValueChains.map((chainId, index) => ({
    label: data.valueChainLabels[chainId] || chainId,
    data: data.series[chainId] || [],
    backgroundColor: `${chartPalette[index % chartPalette.length]}33`,
    borderColor: chartPalette[index % chartPalette.length],
    borderWidth: 2,
    pointRadius: 3,
  }));

  return new Chart(canvas, {
    type: "radar",
    data: {
      labels: data.labels,
      datasets,
    },
    // Adjust radar styling and grid colors here.
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        r: {
          beginAtZero: true,
          grid: { color: "rgba(148, 163, 184, 0.3)" },
          angleLines: { color: "rgba(148, 163, 184, 0.3)" },
          pointLabels: { color: "#e2e8f0" },
          ticks: { color: "#cbd5f5", backdropColor: "transparent" },
        },
      },
      plugins: {
        legend: { labels: { color: "#e2e8f0" } },
      },
    },
  });
};

window.RankingCharts = {
  renderTotalsBarChart,
  renderCriteriaRadar,
};
