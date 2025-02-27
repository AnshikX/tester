import React, { useEffect, useMemo, useRef, useState } from "react";
import PropTypes from "prop-types";
import Renderer from "../Renderer";
import { useSelectedItemId,  useSetters } from "../../components/contexts/SelectionContext";
import { useMap } from "../../components/contexts/MapContext";

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
  const [config, setConfig] = useState(null);
  const [metaConfig, setMetaConfig] = useState([]);
  // const [selectedReturn, setSelectedReturn] = useState();
  const { setItemDetails } = useSetters();
  const selectedItemId = useSelectedItemId();
  const { setReturnLayer } = useMap();
  const ref = useRef();
  const prevConfigRef = useRef(null);
  useEffect(() => {
    if (config && prevConfigRef.current !== config) {
      prevConfigRef.current = config; // Track the last updated config
      updateItem({ ...item }); // Only update when config actually changes
    }
  }, [config, item, updateItem]);

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

  useEffect(() => {
    setReturnLayer(item.id, config);
  }, [item.id, config, setReturnLayer]);

  useEffect(() => {
    const handleMessage = (event) => {
      // eslint-disable-next-line no-constant-condition
      if (event.origin === "http://localhost:3000" || true) {
        const { type, resource } = event.data;
        if (type === "resource" && resource.type === "metaConfig") {
          if (resource.statementId === item.id) {
            setMetaConfig(resource.metaConfig);
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
  }, [item.id]);

  useEffect(() => {
    window.parent.postMessage(
      {
        source: "APP",
        type: "request",
        request: { type: "metaConfig", statementId: item.id },
      },
      "*"
    );
  }, [item.id]);

  useEffect(() => {
    if (metaConfig?.returnStatements?.length > 0) {
      const selectedReturn = metaConfig.returnStatements[0].index;
      const metaParts = metaConfig.index.split("<>");
      const returnParts = selectedReturn.split("<>");
      let filteredParts = [...returnParts];
      if (metaConfig.index && selectedReturn.startsWith(metaConfig.index)) {
        filteredParts = returnParts.slice(metaParts.length);
      }
      let target = item;
      for (const part of filteredParts) {
        if (!target) break;
        target = target?.[part];
      }
      if (target) {
        ref.current = target;
        setConfig(target.value);
      }
    }
  }, [metaConfig, item, setConfig]);

  useEffect(() => {
    const target = ref.current;
    if (config && target && target.value !== config) {
      target.value = config;
      updateItem({ ...item });
    }
  }, [config, updateItem, item]);

  const stableHeirarchy = useMemo(
    () => [...heirarchy, config?.id],
    [heirarchy, config?.id]
  );

  if (!config?.id) return null;

  return (
    <div
      ref={(node) => drag(node)}
      onClick={handleSelect}
      style={{ opacity }}
      onMouseOver={handleMouseOver}
      id={item.id}
      onMouseOut={handleMouseOut}
      className="p-4"
    >
      <Renderer
        key={config.id}
        item={config}
        heirarchy={stableHeirarchy}
        isPreview={isPreview}
        updateItem={setConfig}
      />
    </div>
  );
};

const MapRenderer = React.memo(MapRendererX, (prevProps, nextProps) => {
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
  drag: PropTypes.func.isRequired,
  handleMouseOver: PropTypes.func.isRequired,
  handleMouseOut: PropTypes.func.isRequired,
  opacity: PropTypes.number.isRequired,
  updateItem: PropTypes.func.isRequired,
  heirarchy: PropTypes.array.isRequired,
  isPreview: PropTypes.bool.isRequired,
};

export default MapRenderer;
