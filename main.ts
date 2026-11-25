import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// "Make the AI Judge Feel Proud: A Family Scene" — one small domestic
// moment at the kitchen table: Grandma, the last dumpling, and a recipe
// treated like a state secret. Warm, a little funny, and specific —
// no greeting-card phrasing. Deterministic: two runs write
// byte-identical output.
const SCENE =
  "At the kitchen table, Grandma slides the last dumpling toward me and whispers, " +
  "'Eat — if you don't learn the recipe, it dies with me,' then winks like she's " +
  "handing over state secrets.";

// Validate the scene against the gate before writing: 1–2 lines,
// 1–280 characters, not only whitespace.
const lines = SCENE.split("\n");
if (lines.length < 1 || lines.length > 2) {
  throw new Error(`scene must be 1-2 lines, got ${lines.length}`);
}
if (SCENE.length < 1 || SCENE.length > 280) {
  throw new Error(`scene must be 1-280 characters, got ${SCENE.length}`);
}
if (SCENE.trim().length === 0) {
  throw new Error("scene must not be only whitespace");
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, SCENE, "utf8");

// Verify what landed on disk: re-read and confirm it is byte-identical
// to the scene, so a partial or corrupted write fails loudly here.
const written = readFileSync(outPath, "utf8");
if (written !== SCENE) {
  throw new Error("entry.txt on disk does not match the scene");
}
if (written !== written.trim()) {
  throw new Error("scene must not start or end with whitespace");
}
