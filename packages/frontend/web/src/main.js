import React, { useMemo, useState } from "https://esm.sh/react@18.3.1";
import { createRoot } from "https://esm.sh/react-dom@18.3.1/client";

const MOCK_USERS = [
  { nome: "Ana Souza", email: "ana.souza@example.com", phone: "+55 11 99999-1001" },
  { nome: "Bruno Lima", email: "bruno.lima@example.com", phone: "+55 11 99999-1002" }
];

function App() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("Pronto para executar o fluxo.");

  const hasUsers = useMemo(() => users.length > 0, [users]);

  async function handleExecute() {
    setLoading(true);
    setError("");

    try {
      await new Promise((resolve) => setTimeout(resolve, 250));
      setUsers(MOCK_USERS);
      setMessage(`Tabela preenchida com ${MOCK_USERS.length} registro(s).`);
    } catch {
      setError("Falha ao executar fluxo.");
    } finally {
      setLoading(false);
    }
  }

  async function handleClear() {
    setLoading(true);
    setError("");

    try {
      await new Promise((resolve) => setTimeout(resolve, 120));
      setUsers([]);
      setMessage("Tabela limpa.");
    } catch {
      setError("Falha ao limpar dados.");
    } finally {
      setLoading(false);
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
        "Tabela responsiva com atualizacao dinamica (sem reload)."
      ),
      React.createElement(
        "div",
        { className: "actions" },
        React.createElement(
          "button",
          {
            type: "button",
            className: "primary",
            disabled: loading,
            onClick: handleExecute
          },
          loading ? "Executando..." : "Executar"
        ),
        React.createElement(
          "button",
          {
            type: "button",
            className: "secondary",
            disabled: loading || !hasUsers,
            onClick: handleClear
          },
          loading ? "Aguarde..." : "Limpar"
        )
      ),
      React.createElement(
        "p",
        { className: `status${error ? " error" : ""}` },
        error || message
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
              ? users.map((user) =>
                  React.createElement(
                    "tr",
                    { key: user.email },
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

createRoot(document.getElementById("root")).render(React.createElement(App));
