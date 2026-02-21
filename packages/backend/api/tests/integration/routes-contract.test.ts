import { describe, expect, it } from "bun:test";
import { registerHealthRoutes } from "../../src/presentation/routes/health-routes";
import { registerUsersRoutes } from "../../src/presentation/routes/users-routes";

describe("route contracts", () => {
  it("health route returns status ok", async () => {
    const routes: Record<string, (...args: any[]) => any> = {};
    const app = {
      get: (path: string, handler: (...args: any[]) => any) => {
        routes[`GET ${path}`] = handler;
      }
    };

    await registerHealthRoutes(app as any);

    const output = await routes["GET /health"]();
    expect(output).toEqual({ status: "ok" });
  });

  it("users routes call controller methods", async () => {
    const routes: Record<string, (...args: any[]) => any> = {};
    const app = {
      post: (path: string, handler: (...args: any[]) => any) => {
        routes[`POST ${path}`] = handler;
      }
    };

    const controller = {
      execute: async () => ({ users: [{ id: 1 }] }),
      clear: async () => ({ cleared: true }),
      seed: async () => ({ users: [{ id: 2 }] })
    };

    await registerUsersRoutes(app as any, controller as any);

    const executeOutput = await routes["POST /users/execute"]();
    const clearOutput = await routes["POST /users/clear"]();
    const seedOutput = await routes["POST /users/seed"]({ body: { count: 1 } });

    expect(executeOutput).toEqual({ users: [{ id: 1 }] });
    expect(clearOutput).toEqual({ cleared: true });
    expect(seedOutput).toEqual({ users: [{ id: 2 }] });
  });
});
