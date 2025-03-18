import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import {
  useSelectedItemId,
  useSetters,
} from "/src/components/contexts/SelectionContext";
import { usePushChanges } from "/src/components/contexts/UndoRedoContext";
import deepCopy from "/src/utils/deepcopy";

const TextRenderer = ({
  item,
  handleSelect,
  updateItem,
  handleMouseOver,
  handleMouseOut,
  opacity,
  drag,
  isPreview,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentItem, setCurrentItem] = useState(item);

  const selectedItemId = useSelectedItemId();
  const { setItemDetails } = useSetters();
  const { pushChanges } = usePushChanges();
  const previousConfigRef = useRef(currentItem);

  useEffect(() => {
    setCurrentItem(item);
  }, [item]);

  useEffect(() => {
    if (selectedItemId === currentItem.id) {
      setItemDetails({
        config: currentItem,
        setConfig: (updatedItem) => {
          setCurrentItem(updatedItem);
          updateItem({ ...updatedItem });
        },
      });
    }
  }, [selectedItemId, currentItem, setItemDetails, updateItem]);

  useEffect(() => {
    if (currentItem) {
      pushChanges({
        doChanges: setCurrentItem.bind(null, previousConfigRef.current),
      });
      console.log(previousConfigRef.current);
      previousConfigRef.current = deepCopy(currentItem);
    }
  }, [currentItem, pushChanges]);

  const handleInputKeyDown = (e) => {
    if (e.key === "Enter") {
      handleInputSave(e);
    }
  };

  const handleInputSave = (e) => {
    const newValue = e.currentTarget.value;
    const updatedItem = { ...currentItem, value: newValue };
    setCurrentItem(updatedItem);
    updateItem(updatedItem);
    setIsEditing(false);
  };

  const handleDoubleClick = (e) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleBlur = (e) => {
    if (isEditing) {
      handleInputSave(e);
    }
  };

  return isPreview ? (
    currentItem.value || "Empty Text"
  ) : isEditing ? (
    <input
      id={currentItem.id}
      type="text"
      defaultValue={currentItem.value}
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
      autoFocus
      onBlur={handleBlur}
      onKeyDown={handleInputKeyDown}
    />
  ) : (
    <span
      id={currentItem.id}
      style={{ opacity }}
      onClick={handleSelect}
      onDoubleClick={handleDoubleClick}
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
      ref={(node) => drag(node)}
    >
      {currentItem.value || "Empty Text"}
    </span>
  );
};

TextRenderer.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string.isRequired,
    value: PropTypes.string,
  }).isRequired,
  handleSelect: PropTypes.func.isRequired,
  updateItem: PropTypes.func.isRequired,
  handleMouseOver: PropTypes.func.isRequired,
  handleMouseOut: PropTypes.func.isRequired,
  opacity: PropTypes.number.isRequired,
  drag: PropTypes.func.isRequired,
  isPreview: PropTypes.bool.isRequired,
};

export default TextRenderer;
