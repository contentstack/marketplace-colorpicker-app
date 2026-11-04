import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import App from "./containers/App/App";
import "./index.css";

// Contentstack loads the field at <host>/#/custom-field; a plain /custom-field load is moved onto the hash so both URL styles work.
if (window.location.pathname !== "/" && !window.location.hash) {
  window.history.replaceState(null, "", `/#${window.location.pathname}${window.location.search}`);
}

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>
);

// web vitals reporting removed during Vite migration
