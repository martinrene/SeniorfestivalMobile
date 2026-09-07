#!/usr/bin/env node

/**
 * Fails the build when the emitted chunks import each other in a cycle.
 *
 * Ionic's prebuilt modules import each other circularly, which is harmless
 * inside one module graph. When the bundler splits such a cycle across chunk
 * boundaries the execution order breaks: a chunk calls an imported binding that
 * its own importer has not finished initialising, and you get
 * "TypeError: e is not a function" from Ionic's focus-visible helper and a blank
 * white app with no other symptom.
 *
 * Whether that happens depends on the shape of the whole module graph, so an
 * unrelated import added anywhere in src/ can trigger it. That makes it exactly
 * the kind of fault worth failing the build over rather than discovering on a
 * device: a healthy bundle has no chunk cycles at all.
 */

import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const assetsDir = process.argv[2] ?? "dist/assets";

// The legacy bundle is a parallel copy of the same graph; checking the modern
// chunks is enough and keeps the output readable.
const chunks = readdirSync(assetsDir).filter(
  (name) => name.endsWith(".js") && !name.includes("legacy")
);

const graph = new Map();

for (const name of chunks) {
  const source = readFileSync(join(assetsDir, name), "utf8");
  const deps = [...source.matchAll(/from"\.\/([^"]+\.js)"/g)].map((m) => m[1]);

  graph.set(name, new Set(deps.filter((dep) => chunks.includes(dep))));
}

const cycles = new Set();
const visitedEdges = new Set();

function walk(node, path) {
  for (const next of graph.get(node) ?? []) {
    if (path.includes(next)) {
      cycles.add([...new Set(path.slice(path.indexOf(next)))].sort().join(" <-> "));
      continue;
    }

    const edge = `${node}>${next}`;
    if (!visitedEdges.has(edge)) {
      visitedEdges.add(edge);
      walk(next, [...path, next]);
    }
  }
}

for (const name of graph.keys()) {
  walk(name, [name]);
}

if (cycles.size === 0) {
  console.log(`Bundle check: no import cycles across ${chunks.length} chunks.`);
  process.exit(0);
}

console.error(
  `\nBundle check FAILED: ${cycles.size} import cycle(s) between emitted chunks.\n` +
    `The app will very likely show a blank white screen.\n`
);

for (const cycle of cycles) {
  console.error(`  ${cycle}`);
}

console.error(
  "\nThis is a chunking fault, not a bug in the cycle's own code. It is usually\n" +
    "triggered by an unrelated import added in src/, and shifting that import can\n" +
    "clear it -- see the notes at the top of this script.\n"
);

process.exit(1);
