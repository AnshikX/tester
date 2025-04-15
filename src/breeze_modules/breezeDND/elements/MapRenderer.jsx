import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import PropTypes from "prop-types";
import Renderer from "../Renderer";
import { useSelectedItemId, useSetters } from "../contexts/SelectionContext";
import deepCopy from "../../utils/deepcopy";
import { usePushChanges } from "../contexts/UndoRedoContext";

const extractConfig = (filteredParts, item) => {
  let target = item;
  for (const part of filteredParts) {
    if (!target) break;
    target = target?.[part];
  }
  return target;
};

const MapRendererX = ({
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
  const [configs, setConfigs] = useState([]);
  const [currentItem, setCurrentItem] = useState(item);
  const { setItemDetails } = useSetters();
  const selectedItemId = useSelectedItemId();
  const { pushChanges } = usePushChanges();

  const ref = useRef([]);
  const previousConfigRef = useRef(deepCopy(currentItem));

  const updateCurrentItem = useCallback(
    (stateOrCallBack) => {
      console.log('object')
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
    setCurrentItem(item);
  }, [item]);

  useEffect(() => {
    if (selectedItemId === currentItem.id) {
      setItemDetails({
        config: currentItem,
        setConfig: updateCurrentItem,
      });
    }
  }, [selectedItemId, currentItem, setItemDetails, updateCurrentItem]);

  // useEffect(() => {
  //   let changed = false;
  //   for (let i = 0; i < configs.length; i++) {
  //     if (ref.current[i].value !== configs[i]) {
  //       changed = true;
  //       ref.current[i].value = configs[i];
  //     }
  //   }
  //   if (changed) {
  //     updateItem(currentItem );
  //   }
  // }, [configs, updateItem, currentItem]);

  useEffect(() => {
    const handleMessage = (event) => {
      // eslint-disable-next-line no-constant-condition
      if (event.origin === "http://localhost:3000" || true) {
        const { type, resource } = event.data;
        if (type === "resource" && resource.type === "filteredParts") {
          if (resource.statementId === currentItem.id) {
            const extractedConfigs = resource.filteredParts.map((parts) =>
              extractConfig(parts, currentItem)
            );
            const configs = [];
            extractedConfigs.forEach((element, i) => {
              ref.current[i] = element;
              configs[i] = element.value;
            });
            setConfigs(configs);
          }
        }
        if (type === "resource" && resource.type === "updateItem") {
          if (resource.itemConfig?.id === currentItem.id) {
            updateCurrentItem((prev) => ({
              ...prev,
              ...resource.itemConfig,
              bodyConfig: prev.bodyConfig,
            }));
          }
        }
      }
    };

    window.parent.postMessage(
      { source: "APP", type: "request", request: { type: "metaConfig" } },
      "*"
    );

    window.addEventListener("message", handleMessage);
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [currentItem, updateCurrentItem]);

  useEffect(() => {
    window.parent.postMessage(
      {
        source: "APP",
        type: "request",
        request: { type: "metaConfig", statementId: currentItem.id },
      },
      "*"
    );
  }, [currentItem.id]);

  const stableHeirarchy = useMemo(
    () => [...heirarchy, ...configs.map((config) => config?.id)],
    [heirarchy, configs]
  );

  function updateConfigs(index, updatedConfig) {
    setConfigs((prev) => {
      prev[index] = updatedConfig;
      ref.current[index].value = updatedConfig;

      updateItem(currentItem);
      return prev;
    });
  }

  if (configs.length === 0) return null;

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
      {configs.map((config, index) => (
        <Renderer
          key={config.id || index}
          item={config}
          heirarchy={stableHeirarchy}
          isPreview={isPreview}
          updateItem={(updatedItem) => updateConfigs(index, updatedItem)}
        />
      ))}
    </div>
  );
};

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
  drag: PropTypes.func.isRequired,
  handleMouseOver: PropTypes.func.isRequired,
  handleMouseOut: PropTypes.func.isRequired,
  opacity: PropTypes.number.isRequired,
  updateItem: PropTypes.func.isRequired,
  heirarchy: PropTypes.array.isRequired,
  isPreview: PropTypes.bool.isRequired,
};

export default React.memo(MapRendererX);
