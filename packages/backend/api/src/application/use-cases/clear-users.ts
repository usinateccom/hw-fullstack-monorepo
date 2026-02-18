import type { N8nWebhookClientPort } from "../ports/n8n-webhook-client";

export class ClearUsersUseCase {
  constructor(private readonly n8nWebhookClient: N8nWebhookClientPort) {}

  async execute() {
    await this.n8nWebhookClient.clearUsers();
    return { cleared: true as const };
  }
}
