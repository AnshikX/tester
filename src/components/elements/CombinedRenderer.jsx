import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import PropTypes from "prop-types";
import DropZone from "../DropZone";
import Renderer from "../Renderer";
import { useSelectedItemId, useSetters } from "../contexts/SelectionContext";
import { getValue } from "../constants/processAttributesFunction";
import SwitchRenderer from "../SwitchRenderer";
import { usePushChanges } from "../contexts/UndoRedoContext";
import deepCopy from "/src/utils/deepcopy";

// const debounce = (func, delay) => {
//   let timeout;
//   return (...args) => {
//     clearTimeout(timeout);
//     timeout = setTimeout(() => func(...args), delay);
//   };
// };

const CombinedRenderer = ({
  item: config,
  handleSelect,
  handleMouseOver,
  handleMouseOut,
  heirarchy,
  updateItem,
  opacity,
  drag,
  isPreview,
}) => {
  const { setItemDetails } = useSetters();
  const selectedItemId = useSelectedItemId();
  const { pushChanges } = usePushChanges();
  const [currentItem, setCurrentItem] = useState(config);
  const previousConfigRef = useRef(currentItem);
  const removedIndexRef = useRef();
  removedIndexRef.current = null;

  const updateCurrentItem = useCallback(
    (stateOrCallBack) => {
      setCurrentItem((prev) => {
        let next;
        if (typeof stateOrCallBack === "function") {
          next = stateOrCallBack(prev);
        } else {
          next = stateOrCallBack;
        }
        pushChanges({
          doChanges: updateCurrentItem.bind(null, previousConfigRef.current),
        });
        previousConfigRef.current = deepCopy(next);
        updateItem(next);
        return next;
      });
    },
    [updateItem, pushChanges]
  );

  useEffect(() => {
    setCurrentItem(config);
  }, [config]);

  useEffect(() => {
    if (selectedItemId === currentItem.id) {
      setItemDetails({ config: currentItem });
    }
  }, [selectedItemId, currentItem, setItemDetails]);

  useEffect(() => {
    if (selectedItemId !== config.id) return;

    const handleMessageEvent = (event) => {
      if (event.data?.source === "BREEZE" && event.data.type === "resource") {
        const { resource } = event.data;
        if (resource.type === "updateItem") {
          updateCurrentItem((item) => {
            resource.itemConfig.children = item?.children;
            // debouncedUpdate.current(resource.itemConfig);
            if (JSON.stringify(resource.itemConfig) !== JSON.stringify(item)) {
              console.log(resource);
              return resource.itemConfig;
            } else {
              return item;
            }
          });
        }
      }
    };

    window.addEventListener("message", handleMessageEvent);
    return () => window.removeEventListener("message", handleMessageEvent);
  }, [selectedItemId, config.id,updateCurrentItem]);

  const addChild = useCallback(
    (newChild, offset, index) => {
      updateCurrentItem((prevItem) => {
        console.log(removedIndexRef.current, prevItem.children.length);
        let pos = offset + index;
        console.log(pos);
        if (removedIndexRef.current <= pos) {
          // pos = pos - 1;
          console.log(pos);
        }
        removedIndexRef.current = null;
        const updatedItem = { ...prevItem };

        updatedItem.children.splice(pos, 0, { ...newChild });
        // debouncedUpdate.current(updatedItem);
        return updatedItem;
      });
    },
    [updateCurrentItem]
  );

  const removeChild = useCallback(
    (id) => {
      updateCurrentItem((prevItem) => {
        const updatedItem = { ...prevItem };
        const index = prevItem.children.findIndex((c) => c.id === id);
        removedIndexRef.current = index;
        updatedItem.children.splice(index, 1);

        return updatedItem;
      });
    },
    [updateCurrentItem]
  );

  const updateChild = useCallback(
    (child) => {
      setCurrentItem((prevItem) => {
        const index = prevItem.children.findIndex((c) => c.id === child.id);
        if (index !== -1) {
          prevItem.children[index] = child;
        } else {
          alert("SOMETHING WENT WRONG Combined renderer updatechild");
        }
        return prevItem;
      })
    },
    []
  );

  const stableHeirarchy = useMemo(
    () => [...heirarchy, currentItem.id],
    [currentItem.id, heirarchy]
  );

  const processedAttributes = useMemo(() => {
    if (!currentItem.attributes) return {};
    return Object.entries(currentItem.attributes).reduce(
      (acc, [key, value]) => {
        if (key.startsWith("on")) return acc;
        if (key === "style" && value?.type === "OBJECT") {
          const computedStyles = Object.entries(value.properties).reduce(
            (styleAcc, [styleKey, styleValue]) => {
              styleAcc[styleKey] = styleValue.value;
              return styleAcc;
            },
            {}
          );
          if (
            !Object.prototype.hasOwnProperty.call(computedStyles, "padding")
          ) {
            computedStyles["padding"] = "4px";
          }
          acc[key] = computedStyles;
        } else {
          acc[key] = getValue(value);
        }
        return acc;
      },
      {}
    );
  }, [currentItem.attributes]);

  const appliedStyles = useMemo(() => {
    return { ...processedAttributes.style, opacity };
  }, [processedAttributes, opacity]);

  return (
    <SwitchRenderer
      item={{ ...currentItem, appliedStyles }}
      handleSelect={handleSelect}
      handleMouseOver={handleMouseOver}
      handleMouseOut={handleMouseOut}
      drag={drag}
      opacity={opacity}
      processedAttributes={processedAttributes}
    >
      {currentItem.children?.map((child, index) => {
        const prevId = index > 0 ? currentItem.children[index - 1].id : null;
        return (
          <Renderer
            key={child?.id}
            item={child}
            prevId={prevId}
            updateItem={updateChild}
            addSibling={(newChild, offset) => addChild(newChild, offset, index)}
            heirarchy={[...stableHeirarchy, child.id]}
            isFirst={false}
            isPreview={isPreview}
            handleDelete={() => removeChild(child.id)}
          />
        );
      })}
      {!isPreview &&
        currentItem.children &&
        (currentItem.children.length === 0 ? (
          <DropZone
            key={`${currentItem.id}-drop`}
            onDrop={(addedItem) =>
              addChild(addedItem, 0, currentItem.children.length)
            }
            position="bottom"
            isOnly={true}
            heirarchy={[...stableHeirarchy, currentItem.id]}
          >
            DROP HERE
          </DropZone>
        ) : (
          <DropZone
            key={`${currentItem.id}-drop-bottom`}
            onDrop={(addedItem) =>
              addChild(addedItem, 0, currentItem.children.length)
            }
            position="bottom"
            heirarchy={[
              ...stableHeirarchy,
              currentItem.id,
              currentItem.children[currentItem.children.length - 1].id,
            ]}
          />
        ))}
    </SwitchRenderer>
  );
};

CombinedRenderer.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string.isRequired,
    tagName: PropTypes.string,
    elementType: PropTypes.string.isRequired,
    attributes: PropTypes.object,
    children: PropTypes.array,
  }).isRequired,
  handleSelect: PropTypes.func.isRequired,
  handleMouseOver: PropTypes.func.isRequired,
  handleMouseOut: PropTypes.func.isRequired,
  opacity: PropTypes.number.isRequired,
  heirarchy: PropTypes.array.isRequired,
  updateItem: PropTypes.func.isRequired,
  drag: PropTypes.func.isRequired,
  isPreview: PropTypes.bool.isRequired,
};

export default React.memo(CombinedRenderer, (prevProps, nextProps) => {
  return (
    prevProps.item === nextProps.item &&
    JSON.stringify(prevProps.heirarchy) ===
      JSON.stringify(nextProps.heirarchy) &&
    prevProps.handleMouseOver === nextProps.handleMouseOver &&
    prevProps.handleMouseOut === nextProps.handleMouseOut &&
    prevProps.handleSelect === nextProps.handleSelect &&
    prevProps.drag === nextProps.drag &&
    prevProps.updateItem === nextProps.updateItem &&
    prevProps.isPreview === nextProps.isPreview
  );
});
