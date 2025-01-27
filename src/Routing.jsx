import Main from "/src/components/Main.jsx";

import SandBox from "./SandBox.jsx";
import {
  Routes,
  Route,
  Navigate,
  BrowserRouter,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import Container from "/src/components/Container.jsx";
import { HTML5Backend } from "react-dnd-html5-backend";

import { DndProvider } from "react-dnd";
import { ConfigProvider } from "/src/components/ConfigContext.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path="/" element={<Main />} />

      <Route path="breeze/sandbox" element={<SandBox />} />
      <Route
        path="breeze/config-builder"
        element={
          <ConfigProvider>
            <DndProvider backend={HTML5Backend}>
              <Container />
            </DndProvider>
          </ConfigProvider>
        }
      />
    </Route>
  )
);

export default router;
