import { useEffect, useState } from "react";
import { useDrag } from "react-dnd";
import DropZone from "./DropZone";
import PropTypes from "prop-types";
import { useConfig } from "./contexts/ConfigContext";
import { useSelection } from "./contexts/SelectionContext";
import OverlayBar from "./OverlayBar";
import TextRenderer from "./elements/TextRenderer";
import HTMLRenderer from "./elements/HTMLRenderer";
import ComponentRenderer from "./elements/ComponentRenderer";
import { useVisibility } from "./contexts/VisibilityContext";

const Renderer = ({
  item,
  addSibling,
  heirarchy = [],
  prevId = null,
  isFirst = true,
}) => {
  const { removeChildById, updateItem, addItemToId } = useConfig();
  const { visibilityState, hoveredItemId } = useVisibility();
  const { selectedItemId, setSelectedItemId } = useSelection();
  const [isHovered, setIsHovered] = useState(false);
  const firstDropZoneHeriarchy = [...heirarchy];
  const isSelected = selectedItemId === item.id;

  const [{ isDragging }, drag] = useDrag({
    type: "HTML",
    item: { ...item },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const opacity = isDragging ? 0.5 : 1;
  const isVisible = visibilityState[item.id] !== false;

  useEffect(() => {
    if (hoveredItemId === item.id) {
      setIsHovered(true);
    } else {
      setIsHovered(false);
    }
  }, [hoveredItemId, item.id]);

  if (!isVisible) {
    return null;
  }

  const addChild = (newChild, offset, index) => {
    const newItem = JSON.parse(JSON.stringify(newChild));
    addItemToId(newItem, item.id, offset + index);
  };

  const updateChild = (child, index) => {
    const updatedChildren = [...item.children];
    updatedChildren[index] = child;
    item.children = updatedChildren;
    updateItem({ ...item });
  };

  const handleDrop = (draggedItem, offset = 0) => {
    addSibling(draggedItem, offset);
  };

  if (prevId) {
    firstDropZoneHeriarchy.push(prevId);
  }

  const handleSelect = (e) => {
    e.stopPropagation();
    setSelectedItemId(item.id);
    setIsHovered(false);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    removeChildById(item.id);
  };

  const commonStyle = {
    border: "2px dashed #ccc",
    opacity,
    padding: "10px",
    position: "relative",
    margin: "5px 0",
    cursor: "pointer",
  };

  const handleMouseOver = (e) => {
    e.stopPropagation();
    if (!isSelected) {
      setIsHovered(true);
    }
  };

  const handleMouseOut = (e) => {
    e.stopPropagation();
    if (!isSelected) {
      setIsHovered(false);
    }
  };

  return (
    <>
      <DropZone
        onDrop={(draggedItem) => handleDrop(draggedItem, 0)}
        position="top"
        heirarchy={firstDropZoneHeriarchy}
      />
      {item.elementType === "TEXT" ? (
        <TextRenderer
          item={item}
          handleSelect={handleSelect}
          handleMouseOver={handleMouseOver}
          handleMouseOut={handleMouseOut}
          updateItem={updateItem}
          commonStyle={commonStyle}
          drag={drag}
        />
      ) : item.elementType === "HTML" || item.elementType === "THIRD_PARTY" ? (
        <HTMLRenderer
          item={item}
          handleSelect={handleSelect}
          handleMouseOver={handleMouseOver}
          handleMouseOut={handleMouseOut}
          commonStyle={commonStyle}
          heirarchy={heirarchy}
          addChild={addChild}
          updateChild={updateChild}
          drag={drag}
        />
      ) : item.elementType === "COMPONENT" ? (
        <ComponentRenderer
          item={item}
          handleSelect={handleSelect}
          handleMouseOver={handleMouseOver}
          handleMouseOut={handleMouseOut}
          commonStyle={commonStyle}
          heirarchy={heirarchy}
          addChild={addChild}
          updateChild={updateChild}
          drag={drag}
        />
      ) : (
        <div
          className="component unknown"
          ref={(node) => drag(node)}
          style={commonStyle}
          onClick={handleSelect}
          onMouseOver={handleMouseOver}
          onMouseOut={handleMouseOut}
        >
          Unknown Element
        </div>
      )}
      <OverlayBar
        itemId={item.id}
        itemLabel={item.label}
        elementType={item.elementType}
        onDelete={handleDelete}
        isVisible={isHovered || isSelected}
        setIsHovered={setIsHovered}
        isFirst={isFirst}
      />
    </>
  );
};

Renderer.propTypes = {
  item: PropTypes.shape({
    elementType: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    tagName: PropTypes.string,
    $ref: PropTypes.string,
    label: PropTypes.string,
    attributes: PropTypes.object,
    value: PropTypes.string,
    children: PropTypes.arrayOf(
      PropTypes.shape({
        elementType: PropTypes.string.isRequired,
        id: PropTypes.string,
        value: PropTypes.string,
        children: PropTypes.array,
      })
    ),
  }).isRequired,
  addSibling: PropTypes.func,
  heirarchy: PropTypes.array,
  prevId: PropTypes.string,
  isFirst: PropTypes.bool,
};

export default Renderer;
