import fs from "node:fs";
import path from "node:path";
import xlsx from "xlsx";

const sourcePath = path.resolve("data/source.xlsx");
const outputPath = path.resolve("data/data.json");

if (!fs.existsSync(sourcePath)) {
  console.error(`Missing source file at ${sourcePath}`);
  process.exit(1);
}

const workbook = xlsx.readFile(sourcePath, { cellDates: true });
const sheets = {};

for (const sheetName of workbook.SheetNames) {
  const sheet = workbook.Sheets[sheetName];
  if (!sheet) {
    continue;
  }

  const rows = xlsx.utils.sheet_to_json(sheet, {
    defval: null,
    raw: false,
  });

  const columns = rows.length > 0 ? Object.keys(rows[0]) : [];

  sheets[sheetName] = {
    columns,
    rows,
  };
}

const payload = {
  generatedAt: new Date().toISOString(),
  sheets,
};

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, JSON.stringify(payload, null, 2));

console.log(`Wrote ${outputPath}`);
