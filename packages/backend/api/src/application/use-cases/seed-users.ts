import { AppError } from "../../domain/errors/app-error";
import type { User } from "../../domain/entities/user";
import type { N8nWebhookClientPort } from "../ports/n8n-webhook-client";

const FIRST_NAMES = [
  "Ana",
  "Bruno",
  "Carla",
  "Diego",
  "Elisa",
  "Felipe",
  "Gabriela",
  "Henrique",
  "Isabela",
  "Joao"
];

const LAST_NAMES = [
  "Silva",
  "Souza",
  "Oliveira",
  "Santos",
  "Lima",
  "Pereira",
  "Costa",
  "Rodrigues",
  "Almeida",
  "Ferreira"
];

export class SeedUsersUseCase {
  constructor(private readonly n8nWebhookClient: N8nWebhookClientPort) {}

  async execute(count: number) {
    if (!Number.isInteger(count) || count < 1 || count > 200) {
      throw new AppError("INVALID_SEED_COUNT", "Quantidade invalida para popular registros", {
        min: 1,
        max: 200
      });
    }

    const users = this.buildUsers(count);
    await this.n8nWebhookClient.ingestUsers(users);
    const listResult = await this.n8nWebhookClient.listUsers();
    return listResult ?? { users };
  }

  private buildUsers(count: number): User[] {
    const stamp = Date.now();
    const users: User[] = [];

    for (let index = 1; index <= count; index += 1) {
      const firstName = FIRST_NAMES[(index - 1) % FIRST_NAMES.length];
      const lastName = LAST_NAMES[(index - 1) % LAST_NAMES.length];
      const suffix = `${stamp}${index}`.slice(-8);
      users.push({
        nome: `${firstName} ${lastName}`,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}.${suffix}@seed.local`,
        phone: `+55 11 9${String(10000000 + index).slice(-8)}`
      });
    }

    return users;
  }
}
