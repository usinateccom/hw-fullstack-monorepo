import { describe, expect, it } from "bun:test";
import { AppError } from "../../src/domain/errors/app-error";
import { toErrorEnvelope } from "../../src/presentation/error-envelope";

describe("toErrorEnvelope", () => {
  it("maps app error into standard envelope", () => {
    const output = toErrorEnvelope(new AppError("INVALID_PAYLOAD", "Erro de payload", { field: "iv" }));

    expect(output.statusCode).toBe(400);
    expect(output.payload).toEqual({
      error: {
        code: "INVALID_PAYLOAD",
        message: "Erro de payload",
        details: { field: "iv" }
      }
    });
  });

  it("maps unknown error into internal envelope", () => {
    const output = toErrorEnvelope(new Error("boom"));

    expect(output.statusCode).toBe(500);
    expect(output.payload).toEqual({
      error: {
        code: "INTERNAL_ERROR",
        message: "Erro interno inesperado"
      }
    });
  });
});
