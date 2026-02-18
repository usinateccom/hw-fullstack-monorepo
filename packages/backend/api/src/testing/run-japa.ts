async function loadModule(specifier: string) {
  const importer = new Function("s", "return import(s);");
  return importer(specifier);
}

async function run() {
  try {
    await loadModule("@japa/runner");
    console.log("Japa detectado. Configure e execute suites reais via japaFile.ts.");
    process.exit(0);
  } catch {
    console.log("Japa nao disponivel neste ambiente. Mantendo suite deterministic com bun:test.");
    process.exit(0);
  }
}

void run();
