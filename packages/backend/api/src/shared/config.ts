export type AppConfig = {
  port: number;
  host: string;
  corsOrigin: string;
  secureEndpointUrl: string;
  n8nWebhookIngestUrl: string;
  n8nWebhookListUrl: string;
  n8nWebhookClearUrl: string;
  httpTimeoutMs: number;
  httpRetries: number;
};

function required(name: string, fallback?: string): string {
  const value = Bun.env[name] ?? fallback;
  if (!value) {
    throw new Error(`Missing env var: ${name}`);
  }
  return value;
}

export function loadConfig(): AppConfig {
  return {
    port: Number(required("API_PORT", "3001")),
    host: required("API_HOST", "0.0.0.0"),
    corsOrigin: required("CORS_ORIGIN", "http://localhost:5173"),
    secureEndpointUrl: required("SECURE_ENDPOINT_URL"),
    n8nWebhookIngestUrl: required("N8N_WEBHOOK_INGEST_URL"),
    n8nWebhookListUrl: required("N8N_WEBHOOK_LIST_URL"),
    n8nWebhookClearUrl: required("N8N_WEBHOOK_CLEAR_URL"),
    httpTimeoutMs: Number(required("HTTP_TIMEOUT_MS", "10000")),
    httpRetries: Number(required("HTTP_RETRIES", "3"))
  };
}
