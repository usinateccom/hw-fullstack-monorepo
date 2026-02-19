import { Aes256GcmDecryptor } from "../services/aes256gcm-decryptor";
import type { SecureEndpointClientPort } from "../ports/encrypted-payload";
import { AppError } from "../../domain/errors/app-error";
import type { User } from "../../domain/entities/user";

export class FetchAndDecryptUsersUseCase {
  constructor(
    private readonly secureEndpointClient: SecureEndpointClientPort,
    private readonly decryptor: Aes256GcmDecryptor
  ) {}

  async execute() {
    const payload = await this.secureEndpointClient.fetchPayload();
    const decrypted = this.decryptor.decryptUsers(payload);
    return decrypted.map((entry) => this.toUser(entry));
  }

  private toUser(raw: unknown): User {
    const source = (raw ?? {}) as Record<string, unknown>;

    const nome = source.nome;
    const email = source.email;
    const phone = source.phone ?? source.telefone;

    if (typeof nome !== "string" || typeof email !== "string" || phone === undefined || phone === null) {
      throw new AppError("INVALID_PAYLOAD", "Usuario descriptografado com campos obrigatorios ausentes");
    }

    return {
      nome,
      email,
      phone: String(phone)
    };
  }
}
