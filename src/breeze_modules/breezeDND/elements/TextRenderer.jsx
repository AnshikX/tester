import { useCallback, useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { useSelectedItemId, useSetters } from "../contexts/SelectionContext";
import { usePushChanges } from "../contexts/UndoRedoContext";
import deepCopy from "../utils/deepcopy";

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
  if( item.textType === 'value'){
    return 'VALUE COMPONENT GOES HERE'
  }
  
  const [isEditing, setIsEditing] = useState(false);
  const [currentItem, setCurrentItem] = useState(item);

  const selectedItemId = useSelectedItemId();
  const { setItemDetails } = useSetters();
  const { pushChanges } = usePushChanges();
  const previousConfigRef = useRef(deepCopy(currentItem));

  const updateCurrentItem = useCallback(
    (stateOrCallBack) => {
      console.log('object')
      setCurrentItem((prev) => {
        let next;
        if (typeof stateOrCallBack === "function") {
          next = stateOrCallBack(prev);
        } else {
          next = stateOrCallBack;
        }
        const undoTo = deepCopy(previousConfigRef.current);
        previousConfigRef.current = deepCopy(next);
        setTimeout(() => {
          pushChanges({
            doChanges: updateCurrentItem.bind(null, undoTo),
          });
        }, 0);
        updateItem(next);
        return next;
      });
    },
    [updateItem, pushChanges]
  );

  // useEffect(() => {
  //   setCurrentItem(item);
  // }, [item]);

  useEffect(() => {
    if (selectedItemId === currentItem.id) {
      setItemDetails({
        config: currentItem,
        setConfig: updateCurrentItem,
      });
    }
  }, [selectedItemId, currentItem, setItemDetails, updateCurrentItem]);

  const handleInputKeyDown = (e) => {
    if (e.key === "Enter") {
      handleInputSave(e);
    }
  };

  const handleInputSave = (e) => {
    const newValue = e.currentTarget.value;
    updateCurrentItem((currentItem) => {
      const updatedItem = { ...currentItem, value: newValue };
      return updatedItem;
    });

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
      style={{ opacity, display:"inline" , alignSelf:"center", width:"auto" }}
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
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  }).isRequired,
  handleSelect: PropTypes.func.isRequired,
  textType: PropTypes.string,
  updateItem: PropTypes.func.isRequired,
  handleMouseOver: PropTypes.func.isRequired,
  handleMouseOut: PropTypes.func.isRequired,
  opacity: PropTypes.number.isRequired,
  drag: PropTypes.func.isRequired,
  isPreview: PropTypes.bool.isRequired,
};

export default TextRenderer;
