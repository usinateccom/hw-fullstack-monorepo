import { createApp } from "./infrastructure/http/create-app";
import { loadConfig } from "./shared/config";

const config = loadConfig();
const app = createApp(config);

app
  .listen({ port: config.port, host: config.host })
  .then(() => {
    app.log.info(`Servidor iniciado em http://${config.host}:${config.port}`);
  })
  .catch((error) => {
    app.log.error(error, "Falha ao iniciar servidor");
    process.exit(1);
  });
