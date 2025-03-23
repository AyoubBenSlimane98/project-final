import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router";
import { StrictMode } from "react";
import NotFound from "./pages/not found 404/NotFound.tsx";
import AuthRoutes from "./routes/AuthRoutes.tsx";
import EnsRespobsableRoutes from "./routes/EnsRespobsableRoutes.tsx";
import AdminRoutes from "./routes/AdminRoutes.tsx";
import EnsPrincipaleRoutes from "./routes/EnsPrincipaleRoutes.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {AuthRoutes}
        {EnsRespobsableRoutes}
        {AdminRoutes}
        {EnsPrincipaleRoutes}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
