import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { MatomoProvider, createInstance } from "@datapunt/matomo-tracker-react";

import App from "./App.tsx";
import { Provider } from "./provider.tsx";
import "@/styles/globals.css";

const instance = createInstance({
  urlBase: "https://pocketmessenger.matomo.cloud",
  siteId: 1,
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <MatomoProvider value={instance}>
      <BrowserRouter>
        <Provider>
          <App />
        </Provider>
      </BrowserRouter>
    </MatomoProvider>
  </React.StrictMode>,
);
