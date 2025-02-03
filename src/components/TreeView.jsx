import { useState } from "react";
import PropTypes from "prop-types";
import { useSelection } from "./contexts/SelectionContext";
import { useVisibility } from "./contexts/VisibilityContext";
import downArrow from "./assets/svgs/down-arrow.svg";
import upArrow from "./assets/svgs/up-arrow.svg";
import eyeOpen from "./assets/svgs/eye-open.svg";
import eyeClosed from "./assets/svgs/eye-close.svg";
import { useConfig } from "./contexts/ConfigContext";

const TreeView = ({ node, level = 0, handleSelect }) => {
  const [expanded, setExpanded] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const { selectedItemId } = useSelection();
  const { visibilityState, toggleVisibility, setHoveredItem } = useVisibility();
  const { updateItem } = useConfig();
  const isVisible = visibilityState[node.id] !== false;

  const handleVisibilityToggle = (e) => {
    e.stopPropagation();
    toggleVisibility(node.id);
    handleSelect(node.id);
  };

  const handleSelectItem = () => {
    handleSelect(node.id);
  };

  const handleMouseOver = () => {
    setHoveredItem(node.id);
  };

  const handleMouseOut = () => {
    setHoveredItem(null);
  };

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    updateItem({ ...node, label: newValue });
  };

  const handleDoubleClick = (e) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  return (
    <div
      style={{
        backgroundColor: selectedItemId !== node.id ? "white" : "#2680eb",
        color: selectedItemId !== node.id ? "black" : "white",
      }}
    >
      <div
        className={`treeItem ${selectedItemId === node.id ? "selected" : ""}`}
        onClick={handleSelectItem}
        onMouseOver={handleMouseOver}
        onMouseOut={handleMouseOut}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>
          <img
            className="eyeIcon"
            style={{ cursor: "pointer" }}
            src={isVisible ? eyeOpen : eyeClosed}
            alt="visibility"
            onClick={handleVisibilityToggle}
          />
          {isEditing ? (
            <input
              type="text"
              defaultValue={node.label? node.label : node.elementType}
              autoFocus
              onChange={handleInputChange}
              onBlur={() => setIsEditing(false)}
              style={{ width: "50%" }}
            />
          ) : (
            <span
              style={{ paddingLeft: level * 15 }}
              onDoubleClick={handleDoubleClick}
            >
              {node.label ? node.label : node.elementType}
            </span>
          )}
        </div>
        {node.children?.length > 0 && (
          <img
            className="arrow"
            src={expanded ? upArrow : downArrow}
            alt="toggle"
            onClick={() => setExpanded(!expanded)}
          />
        )}
      </div>

      {expanded && node.children && (
        <div className="treeChildren">
          {node.children.map((child) => (
            <TreeView
              key={child.id}
              node={child}
              level={level + 1}
              handleSelect={handleSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
};

TreeView.propTypes = {
  node: PropTypes.object.isRequired,
  level: PropTypes.number,
  handleSelect: PropTypes.func.isRequired,
};

export default TreeView;
