import type { FastifyInstance } from "fastify";
import type { UsersController } from "../controllers/users-controller";

export async function registerUsersRoutes(app: FastifyInstance, controller: UsersController) {
  app.post("/users/execute", async () => {
    return controller.execute();
  });

  app.post("/users/clear", async () => {
    return controller.clear();
  });
}
