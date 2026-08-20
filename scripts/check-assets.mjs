// Every local image path the site references must exist in /public.
//
// This exists because the failure it catches is SILENT: deleting a folder under
// public/ breaks nothing at build time — Next does not resolve static paths —
// so the build goes green and the pictures 404 in the browser. It happened
// once: the showcase sets were replaced and the Featured car, the only vehicle
// still pointing into them, lost all nine of its frames.
import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { join, extname } from "node:path";

const SRC = ["app", "components", "lib", "data"];
const RE = /["'`](\/(?:site|showcase|ilusso|inventory|brands)\/[^"'`]+)["'`]/g;

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else if ([".tsx", ".ts", ".json"].includes(extname(p))) out.push(p);
  }
  return out;
}

const missing = [];
for (const root of SRC) {
  if (!existsSync(root)) continue;
  for (const file of walk(root)) {
    const text = readFileSync(file, "utf-8");
    for (const m of text.matchAll(RE)) {
      if (!existsSync(join("public", m[1]))) missing.push({ file, path: m[1] });
    }
  }
}

if (missing.length) {
  console.error(`\n✗ ${missing.length} referenced image(s) do not exist in public/:\n`);
  for (const { file, path } of missing) console.error(`   ${path}\n     ← ${file}`);
  console.error("");
  process.exit(1);
}
console.log("  ✓ every referenced image exists");
