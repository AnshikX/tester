import React, { useEffect, useMemo, useRef, useState } from "react";
import PropTypes from "prop-types";
import Renderer from "../Renderer";
import {
  useSelectedItemId,
  useSetters,
} from "../../components/contexts/SelectionContext";
import { useMap } from "../../components/contexts/MapContext";

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
  const { setReturnLayer } = useMap();
  const ref = useRef([]);

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
    let changed = false;
    for (let i = 0; i < configs.length; i++) {
      if (ref.current[i].value !== configs[i]) {
        changed = true;
        ref.current[i].value = configs[i];
      }
    }
    if (changed) {
      updateItem({ ...currentItem });
    }
  }, [configs, updateItem, currentItem]);

  useEffect(() => {
    setReturnLayer(currentItem.id, configs);
  }, [currentItem.id, configs, setReturnLayer]);

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
            setCurrentItem((prev) => ({
              ...prev,
              ...resource.itemConfig,
              bodyConfig: prev.bodyConfig,
            }));
            updateItem((prev) => ({
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
  }, [currentItem, updateItem]);

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
      const newConfigs = [...prev];
      newConfigs[index] = updatedConfig;
      return newConfigs;
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
