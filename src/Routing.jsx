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
import { SelectionProvider } from "/src/components/contexts/SelectionContext.jsx";
import { VisibilityProvider } from "/src/components/contexts/VisibilityContext.jsx";
import { PropProvider } from "/src/components/contexts/PropContext.jsx";
import { MapProvider } from "/src/components/contexts/MapContext.jsx";
import Main from "/src/components/Main.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path="/" element={<Main />} />

      <Route path="breeze/sandbox" element={<SandBox />} />
      <Route
        path="breeze/config-builder"
        element={
          <MapProvider>
          <VisibilityProvider>
            <PropProvider>
                <SelectionProvider>
                  <DndProvider backend={HTML5Backend}>
                    <Container />
                  </DndProvider>
                </SelectionProvider>
            </PropProvider>
          </VisibilityProvider></MapProvider>
        }
      />
    </Route>
  )
);

export default router;
