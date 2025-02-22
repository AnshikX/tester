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
import { PropProvider } from "/src/components/contexts/PropContext.jsx";
import Main from "/src/components/Main.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path="/" element={<Main />} />

      <Route path="breeze/sandbox" element={<SandBox />} />
      <Route
        path="breeze/config-builder"
        element={
          <VisibilityProvider>
            <PropProvider>
              <ConfigProvider>
                <SelectionProvider>
                  <DndProvider backend={HTML5Backend}>
                    <Container />
                  </DndProvider>
                </SelectionProvider>
              </ConfigProvider>
            </PropProvider>
          </VisibilityProvider>
        }
      />
    </Route>
  )
);

export default router;
