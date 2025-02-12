import Ankur from "/src/components/ankur.jsx";

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
import { ConfigProvider } from "/src/components/contexts/ConfigContext.jsx";
import { SelectionProvider } from "/src/components/contexts/SelectionContext.jsx";
import { VisibilityProvider } from "/src/components/contexts/VisibilityContext.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path="/" element={<Ankur />} />

      <Route path="breeze/sandbox" element={<SandBox />} />
      <Route
        path="breeze/config-builder"
        element={
          <VisibilityProvider>
              <ConfigProvider>
            <SelectionProvider>
                <DndProvider backend={HTML5Backend}>
                  <Container />
                </DndProvider>
            </SelectionProvider>
              </ConfigProvider>
          </VisibilityProvider>
        }
      />
    </Route>
  )
);

export default router;
