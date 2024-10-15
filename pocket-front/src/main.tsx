import React from "react";
import ReactDOM from "react-dom/client";
import { MatomoProvider, createInstance } from "@datapunt/matomo-tracker-react";

import App from "./App.tsx";

import './i18n';

import "@/styles/globals.css";

const instance = createInstance({
  urlBase: "https://pocketmessenger.matomo.cloud",
  siteId: 1,
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <MatomoProvider value={instance}>
          <App />
    </MatomoProvider>
  </React.StrictMode>,
);
