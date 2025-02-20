import { useSelection } from "../../contexts/SelectionContext";
import PropTypes from "prop-types";
import LayersEditor from "./LayersEditor";

const MapLayers = ({ node, handleSelect }) => {
  const { contexts, setSelectedItem } = useSelection();

  const nodeContext = contexts[node.id] || {};
  const handleMapSelect = (id) => {
    setSelectedItem(id);
    handleSelect(id);
  };
  return (
    <LayersEditor
      node={{ ...node, ...nodeContext.config }}
      handleSelect={handleMapSelect}
    />
  );
};

MapLayers.propTypes = {
  node: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }).isRequired,
  handleSelect: PropTypes.func.isRequired,
};

export default MapLayers;
