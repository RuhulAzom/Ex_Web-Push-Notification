import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/index.css";
import App from "./app.tsx";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { Toaster as Sonner } from "@/components/ui/sonner";
//
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Toaster />
      <Sonner />
      <App />
    </BrowserRouter>
  </StrictMode>
);
