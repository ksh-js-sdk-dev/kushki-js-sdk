// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  // TODO: Validate double render with zoid
  // <React.StrictMode>
  <App />
  // </React.StrictMode>
);
