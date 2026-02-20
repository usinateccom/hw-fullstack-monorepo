import { jest } from "@jest/globals";
import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { App } from "../src/App.tsx";

describe("App component", () => {
  const apiBaseUrl = "http://localhost:3001";

  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test("execute populates table", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        users: [{ nome: "Ana", email: "ana@example.com", phone: "111" }]
      })
    });

    render(React.createElement(App, { apiBaseUrl }));

    fireEvent.click(screen.getByRole("button", { name: "Executar" }));

    await waitFor(() => {
      expect(screen.getByText("ana@example.com")).toBeInTheDocument();
    });
  });

  test("clear empties table", async () => {
    global.fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          users: [{ nome: "Ana", email: "ana@example.com", phone: "111" }]
        })
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ cleared: true })
      });

    render(React.createElement(App, { apiBaseUrl }));

    fireEvent.click(screen.getByRole("button", { name: "Executar" }));
    await waitFor(() => expect(screen.getByText("ana@example.com")).toBeInTheDocument());

    fireEvent.click(screen.getByRole("button", { name: "Limpar" }));
    await waitFor(() => expect(screen.queryByText("ana@example.com")).not.toBeInTheDocument());
  });

  test("loading disables buttons", async () => {
    let resolver;
    global.fetch.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolver = resolve;
        })
    );

    render(React.createElement(App, { apiBaseUrl }));

    fireEvent.click(screen.getByRole("button", { name: "Executar" }));

    expect(screen.getByRole("button", { name: "Executando..." })).toBeDisabled();

    resolver({ ok: true, json: async () => ({ users: [] }) });
    await waitFor(() => expect(screen.getByRole("button", { name: "Executar" })).toBeInTheDocument());
  });
});
