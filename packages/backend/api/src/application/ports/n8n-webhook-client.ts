import type { User } from "../../domain/entities/user";

export type N8nWebhookClientPort = {
  ingestUsers(users: User[]): Promise<unknown>;
  clearUsers(): Promise<unknown>;
};
