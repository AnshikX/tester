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
const HTMLRendererX = ({
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
  const [item, setItem] = useState(config);
  useEffect(() => {
  });

  const ref = useRef({
    queue: [],
    triggered: false,
  });

  useEffect(() => {
    if (selectedItemId === item.id) {
      setItemDetails({
        config: item,
        setConfig: (item) => {
          updateItem(item);
          setItem(item);
        },
        localStyles: localStyles,
        setLocalStyles: setLocalStyles,
      });
    }
  }, [
    selectedItemId,
    item,
    setItemDetails,
    localStyles,
    updateItem,
    setLocalStyles,
  ]);

  const updateItemRef = useRef(updateItem);
  useEffect(() => {
    updateItemRef.current = updateItem;
  }, [updateItem]);

  const processQueue = useCallback(() => {
    const callBack = () => {
      setItem((item) => {
        const newChildren = [...item.children];

        while (ref.current.queue.length > 0) {
          const operation = ref.current.queue.shift();

          switch (operation.type) {
            case "add": {
              const { newChild, index } = operation;
              newChildren.splice(index, 0, {
                ...newChild,
              });
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
    }
    const func = async ()=>callBack();
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

  // Stabilizing the heirarchy to avoid unnecessary re-renders
  const stableHeirarchy = useMemo(
    () => [...heirarchy, item.id],
    [item.id, heirarchy]
  );

  const processedAttributes = useMemo(() => {
    if (!item.attributes) return {};

    return Object.entries(item.attributes).reduce((acc, [key, value]) => {
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

        // Add padding if not already set
        if (!Object.prototype.hasOwnProperty.call(computedStyles, "padding")) {
          computedStyles["padding"] = "4px";
        }

        acc[key] = computedStyles;
      } else {
        acc[key] = getValue(value);
      }

      return acc;
    }, {});
  }, [item.attributes]);

  const appliedStyles = useMemo(() => {
    if (
      localStyles &&
      selectedItemId === item.id &&
      Object.keys(localStyles).length > 0
    ) {
      return { ...processedAttributes.style, ...localStyles, opacity };
    }
    return { ...processedAttributes.style, opacity };
  }, [localStyles, selectedItemId, processedAttributes, item.id, opacity]);

  // const renderedChildren = useMemo(() => {
  //   console.log("Called children")
  //   return Array.isArray(item.children)
  //     // ? [
  //     //     ...item.children.map((child, index) => {
  //     //       const prevId = index > 0 ? item.children[index - 1].id : null;
  //     //       return (
  //     //         <Renderer
  //     //           key={child?.id}
  //     //           item={child}
  //     //           prevId={prevId}
  //     //           updateItem={(updatedChild) => updateChild(updatedChild)}
  //     //           addSibling={(newChild, offset) =>
  //     //             addChild(newChild, offset, index)
  //     //           }
  //     //           heirarchy={[...stableHeirarchy, child.id]}
  //     //           isFirst={false}
  //     //           isPreview={isPreview}
  //     //           handleDelete={() => removeChild(child.id)}
  //     //         />
  //     //       );
  //     //     }),
  //     //     item.children.length === 0 && !isPreview ? (
  //     //       <DropZone
  //     //         key={`${item.id}-drop`}
  //     //         onDrop={(addedItem) =>
  //     //           addChild(addedItem, 0, item.children.length)
  //     //         }
  //     //         position="bottom"
  //     //         isOnly={true}
  //     //         heirarchy={[...stableHeirarchy, item.id]}
  //     //       >
  //     //         DROP HERE
  //     //       </DropZone>
  //     //     ) : (
  //     //       !isPreview && (
  //     //         <DropZone
  //     //           key={`${item.id}-drop-bottom`}
  //     //           onDrop={(addedItem) =>
  //     //             addChild(addedItem, 0, item.children.length)
  //     //           }
  //     //           position="bottom"
  //     //           heirarchy={[
  //     //             ...stableHeirarchy,
  //     //             item.id,
  //     //             item.children[item.children.length - 1].id,
  //     //           ]}
  //     //         />
  //     //       )
  //     //     ),
  //     //   ]
  //     : [];
  // }, [item, stableHeirarchy, addChild, updateChild, isPreview, removeChild]);

  return React.createElement(
    item.tagName || "div",
    {
      ...processedAttributes,
      style: appliedStyles,
      onClick: handleSelect,
      onMouseOver: handleMouseOver,
      onMouseOut: handleMouseOut,
      id: item.id,
      ref: (node) => drag(node),
    },
    ...[
        ...item.children.map((child, index) => {
          const prevId = index > 0 ? item.children[index - 1].id : null;
          return (
            <Renderer
              key={child?.id}
              item={child}
              prevId={prevId}
              updateItem={(updatedChild) => updateChild(updatedChild)}
              addSibling={(newChild, offset) =>
                addChild(newChild, offset, index)
              }
              heirarchy={[...stableHeirarchy, child.id]}
              isFirst={false}
              isPreview={isPreview}
              handleDelete={() => removeChild(child.id)}
            />
          );
        }),
        item.children.length === 0 && !isPreview ? (
          <DropZone
            key={`${item.id}-drop`}
            onDrop={(addedItem) => addChild(addedItem, 0, item.children.length)}
            position="bottom"
            isOnly={true}
            heirarchy={[...stableHeirarchy, item.id]}
          >
            DROP HERE
          </DropZone>
        ) : (
          !isPreview && (
            <DropZone
              key={`${item.id}-drop-bottom`}
              onDrop={(addedItem) =>
                addChild(addedItem, 0, item.children.length)
              }
              position="bottom"
              heirarchy={[
                ...stableHeirarchy,
                item.id,
                item.children[item.children.length - 1].id,
              ]}
            />
          )
        ),
      
    ]
  );
};

const HTMLRenderer = React.memo(HTMLRendererX, (prevProps, nextProps) => {
  // Custom comparison function to prevent re-renders unless necessary
  return (
    prevProps.item === nextProps.item &&
    JSON.stringify(prevProps.heirarchy) ===
      JSON.stringify(nextProps.heirarchy) &&
    prevProps.handleMouseOver === nextProps.handleMouseOver &&
    prevProps.handleMouseOut === nextProps.handleMouseOut &&
    prevProps.handleSelect === nextProps.handleSelect &&
    prevProps.drag === nextProps.drag &&
    prevProps.addChild === nextProps.addChild &&
    prevProps.updateItem === nextProps.updateItem &&
    prevProps.isPreview === nextProps.isPreview
  );
});

HTMLRendererX.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string.isRequired,
    tagName: PropTypes.string,
    attributes: PropTypes.object,
    children: PropTypes.array,
  }).isRequired,
  handleSelect: PropTypes.func.isRequired,
  handleMouseOver: PropTypes.func.isRequired,
  opacity: PropTypes.number.isRequired,
  handleMouseOut: PropTypes.func.isRequired,
  heirarchy: PropTypes.array.isRequired,
  updateItem: PropTypes.func.isRequired,
  drag: PropTypes.func.isRequired,
  isPreview: PropTypes.bool.isRequired,
};

export default HTMLRenderer;
