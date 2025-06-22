import React from "react";
import ReactDOM from "react-dom/client"; // Import the new createRoot API
import {AppProvider} from "./AppProvider";
import App from "./App"; // Your routes definition
import "./index.css"; // Import your global styles
const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <AppProvider>
      <App />
    </AppProvider>
  </React.StrictMode>
);
