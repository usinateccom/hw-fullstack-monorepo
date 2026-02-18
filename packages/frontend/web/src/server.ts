const port = Number(Bun.env.FRONTEND_PORT ?? 5173);

function contentType(pathname: string): string {
  if (pathname.endsWith(".html")) return "text/html; charset=utf-8";
  if (pathname.endsWith(".js")) return "text/javascript; charset=utf-8";
  if (pathname.endsWith(".css")) return "text/css; charset=utf-8";
  if (pathname.endsWith(".json")) return "application/json; charset=utf-8";
  return "text/plain; charset=utf-8";
}

const server = Bun.serve({
  port,
  async fetch(req) {
    const url = new URL(req.url);
    const pathname = url.pathname === "/" ? "/index.html" : url.pathname;
    const filePath = `${import.meta.dir}/..${pathname}`;
    const file = Bun.file(filePath);

    if (await file.exists()) {
      return new Response(file, {
        headers: {
          "content-type": contentType(pathname)
        }
      });
    }

    return new Response("Not found", { status: 404 });
  }
});

console.log(`Servidor frontend iniciado em http://localhost:${server.port}`);
