import { createContext, useContext, useState } from "react";
import PropTypes from "prop-types";

const SelectionContext = createContext();

export const SelectionProvider = ({ children }) => {
  const [selectedItemId, setSelectedItemId] = useState(null);

  const selectItem = (id) => {
    setSelectedItemId(id);
  };

  const clearSelection = () => {
    setSelectedItemId(null);
  };

  return (
    <SelectionContext.Provider
      value={{ selectedItemId, selectItem, clearSelection }}
    >
      {children}
    </SelectionContext.Provider>
  );
};

export const useSelection = () => useContext(SelectionContext);

SelectionProvider.propTypes = {
  children: PropTypes.node.isRequired,
};