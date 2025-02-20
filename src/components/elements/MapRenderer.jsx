import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import Renderer from "../Renderer";
import { useConfig } from "../../components/contexts/ConfigContext";
import { useSelection } from "../../components/contexts/SelectionContext";

const MapRendererX = ({
  item,
  handleSelect,
  handleMouseOver,
  handleMouseOut,
  heirarchy,
  isPreview,
  updateItem,
}) => {
  const { config, setConfig } = useConfig();
  const [metaConfig, setMetaConfig] = useState([]);
  const [selectedReturn, setSelectedReturn] = useState();
  const ref = useRef();

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
      if (selectedReturn.startsWith(metaConfig.index)) {
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
    const target = ref.current
    if (config && target && target.value !== config) {
      target.value = config
      updateItem({...item})
    }
  }, [config, updateItem, item]);

  // Render mapped children
  // const renderedChildren = useMemo(() => {
  //   if (!item.bodyConfig || !item.bodyConfig.statements) return [];

  //   return item.bodyConfig.statements.map((stmt, index) => {
  //     if (stmt.type === "RETURN" && stmt.value) {
  //       return (
  //         <Renderer
  //           key={stmt.id || `${item.id}-${index}`}
  //           item={stmt.value}
  //           heirarchy={[...stableHeirarchy, stmt.id]}
  //           isPreview={isPreview}
  //         />
  //       );
  //     }
  //     return null;
  //   });
  // }, [item.bodyConfig, stableHeirarchy, isPreview, item.id]);

  if (!config?.id) return null;

  return (
    <div
      onClick={handleSelect}
      onMouseOver={handleMouseOver}
      id={item.id}
      onMouseOut={handleMouseOut}
      className="p-4"
    >
      <Renderer
        key={config.id}
        item={config}
        heirarchy={[]}
        isPreview={isPreview}
      />
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
    prevProps.isPreview === nextProps.isPreview &&
    prevProps.updateChild === nextProps.updateChild
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
  updateItem: PropTypes.func.isRequired,
  heirarchy: PropTypes.array.isRequired,
  isPreview: PropTypes.bool.isRequired,
};

export default MapRenderer;
