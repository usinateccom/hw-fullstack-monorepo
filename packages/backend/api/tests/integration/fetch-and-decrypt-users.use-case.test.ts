import { describe, expect, it } from "bun:test";
import { FetchAndDecryptUsersUseCase } from "../../src/application/use-cases/fetch-and-decrypt-users";

describe("FetchAndDecryptUsersUseCase", () => {
  it("maps secure payload users into nome/email/phone shape", async () => {
    const useCase = new FetchAndDecryptUsersUseCase(
      { fetchPayload: async () => ({}) },
      {
        decryptUsers: () => [
          {
            nome: "John Smith",
            email: "johnsmith@email.com",
            telefone: 1234567890
          }
        ]
      } as any
    );

    const output = await useCase.execute();

    expect(output).toEqual([
      {
        nome: "John Smith",
        email: "johnsmith@email.com",
        phone: "1234567890"
      }
    ]);
  });
});
