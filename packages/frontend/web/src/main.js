import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App.js";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3001";
createRoot(document.getElementById("root")).render(React.createElement(App, { apiBaseUrl }));
