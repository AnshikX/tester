import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useSelectedItemId, useSetters } from "/src/components/contexts/SelectionContext";

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

  const selectedItemId = useSelectedItemId();
  const { setItemDetails } = useSetters();

  useEffect(() => {
    if (selectedItemId === item.id) {
      setItemDetails({
        config: item,
        setConfig: (item) => {
          updateItem({ ...item });
        },
      });
    }
  }, [selectedItemId, item, setItemDetails, updateItem]);
  
  const handleInputKeyDown = (e) => {
    if (e.key === "Enter") {
      handleInputSave(e);
    }
  };

  const handleInputSave = (e) => {
    const newValue = e.currentTarget.value;
    updateItem({ ...item, value: newValue });
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
    item.value || "Empty Text"
  ) : isEditing ? (
    <input
      id={item.id}
      type="text"
      defaultValue={item.value}
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
      autoFocus
      onBlur={handleBlur}
      onKeyDown={handleInputKeyDown}
    />
  ) : (
    <span
      id={item.id}
      style={{ opacity }}
      onClick={handleSelect}
      onDoubleClick={handleDoubleClick}
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
      ref={(node) => drag(node)}
    >
      {item.value || "Empty Text"}
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
