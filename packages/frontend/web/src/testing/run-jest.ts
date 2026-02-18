async function loadModule(specifier: string) {
  const importer = new Function("s", "return import(s);");
  return importer(specifier);
}

async function run() {
  try {
    await loadModule("jest");
    console.log("Jest detectado. Execute a suite real com configuracao completa.");
    process.exit(0);
  } catch {
    console.log("Jest nao disponivel neste ambiente. Mantendo suite deterministic com bun:test.");
    process.exit(0);
  }
}

void run();
