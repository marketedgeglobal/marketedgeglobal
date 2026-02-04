const statusEl = document.getElementById("detail-status");
const tableBody = document.getElementById("detail-table");
const valueChainSelect = document.getElementById("value-chain-detail");
const areaFiltersEl = document.getElementById("area-filters");
const downloadBtn = document.getElementById("download-csv");

const getWeightedScore = (scoreRow, criteriaById) => {
  if (typeof scoreRow.weighted_score === "number") {
    return scoreRow.weighted_score;
  }

  const criterion = criteriaById[scoreRow.criterion_id];
  if (!criterion) {
    return 0;
  }

  return (scoreRow.score * criterion.weight) / 100;
};

const getQueryValueChain = () => {
  const params = new URLSearchParams(window.location.search);
  return params.get("value_chain");
};

const buildAreaFilters = (criteria) => {
  const areas = Array.from(
    new Set(criteria.map((item) => item.area || "General"))
  );

  areaFiltersEl.innerHTML = "";

  areas.forEach((area) => {
    const wrapper = document.createElement("label");
    wrapper.className = "checkbox-item";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.value = area;
    checkbox.checked = true;

    const text = document.createElement("span");
    text.textContent = area;

    wrapper.append(checkbox, text);
    areaFiltersEl.append(wrapper);
  });
};

const buildValueChainOptions = (valueChains, selectedId) => {
  valueChainSelect.innerHTML = "";
  valueChains.forEach((chain) => {
    const option = document.createElement("option");
    option.value = chain.id;
    option.textContent = chain.label;
    option.selected = chain.id === selectedId;
    valueChainSelect.append(option);
  });
};

const getSelectedAreas = () =>
  Array.from(areaFiltersEl.querySelectorAll("input:checked")).map(
    (input) => input.value
  );

const updateTable = (data, criteriaById) => {
  const selectedChain = valueChainSelect.value;
  const selectedAreas = getSelectedAreas();

  const scores = data.scores.filter(
    (row) =>
      row.value_chain === selectedChain &&
      selectedAreas.includes(criteriaById[row.criterion_id]?.area || "General")
  );

  tableBody.innerHTML = "";

  if (!scores.length) {
    statusEl.textContent = "No rows match the selected filters.";
    statusEl.classList.add("error");
    return;
  }

  statusEl.textContent = "";
  statusEl.classList.remove("error");

  scores.forEach((row) => {
    const criterion = criteriaById[row.criterion_id] || {
      label: row.criterion_id,
      weight: 0,
    };

    const weightedScore = getWeightedScore(row, criteriaById);

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${criterion.label}</td>
      <td>${criterion.weight}</td>
      <td>${row.score}</td>
      <td>${weightedScore.toFixed(2)}</td>
      <td>
        <details>
          <summary>View</summary>
          <p>${row.explanation || "No explanation provided."}</p>
        </details>
      </td>
    `;

    tableBody.append(tr);
  });
};

const exportCsv = (data, criteriaById) => {
  const selectedChain = valueChainSelect.value;
  const selectedAreas = getSelectedAreas();

  const rows = data.scores
    .filter(
      (row) =>
        row.value_chain === selectedChain &&
        selectedAreas.includes(criteriaById[row.criterion_id]?.area || "General")
    )
    .map((row) => {
      const criterion = criteriaById[row.criterion_id] || {
        label: row.criterion_id,
        weight: 0,
      };

      return {
        criterion: criterion.label,
        weight: criterion.weight,
        score: row.score,
        weighted_score: getWeightedScore(row, criteriaById).toFixed(2),
        explanation: row.explanation || "",
      };
    });

  if (!rows.length) {
    return;
  }

  const header = ["criterion", "weight", "score", "weighted_score", "explanation"];
  const lines = [header.join(",")];

  rows.forEach((row) => {
    const line = header
      .map((key) => `"${String(row[key]).replace(/"/g, '""')}"`)
      .join(",");
    lines.push(line);
  });

  const blob = new Blob([lines.join("\n")], { type: "text/csv" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `ranking-tool-${selectedChain}.csv`;
  link.click();

  URL.revokeObjectURL(url);
};

const init = async () => {
  try {
    const data = await window.loadRankingData();
    const criteria = data.criteria.criteria || [];
    const scores = data.scores.scores || [];
    const valueChains = data.valueChains.value_chains || [];

    if (!criteria.length || !scores.length || !valueChains.length) {
      statusEl.textContent = "Ranking data is incomplete.";
      statusEl.classList.add("error");
      return;
    }

    const criteriaById = Object.fromEntries(criteria.map((item) => [item.id, item]));
    const requestedChain = getQueryValueChain();
    const defaultChain =
      valueChains.find((chain) => chain.id === requestedChain)?.id ||
      valueChains[0].id;

    buildAreaFilters(criteria);
    buildValueChainOptions(valueChains, defaultChain);

    const normalized = {
      criteria,
      scores,
      valueChains,
    };

    areaFiltersEl.addEventListener("change", () =>
      updateTable(normalized, criteriaById)
    );
    valueChainSelect.addEventListener("change", () =>
      updateTable(normalized, criteriaById)
    );
    downloadBtn.addEventListener("click", () => exportCsv(normalized, criteriaById));

    updateTable(normalized, criteriaById);
  } catch (error) {
    statusEl.textContent = "Unable to load ranking data.";
    statusEl.classList.add("error");
    console.error(error);
  }
};

init();
