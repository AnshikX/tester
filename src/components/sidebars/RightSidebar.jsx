import { useState } from "react";
import PropTypes from "prop-types";
import LayersEditor from "../editors/LayersConfiguration/LayersEditor";
import stackIcon from "../assets/svgs/stack.svg";
import downArrow from "../assets/svgs/down-arrow.svg";
import upArrow from "../assets/svgs/up-arrow.svg";
import { useSelection } from "../contexts/SelectionContext";
import StyleEditor from "../editors/StyleConfiguration/StyleEditor";
import PropsEditor from "../editors/PropsConfiguration/PropsEditor";
import MapsEditor from "../editors/MapsConfiguration/MapsEditor";

const RightSidebar = ({ config }) => {
  const [treeExpanded, setTreeExpanded] = useState(false);
  const [stylesExpanded, setStylesExpanded] = useState(false);
  const [propsExpanded, setPropsExpanded] = useState(false);
  const [mapExpanded, setMapExpanded] = useState(false);
  const { selectedItemId, setSelectedItemId, selectedItem } = useSelection();

  const handleTileSelect = (id) => {
    setSelectedItemId(id);
  };

  if (selectedItemId === null) {
    return (
      <p
        style={{
          padding: "10px",
          fontSize: "14px",
          textAlign: "center",
          color: "#555",
        }}
      >
        Select an item to edit its configuration.
      </p>
    );
  }

  const isTextElement = selectedItem?.elementType === "Text" || selectedItem?.elementType === "TEXT";
  const isMapElement = selectedItem?.elementType === "Map" || selectedItem?.elementType === "MAP";

  return (
    <>
      {!isTextElement && (
        <>
          {isMapElement && (
            <>
              <div className="treeItem" onClick={() => setMapExpanded(!mapExpanded)}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <img src={stackIcon} alt="stack" width="20" height="20" />
                  <span>Edit Maps</span>
                </div>
                <img
                  className="arrow"
                  src={mapExpanded ? upArrow : downArrow}
                  alt={mapExpanded ? "up arrow" : "down arrow"}
                />
              </div>

              {mapExpanded && (
                selectedItemId ? (
                  <MapsEditor />
                ) : (
                  <p
                    style={{
                      padding: "10px",
                      fontSize: "14px",
                      textAlign: "center",
                      color: "#555",
                    }}
                  >
                    Choose a map to configure it.
                  </p>
                )
              )}
            </>
          )}
          {!isMapElement && (
            <>
              <div className="treeItem" onClick={() => setPropsExpanded(!propsExpanded)}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <img src={stackIcon} alt="stack" width="20" height="20" />
                  <span>Props</span>
                </div>
                <img
                  className="arrow"
                  src={propsExpanded ? upArrow : downArrow}
                  alt={propsExpanded ? "up arrow" : "down arrow"}
                />
              </div>

              {propsExpanded && (
                selectedItemId ? (
                  <PropsEditor />
                ) : (
                  <p
                    style={{
                      padding: "10px",
                      fontSize: "14px",
                      textAlign: "center",
                      color: "#555",
                    }}
                  >
                    Choose an item to add props.
                  </p>
                )
              )}

              <div
                className="treeItem"
                onClick={() => setStylesExpanded(!stylesExpanded)}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <img src={stackIcon} alt="stack" width="20" height="20" />
                  <span>Styles</span>
                </div>
                <img
                  className="arrow"
                  src={stylesExpanded ? upArrow : downArrow}
                  alt={stylesExpanded ? "up arrow" : "down arrow"}
                />
              </div>

              {stylesExpanded &&
                (selectedItemId ? (
                  <StyleEditor />
                ) : (
                  <p
                    style={{
                      padding: "10px",
                      fontSize: "14px",
                      textAlign: "center",
                      color: "#555",
                    }}
                  >
                    Choose an item to style.
                  </p>
                ))}
            </>
          )}
        </>
      )}

      <div
        className="treeItem"
        onClick={() => setTreeExpanded(!treeExpanded)}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <img src={stackIcon} alt="stack" width="20" height="20" />
          <span>Layers</span>
        </div>
        <img
          className="arrow"
          src={treeExpanded ? upArrow : downArrow}
          alt={treeExpanded ? "up arrow" : "down arrow"}
        />
      </div>

      {treeExpanded &&
        (config ? (
          <LayersEditor node={config} handleSelect={handleTileSelect} />
        ) : (
          <p>Loading...</p>
        ))}
    </>
  );
};

RightSidebar.propTypes = {
  config: PropTypes.object.isRequired,
};

export default RightSidebar;

