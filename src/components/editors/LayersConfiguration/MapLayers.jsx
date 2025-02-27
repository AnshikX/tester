import PropTypes from "prop-types";
import LayersEditor from "./LayersEditor";
import { useMap } from "../../contexts/MapContext";
import { useEffect, useState } from "react";

const MapLayers = ({ node, handleSelect }) => {
  const [childNode, setChildNode] = useState(null);

  const { getReturnLayer } = useMap();

  useEffect(() => {
    setChildNode(getReturnLayer(node.id));
  }, [node.id, getReturnLayer]);

  if (!childNode) return null;

  return <LayersEditor node={childNode} handleSelect={handleSelect} />;
};

MapLayers.propTypes = {
  node: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }).isRequired,
  handleSelect: PropTypes.func.isRequired,
};

export default MapLayers;
