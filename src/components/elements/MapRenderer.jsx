import React, { useMemo } from "react";
import PropTypes from "prop-types";
import Renderer from "../Renderer";

const MapRendererX = ({
  item,
  handleSelect,
  handleMouseOver,
  handleMouseOut,
  heirarchy,
  drag,
  isPreview,
}) => {
  // Stabilize the hierarchy to avoid unnecessary re-renders
  const stableHeirarchy = useMemo(
    () => [...heirarchy, item.id],
    [item.id, heirarchy]
  );
  // Render mapped children
  const renderedChildren = useMemo(() => {
    if (!item.bodyConfig || !item.bodyConfig.statements) return [];

    return item.bodyConfig.statements.map((stmt, index) => {
      if (stmt.type === "RETURN" && stmt.value) {
        return (
          <Renderer
            key={stmt.id || `${item.id}-${index}`}
            item={stmt.value}
            heirarchy={[...stableHeirarchy, stmt.id]}
            isPreview={isPreview}
          />
        );
      }
      return null;
    });
  }, [
    item.bodyConfig,
    stableHeirarchy,
    isPreview,
    item.id,
  ]);

  return (
    <div
      onClick={handleSelect}
      onMouseOver={handleMouseOver}
      id={item.id}
      ref={(node) => drag(node)}
      onMouseOut={handleMouseOut}
      className="p-4"
    >
      {renderedChildren}
    </div>
  );
};

const MapRenderer = React.memo(MapRendererX, (prevProps, nextProps) => {
  return (
    prevProps.item === nextProps.item &&
    prevProps.localStyles === nextProps.localStyles &&
    JSON.stringify(prevProps.heirarchy) ===
      JSON.stringify(nextProps.heirarchy) &&
    prevProps.handleMouseOver === nextProps.handleMouseOver &&
    prevProps.handleMouseOut === nextProps.handleMouseOut &&
    prevProps.handleSelect === nextProps.handleSelect &&
    prevProps.commonStyle === nextProps.commonStyle &&
    prevProps.drag === nextProps.drag &&
    prevProps.isPreview === nextProps.isPreview
  );
});

MapRendererX.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string.isRequired,
    tagName: PropTypes.string,
    attributes: PropTypes.object,
    bodyConfig: PropTypes.shape({
      statements: PropTypes.array,
    }),
  }).isRequired,
  handleSelect: PropTypes.func.isRequired,
  handleMouseOver: PropTypes.func.isRequired,
  handleMouseOut: PropTypes.func.isRequired,
  commonStyle: PropTypes.object.isRequired,
  heirarchy: PropTypes.array.isRequired,
  drag: PropTypes.func.isRequired,
  isPreview: PropTypes.bool.isRequired,
};

export default MapRenderer;