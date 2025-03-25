import "bootstrap/dist/css/bootstrap.css";
import { createRoot } from "react-dom/client";
import router from "./Routing.jsx";
import { RouterProvider } from "react-router-dom";
import { StrictMode } from "react";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
