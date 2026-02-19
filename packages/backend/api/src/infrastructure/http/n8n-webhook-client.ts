import type { User } from "../../domain/entities/user";
import { AppError } from "../../domain/errors/app-error";

type N8nClientOptions = {
  timeoutMs: number;
  retries: number;
};

export class N8nWebhookClient {
  constructor(
    private readonly ingestUrl: string,
    private readonly listUrl: string,
    private readonly clearUrl: string,
    private readonly options: N8nClientOptions
  ) {}

  ingestUsers(users: User[]) {
    return this.requestWithRetry("POST", this.ingestUrl, { users });
  }

  listUsers() {
    return this.requestWithRetry("GET", this.listUrl);
  }

  clearUsers() {
    return this.requestWithRetry("POST", this.clearUrl, {});
  }

  private async requestWithRetry(method: "GET" | "POST", url: string, payload?: unknown) {
    let lastError: unknown;

    for (let attempt = 1; attempt <= this.options.retries; attempt += 1) {
      try {
        return await this.request(method, url, payload);
      } catch (error) {
        lastError = error;
      }
    }

    if (lastError instanceof AppError) {
      throw lastError;
    }

    throw new AppError("N8N_WEBHOOK_FAILED", "Falha ao chamar webhook do n8n");
  }

  private async request(method: "GET" | "POST", url: string, payload?: unknown) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.options.timeoutMs);

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "content-type": "application/json"
        },
        body: payload !== undefined ? JSON.stringify(payload) : undefined,
        signal: controller.signal
      });

      if (!response.ok) {
        throw new AppError("N8N_WEBHOOK_FAILED", "Webhook do n8n retornou erro", {
          status: response.status
        });
      }

      return await response.json();
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      throw new AppError("N8N_WEBHOOK_FAILED", "Falha de rede ao chamar webhook do n8n");
    } finally {
      clearTimeout(timeout);
    }
  }
}
