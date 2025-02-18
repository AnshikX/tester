import React from "react";
import PropTypes from "prop-types";
import DropZone from "../DropZone";
import entities from "../Entities";
import Renderer from "../Renderer";

const ComponentRenderer = ({
  item,
  handleSelect,
  handleMouseOver,
  handleMouseOut,
  commonStyle,
  heirarchy,
  addChild,
  updateChild,
  drag,
  isPreview,
}) => {
  return (
    <div
      id={item.id}
      style={commonStyle}
      onClick={handleSelect}
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
      ref={(node) => drag(node)}
    >
      {React.createElement(
        entities[item["$ref"]],
        { ...item.attributes },
        Array.isArray(item.children) ? (
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
                  isPreview={isPreview}
                />
              );
            })}
            {!isPreview && (
              item.children.length === 0 ? (
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
                />
              )
            )}
          </>
        ) : null
      )}
    </div>
  );
};

ComponentRenderer.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string.isRequired,
    $ref: PropTypes.string.isRequired,
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
  isPreview: PropTypes.bool.isRequired
};

export default ComponentRenderer;
