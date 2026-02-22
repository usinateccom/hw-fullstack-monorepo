import cors from "@fastify/cors";
import Fastify, { type FastifyInstance } from "fastify";
import { Aes256GcmDecryptor } from "../../application/services/aes256gcm-decryptor";
import { ClearUsersUseCase } from "../../application/use-cases/clear-users";
import { ExecuteUsersPipelineUseCase } from "../../application/use-cases/execute-users-pipeline";
import { FetchAndDecryptUsersUseCase } from "../../application/use-cases/fetch-and-decrypt-users";
import { SecureEndpointClient } from "./secure-endpoint-client";
import { N8nWebhookClient } from "./n8n-webhook-client";
import type { AppConfig } from "../../shared/config";
import { registerHealthRoutes } from "../../presentation/routes/health-routes";
import { registerUsersRoutes } from "../../presentation/routes/users-routes";
import { UsersController } from "../../presentation/controllers/users-controller";
import { toErrorEnvelope } from "../../presentation/error-envelope";
import type { SecureEndpointClientPort } from "../../application/ports/encrypted-payload";
import type { N8nWebhookClientPort } from "../../application/ports/n8n-webhook-client";

type CreateAppDeps = {
  secureEndpointClient?: SecureEndpointClientPort;
  n8nWebhookClient?: N8nWebhookClientPort;
};

export function createApp(config: AppConfig, deps: CreateAppDeps = {}): FastifyInstance {
  const app = Fastify({ logger: true });

  app.register(cors, {
    origin: config.corsOrigin,
    methods: ["GET", "POST", "OPTIONS"]
  });

  app.setErrorHandler((error, _request, reply) => {
    const envelope = toErrorEnvelope(error);
    reply.status(envelope.statusCode).send(envelope.payload);
  });

  const secureEndpointClient =
    deps.secureEndpointClient ??
    new SecureEndpointClient(config.secureEndpointUrl, {
      timeoutMs: config.httpTimeoutMs
    });

  const n8nWebhookClient =
    deps.n8nWebhookClient ??
    new N8nWebhookClient(config.n8nWebhookIngestUrl, config.n8nWebhookListUrl, config.n8nWebhookClearUrl, {
      timeoutMs: config.httpTimeoutMs,
      retries: config.httpRetries
    });

  const fetchAndDecryptUsersUseCase = new FetchAndDecryptUsersUseCase(
    secureEndpointClient,
    new Aes256GcmDecryptor()
  );
  const usersController = new UsersController(
    new ExecuteUsersPipelineUseCase(fetchAndDecryptUsersUseCase, n8nWebhookClient),
    new ClearUsersUseCase(n8nWebhookClient)
  );

  app.register(registerHealthRoutes);
  app.register(async (scope) => {
    await registerUsersRoutes(scope, usersController);
  });

  return app;
}
