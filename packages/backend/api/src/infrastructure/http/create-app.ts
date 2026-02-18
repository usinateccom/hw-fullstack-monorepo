import cors from "@fastify/cors";
import Fastify from "fastify";
import type { AppConfig } from "../../shared/config";
import { registerHealthRoutes } from "../../presentation/routes/health-routes";

export function createApp(config: AppConfig) {
  const app = Fastify({ logger: true });

  app.register(cors, {
    origin: config.corsOrigin,
    methods: ["GET", "POST", "OPTIONS"]
  });

  app.register(registerHealthRoutes);

  return app;
}
