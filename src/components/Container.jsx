import { useState, useEffect } from "react";
import SideBarItem from "./SideBarItem";
import Renderer from "./Renderer";
import "../styles/styles.css";
import { useConfig } from "./ConfigContext";
import { useSelection } from "./SelectionContext";

const Container = () => {
  const { config, setConfig } = useConfig({});
  const [sidebarItems, setSidebarItems] = useState([]);
  const { setSelectedItemId } = useSelection();

  useEffect(() => {
    const handleMessage = (event) => {
      // eslint-disable-next-line no-constant-condition
      if (event.origin === "http://localhost:3000" || true) {
        const { type, resource } = event.data;
        if (type === "resource" && resource.type === "componentConfig") {
          setConfig(resource.component);
        }
        if (type === "resource" && resource.type === "sidebarItems") {
          setSidebarItems(resource.sideBarItems);
        }
      }
    };
    window.parent.postMessage(
      { source: "APP", type: "request", request: { type: "componentConfig" } },
      "*"
    );

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [setConfig, setSidebarItems]);

  // const handleTransmit = () => {
  //   window.parent.postMessage(
  //     {
  //       source: "APP",
  //       type: "resource",
  //       resource: { type: "customConfig", customConfig: config },
  //     },
  //     "*"
  //   );
  // };

  useEffect(()=>{
    const handleClickOutside = () => {
        setSelectedItemId(null);
      }
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
  },[setSelectedItemId])

  return (
    <div className="body">
      <div className="sideBar">
        {sidebarItems.map((sidebarItem, index) => (
          <SideBarItem key={index} data={sidebarItem} />
        ))}
      </div>
      <div className="pageContainer">
        <div className="page">
          {config && config.elementType ? (
            <Renderer
              item={config}
              heirarchy={[config.id]}
            />
          ) : (
            <p>Loading...</p>
          )}
        </div>
      </div> 
        {/* <div className="saveButtonContainer">
          <button onClick={handleTransmit} className="saveButton">
            Save Configuration
          </button>
        </div> */}
    </div>
  );
};
export default Container;
