export type EncryptedPayload = {
  ciphertext: string;
  iv: string;
  authTag: string;
  key: string;
  encoding?: "base64" | "hex";
};

export type SecureEndpointClientPort = {
  fetchPayload(): Promise<unknown>;
};
