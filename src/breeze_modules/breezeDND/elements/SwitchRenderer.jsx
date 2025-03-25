import React, { useEffect, useState } from "react";
import { loadEntity } from "../../Entities";
import PropTypes from "prop-types";

const SwitchRenderer = ({
  item,
  children,
  handleSelect,
  handleMouseOver,
  handleMouseOut,
  drag,
  opacity,
  processedAttributes,
}) => {
  const [importedComponent, setImportedComponent] = useState({
    isLoaded: false,
  });
  useEffect(() => {
    if (item.elementType === "COMPONENT") {
      loadEntity(item.$ref).then((data) => {
        setImportedComponent((comp) => {
          if (comp.component != data) {
            return { component: data, isLoaded: true };
          }
          return comp;
        });
      });
    } else {
      if (item.elementType === "html") {
        setImportedComponent({ isLoaded: true });
      }
    }
  }, [item.$ref, item.elementType]);

  if (item.elementType === "COMPONENT" || item.tagName === "fragment") {
    return importedComponent.isLoaded ? (
      <div
        id={item.id}
        style={{ opacity }}
        onClick={handleSelect}
        onMouseOver={handleMouseOver}
        onMouseOut={handleMouseOut}
        ref={(node) => drag(node)}
      >
        {item.tagName === "fragment"
          ? children
          : React.createElement(
              importedComponent.component,
              { ...processedAttributes },
              children
            )}
      </div>
    ) : (
      <div>Loading...</div>
    );
  }

  return React.createElement(
    item.tagName || "div",
    {
      ...processedAttributes,
      style: item.appliedStyles,
      onClick: handleSelect,
      onMouseOver: handleMouseOver,
      onMouseOut: handleMouseOut,
      id: item.id,
      ref: (node) => drag(node),
    },
    children?.filter((i) => i).length > 0 ? children : null
  );
};

export default SwitchRenderer;

SwitchRenderer.propTypes = {
  item: PropTypes.shape({
    elementType: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    tagName: PropTypes.string,
    $ref: PropTypes.string,
    attributes: PropTypes.object,
    appliedStyles: PropTypes.object,
  }).isRequired,
  children: PropTypes.array,
  handleSelect: PropTypes.func.isRequired,
  handleMouseOver: PropTypes.func.isRequired,
  handleMouseOut: PropTypes.func.isRequired,
  drag: PropTypes.func.isRequired,
  opacity: PropTypes.number.isRequired,
  processedAttributes: PropTypes.object.isRequired,
};
