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

const debounce = (func, delay) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
};
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
  const [localStyles, setLocalStyles] = useState({});
  const [currentItem, setCurrentItem] = useState(config);
  useEffect(() => {
    if (selectedItemId === currentItem.id) {
      setItemDetails({
        config: currentItem,
        // setConfig: (item) => {
        //   updateItem(item);
        //   setCurrentItem(item);
        // },
        // localStyles: localStyles,
        // setLocalStyles: setLocalStyles,
      });
    }
  }, [selectedItemId, currentItem, setItemDetails, localStyles, updateItem]);

  const ref = useRef({
    queue: [],
    triggered: false,
  });
  const debouncedUpdate = useRef(
    debounce((itemConfig) => {
      updateItemRef.current(itemConfig);
    }, 250)
  );

  useEffect(() => {
    if (selectedItemId !== config.id) return;

    const handleMessageEvent = (event) => {
      if (event.data?.source === "BREEZE" && event.data.type === "resource") {
        const { resource } = event.data;
        if (resource.type === "updateItem") {
          console.log(resource);
          setCurrentItem((item) => {
            resource.itemConfig.children = item?.children;
            debouncedUpdate.current(resource.itemConfig);
            return resource.itemConfig;
          });
        }
      }
    };

    window.addEventListener("message", handleMessageEvent);
    return () => window.removeEventListener("message", handleMessageEvent);
  }, [selectedItemId, config.id]);

  const updateItemRef = useRef(updateItem);
  useEffect(() => {
    updateItemRef.current = updateItem;
  }, [updateItem]);

  const processQueue = useCallback(() => {
    const callBack = () => {
      setCurrentItem((item) => {
        const newChildren = [...item.children];
        while (ref.current.queue.length > 0) {
          const operation = ref.current.queue.shift();
          switch (operation.type) {
            case "add": {
              const { newChild, index } = operation;
              newChildren.splice(index, 0, { ...newChild });
              break;
            }
            case "remove": {
              const { id } = operation;
              const index = newChildren.findIndex((child) => child.id === id);
              if (index !== -1) {
                newChildren.splice(index, 1);
              }
              break;
            }
            case "update": {
              const { child } = operation;
              const index = newChildren.findIndex((c) => c.id === child.id);
              if (index !== -1) {
                newChildren[index] = child;
              }
              break;
            }
            default:
              break;
          }
        }
        ref.current.triggered = false;
        const newItem = { ...item, children: newChildren };
        setTimeout(() => updateItemRef.current(newItem), 0);
        return newItem;
      });
    };
    const func = async () => callBack();
    func();
  }, []);

  const addToQueue = useCallback(
    (operation) => {
      ref.current.queue.push(operation);
      if (!ref.current.triggered) {
        ref.current.triggered = true;
        processQueue();
      }
    },
    [processQueue]
  );

  const addChild = useCallback(
    (newChild, offset, index) => {
      addToQueue({ type: "add", newChild, index: offset + index });
    },
    [addToQueue]
  );

  const removeChild = useCallback(
    (id) => {
      addToQueue({ type: "remove", id });
    },
    [addToQueue]
  );

  const updateChild = useCallback(
    (child) => {
      addToQueue({ type: "update", child });
    },
    [addToQueue]
  );

  // Stabilize the heirarchy to avoid unnecessary re-renders
  const stableHeirarchy = useMemo(
    () => [...heirarchy, currentItem.id],
    [currentItem.id, heirarchy]
  );

  const processedAttributes = useMemo(() => {
    if (!currentItem.attributes) return {};
    return Object.entries(currentItem.attributes).reduce(
      (acc, [key, value]) => {
        if (key.startsWith("on")) {
          // Skip event listeners
          return acc;
        }
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
    if (
      localStyles &&
      selectedItemId === currentItem.id &&
      Object.keys(localStyles).length > 0
    ) {
      return { ...processedAttributes.style, ...localStyles, opacity };
    }
    return { ...processedAttributes.style, opacity };
  }, [
    localStyles,
    selectedItemId,
    processedAttributes,
    currentItem.id,
    opacity,
  ]);

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
        (currentItem.children?.length === 0 ? (
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
    $ref: PropTypes.string,
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
