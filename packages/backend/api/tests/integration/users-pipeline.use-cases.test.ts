import { describe, expect, it } from "bun:test";
import { AppError } from "../../src/domain/errors/app-error";
import { ClearUsersUseCase } from "../../src/application/use-cases/clear-users";
import { ExecuteUsersPipelineUseCase } from "../../src/application/use-cases/execute-users-pipeline";
import { SeedUsersUseCase } from "../../src/application/use-cases/seed-users";

describe("users pipeline use cases", () => {
  it("execute forwards decrypted users to n8n and returns persisted payload", async () => {
    const decryptedUsers = [
      { nome: "Ana", email: "ana@example.com", phone: "111" },
      { nome: "Bruno", email: "bruno@example.com", phone: "222" }
    ];

    const fetchAndDecryptUsersUseCase = {
      execute: async () => decryptedUsers
    } as any;

    const n8nWebhookClient = {
      ingestUsers: async () => null,
      listUsers: async () => ({ users: decryptedUsers, persisted: true }),
      clearUsers: async () => ({ cleared: true })
    };

    const useCase = new ExecuteUsersPipelineUseCase(
      fetchAndDecryptUsersUseCase,
      n8nWebhookClient
    );

    const output = await useCase.execute();

    expect(output).toEqual({ users: decryptedUsers, persisted: true });
  });

  it("clear calls n8n and returns cleared true", async () => {
    let called = 0;
    const n8nWebhookClient = {
      ingestUsers: async () => ({}),
      listUsers: async () => ({ users: [] }),
      clearUsers: async () => {
        called += 1;
        return { ok: true };
      }
    };

    const useCase = new ClearUsersUseCase(n8nWebhookClient);
    const output = await useCase.execute();

    expect(called).toBe(1);
    expect(output).toEqual({ cleared: true });
  });

  it("propagates app error in execute flow", async () => {
    const fetchAndDecryptUsersUseCase = {
      execute: async () => [{ nome: "Ana", email: "ana@example.com", phone: "111" }]
    } as any;

    const n8nWebhookClient = {
      ingestUsers: async () => {
        throw new AppError("N8N_WEBHOOK_FAILED", "Falha no n8n");
      },
      listUsers: async () => ({ users: [] }),
      clearUsers: async () => ({ cleared: true })
    };

    const useCase = new ExecuteUsersPipelineUseCase(
      fetchAndDecryptUsersUseCase,
      n8nWebhookClient
    );

    try {
      await useCase.execute();
      throw new Error("Should fail");
    } catch (error) {
      expect(error).toBeInstanceOf(AppError);
      expect((error as AppError).code).toBe("N8N_WEBHOOK_FAILED");
    }
  });

  it("seed generates users and returns persisted users", async () => {
    const n8nWebhookClient = {
      ingestUsers: async (users: any[]) => ({ accepted: users.length }),
      listUsers: async () => ({
        users: [{ nome: "Seed", email: "seed@example.com", phone: "111" }]
      }),
      clearUsers: async () => ({ cleared: true })
    };

    const useCase = new SeedUsersUseCase(n8nWebhookClient as any);
    const output = await useCase.execute(5);

    expect(output).toEqual({
      users: [{ nome: "Seed", email: "seed@example.com", phone: "111" }]
    });
  });

  it("seed rejects invalid count", async () => {
    const n8nWebhookClient = {
      ingestUsers: async () => ({}),
      listUsers: async () => ({ users: [] }),
      clearUsers: async () => ({ cleared: true })
    };

    const useCase = new SeedUsersUseCase(n8nWebhookClient as any);

    try {
      await useCase.execute(0);
      throw new Error("Should fail");
    } catch (error) {
      expect(error).toBeInstanceOf(AppError);
      expect((error as AppError).code).toBe("INVALID_SEED_COUNT");
    }
  });
});
