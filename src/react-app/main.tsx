import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import LeakPatrol from "./LeakPatrol";

const pathname = window.location.pathname;
const isGamePath = pathname.startsWith("/leak-patrol") || pathname.startsWith("/game");

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {isGamePath ? <LeakPatrol /> : <App />}
  </StrictMode>,
);
