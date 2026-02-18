import { describe, expect, it } from "bun:test";
import {
  applyClearSuccess,
  applyExecuteSuccess,
  applyFailure,
  canClear,
  canExecute,
  initialUiState,
  startLoading
} from "../src/state.js";

describe("frontend state transitions", () => {
  it("execute success populates users", () => {
    const initial = initialUiState();
    const loading = startLoading(initial);
    const next = applyExecuteSuccess(loading, [
      { nome: "Ana", email: "ana@example.com", phone: "111" }
    ]);

    expect(next.users.length).toBe(1);
    expect(next.loading).toBe(false);
    expect(next.error).toBe("");
  });

  it("clear success empties users", () => {
    const stateWithUsers = applyExecuteSuccess(startLoading(initialUiState()), [
      { nome: "Ana", email: "ana@example.com", phone: "111" }
    ]);

    const next = applyClearSuccess(stateWithUsers);

    expect(next.users).toEqual([]);
    expect(next.message.includes("Tabela limpa")).toBe(true);
  });

  it("loading disables execute and clear", () => {
    const loading = startLoading(initialUiState());

    expect(canExecute(loading)).toBe(false);
    expect(canClear(loading)).toBe(false);
  });

  it("failure stores error and exits loading", () => {
    const next = applyFailure(startLoading(initialUiState()), "Erro qualquer");

    expect(next.loading).toBe(false);
    expect(next.error).toBe("Erro qualquer");
  });
});
