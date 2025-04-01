import 'bootstrap/dist/css/bootstrap.css';
import "bootstrap/dist/css/bootstrap.css";
import { createRoot } from "react-dom/client";
import router from "./Routing.jsx";
import { RouterProvider } from "react-router-dom";

createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);
