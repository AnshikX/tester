import React, { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import Renderer from "../Renderer";
import {
  useSelectedItemId,
  useSetters,
} from "/src/components/contexts/SelectionContext";

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
  const [currentItem, setCurrentItem] = useState(item);
  const selectedItemId = useSelectedItemId();
  const { setItemDetails } = useSetters();

  useEffect(() => {
    setCurrentItem(item);
  }, [item]);

  useEffect(() => {
    if (selectedItemId === currentItem.id) {
      setItemDetails({
        config: currentItem,
        setConfig: (updatedItem) => {
          setCurrentItem(updatedItem);
          updateItem({ ...updatedItem });
        },
      });
    }
  }, [selectedItemId, currentItem, setItemDetails, updateItem]);

  useEffect(() => {
    if (selectedItemId !== currentItem.id) return;

    const handleMessageEvent = (event) => {
      if (event.data?.source === "BREEZE" && event.data.type === "resource") {
        const { resource } = event.data;
        if (resource.type === "updateItem") {
          console.log(resource);
          setCurrentItem(resource.itemConfig);
          updateItem(resource.itemConfig);
        }
      }
    };

    window.addEventListener("message", handleMessageEvent);
    return () => window.removeEventListener("message", handleMessageEvent);
  }, [selectedItemId, currentItem.id, updateItem]);

  const stableTrueHeirarchy = useMemo(
    () => [...heirarchy, currentItem?.trueCase?.id],
    [heirarchy, currentItem?.trueCase?.id]
  );
  const stableFalseHeirarchy = useMemo(
    () => [...heirarchy, currentItem?.falseCase?.id],
    [heirarchy, currentItem?.falseCase?.id]
  );

  if (!currentItem?.id) return null;

  return (
    <div
      ref={(node) => drag(node)}
      onClick={handleSelect}
      style={{ opacity }}
      onMouseOver={handleMouseOver}
      id={currentItem.id}
      onMouseOut={handleMouseOut}
      className="p-4"
    >
      {/* True Case */}
      {currentItem.trueCase && (
        <Renderer
          key={currentItem.trueCase.id}
          item={currentItem.trueCase}
          heirarchy={stableTrueHeirarchy}
          isPreview={isPreview}
          updateItem={(updatedCase) => {
            setCurrentItem((prev) => ({
              ...prev,
              trueCase: updatedCase,
            }));
            updateItem({
              ...currentItem,
              trueCase: updatedCase,
            });
          }}
          overDetails={{
            labelSuffix: "(TrueCase)",
          }}
        />
      )}
      {/* False Case */}
      {currentItem.falseCase && (
        <>
          <div className="my-3"></div>
          <Renderer
            key={currentItem.falseCase.id}
            item={currentItem.falseCase}
            heirarchy={stableFalseHeirarchy}
            isPreview={isPreview}
            updateItem={(updatedCase) => {
              setCurrentItem((prev) => ({
                ...prev,
                falseCase: updatedCase,
              }));
              updateItem({
                ...currentItem,
                falseCase: updatedCase,
              });
            }}
            overDetails={{
              labelSuffix: "(FalseCase)",
            }}
          />
        </>
      )}
    </div>
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
