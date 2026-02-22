import React, { useMemo, useState } from "react";
import {
  applyClearSuccess,
  applyExecuteSuccess,
  applyFailure,
  applySeedSuccess,
  canClear,
  canExecute,
  initialUiState,
  startLoading
} from "./state";

function parseUsers(payload) {
  const root = payload;
  if (Array.isArray(root)) return root;
  if (Array.isArray(root?.users)) return root.users;
  if (Array.isArray(root?.data?.users)) return root.data.users;
  return [];
}

function toUiError(error) {
  const rawMessage =
    error && typeof error === "object" && "message" in error ? String(error.message) : String(error ?? "");

  if (rawMessage.toLowerCase().includes("failed to fetch")) {
    return "Falha de rede ao chamar backend. Verifique VITE_API_BASE_URL no deploy e CORS_ORIGIN no backend.";
  }

  if (rawMessage.includes("Route POST:/users/seed not found")) {
    return "Backend publicado sem rota /users/seed. Faça deploy da versao mais recente para habilitar o botao Popular.";
  }

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
    const message = body?.error?.message ?? body?.message ?? "Falha de comunicacao com backend";
    throw new Error(message);
  }

  return body;
}

export function App({ apiBaseUrl }) {
  const [state, setState] = useState(initialUiState());
  const [seedCount, setSeedCount] = useState(20);
  const hasUsers = useMemo(() => state.users.length > 0, [state.users.length]);
  const runningOutsideLocalhost =
    typeof window !== "undefined" && !["localhost", "127.0.0.1"].includes(window.location.hostname);
  const apiLooksLocalOnly = apiBaseUrl.includes("localhost") || apiBaseUrl.includes("127.0.0.1");

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

  async function handleSeed() {
    if (!canExecute(state)) return;
    const normalizedCount = Number(seedCount);

    setState((prev) => startLoading(prev));

    try {
      const payload = await callApi(apiBaseUrl, "/users/seed", {
        method: "POST",
        body: JSON.stringify({ count: normalizedCount })
      });
      const users = parseUsers(payload);
      setState((prev) => applySeedSuccess(prev, users, normalizedCount));
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
      runningOutsideLocalhost && apiLooksLocalOnly
        ? React.createElement(
            "p",
            { className: "status error" },
            "Configuracao de deploy incompleta: defina VITE_API_BASE_URL com a URL publica do backend."
          )
        : null,
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
            disabled: state.loading,
            onClick: handleSeed
          },
          state.loading ? "Aguarde..." : `Popular ${seedCount}`
        ),
        React.createElement("input", {
          type: "number",
          min: 1,
          max: 200,
          step: 1,
          value: seedCount,
          onChange: (event) => setSeedCount(Number(event.target.value || 0)),
          "aria-label": "Quantidade de registros para popular"
        }),
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
