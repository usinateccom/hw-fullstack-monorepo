import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3001";
const root = document.getElementById("root");

if (!root) {
  throw new Error("Root element not found");
}

createRoot(root).render(React.createElement(App, { apiBaseUrl }));
