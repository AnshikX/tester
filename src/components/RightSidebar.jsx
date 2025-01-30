import { useState } from "react";
import PropTypes from "prop-types";
import TreeView from "./TreeView";
import stackIcon from "./assets/svgs/stack.svg";
import downArrow from "./assets/svgs/down-arrow.svg";
import upArrow from "./assets/svgs/up-arrow.svg";
import { useSelection } from "./contexts/SelectionContext";

const RightSidebar = ({ config }) => {
  const [expanded, setExpanded] = useState(true);
  const { setSelectedItemId } = useSelection();

  const handleTileSelect = (id) => {
    setSelectedItemId(id);
  };
  return (
    <div className="rightSidebar">
      <div className="treeItem" onClick={() => setExpanded(!expanded)} style={{ backgroundColor: "#d8d8d8"}}>
        <div style={{ display: "flex", alignItems: "start", gap: "10px" }}>
          <img src={stackIcon} alt="stack" width="20" height="20" />
          <span>Layers</span>
        </div>
        <img
          className="arrow"
          src={expanded ? upArrow : downArrow}
          alt={expanded ? "up arrow" : "down arrow"}
        />
      </div>

      {expanded &&
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
