import type { FastifyInstance } from "fastify";
import { GetHealthUseCase } from "../../application/use-cases/get-health";
import { HealthController } from "../controllers/health-controller";

export async function registerHealthRoutes(app: FastifyInstance) {
  const controller = new HealthController(new GetHealthUseCase());

  app.get("/health", async () => {
    return controller.handle();
  });
}
