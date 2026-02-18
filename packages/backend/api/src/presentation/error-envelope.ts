import { AppError } from "../domain/errors/app-error";

export function toErrorEnvelope(error: unknown) {
  if (error instanceof AppError) {
    return {
      statusCode: 400,
      payload: {
        error: {
          code: error.code,
          message: error.message,
          details: error.details
        }
      }
    };
  }

  return {
    statusCode: 500,
    payload: {
      error: {
        code: "INTERNAL_ERROR",
        message: "Erro interno inesperado"
      }
    }
  };
}
