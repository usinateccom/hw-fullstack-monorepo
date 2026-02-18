import { afterEach, describe, expect, it, mock } from "bun:test";
import { N8nWebhookClient } from "../../src/infrastructure/http/n8n-webhook-client";
import { AppError } from "../../src/domain/errors/app-error";

describe("N8nWebhookClient", () => {
  afterEach(() => {
    mock.restore();
  });

  it("retries failed calls and succeeds on third attempt", async () => {
    let calls = 0;
    mock.module("globalThis", () => globalThis as any);

    const fetchMock = mock(async () => {
      calls += 1;
      if (calls < 3) {
        throw new Error("network");
      }

      return {
        ok: true,
        json: async () => ({ users: [{ id: 1 }] })
      };
    });

    (globalThis as any).fetch = fetchMock;

    const client = new N8nWebhookClient("http://n8n/ingest", "http://n8n/clear", {
      timeoutMs: 500,
      retries: 3
    });

    const result = await client.ingestUsers([]);

    expect(calls).toBe(3);
    expect(result).toEqual({ users: [{ id: 1 }] });
  });

  it("returns app error after retries exhausted", async () => {
    (globalThis as any).fetch = mock(async () => {
      throw new Error("offline");
    });

    const client = new N8nWebhookClient("http://n8n/ingest", "http://n8n/clear", {
      timeoutMs: 500,
      retries: 3
    });

    try {
      await client.clearUsers();
      throw new Error("Should fail");
    } catch (error) {
      expect(error).toBeInstanceOf(AppError);
      expect((error as AppError).code).toBe("N8N_WEBHOOK_FAILED");
    }
  });
});
