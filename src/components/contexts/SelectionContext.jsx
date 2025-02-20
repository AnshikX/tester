import { createContext, useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useConfig } from "./ConfigContext";

const SelectionContext = createContext();

export const SelectionProvider = ({  children }) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [isResizing, setIsResizing] = useState(false);
  const context = useConfig();
  

  useEffect(()=>{
  console.log(selectedItem)

  },[selectedItem])
  const [selectedContext, setSelectedContext] = useState(context);


  const selectedItemId = selectedItem?.id;
  const [localStyles, setLocalStyles] = useState(
    selectedItem?.attributes?.style || {}
  );

  return (
    <SelectionContext.Provider
      value={{
        selectedItemId,
        setSelectedItem,
        isResizing,
        setIsResizing,
        localStyles,
        setLocalStyles,
        selectedItem,
        selectedContext,
        setSelectedContext,
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
