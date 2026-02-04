import fs from "node:fs";
import path from "node:path";

const baseDir = path.resolve("public/data/ranking-tool");
const files = {
  criteria: "criteria.json",
  scores: "scores.json",
  valueChains: "value_chains.json",
};

const errors = [];

const readJson = (fileName) => {
  const filePath = path.join(baseDir, fileName);
  try {
    const contents = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(contents);
  } catch (error) {
    errors.push(`Could not read ${fileName}: ${error.message}`);
    return null;
  }
};

const assert = (condition, message) => {
  if (!condition) {
    errors.push(message);
  }
};

const isNonEmptyString = (value) => typeof value === "string" && value.trim().length > 0;

const criteriaData = readJson(files.criteria);
const scoresData = readJson(files.scores);
const valueChainsData = readJson(files.valueChains);

const criteria = criteriaData?.criteria;
const scores = scoresData?.scores;
const valueChains = valueChainsData?.value_chains;

assert(Array.isArray(criteria), "criteria.json must include a criteria array.");
assert(Array.isArray(scores), "scores.json must include a scores array.");
assert(
  Array.isArray(valueChains),
  "value_chains.json must include a value_chains array."
);

const criteriaIds = new Set();
const valueChainIds = new Set();

if (Array.isArray(criteria)) {
  criteria.forEach((item, index) => {
    assert(isNonEmptyString(item.id), `criteria[${index}].id is required.`);
    assert(isNonEmptyString(item.label), `criteria[${index}].label is required.`);
    assert(typeof item.weight === "number", `criteria[${index}].weight must be a number.`);
    if (typeof item.weight === "number") {
      assert(
        item.weight >= 0 && item.weight <= 100,
        `criteria[${index}].weight must be between 0 and 100.`
      );
    }

    if (item.id) {
      assert(!criteriaIds.has(item.id), `Duplicate criteria id: ${item.id}.`);
      criteriaIds.add(item.id);
    }
  });
}

if (Array.isArray(valueChains)) {
  valueChains.forEach((item, index) => {
    assert(isNonEmptyString(item.id), `value_chains[${index}].id is required.`);
    assert(isNonEmptyString(item.label), `value_chains[${index}].label is required.`);

    if (item.id) {
      assert(!valueChainIds.has(item.id), `Duplicate value chain id: ${item.id}.`);
      valueChainIds.add(item.id);
    }
  });
}

if (Array.isArray(scores)) {
  scores.forEach((item, index) => {
    assert(
      isNonEmptyString(item.value_chain),
      `scores[${index}].value_chain is required.`
    );
    assert(
      isNonEmptyString(item.criterion_id),
      `scores[${index}].criterion_id is required.`
    );
    assert(typeof item.score === "number", `scores[${index}].score must be a number.`);

    if (item.weighted_score !== undefined) {
      assert(
        typeof item.weighted_score === "number",
        `scores[${index}].weighted_score must be a number when provided.`
      );
    }

    if (item.value_chain) {
      assert(
        valueChainIds.has(item.value_chain),
        `scores[${index}].value_chain does not exist: ${item.value_chain}.`
      );
    }

    if (item.criterion_id) {
      assert(
        criteriaIds.has(item.criterion_id),
        `scores[${index}].criterion_id does not exist: ${item.criterion_id}.`
      );
    }
  });
}

if (errors.length) {
  console.error("Ranking data validation failed:");
  errors.forEach((message) => console.error(`- ${message}`));
  process.exit(1);
}

console.log("Ranking data validation passed.");
