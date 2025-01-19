import React from "react";
import ReactDOM from "react-dom/client";
import { MatomoProvider, createInstance } from "@datapunt/matomo-tracker-react";

import App from "./App.tsx";

import "./i18n";

import "@/styles/globals.css";

const instance = createInstance({
  urlBase: "http://193.108.55.253:5174",
  siteId: 1,
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <MatomoProvider value={instance}>
      <App />
    </MatomoProvider>
  </React.StrictMode>,
);
