import React from "react";
import PropTypes from "prop-types";
import DropZone from "../DropZone";
import Renderer from "../Renderer";

const HTMLRenderer = ({ item, handleSelect, handleMouseOver, handleMouseOut, commonStyle, heirarchy, addChild, updateChild, drag }) => {
  return React.createElement(
    item.tagName || "div",
    {
      ...item.attributes,
      style: {
        ...commonStyle,
        ...item.attributes?.style,
      },
      onClick: handleSelect,
      onMouseOver: handleMouseOver,
      onMouseOut: handleMouseOut,
      id: item.id,
      ref: (node) => drag(node),
    },
    ...(Array.isArray(item.children)
      ? [
          ...item.children.map((child, index) => {
            const prevId = index > 0 ? item.children[index - 1].id : null;
            return (
              <Renderer
                key={child?.id || `${item.id}-${index}`}
                item={child}
                prevId={prevId}
                updateItem={(updatedChild) => updateChild(updatedChild, index)}
                addSibling={(newChild, offset) => addChild(newChild, offset, index)}
                heirarchy={[...heirarchy, child.id]}
                isFirst={false}
              />
            );
          }),
          item.children.length === 0 ? (
            <DropZone
              key={`${item.id}-drop`}
              onDrop={(addedItem) => addChild(addedItem, 0, item.children.length)}
              position="bottom"
              isOnly={true}
              heirarchy={[...heirarchy, item.id]}
            >
              DROP HERE
            </DropZone>
          ) : (
            <DropZone
              key={`${item.id}-drop-bottom`}
              onDrop={(addedItem) => addChild(addedItem, 0, item.children.length)}
              position="bottom"
              heirarchy={[
                ...heirarchy,
                item.id,
                item.children[item.children.length - 1].id,
              ]}
            />
          ),
        ]
      : [])
  );
};

HTMLRenderer.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string.isRequired,
    tagName: PropTypes.string,
    attributes: PropTypes.object,
    children: PropTypes.array,
  }).isRequired,
  handleSelect: PropTypes.func.isRequired,
  handleMouseOver: PropTypes.func.isRequired,
  handleMouseOut: PropTypes.func.isRequired,
  commonStyle: PropTypes.object.isRequired,
  heirarchy: PropTypes.array.isRequired,
  addChild: PropTypes.func.isRequired,
  updateChild: PropTypes.func.isRequired,
  drag: PropTypes.func.isRequired,
};

export default HTMLRenderer;