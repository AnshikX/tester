import { useDrag } from "react-dnd";
import DropZone from "./DropZone";
import PropTypes from "prop-types";
import { jsxs } from "react/jsx-runtime";
import { useConfig } from "../components/ConfigContext";
import { useState } from "react";
import OverlayBar from "./OverlayBar";

import entities from "./Entities";
import { useSelection } from "./SelectionContext";

const Renderer = ({
  item,
  addSibling,
  heirarchy = [],
  prevId = null,
  isFirst = true,
}) => {
  const { removeChildById, updateItem, addItemToId } = useConfig();
  const { selectedItemId, setSelectedItemId } = useSelection();
  const [isHovered, setIsHovered] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
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

  const handleDoubleClick = (e) => {
    e.stopPropagation();
    if (item.elementType === "TEXT") {
      setIsEditing(true);
    }
  };

  const handleInputKeyDown = (e) => {
    if (e.key === "Enter") {
      handleInputSave(e);
    }
  };

  const handleInputSave = (e) => {
    const newValue = e.currentTarget.value;
    updateItem({ ...item, value: newValue });
    setIsEditing(false);
  };

  const handleBlur = (e) => {
    if (isEditing) {
      handleInputSave(e);
    }
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
    // resize: isSelected ? "both" : "none",
    // overflow: "auto",
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
        isEditing ? (
          <input
            id={item.id}
            type="text"
            defaultValue={item.value}
            style={{
              ...commonStyle,
              outline: "none",
            }}
            onMouseOver={handleMouseOver}
            onMouseOut={handleMouseOut}
            autoFocus
            onBlur={handleBlur}
            onKeyDown={handleInputKeyDown}
          />
        ) : (
          <span
            id={item.id}
            ref={(node) => drag(node)}
            style={commonStyle}
            onClick={handleSelect}
            onDoubleClick={handleDoubleClick}
            onMouseOver={handleMouseOver}
            onMouseOut={handleMouseOut}
          >
            {item.value || "Empty Text"}
          </span>
        )
      ) : item.elementType === "HTML" || item.elementType === "THIRD_PARTY" ? (
        jsxs(
          item.tagName || "div",
          {
            ...item.attributes,
            ref: (node) => drag(node),
            style: {
              ...commonStyle,
              ...item.attributes?.style,
            },
            onClick: handleSelect,
            onMouseOver: handleMouseOver,
            onMouseOut: handleMouseOut,
            id: item.id,
            children: Array.isArray(item.children) ? (
              <>
                {item.children.map((child, index) => {
                  const prevId = index > 0 ? item.children[index - 1].id : null;
                  return (
                    <Renderer
                      key={child?.id || `${item.id}-${index}`}
                      item={child}
                      prevId={prevId}
                      updateItem={(updatedChild) =>
                        updateChild(updatedChild, index)
                      }
                      addSibling={(newChild, offset) =>
                        addChild(newChild, offset, index)
                      }
                      heirarchy={[...heirarchy, child.id]}
                      isFirst={false}
                    />
                  );
                })}

                {item.children.length === 0 ? (
                  <DropZone
                    onDrop={(addedItem) =>
                      addChild(addedItem, 0, item.children.length)
                    }
                    position="bottom"
                    isOnly={true}
                    heirarchy={[...heirarchy, item.id]}
                  >
                    DROP HERE
                  </DropZone>
                ) : (
                  <DropZone
                    onDrop={(addedItem) =>
                      addChild(addedItem, 0, item.children.length)
                    }
                    position="bottom"
                    heirarchy={[
                      ...heirarchy,
                      item.id,
                      item.children[item.children.length - 1].id,
                    ]}
                  ></DropZone>
                )}
              </>
            ) : null,
          },
          item.id
        )
      ) : item.elementType === "COMPONENT" ? (
        <div
          id={item.id}
          ref={(node) => drag(node)}
          style={commonStyle}
          onClick={handleSelect}
          onDoubleClick={handleDoubleClick}
          onMouseOver={handleMouseOver}
          onMouseOut={handleMouseOut}
        >
          {jsxs(
            entities[item["$ref"]],
            {
              ...item.attributes,
              children: Array.isArray(item.children) ? (
                <>
                  {item.children.map((child, index) => {
                    const prevId =
                      index > 0 ? item.children[index - 1].id : null;
                    return (
                      <Renderer
                        key={child?.id || `${item.id}-${index}`}
                        item={child}
                        prevId={prevId}
                        updateItem={(updatedChild) =>
                          updateChild(updatedChild, index)
                        }
                        addSibling={(newChild, offset) =>
                          addChild(newChild, offset, index)
                        }
                        heirarchy={[...heirarchy, child.id]}
                        isFirst={false}
                      />
                    );
                  })}
                  {item.children.length === 0 ? (
                    <DropZone
                      onDrop={(addedItem) =>
                        addChild(addedItem, 0, item.children.length)
                      }
                      position="bottom"
                      isOnly={true}
                      heirarchy={[...heirarchy, item.id]}
                    >
                      DROP HERE
                    </DropZone>
                  ) : (
                    <DropZone
                      onDrop={(addedItem) =>
                        addChild(addedItem, 0, item.children.length)
                      }
                      position="bottom"
                      heirarchy={[
                        ...heirarchy,
                        item.id,
                        item.children[item.children.length - 1].id,
                      ]}
                    ></DropZone>
                  )}
                </>
              ) : null,
            },
            item.id
          )}
        </div>
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
        itemTagName={item.tagName}
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
