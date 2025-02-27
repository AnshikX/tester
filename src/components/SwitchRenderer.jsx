import React, { lazy } from "react";
import entities from "./Entities";
import PropTypes from "prop-types";

const SwitchRenderer = ({ item, children, handleSelect, handleMouseOver, handleMouseOut, drag, opacity }) => {
  // const entities = lazy(()=> import("./Entities"))
  if (item.elementType === "COMPONENT") {
    return (
      <div
        id={item.id}
        style={{ opacity }}
        onClick={handleSelect}
        onMouseOver={handleMouseOver}
        onMouseOut={handleMouseOut}
        ref={(node) => drag(node)}
      >
        {React.createElement(entities[item["$ref"]], { ...item.attributes }, children)}
      </div>
    );
  }
  return React.createElement(item.tagName || "div", {
    ...item.attributes,
    style: item.appliedStyles,
    onClick: handleSelect,
    onMouseOver: handleMouseOver,
    onMouseOut: handleMouseOut,
    id: item.id,
    ref: (node) => drag(node),
  }, children);
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
};