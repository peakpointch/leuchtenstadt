import React from "react";
import ReactDOM from "react-dom/client";
import { Calculator } from "./calc/index.tsx";
import "./main.css";

// Import any component inside your repo:

function App() {
  return (
    <div style={{ padding: 40 }}>
      <Calculator></Calculator>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
