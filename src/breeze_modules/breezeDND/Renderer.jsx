import { useCallback, useEffect, useState } from "react";
import { useDrag } from "react-dnd";
import DropZone from "./DropZone";
import PropTypes from "prop-types";
import { useSelectedItemId, useSetters } from "./contexts/SelectionContext";
import OverlayBar from "./OverlayBar";
import TextRenderer from "./elements/TextRenderer";
import CombinedRenderer from "./elements/CombinedRenderer";
import { useVisibility } from "./contexts/VisibilityContext";
import MapRenderer from "./elements/MapRenderer";
import ConditionalRenderer from "./elements/ConditionalRenderer";

const Renderer = ({
  item,
  addSibling,
  heirarchy = [],
  prevId = null,
  isFirst = true,
  isPreview,
  updateItem,
  handleDelete,
  overDetails,
}) => {
  const { visibilityState, hoveredItemId } = useVisibility();
  const { setSelectedItemId } = useSetters();

  const selectedItemId = useSelectedItemId();

  const [isHovered, setIsHovered] = useState(false);
  const firstDropZoneHeriarchy = [...heirarchy];
  const isSelected = selectedItemId === item.id;
  const [{ isDragging }, drag] = useDrag(
    {
      type: "HTML",
      item: { item: { ...item }, myOnDrop: handleDelete },
      canDrag: () => (handleDelete ? true : false),

      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    },
    [item, handleDelete]
  );

  const opacity = isDragging ? 0.5 : 1;
  const isVisible = visibilityState[item.id] !== false;

  useEffect(() => {
    if (hoveredItemId === item.id) {
      setIsHovered(true);
    } else {
      setIsHovered(false);
    }
  }, [hoveredItemId, item.id]);

  const handleDrop = useCallback(
    (draggedItem, offset = 0) => {
      addSibling(draggedItem, offset);
    },
    [addSibling]
  );

  if (prevId) {
    firstDropZoneHeriarchy.push(prevId);
  }

  const handleSelect = useCallback(
    (e) => {
      e.stopPropagation();
      if (selectedItemId !== item.id) {
        setSelectedItemId(item.id);
      }
      setIsHovered(false);
    },

    [selectedItemId, item.id, setSelectedItemId, setIsHovered]
  );

  const handleMouseOver = useCallback(
    (e) => {
      e.stopPropagation();
      if (!isSelected) {
        setIsHovered(true);
      }
    },
    [isSelected]
  );

  const handleMouseOut = useCallback(
    (e) => {
      e.stopPropagation();
      if (!isSelected) {
        setIsHovered(false);
      }
    },
    [isSelected]
  );

  if (!isVisible) {
    return null;
  }
  return (
    <>
      {!isPreview && addSibling && (
        <DropZone
          onDrop={(draggedItem) => handleDrop(draggedItem, 0)}
          position="top"
          heirarchy={firstDropZoneHeriarchy}
        />
      )}
      {item.elementType === "TEXT" ? (
        <TextRenderer
          item={item}
          handleSelect={handleSelect}
          handleMouseOver={handleMouseOver}
          opacity={opacity}
          handleMouseOut={handleMouseOut}
          key={item.id}
          updateItem={updateItem}
          drag={drag}
          isPreview={isPreview}
        />
      ) : item.elementType === "HTML" ||
        item.elementType === "html" ||
        item.elementType === "COMPONENT" ||
        item.elementType === "THIRD_PARTY" ? (
        <CombinedRenderer
          item={item}
          handleSelect={handleSelect}
          key={item.id}
          handleMouseOver={handleMouseOver}
          handleMouseOut={handleMouseOut}
          heirarchy={heirarchy}
          updateItem={updateItem}
          opacity={opacity}
          drag={drag}
          isPreview={isPreview}
        />
      ) : item.elementType === "MAP" ? (
        <MapRenderer
          item={item}
          handleSelect={handleSelect}
          drag={drag}
          opacity={opacity}
          handleMouseOver={handleMouseOver}
          handleMouseOut={handleMouseOut}
          heirarchy={heirarchy}
          updateItem={updateItem}
          isPreview={isPreview}
        />
      ) : item.elementType === "CONDITIONAL" ? (
        <ConditionalRenderer
          item={item}
          handleSelect={handleSelect}
          drag={drag}
          opacity={opacity}
          handleMouseOver={handleMouseOver}
          handleMouseOut={handleMouseOut}
          heirarchy={heirarchy}
          updateItem={updateItem}
          isPreview={isPreview}
        />
      ) : (
        <div
          className="component"
          ref={(node) => drag(node)}
          onClick={handleSelect}
          onMouseOver={handleMouseOver}
          onMouseOut={handleMouseOut}
        >
          Unknown Element
        </div>
      )}
      {!isPreview && (
        <OverlayBar
          itemId={item.id}
          itemLabel={item.label || item.tagName || item.elementType}
          onDelete={handleDelete}
          isVisible={isHovered || isSelected}
          setIsHovered={setIsHovered}
          isFirst={isFirst}
          overDetails={overDetails}
        />
      )}
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
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    children: PropTypes.arrayOf(
      PropTypes.shape({
        elementType: PropTypes.string.isRequired,
        id: PropTypes.string,
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
        children: PropTypes.array,
      })
    ),
  }).isRequired,
  addSibling: PropTypes.func,
  heirarchy: PropTypes.array,
  prevId: PropTypes.string,
  isFirst: PropTypes.bool,
  isPreview: PropTypes.bool.isRequired,
  updateItem: PropTypes.func.isRequired,
  handleDelete: PropTypes.func,
  overDetails: PropTypes.object,
};

export default Renderer;
