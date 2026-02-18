import { Aes256GcmDecryptor } from "../services/aes256gcm-decryptor";
import type { SecureEndpointClientPort } from "../ports/encrypted-payload";

export class FetchAndDecryptUsersUseCase {
  constructor(
    private readonly secureEndpointClient: SecureEndpointClientPort,
    private readonly decryptor: Aes256GcmDecryptor
  ) {}

  async execute() {
    const payload = await this.secureEndpointClient.fetchPayload();
    return this.decryptor.decryptUsers(payload);
  }
}
