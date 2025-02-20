import { createContext, useContext, useState } from "react";
import PropTypes from "prop-types";
import { useConfig } from "./ConfigContext";

const SelectionContext = createContext();

const findNodeById = (node, id) => {
  if (!node) return null;
  if (node.id === id) return node;
  if (node.children) {
    for (const child of node.children) {
      const found = findNodeById(child, id);
      if (found) return found;
    }
  }
  return null;
};

export const SelectionProvider = ({  children }) => {
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [isResizing, setIsResizing] = useState(false);
  const { config } = useConfig();

  const [useSelectedContext, setSelectedContext] = useState();

  const [contexts, setContexts] = useState({});

  const selectedItem = findNodeById(config, selectedItemId);
  const [localStyles, setLocalStyles] = useState(
    selectedItem?.attributes?.style || {}
  );

  return (
    <SelectionContext.Provider
      value={{
        selectedItemId,
        setSelectedItemId,
        isResizing,
        setIsResizing,
        localStyles,
        setLocalStyles,
        selectedItem,
        useSelectedContext,
        setSelectedContext,
        contexts,
        setContexts,
      }}
    >
      {children}
    </SelectionContext.Provider>
  );
};

SelectionProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
export const useSelection = () => useContext(SelectionContext);
