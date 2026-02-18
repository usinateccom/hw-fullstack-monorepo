import React, { useMemo, useState } from "react";
import {
  applyClearSuccess,
  applyExecuteSuccess,
  applyFailure,
  canClear,
  canExecute,
  initialUiState,
  startLoading
} from "./state.js";

function parseUsers(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.users)) return payload.users;
  if (Array.isArray(payload?.data?.users)) return payload.data.users;
  return [];
}

function toUiError(error) {
  if (error && typeof error === "object" && "message" in error) {
    return String(error.message);
  }

  return "Erro inesperado ao processar solicitacao.";
}

async function callApi(apiBaseUrl, path, init) {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...init,
    headers: {
      "content-type": "application/json",
      ...(init?.headers ?? {})
    }
  });

  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = body?.error?.message ?? "Falha de comunicacao com backend";
    throw new Error(message);
  }

  return body;
}

export function App({ apiBaseUrl }) {
  const [state, setState] = useState(initialUiState());
  const hasUsers = useMemo(() => state.users.length > 0, [state.users.length]);

  async function handleExecute() {
    if (!canExecute(state)) return;

    setState((prev) => startLoading(prev));

    try {
      const payload = await callApi(apiBaseUrl, "/users/execute", {
        method: "POST",
        body: "{}"
      });
      const users = parseUsers(payload);
      setState((prev) => applyExecuteSuccess(prev, users));
    } catch (error) {
      setState((prev) => applyFailure(prev, toUiError(error)));
    }
  }

  async function handleClear() {
    if (!canClear(state)) return;

    setState((prev) => startLoading(prev));

    try {
      await callApi(apiBaseUrl, "/users/clear", {
        method: "POST",
        body: "{}"
      });
      setState((prev) => applyClearSuccess(prev));
    } catch (error) {
      setState((prev) => applyFailure(prev, toUiError(error)));
    }
  }

  return React.createElement(
    "main",
    { className: "page" },
    React.createElement(
      "section",
      { className: "panel" },
      React.createElement("h1", null, "H&W Fullstack Test"),
      React.createElement(
        "p",
        { className: "subtitle" },
        "Clique em Executar para chamar o backend e preencher a tabela sem reload."
      ),
      React.createElement(
        "div",
        { className: "actions" },
        React.createElement(
          "button",
          {
            type: "button",
            className: "primary",
            disabled: state.loading,
            onClick: handleExecute
          },
          state.loading ? "Executando..." : "Executar"
        ),
        React.createElement(
          "button",
          {
            type: "button",
            className: "secondary",
            disabled: state.loading || !hasUsers,
            onClick: handleClear
          },
          state.loading ? "Aguarde..." : "Limpar"
        )
      ),
      React.createElement(
        "p",
        { className: `status${state.error ? " error" : ""}` },
        state.error || state.message
      ),
      React.createElement(
        "div",
        { className: "table-wrap" },
        React.createElement(
          "table",
          { role: "table", "aria-label": "Tabela de usuarios" },
          React.createElement(
            "thead",
            null,
            React.createElement(
              "tr",
              null,
              React.createElement("th", null, "Nome"),
              React.createElement("th", null, "Email"),
              React.createElement("th", null, "Phone")
            )
          ),
          React.createElement(
            "tbody",
            null,
            hasUsers
              ? state.users.map((user) =>
                  React.createElement(
                    "tr",
                    { key: `${user.email}-${user.nome}` },
                    React.createElement("td", null, user.nome),
                    React.createElement("td", null, user.email),
                    React.createElement("td", null, user.phone)
                  )
                )
              : React.createElement(
                  "tr",
                  null,
                  React.createElement(
                    "td",
                    { className: "empty", colSpan: 3 },
                    "Sem dados no momento."
                  )
                )
          )
        )
      )
    )
  );
}
