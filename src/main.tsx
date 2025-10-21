import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router";
import { routes } from "@/app/routes";
import "@/i18n";
import { AuthProvider } from "@features/auth/context/AuthProvider";
import { EngineApiProvider } from "./engine";
import { Leva } from "leva";

createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <EngineApiProvider>
      <Leva collapsed />
      <RouterProvider router={routes} />
    </EngineApiProvider>
  </AuthProvider>
);
