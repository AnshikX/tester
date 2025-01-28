import { createContext, useContext, useState } from "react";
import PropTypes from "prop-types";

const SelectionContext = createContext();

export const SelectionProvider = ({ children }) => {
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [isResizing, setIsResizing] = useState(false);

  return (
    <SelectionContext.Provider
      value={{ selectedItemId, setSelectedItemId, isResizing, setIsResizing }}
    >
      {children}
    </SelectionContext.Provider>
  );
};

SelectionProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
export const useSelection = () => useContext(SelectionContext);
