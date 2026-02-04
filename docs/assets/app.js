const statusEl = document.getElementById("status");
const criteriaSelect = document.getElementById("criteria-select");
const chartsContainer = document.getElementById("charts");

const charts = [];

const knownCriteriaColumns = [
  "Criteria Area",
  "Criteria",
  "Area",
  "criteria",
  "criteria_area",
];

const knownLabelColumns = [
  "Label",
  "Category",
  "Item",
  "Metric",
  "label",
  "category",
];

const isNumber = (value) => typeof value === "number" && !Number.isNaN(value);

const clearCharts = () => {
  charts.forEach((chart) => chart.destroy());
  charts.length = 0;
  chartsContainer.innerHTML = "";
};

const pickColumn = (columns, candidates) =>
  candidates.find((name) => columns.includes(name));

const buildCharts = (rows, labelColumn, numericColumns) => {
  clearCharts();

  if (!rows.length || !numericColumns.length) {
    statusEl.textContent = "No chartable data available.";
    return;
  }

  statusEl.textContent = "";

  for (const column of numericColumns) {
    const labels = rows.map((row) => String(row[labelColumn] ?? ""));
    const values = rows.map((row) => Number(row[column] ?? 0));

    const card = document.createElement("div");
    card.className = "chart-card";

    const title = document.createElement("h3");
    title.textContent = column;
    title.style.margin = "0 0 1rem";

    const canvas = document.createElement("canvas");

    card.append(title, canvas);
    chartsContainer.append(card);

    const chart = new Chart(canvas, {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            label: column,
            data: values,
            backgroundColor: "rgba(59, 130, 246, 0.6)",
            borderColor: "rgba(37, 99, 235, 0.9)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });

    charts.push(chart);
  }
};

const loadData = async () => {
  try {
    const response = await fetch("data/data.json", { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const payload = await response.json();
    const firstSheet = payload.sheets
      ? payload.sheets[Object.keys(payload.sheets)[0]]
      : null;

    if (!firstSheet || !firstSheet.rows) {
      statusEl.textContent = "Data file is missing sheets or rows.";
      statusEl.classList.add("error");
      return;
    }

    const rows = firstSheet.rows;
    const columns = firstSheet.columns ?? Object.keys(rows[0] ?? {});

    const criteriaColumn =
      pickColumn(columns, knownCriteriaColumns) || columns[0];
    const labelColumn =
      pickColumn(columns, knownLabelColumns) || columns[1] || columns[0];

    const numericColumns = columns.filter((column) =>
      rows.some((row) => isNumber(row[column]))
    );

    const criteriaValues = [
      "All",
      ...new Set(rows.map((row) => row[criteriaColumn]).filter(Boolean)),
    ];

    criteriaSelect.innerHTML = "";
    criteriaValues.forEach((value) => {
      const option = document.createElement("option");
      option.value = value;
      option.textContent = value;
      criteriaSelect.append(option);
    });

    const updateCharts = () => {
      const selected = criteriaSelect.value;
      const filteredRows =
        selected === "All"
          ? rows
          : rows.filter((row) => row[criteriaColumn] === selected);

      buildCharts(filteredRows, labelColumn, numericColumns);
    };

    criteriaSelect.addEventListener("change", updateCharts);
    updateCharts();
  } catch (error) {
    statusEl.textContent = "Unable to load data.";
    statusEl.classList.add("error");
    console.error(error);
  }
};

loadData();
