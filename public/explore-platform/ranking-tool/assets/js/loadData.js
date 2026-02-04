const DATA_BASE = "../../data/ranking-tool";

const fetchJson = async (fileName) => {
  const response = await fetch(`${DATA_BASE}/${fileName}`, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Failed to load ${fileName} (${response.status})`);
  }
  return response.json();
};

const loadRankingData = async () => {
  const [criteria, scores, valueChains] = await Promise.all([
    fetchJson("criteria.json"),
    fetchJson("scores.json"),
    fetchJson("value_chains.json"),
  ]);

  window.RankingData = {
    criteria,
    scores,
    valueChains,
  };

  return window.RankingData;
};

window.loadRankingData = loadRankingData;
