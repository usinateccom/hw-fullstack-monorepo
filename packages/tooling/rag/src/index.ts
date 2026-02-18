import { mkdir, readFile, readdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";

type DocEntry = {
  path: string;
  content: string;
};

type IndexedEntry = {
  path: string;
  snippet: string;
  score: number;
};

type RagIndex = {
  generatedAt: string;
  files: DocEntry[];
};

const repoRoot = path.resolve(import.meta.dir, "../../../../");
const includeDirs = [
  path.join(repoRoot, "docs"),
  path.join(repoRoot, "instructions"),
  path.join(repoRoot, ".github/issues")
];
const outputDir = path.resolve(import.meta.dir, "../rag");
const outputFile = path.join(outputDir, "index.json");

async function collectFiles(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await collectFiles(fullPath)));
      continue;
    }

    if (!entry.isFile()) {
      continue;
    }

    if (!fullPath.endsWith(".md") && !fullPath.endsWith(".instructions.md")) {
      continue;
    }

    files.push(fullPath);
  }

  return files;
}

function toRelative(filePath: string): string {
  return path.relative(repoRoot, filePath).replaceAll("\\", "/");
}

function toSnippet(content: string): string {
  return content.replace(/\s+/g, " ").trim().slice(0, 220);
}

function scoreMatch(content: string, terms: string[]): number {
  const normalized = content.toLowerCase();
  return terms.reduce((acc, term) => {
    if (!term) return acc;

    const regex = new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi");
    const matches = normalized.match(regex);
    return acc + (matches?.length ?? 0);
  }, 0);
}

async function buildIndex() {
  const fileSet = new Set<string>();

  for (const dir of includeDirs) {
    const exists = await stat(dir).then(() => true).catch(() => false);
    if (!exists) continue;

    const files = await collectFiles(dir);
    files.forEach((file) => fileSet.add(file));
  }

  const files: DocEntry[] = [];
  for (const filePath of fileSet) {
    const content = await readFile(filePath, "utf8");
    files.push({
      path: toRelative(filePath),
      content
    });
  }

  const index: RagIndex = {
    generatedAt: new Date().toISOString(),
    files
  };

  await mkdir(outputDir, { recursive: true });
  await writeFile(outputFile, JSON.stringify(index, null, 2));

  console.log(`Index criado: ${outputFile}`);
  console.log(`Arquivos indexados: ${files.length}`);
}

async function searchIndex(query: string) {
  const raw = await readFile(outputFile, "utf8");
  const index = JSON.parse(raw) as RagIndex;
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);

  const ranked: IndexedEntry[] = index.files
    .map((file) => ({
      path: file.path,
      snippet: toSnippet(file.content),
      score: scoreMatch(file.content, terms)
    }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);

  if (ranked.length === 0) {
    console.log("Nenhum resultado encontrado.");
    return;
  }

  for (const result of ranked) {
    console.log(`[score:${result.score}] ${result.path}`);
    console.log(`  ${result.snippet}`);
  }
}

async function main() {
  const command = Bun.argv[2];

  if (command === "index") {
    await buildIndex();
    return;
  }

  if (command === "search") {
    const query = Bun.argv.slice(3).join(" ").trim();
    if (!query) {
      console.error("Uso: bun src/index.ts search \"<query>\"");
      process.exit(1);
    }

    await searchIndex(query);
    return;
  }

  console.error("Uso: bun src/index.ts <index|search> [query]");
  process.exit(1);
}

void main();
