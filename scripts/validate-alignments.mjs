import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const filePath = path.join(__dirname, "..", "lib", "alignment", "alignments.json");

const data = JSON.parse(readFileSync(filePath, "utf8"));
const alignments = data.alignments;
const ids = Object.keys(alignments);

const tokenSets = ids.map((id) => ({
  id,
  keys: new Set(Object.keys(alignments[id].tokens)),
}));

const referenceKeys = tokenSets[0].keys;
let hasMismatch = false;

for (let i = 1; i < tokenSets.length; i++) {
  const { id, keys } = tokenSets[i];
  const missing = [...referenceKeys].filter((k) => !keys.has(k));
  const extra = [...keys].filter((k) => !referenceKeys.has(k));

  if (missing.length > 0 || extra.length > 0) {
    hasMismatch = true;
    console.error(`Token mismatch between "${tokenSets[0].id}" and "${id}":`);
    if (missing.length > 0) {
      console.error(`  missing in "${id}": ${missing.join(", ")}`);
    }
    if (extra.length > 0) {
      console.error(`  extra in "${id}": ${extra.join(", ")}`);
    }
  }
}

if (hasMismatch) {
  process.exit(1);
} else {
  console.log("alignments OK");
  process.exit(0);
}
