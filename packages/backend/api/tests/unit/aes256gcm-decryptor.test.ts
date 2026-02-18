import { createCipheriv } from "node:crypto";
import { describe, expect, it } from "bun:test";
import { Aes256GcmDecryptor } from "../../src/application/services/aes256gcm-decryptor";
import { AppError } from "../../src/domain/errors/app-error";

function fixture() {
  const users = [
    { nome: "Ana", email: "ana@example.com", phone: "+55 11 90000-0001" },
    { nome: "Bruno", email: "bruno@example.com", phone: "+55 11 90000-0002" }
  ];

  const key = Buffer.from("12345678901234567890123456789012", "utf8");
  const iv = Buffer.from("123456789012", "utf8");
  const cipher = createCipheriv("aes-256-gcm", key, iv);
  const content = JSON.stringify(users);

  const ciphertext = Buffer.concat([cipher.update(content, "utf8"), cipher.final()]);
  const authTag = cipher.getAuthTag();

  return {
    users,
    payload: {
      ciphertext: ciphertext.toString("base64"),
      iv: iv.toString("base64"),
      authTag: authTag.toString("base64"),
      key: key.toString("base64"),
      encoding: "base64" as const
    }
  };
}

describe("Aes256GcmDecryptor", () => {
  it("decrypts valid payload", () => {
    const { users, payload } = fixture();
    const decryptor = new Aes256GcmDecryptor();

    const output = decryptor.decryptUsers(payload);

    expect(output).toEqual(users);
  });

  it("fails closed for invalid payload", () => {
    const decryptor = new Aes256GcmDecryptor();

    try {
      decryptor.decryptUsers({});
      throw new Error("Should fail");
    } catch (error) {
      expect(error).toBeInstanceOf(AppError);
      expect((error as AppError).code).toBe("INVALID_PAYLOAD");
    }
  });

  it("fails when auth tag is tampered", () => {
    const { payload } = fixture();
    const decryptor = new Aes256GcmDecryptor();

    const broken = {
      ...payload,
      authTag: Buffer.from("tamperedtampered1").toString("base64")
    };

    try {
      decryptor.decryptUsers(broken);
      throw new Error("Should fail");
    } catch (error) {
      expect(error).toBeInstanceOf(AppError);
      expect((error as AppError).code).toBe("DECRYPTION_FAILED");
    }
  });
});
