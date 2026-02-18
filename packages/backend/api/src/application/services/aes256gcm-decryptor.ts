import { createDecipheriv } from "node:crypto";
import { AppError } from "../../domain/errors/app-error";
import type { EncryptedPayload } from "../ports/encrypted-payload";

const KEY_LENGTH = 32;

type Decoded = {
  ciphertext: Buffer;
  iv: Buffer;
  authTag: Buffer;
  key: Buffer;
};

function looksLikeHex(value: string): boolean {
  return value.length % 2 === 0 && /^[0-9a-fA-F]+$/.test(value);
}

function decodeValue(value: string, preferred?: "base64" | "hex"): Buffer {
  const attempts: Array<"base64" | "hex"> = preferred
    ? [preferred]
    : looksLikeHex(value)
      ? ["hex", "base64"]
      : ["base64", "hex"];

  for (const encoding of attempts) {
    try {
      const decoded = Buffer.from(value, encoding);
      if (decoded.length > 0) {
        return decoded;
      }
    } catch {
      // Try next encoding.
    }
  }

  throw new AppError("INVALID_PAYLOAD", "Nao foi possivel decodificar campo criptografado");
}

function normalizePayload(raw: unknown): EncryptedPayload {
  const root = (raw ?? {}) as Record<string, unknown>;
  const data = (root.data ?? {}) as Record<string, unknown>;
  const encryptedBlock = (data.encrypted ?? root.encrypted ?? {}) as Record<string, unknown>;

  const ciphertext =
    (encryptedBlock.ciphertext as string | undefined) ??
    (encryptedBlock.encrypted as string | undefined) ??
    (root.ciphertext as string | undefined) ??
    (root.encryptedData as string | undefined) ??
    (root.data as string | undefined);

  const iv =
    (encryptedBlock.iv as string | undefined) ??
    (encryptedBlock.initializationVector as string | undefined) ??
    (root.iv as string | undefined);

  const authTag =
    (encryptedBlock.authTag as string | undefined) ??
    (encryptedBlock.tag as string | undefined) ??
    (root.authTag as string | undefined);

  const key =
    (data.secretKey as string | undefined) ??
    (root.secretKey as string | undefined) ??
    (root.key as string | undefined);

  const encoding =
    (data.encoding as "base64" | "hex" | undefined) ??
    (encryptedBlock.encoding as "base64" | "hex" | undefined) ??
    (root.encoding as "base64" | "hex" | undefined);

  if (!ciphertext || !iv || !authTag || !key) {
    throw new AppError("INVALID_PAYLOAD", "Payload criptografado incompleto");
  }

  return { ciphertext, iv, authTag, key, encoding };
}

function decodePayload(payload: EncryptedPayload): Decoded {
  const decoded = {
    ciphertext: decodeValue(payload.ciphertext, payload.encoding),
    iv: decodeValue(payload.iv, payload.encoding),
    authTag: decodeValue(payload.authTag, payload.encoding),
    key: decodeValue(payload.key, payload.encoding)
  };

  if (decoded.key.length !== KEY_LENGTH) {
    throw new AppError("INVALID_PAYLOAD", "A chave AES-256-GCM deve ter 32 bytes");
  }

  return decoded;
}

export class Aes256GcmDecryptor {
  decryptUsers(rawPayload: unknown) {
    try {
      const payload = normalizePayload(rawPayload);
      const decoded = decodePayload(payload);

      const decipher = createDecipheriv("aes-256-gcm", decoded.key, decoded.iv);
      decipher.setAuthTag(decoded.authTag);

      const plainText = Buffer.concat([
        decipher.update(decoded.ciphertext),
        decipher.final()
      ]).toString("utf8");

      const parsed = JSON.parse(plainText) as unknown;
      if (!Array.isArray(parsed)) {
        throw new AppError("INVALID_PAYLOAD", "Conteudo descriptografado nao e uma lista de usuarios");
      }

      return parsed;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      throw new AppError("DECRYPTION_FAILED", "Falha ao descriptografar payload AES-256-GCM");
    }
  }
}
