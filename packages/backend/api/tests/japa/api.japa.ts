import { createCipheriv } from "node:crypto";
import { test } from "@japa/runner";
import { createApp } from "../../src/infrastructure/http/create-app";
import type { AppConfig } from "../../src/shared/config";

const config: AppConfig = {
  port: 3001,
  host: "0.0.0.0",
  corsOrigin: "http://localhost:5173",
  secureEndpointUrl: "https://example.local/secure",
  n8nWebhookIngestUrl: "https://example.local/ingest",
  n8nWebhookListUrl: "https://example.local/list",
  n8nWebhookClearUrl: "https://example.local/clear",
  httpTimeoutMs: 1000,
  httpRetries: 3
};

function encryptedFixture() {
  const users = [{ nome: "Ana", email: "ana@example.com", phone: "111" }];
  const key = Buffer.from("12345678901234567890123456789012", "utf8");
  const iv = Buffer.from("123456789012", "utf8");
  const cipher = createCipheriv("aes-256-gcm", key, iv);
  const encrypted = Buffer.concat([cipher.update(JSON.stringify(users), "utf8"), cipher.final()]);

  return {
    users,
    payload: {
      ciphertext: encrypted.toString("base64"),
      iv: iv.toString("base64"),
      authTag: cipher.getAuthTag().toString("base64"),
      key: key.toString("base64"),
      encoding: "base64"
    }
  };
}

test.group("API endpoints", () => {
  test("GET /health returns status ok", async ({ assert }) => {
    const app = createApp(config, {
      secureEndpointClient: { fetchPayload: async () => ({}) },
      n8nWebhookClient: {
        ingestUsers: async () => ({ users: [] }),
        listUsers: async () => ({ users: [] }),
        clearUsers: async () => ({ cleared: true })
      }
    });

    const response = await app.inject({ method: "GET", url: "/health" });

    assert.equal(response.statusCode, 200);
    assert.deepEqual(response.json(), { status: "ok" });
  });

  test("POST /users/execute returns persisted users", async ({ assert }) => {
    const fixture = encryptedFixture();

    const app = createApp(config, {
      secureEndpointClient: { fetchPayload: async () => fixture.payload },
      n8nWebhookClient: {
        ingestUsers: async () => null,
        listUsers: async () => ({ users: fixture.users }),
        clearUsers: async () => ({ cleared: true })
      }
    });

    const response = await app.inject({ method: "POST", url: "/users/execute", payload: {} });

    assert.equal(response.statusCode, 200);
    assert.deepEqual(response.json(), { users: fixture.users });
  });

  test("POST /users/clear returns cleared true", async ({ assert }) => {
    const app = createApp(config, {
      secureEndpointClient: { fetchPayload: async () => ({}) },
      n8nWebhookClient: {
        ingestUsers: async () => ({ users: [] }),
        listUsers: async () => ({ users: [] }),
        clearUsers: async () => ({ cleared: true })
      }
    });

    const response = await app.inject({ method: "POST", url: "/users/clear", payload: {} });

    assert.equal(response.statusCode, 200);
    assert.deepEqual(response.json(), { cleared: true });
  });

});
