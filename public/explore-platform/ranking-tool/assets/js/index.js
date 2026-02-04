const statusEl = document.getElementById("status");
const criteriaFiltersEl = document.getElementById("criteria-filters");
const valueChainSelect = document.getElementById("value-chain-select");
const totalsChartEl = document.getElementById("totals-chart");
const radarChartEl = document.getElementById("radar-chart");
const totalsTableEl = document.getElementById("totals-table");
const valueChainLinksEl = document.getElementById("value-chain-links");

let totalsChart = null;
let radarChart = null;

const getSelectedValues = (select) =>
  Array.from(select.selectedOptions).map((option) => option.value);

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

const buildCriteriaFilters = (criteria) => {
  criteriaFiltersEl.innerHTML = "";

  criteria.forEach((criterion) => {
    const wrapper = document.createElement("label");
    wrapper.className = "checkbox-item";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.value = criterion.id;
    checkbox.checked = true;

    const text = document.createElement("span");
    text.textContent = criterion.label;

    wrapper.append(checkbox, text);
    criteriaFiltersEl.append(wrapper);
  });
};

const buildValueChainOptions = (valueChains) => {
  valueChainSelect.innerHTML = "";
  valueChains.forEach((chain) => {
    const option = document.createElement("option");
    option.value = chain.id;
    option.textContent = chain.label;
    option.selected = true;
    valueChainSelect.append(option);
  });
};

const updateDashboard = (data, criteriaById, valueChainById) => {
  const selectedCriteria = Array.from(
    criteriaFiltersEl.querySelectorAll("input[type='checkbox']:checked")
  ).map((input) => input.value);

  const selectedValueChains = getSelectedValues(valueChainSelect);

  if (!selectedCriteria.length || !selectedValueChains.length) {
    statusEl.textContent = "Select at least one criterion and value chain.";
    statusEl.classList.add("error");
    return;
  }

  statusEl.textContent = "";
  statusEl.classList.remove("error");

  const totals = selectedValueChains.map((chainId) => {
    const chainScores = data.scores.filter(
      (row) => row.value_chain === chainId && selectedCriteria.includes(row.criterion_id)
    );

    const totalWeighted = chainScores.reduce(
      (sum, row) => sum + getWeightedScore(row, criteriaById),
      0
    );

    const avgScore =
      chainScores.reduce((sum, row) => sum + row.score, 0) / (chainScores.length || 1);

    return {
      id: chainId,
      label: valueChainById[chainId]?.label || chainId,
      totalWeighted: Number(totalWeighted.toFixed(2)),
      avgScore: Number(avgScore.toFixed(2)),
    };
  });

  totals.sort((a, b) => b.totalWeighted - a.totalWeighted);

  const criteriaLabels = selectedCriteria.map((id) => criteriaById[id]?.label || id);
  const radarSeries = {};

  selectedValueChains.forEach((chainId) => {
    radarSeries[chainId] = selectedCriteria.map((criterionId) => {
      const row = data.scores.find(
        (score) => score.value_chain === chainId && score.criterion_id === criterionId
      );

      if (!row) {
        return 0;
      }

      return getWeightedScore(row, criteriaById);
    });
  });

  if (totalsChart) {
    totalsChart.destroy();
  }

  if (radarChart) {
    radarChart.destroy();
  }

  totalsChart = window.RankingCharts.renderTotalsBarChart(totalsChartEl, {
    labels: totals.map((item) => item.label),
    values: totals.map((item) => item.totalWeighted),
  });

  radarChart = window.RankingCharts.renderCriteriaRadar(
    radarChartEl,
    {
      labels: criteriaLabels,
      series: radarSeries,
      valueChainLabels: Object.fromEntries(
        data.valueChains.map((chain) => [chain.id, chain.label])
      ),
    },
    selectedValueChains
  );

  totalsTableEl.innerHTML = "";
  totals.forEach((row) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${row.label}</td>
      <td>${row.totalWeighted}</td>
      <td>${row.avgScore}</td>
    `;
    totalsTableEl.append(tr);
  });

  valueChainLinksEl.innerHTML = "";
  totals.forEach((row) => {
    const link = document.createElement("a");
    link.className = "link-card";
    link.href = `detail.html?value_chain=${encodeURIComponent(row.id)}`;
    link.textContent = `View ${row.label}`;
    valueChainLinksEl.append(link);
  });
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
    const valueChainById = Object.fromEntries(
      valueChains.map((item) => [item.id, item])
    );

    const normalized = {
      criteria,
      scores,
      valueChains,
    };

    buildCriteriaFilters(criteria);
    buildValueChainOptions(valueChains);

    criteriaFiltersEl.addEventListener("change", () =>
      updateDashboard(normalized, criteriaById, valueChainById)
    );
    valueChainSelect.addEventListener("change", () =>
      updateDashboard(normalized, criteriaById, valueChainById)
    );

    updateDashboard(normalized, criteriaById, valueChainById);
  } catch (error) {
    statusEl.textContent = "Unable to load ranking data.";
    statusEl.classList.add("error");
    console.error(error);
  }
};

init();
