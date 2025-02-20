import { useSelection } from "../../contexts/SelectionContext";
import LayersEditor from "./LayersEditor";

const MapLayers = ({ node, handleSelect }) => {
  const { contexts, setSelectedItem } = useSelection();

  const nodeContext = contexts[node.id] || {};
  const handleMapSelect = (id) => {
    setSelectedItem(id); // Ensure this updates the selection
    handleSelect(id);
  };  
  return (
    <LayersEditor
      node={{ ...node, ...nodeContext.config }}
      handleSelect={handleMapSelect}
    />
  );
};

export default MapLayers;
