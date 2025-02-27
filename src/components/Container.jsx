import { useState, useEffect } from "react";
import SideBarItem from "./sidebars/SideBarItem";
import Renderer from "./Renderer";
import "../styles/styles.css";
import { useSelectedItemId,  useSetters } from "./contexts/SelectionContext";
import RightSidebar from "./sidebars/RightSidebar";
import { usePropContext } from "./contexts/PropContext";

const Container = () => {
  const [ config, setConfig ] = useState({});
  const [sidebarItems, setSidebarItems] = useState([]);
  const { setSelectedItemId } = useSetters();
  const selectedItemId = useSelectedItemId();
  const [isPreview, setIsPreview] = useState(false);
  const { setScope, setProps } = usePropContext();
  console.log("COntainer")
  useEffect(() => {
    const handleMessage = (event) => {
      // eslint-disable-next-line no-constant-condition
      if (event.origin === "http://localhost:3000" || true) {
        const { type } = event.data;
        if (type === "resource") {
          const resource = event.data.resource;
          if (resource.type === "componentConfig") {
            setConfig(resource.component);
          }
          if (resource.type === "sidebarItems") {
            setSidebarItems(resource.sideBarItems);
          }
          if (resource.type === "scope") {
            setScope(resource.scope);
          }
          if (resource.type === "props") {
            setProps(resource.props);
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
      { source: "APP", type: "request", request: { type: "props" } },
      "*"
    );

    window.parent.postMessage(
      { source: "APP", type: "request", request: { type: "scope" } },
      "*"
    );

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [setConfig, setSidebarItems, setScope, setProps]);
  useEffect(() => {
    window.parent.postMessage(
      {
        source: "APP",
        type: "resource",
        resource: { type: "customConfig", customConfig: config },
      },
      "*"
    );
  }, [config]);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!document.querySelector(".rightSidebar")?.contains(event.target)) {
        setSelectedItemId(null);
        
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [setSelectedItemId]);
  console.log(sidebarItems)

  return (
    <div className="body">
      <div className={`sideBar ${isPreview ? "hidden" : "visible width-15"}`}>
        {sidebarItems.map((sidebarItem, index) => (
          <SideBarItem key={index} data={sidebarItem} />
        ))}
      </div>
      <div className={`pageContainer ${isPreview ? "width-100" : "width-60"}`}>
        {/* Toggle Button Container */}
        <div className="toggleButtonContainer">
          <button
            className="toggleButton"
            onClick={() => setIsPreview((prev) => !prev)}
          >
            {isPreview ? "Edit" : "Finish Editing"}
          </button>
        </div>

        <div className="page" id="page">
          {config && config.elementType ? (
            <Renderer
              item={config}
              heirarchy={[config.id]}
              isPreview={isPreview}
              updateItem={setConfig}
            />
          ) : (
            <p>Loading...</p>
          )}
        </div>
      </div>

      <div
        className={`rightSidebar ${isPreview ? "hidden" : "visible width-25"}`}
      >
        <RightSidebar config={config} selectedItemId={selectedItemId} />
      </div>
    </div>
  );
};
export default Container;
