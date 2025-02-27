import { useState, useEffect } from "react";
import { usePropContext } from "../../contexts/PropContext";
import { useSelectedItemDetails,  } from "../../contexts/SelectionContext";
import PropItem from "./PropItem";

const formatProps = (propsData) => {
  return propsData.map((prop) => ({
    value: prop.id || prop.name,
    label: prop.name,
    ...prop,
  }));
};

const PropsEditor = () => {
  const { props, scope } = usePropContext();
  const itemDetails  = useSelectedItemDetails();
  const [formattedProps, setFormattedProps] = useState([]);
  const [selectedProps, setSelectedProps] = useState({});

  useEffect(() => {
    if (props) {
      setFormattedProps(formatProps(props));
    }
    if (itemDetails?.config?.attributes) {
      const filteredProps = Object.entries(itemDetails?.config.attributes)
        .filter(([key]) => key !== "style")
        .reduce((acc, [key, value]) => {
          acc[key] = {
            label: key,
            value: value.value || "",
            scope: value.type || "",
          };
          return acc;
        }, {});

      setSelectedProps(filteredProps);
    }
  }, [props, itemDetails?.config]);

  const handleAddProp = (event) => {
    const propId = event.target.value;
    if (!propId || selectedProps[propId]) return;

    const existingProp = formattedProps.find((prop) => prop.value === propId);
    const newProp = existingProp || { label: propId, value: "", scope: "" };

    const updatedProps = { ...selectedProps, [propId]: newProp };
    setSelectedProps(updatedProps);
    event.target.value = "";
  };

  const handleChange = (id, newValue) => {
    if (!itemDetails?.config) return;
  
    const updatedAttributes = {
      ...itemDetails.config.attributes,
      [id]: {
        type: selectedProps[id].scope || "STRING",
        value: newValue,
      },
    };
  
    itemDetails.setConfig({
      ...itemDetails.config,
      attributes: updatedAttributes,
    });
  };
  
  const handleScopeChange = (id, selectedScope) => {
    if (!itemDetails?.config) return;
  
    const updatedAttributes = {
      ...itemDetails.config.attributes,
      [id]: {
        type: selectedScope,
        value: "",
      },
    };
  
    itemDetails.setConfig({
      ...itemDetails.config,
      attributes: updatedAttributes,
    });
  };
  
  const handleRemove = (id) => {
    if (!itemDetails?.config) return;
  
    const updatedAttributes = { ...itemDetails.config.attributes };
    delete updatedAttributes[id];
  
    itemDetails.setConfig({
      ...itemDetails.config,
      attributes: updatedAttributes,
    });
  
    setSelectedProps((prevProps) => {
      const updatedProps = { ...prevProps };
      delete updatedProps[id];
      return updatedProps;
    });
  };

  const scopeOptions = [
    { value: "STRING", label: "String Input" },
    { value: "NUMERIC", label: "Numeric Input" },
    { value: "BOOLEAN", label: "Boolean Input" },
    { value: "CUSTOM", label: "Custom Input" },
    { value: "NULL", label: "Null Input" },
    { value: "UNDEFINED", label: "Undefined Input" },
    { value: "SCOPE_VAR", label: "Scope Variable" },
    { value: "ENTITY", label: "Entity Reference" },
    ...Object.keys(scope).map((key) => ({
      value: key,
      label: scope[key].name || key,
    })),
  ];

  return (
    <div className="props-editor">
      <select onChange={handleAddProp}>
        <option value="">Select a prop</option>
        {formattedProps.map((prop) => (
          <option key={prop.value} value={prop.value}>
            {prop.label}
          </option>
        ))}
      </select>

      <div className="props-list">
        {Object.entries(selectedProps).map(([key, prop]) => (
          <div key={key} className="prop-item-container">
            <span>{prop.label}</span>
            <select
              value={prop.scope || ""}
              onChange={(e) => handleScopeChange(key, e.target.value)}
              className="scope-select"
            >
              <option value="">Select scope</option>
              {scopeOptions.map((scope) => (
                <option key={scope.value} value={scope.value}>
                  {scope.label}
                </option>
              ))}
            </select>
            {prop.scope && (
              <PropItem prop={prop} onChange={handleChange} onRemove={() => handleRemove(key)} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PropsEditor;
