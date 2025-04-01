import { useState, useEffect, useRef, useCallback } from "react";
import SideBarItem from "./sidebars/SideBarItem";
import Renderer from "./Renderer";
import "./styles.css";
import { useSetters } from "./contexts/SelectionContext";
import { useUndoRedo } from "./contexts/UndoRedoContext";
import undoButton from "./assets/svgs/undo-button.svg";
import redoButton from "./assets/svgs/redo-button.svg";

const Container = () => {
  const config = useRef({});
  const [sidebarItems, setSidebarItems] = useState({
    htmlItems: [],
    components: [],
    third_party: [],
  });
  useEffect(() => {
    console.log("FRST TIME");
  }, []);
  const { setSelectedItemId } = useSetters();
  const [isPreview, setIsPreview] = useState(false);
  const { undoChanges, redoChanges, undoStack, redoStack } = useUndoRedo();
  const [theme, setTheme] = useState("dark");

  const trigger = useState(0)[1];

  useEffect(() => {
    const handleMessage = (event) => {
      // eslint-disable-next-line no-constant-condition
      if (event.origin === "http://localhost:3000" || true) {
        const { type } = event.data;
        if (type === "resource") {
          const resource = event.data.resource;
          if (resource.type === "componentConfig") {
            config.current = resource.component;
            trigger((x) => x + 1);
          }
          if (resource.type === "sidebarItems") {
            setSidebarItems(resource.sidebarItems);
          }
          if (resource.type === "theme") {
            setTheme(resource.theme);
          }
        }
      }
    };

    window.parent.postMessage(
      { source: "APP", type: "request", request: { type: "componentConfig" } },
      "*"
    );
    window.parent.postMessage(
      { source: "APP", type: "request", request: { type: "sidebarItems" } },
      "*"
    );
    window.parent.postMessage(
      { source: "APP", type: "request", request: { type: "theme" } },
      "*"
    );

    window.addEventListener("message", handleMessage);
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [setSidebarItems, trigger]);

  const setConfig = useCallback((conf) => {
    window.parent.postMessage(
      {
        source: "APP",
        type: "resource",
        resource: { type: "customConfig", customConfig: conf },
      },
      "*"
    );
    config.current = conf;
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        !(
          document
            .querySelector(".brDnd-rightSidebar")
            ?.contains(event.target) ||
          document.getElementById("toolBar").contains(event.target)
        )
      ) {
        setSelectedItemId(null);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [setSelectedItemId]);

  const toggle = () => {
    window.parent.postMessage({ source: "APP", action: "TOGGLE_SIDEBAR" }, "*");
  };

  return (
    <div className="brDnd-body">
      <div
        className={`brDnd-sidebar ${
          isPreview ? "brDnd-hidden" : "visible brDnd-width-15 p-2"
        } ${theme === "dark" ? "dark" : "light"}`}
      >
        <SideBarItem sidebarItems={sidebarItems} theme={theme} />
      </div>
      <div
        className={`brDnd-pageContainer ${
          isPreview ? "w-0" : "brDnd-width-60"
        }`}
      >
        <div
          className={`brDnd-shortcutBar ${theme === "dark" ? "dark" : "light"}`}
          id="toolBar"
        >
          <div className={`${isPreview ? "brDnd-hidden" : ""} d-flex`}>
            <span
              onClick={undoChanges}
              className="mx-2"
              disabled={undoStack.length === 0}
            >
              <img src={undoButton} alt="undo" />
            </span>
            <span onClick={redoChanges} disabled={redoStack.length === 0}>
              <img src={redoButton} alt="redo" />
            </span>
          </div>
          <div
            className={`brDnd-toggleButtonContainer ${
              theme === "dark" ? "dark" : "light"
            }`}
          >
            <button
              className="brDnd-toggleButton"
              onClick={() => {
                setIsPreview((prev) => !prev);
                toggle();
              }}
            >
              {isPreview ? "Edit" : "Finish Editing"}
            </button>
          </div>
        </div>
        <div className="brDnd-page" id="page">
          {config.current && config.current.elementType ? (
            <Renderer
              item={config.current}
              heirarchy={[config.id]}
              isPreview={isPreview}
              updateItem={setConfig}
            />
          ) : (
            <p>Loading...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Container;
