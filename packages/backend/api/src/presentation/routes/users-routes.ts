import type { FastifyInstance } from "fastify";
import type { UsersController } from "../controllers/users-controller";

export async function registerUsersRoutes(app: FastifyInstance, controller: UsersController) {
  app.post("/users/execute", async () => {
    return controller.execute();
  });

  app.post("/users/clear", async () => {
    return controller.clear();
  });

  app.post("/users/seed", async (request) => {
    const body = (request.body ?? {}) as { count?: unknown };
    const count = typeof body.count === "number" ? body.count : Number(body.count ?? 0);
    return controller.seed(count);
  });
}
