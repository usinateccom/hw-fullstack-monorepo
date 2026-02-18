export type ErrorCode =
  | "INVALID_PAYLOAD"
  | "DECRYPTION_FAILED"
  | "SECURE_ENDPOINT_FAILED"
  | "N8N_WEBHOOK_FAILED"
  | "INTERNAL_ERROR";

export class AppError extends Error {
  constructor(
    public readonly code: ErrorCode,
    message: string,
    public readonly details?: unknown
  ) {
    super(message);
    this.name = "AppError";
  }
}
