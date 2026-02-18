import type { User } from "../../domain/entities/user";
import type { N8nWebhookClientPort } from "../ports/n8n-webhook-client";
import { FetchAndDecryptUsersUseCase } from "./fetch-and-decrypt-users";

export class ExecuteUsersPipelineUseCase {
  constructor(
    private readonly fetchAndDecryptUsersUseCase: FetchAndDecryptUsersUseCase,
    private readonly n8nWebhookClient: N8nWebhookClientPort
  ) {}

  async execute() {
    const users = (await this.fetchAndDecryptUsersUseCase.execute()) as User[];
    return this.n8nWebhookClient.ingestUsers(users);
  }
}
