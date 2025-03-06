import React, { useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import Renderer from "../Renderer";
import { useSelectedItemId, useSetters } from "/src/components/contexts/SelectionContext";

const ConditionalRendererX = ({
  drag,
  item,
  handleSelect,
  handleMouseOver,
  opacity,
  handleMouseOut,
  heirarchy,
  isPreview,
  updateItem,
}) => {
  const selectedItemId = useSelectedItemId();
  const { setItemDetails } = useSetters();

  useEffect(() => {
    if (selectedItemId === item.id) {
      setItemDetails({
        config: item,
        setConfig: (item) => {
          updateItem({ ...item });
        },
      });
    }
  }, [selectedItemId, item, setItemDetails, updateItem]);
  
  
  const stableTrueHeirarchy = useMemo(
    () => [...heirarchy, item?.trueCase?.id],
    [heirarchy, item?.trueCase?.id]
  );
  const stableFalseHeirarchy = useMemo(
    () => [...heirarchy, item?.falseCase?.id],
    [heirarchy, item?.falseCase?.id]
  );
  if (!item?.id) return null;

  return (
    <>
      <div
        ref={(node) => drag(node)}
        onClick={handleSelect}
        style={{ opacity }}
        onMouseOver={handleMouseOver}
        id={item.id}
        onMouseOut={handleMouseOut}
        className="p-4"
      >
        {/* True Case */}

        {item.trueCase && (
          <Renderer
            key={item.trueCase.id}
            item={item.trueCase}
            heirarchy={stableTrueHeirarchy}
            isPreview={isPreview}
            updateItem={(updatedCase) => {
              updateItem({
                ...item,
                trueCase: updatedCase,
              });
            }}
            overDetails={{
              labelSuffix: '(TrueCase)'
            }}
          />
        )}
        {/* False Case */}
        {item.falseCase && (
          <>
            <div className="my-3"></div>
            <Renderer
              key={item.falseCase.id}
              item={item.falseCase}
              heirarchy={stableFalseHeirarchy}
              isPreview={isPreview}
              updateItem={(updatedCase) => {
                updateItem({
                  ...item,
                  falseCase: updatedCase,
                });
              }}
               overDetails={{
                labelSuffix: '(FalseCase)'
               }}
            />
          </>
        )}
      </div>
    </>
  );
};

const ConditionalRenderer = React.memo(
  ConditionalRendererX,
  (prevProps, nextProps) => {
    return (
      prevProps.item === nextProps.item &&
      JSON.stringify(prevProps.heirarchy) ===
        JSON.stringify(nextProps.heirarchy) &&
      prevProps.handleMouseOver === nextProps.handleMouseOver &&
      prevProps.handleMouseOut === nextProps.handleMouseOut &&
      prevProps.handleSelect === nextProps.handleSelect &&
      prevProps.opacity === nextProps.opacity &&
      prevProps.drag === nextProps.drag &&
      prevProps.isPreview === nextProps.isPreview &&
      prevProps.updateItem === nextProps.updateItem
    );
  }
);

ConditionalRendererX.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string.isRequired,
    tagName: PropTypes.string,
    attributes: PropTypes.object,
    trueCase: PropTypes.shape({
      id: PropTypes.string.isRequired,
      tagName: PropTypes.string,
      elementType: PropTypes.string.isRequired,
      attributes: PropTypes.object,
      children: PropTypes.array,
    }),
    bodyConfig: PropTypes.shape({
      statements: PropTypes.array,
    }),
    falseCase: PropTypes.shape({
      id: PropTypes.string.isRequired,
      tagName: PropTypes.string,
      elementType: PropTypes.string.isRequired,
      attributes: PropTypes.object,
      children: PropTypes.array,
    }),
  }).isRequired,
  handleSelect: PropTypes.func.isRequired,
  drag: PropTypes.func.isRequired,
  handleMouseOver: PropTypes.func.isRequired,
  handleMouseOut: PropTypes.func.isRequired,
  opacity: PropTypes.number.isRequired,
  updateItem: PropTypes.func.isRequired,
  heirarchy: PropTypes.array.isRequired,
  isPreview: PropTypes.bool.isRequired,
};

export default ConditionalRenderer;
