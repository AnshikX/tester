import Container from "./Container.jsx";
import { HTML5Backend } from "react-dnd-html5-backend";

import { DndProvider } from "react-dnd";
import { SelectionProvider } from "./contexts/SelectionContext.jsx";
import { VisibilityProvider } from "./contexts/VisibilityContext.jsx";
import { MapProvider } from "./contexts/MapContext.jsx";
import { UndoRedoProvider } from "./contexts/UndoRedoContext.jsx";

export default function DNDRoot() {
  return (
    <>
      <UndoRedoProvider>
        <MapProvider>
          <VisibilityProvider>
            <SelectionProvider>
              <DndProvider backend={HTML5Backend}>
                <Container />
              </DndProvider>
            </SelectionProvider>
          </VisibilityProvider>
        </MapProvider>
      </UndoRedoProvider>
    </>
  );
}
