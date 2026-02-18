import { AppError } from "../../domain/errors/app-error";

type ClientOptions = {
  timeoutMs: number;
};

export class SecureEndpointClient {
  constructor(
    private readonly endpointUrl: string,
    private readonly options: ClientOptions
  ) {}

  async fetchPayload(): Promise<unknown> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.options.timeoutMs);

    try {
      const response = await fetch(this.endpointUrl, {
        method: "GET",
        signal: controller.signal
      });

      if (!response.ok) {
        throw new AppError("SECURE_ENDPOINT_FAILED", "Endpoint seguro retornou erro", {
          status: response.status
        });
      }

      return await response.json();
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      throw new AppError("SECURE_ENDPOINT_FAILED", "Falha ao consultar endpoint seguro");
    } finally {
      clearTimeout(timeout);
    }
  }
}
