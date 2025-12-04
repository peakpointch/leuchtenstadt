import React from "react";
import ReactDOM from "react-dom/client";
import Calculator from "./calculator";
import "./main.css";

// Import any component inside your repo:

function App() {
  return (
    <div className="p-4 md:p-8">
      <Calculator></Calculator>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
