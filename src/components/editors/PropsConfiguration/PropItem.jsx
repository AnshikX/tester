import { useState } from "react";
import PropTypes from "prop-types";
import deleteButton from "../../assets/svgs/delete-button.svg";

const PropItem = ({ prop, onChange, onRemove }) => {
  const [inputValue, setInputValue] = useState(prop.value || "");
  console.log(prop)
  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange(prop.label, newValue);
  };

  const renderInput = () => {
    switch (prop.scope) {
      case "STRING":
      case "NUMERIC":
      case "BOOLEAN":
      case "CUSTOM":
        return (
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="Enter value"
          />
        );
      case "NULL":
      case "UNDEFINED":
        return <span style={{ marginLeft: "8px" }}>{prop.scope} Input</span>;
      default:
        return null;
    }
  };

  return (
    <div className="prop-item">
      {renderInput()}
      <button onClick={onRemove}>
        <img
          src={deleteButton}
          alt="Delete"
          style={{ width: "15px", cursor: "pointer", height: "15px" }}
        />
      </button>
    </div>
  );
};

PropItem.propTypes = {
  prop: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
};

export default PropItem;
