import { useState } from "react";
import PropTypes from "prop-types";
import TreeView from "./TreeView";
import stackIcon from "./assets/svgs/stack.svg";
import downArrow from "./assets/svgs/down-arrow.svg";
import upArrow from "./assets/svgs/up-arrow.svg";
import { useSelection } from "./contexts/SelectionContext";
import StyleEditor from "./StyleEditor";

const RightSidebar = ({ config }) => {
  const [treeExpanded, setTreeExpanded] = useState(false);
  const [stylesExpanded, setStylesExpanded] = useState(true);
  const { selectedItemId, setSelectedItemId } = useSelection();

  const handleTileSelect = (id) => {
    setSelectedItemId(id);
  };

  return (
    <div className="rightSidebar">
      <div
        className="treeItem"
        onClick={() => setStylesExpanded(!stylesExpanded)}
        style={{ backgroundColor: "#d8d8d8" }}
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

      <div
        className="treeItem"
        onClick={() => setTreeExpanded(!treeExpanded)}
        style={{ backgroundColor: "#d8d8d8" }}
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
          <TreeView node={config} handleSelect={handleTileSelect} />
        ) : (
          <p>Loading...</p>
        ))}
    </div>
  );
};

RightSidebar.propTypes = {
  config: PropTypes.object.isRequired,
};

export default RightSidebar;
