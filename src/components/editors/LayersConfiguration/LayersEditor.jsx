import { useState } from "react";
import PropTypes from "prop-types";
import { useSelectedItemDetails, useSelectedItemId,  useSetters } from "../../contexts/SelectionContext";
import { useVisibility } from "../../contexts/VisibilityContext";
import downArrow from "../../assets/svgs/down-arrow.svg";
import upArrow from "../../assets/svgs/up-arrow.svg";
import eyeOpen from "../../assets/svgs/eye-open.svg";
import eyeClosed from "../../assets/svgs/eye-close.svg";
import MapsLayers from "./MapLayers";

const LayersEditor = ({ node, level = 0, handleSelect }) => {
  const [expanded, setExpanded] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const { setSelectedItemId } = useSetters();
  // const { selectedItemId,itemDetails, setSelectedItemId } = useSelection();

  const itemDetails = useSelectedItemDetails()
  const selectedItemId = useSelectedItemId()
  
  const { visibilityState, toggleVisibility, setHoveredItem } = useVisibility();
  const isVisible = visibilityState[node.id] !== false;

  const handleVisibilityToggle = (e) => {
    e.stopPropagation();
    toggleVisibility(node.id);
    handleSelect(node); 
  };

  const handleSelectItem = () => {
    handleSelect(node);
  };

  const handleMouseOver = () => {
    setHoveredItem(node.id);
  };

  const handleMouseOut = () => {
    setHoveredItem(null);
  };

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    itemDetails?.setConfig({ ...node, label: newValue });
  };

  const handleDoubleClick = (e) => {
    e.stopPropagation();
    setIsEditing(true);
    setSelectedItemId(node.id);
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
          {isEditing && node.id === selectedItemId ? (
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

      {node.elementType === "MAP" && expanded && (
        <div className="treeChildren">
          <MapsLayers node={node} handleSelect={handleSelect} />
        </div>
      )}
      {expanded && node.children && (
        <div className="treeChildren">
          {node.children.map((child) => (
            <LayersEditor
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

LayersEditor.propTypes = {
  node: PropTypes.object.isRequired,
  level: PropTypes.number,
  handleSelect: PropTypes.func.isRequired,
};

export default LayersEditor;
