import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import PropTypes from "prop-types";

// Create separate contexts for each value and setter
const SelectedItemIdContext = createContext();
const SelectedItemIdSetterContext = createContext();
const ItemDetailsContext = createContext();
const ItemDetailsSetterContext = createContext();

const RenderChildren = React.memo(
  ({ child }) => <>{child}</>,
  (prevProps, nextProps) => {
    return prevProps.child === nextProps.child;
  }
);

RenderChildren.displayName = "REnder";

export const SelectionProvider = ({ children }) => {
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [itemDetails, setItemDetails2] = useState(null);
  const setItemDetails = useCallback((itemDetails) => {
    console.log("Setting itemDetails:");
    setItemDetails2(itemDetails);
  }, []);

  // useEffect(() => {
  //   console.log("SelectionContext updated - itemDetails.config.mapParams:", itemDetails?.config?.mapParams);
  // }, [itemDetails]);

  return (
    <SelectedItemIdContext.Provider value={selectedItemId}>
      <SelectedItemIdSetterContext.Provider value={setSelectedItemId}>
        <ItemDetailsContext.Provider value={itemDetails}>
          <ItemDetailsSetterContext.Provider value={setItemDetails}>
            <RenderChildren child={children} />
          </ItemDetailsSetterContext.Provider>
        </ItemDetailsContext.Provider>
      </SelectedItemIdSetterContext.Provider>
    </SelectedItemIdContext.Provider>
  );
};

SelectionProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
// Hooks to get values
export const useSelectedItemId = () => useContext(SelectedItemIdContext);
export const useSelectedItemDetails = () => useContext(ItemDetailsContext);

// Hooks to get setters
export const useSetSelectedItemId = () =>
  useContext(SelectedItemIdSetterContext);
export const useSetItemDetails = () => useContext(ItemDetailsSetterContext);

// Hook to get both setters together (for convenience)
export const useSetters = () => {
  const setSelectedItemId = useSetSelectedItemId();
  const setItemDetails = useSetItemDetails();
  return useMemo(
    () => ({ setSelectedItemId, setItemDetails }),
    [setSelectedItemId, setItemDetails]
  );
};
