import { useState, useEffect, useMemo } from "react";
import { useSelectedItemDetails } from "../../contexts/SelectionContext";
import deleteButton from "../../assets/svgs/delete-button.svg";
import editButton from "../../assets/svgs/edit-button.svg";
import { usePropContext } from "../../contexts/PropContext";
const radioMethodOptions = [
  { label: "keys", value: "keys" },
  { label: "values", value: "values" },
  { label: "entries", value: "entries" },
];
const MapsEditor = () => {
  const itemDetails = useSelectedItemDetails();
  const { scope } = usePropContext();

  const [paramName, setParamName] = useState("");
  const [editingParam, setEditingParam] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedVariable, setSelectedVariable] = useState(null);
  const [selectedMethod, setSelectedMethod] = useState(null);

  const mapParams = useMemo(() => {
    return Array.isArray(itemDetails?.config?.mapParams)
      ? itemDetails.config.mapParams
      : [];
  }, [itemDetails?.config]);

  useEffect(() => {
    if (itemDetails?.config?.mapVariable) {
      setSelectedVariable(itemDetails.config.mapVariable);
    }
    setSelectedMethod(itemDetails?.config?.method);
  }, [itemDetails?.config]);

  useEffect(() => {
    const hasItem = mapParams.some((p) => p.defaultName === "item");
    const hasIndex = mapParams.some((p) => p.defaultName === "index");

    if (!hasItem && hasIndex) {
      setErrorMessage("'item' must be added before 'index'.");
    } else if (
      (!hasItem || !hasIndex) &&
      mapParams.some((p) => p.defaultName === "array")
    ) {
      setErrorMessage("'item' and 'index' must be added before 'array'.");
    } else {
      setErrorMessage("");
    }
  }, [mapParams]);

  const updateConfig = (newParams, newVariable) => {
    if (!itemDetails?.setConfig) {
      console.error("MapsEditor: setConfig is missing!", itemDetails);
      return;
    }

    itemDetails.setConfig({
      ...itemDetails.config,
      mapParams: newParams, // This should reflect the checkbox state
      mapVariable: newVariable || itemDetails.config.mapVariable,
    });
  };

  const handleAddParam = (defaultName) => {
    if (mapParams.some((p) => p.defaultName === defaultName)) return;

    const newParam = { defaultName, name: paramName || defaultName };
    let updatedParams = [...mapParams];

    if (defaultName === "item") {
      updatedParams.unshift(newParam);
    } else if (defaultName === "index") {
      const itemIndex = updatedParams.findIndex(
        (p) => p.defaultName === "item"
      );
      if (itemIndex !== -1) {
        updatedParams.splice(itemIndex + 1, 0, newParam);
      }
    } else if (defaultName === "array") {
      const indexIndex = updatedParams.findIndex(
        (p) => p.defaultName === "index"
      );
      if (indexIndex !== -1) {
        updatedParams.splice(indexIndex + 1, 0, newParam);
      } else {
        updatedParams.push(newParam);
      }
    }

    updateConfig(updatedParams);
    setParamName("");
  };

  const handleRemoveParam = (defaultName) => {
    const updatedParams = mapParams.filter(
      (p) => p.defaultName !== defaultName
    );
    updateConfig(updatedParams);
  };

  const handleEditParam = (defaultName) => {
    if (!editingParam || !paramName) return;

    const updatedParams = mapParams.map((p) =>
      p.defaultName === defaultName ? { ...p, name: paramName } : p
    );

    updateConfig(updatedParams);
    setEditingParam(null);
    setParamName("");
  };

  const handleCheckboxChange = (defaultName, checked) => {
    if (
      defaultName === "index" &&
      !mapParams.some((p) => p.defaultName === "item")
    ) {
      setErrorMessage("'item' must be added before 'index'.");
      return;
    }

    if (
      defaultName === "array" &&
      (!mapParams.some((p) => p.defaultName === "item") ||
        !mapParams.some((p) => p.defaultName === "index"))
    ) {
      setErrorMessage("'item' and 'index' must be added before 'array'.");
      return;
    }

    if (checked) {
      handleAddParam(defaultName);
    } else {
      handleRemoveParam(defaultName);
    }
  };

  const handleVariableSelect = (e) => {
    const selectedRef = e.target.value;
    const selectedScope = scope.find(
      (variable) => variable.$ref === selectedRef
    );

    if (!selectedScope) return;

    const newVariable = {
      name: selectedScope.label,
      $ref: selectedScope.$ref,
      type: "SCOPE_VAR",
    };

    setSelectedVariable(newVariable);
    updateConfig(mapParams, newVariable);
  };

  if (!itemDetails?.config || itemDetails?.config.elementType !== "MAP")
    return null;

  return (
    <div className="maps-editor">
      {errorMessage && <p className="text-danger small-font">{errorMessage}</p>}

      {/* Map Variable Selector */}
      <div className="mb-2">
        <strong>Map Variable:</strong>
        <select
          value={selectedVariable?.$ref || ""}
          onChange={handleVariableSelect}
          className="form-select mt-2"
        >
          <option value="">Select a variable</option>
          {Array.isArray(scope) &&
            scope.map((variable) => (
              <option key={variable.id} value={variable.$ref}>
                {variable.label}
              </option>
            ))}
        </select>
      </div>

      <div className="mb-3">
        <label>Is map on object</label>
        <input
          className="mx-3"
          type="checkbox"
          checked={itemDetails.config.isMapOnObject}
          onChange={() => {
            const newIsMapOnObject = !itemDetails.config.isMapOnObject;
            itemDetails.setConfig({
              ...itemDetails.config,
              isMapOnObject: newIsMapOnObject,
              method: newIsMapOnObject ? selectedMethod : null,
            });
            if (!newIsMapOnObject) {
              setSelectedMethod(null);
            }
          }}
        />
      </div>

      {/* Method Selector */}
      {itemDetails.config.isMapOnObject && (
        <div className="mb-3">
          {radioMethodOptions.map((option) => (
            <label key={option.value} className="mx-2">
              <input
                type="radio"
                value={option.value}
                checked={selectedMethod === option.value}
                onChange={(e) => {
                  setSelectedMethod(e.target.value);
                  itemDetails.setConfig({
                    ...itemDetails.config,
                    method: e.target.value,
                  });
                }}
              />
              {option.label}
            </label>
          ))}
        </div>
      )}

      {/* Parameter Checkboxes */}
      <div className="mb-3">
        <label>
          <input
            type="checkbox"
            checked={mapParams.some((p) => p.defaultName === "item")}
            onChange={(e) => handleCheckboxChange("item", e.target.checked)}
          />
          Item
        </label>
        <label>
          <input
            type="checkbox"
            checked={mapParams.some((p) => p.defaultName === "index")}
            onChange={(e) => handleCheckboxChange("index", e.target.checked)}
          />
          Index
        </label>
        <label>
          <input
            type="checkbox"
            checked={mapParams.some((p) => p.defaultName === "array")}
            onChange={(e) => handleCheckboxChange("array", e.target.checked)}
          />
          Array
        </label>
      </div>

      {/* Parameter List */}
      {mapParams.map((param) => (
        <div
          key={param.defaultName}
          className="my-1 py-1 px-2 d-flex justify-content-between"
          style={{ borderRadius: "0.275rem" }}
        >
          {editingParam === param.defaultName ? (
            <input
              type="text"
              className="form-control"
              value={paramName}
              onChange={(e) => setParamName(e.target.value)}
              onBlur={() => handleEditParam(param.defaultName)}
              autoFocus
            />
          ) : (
            <span className="br-text-primary med-font">{param.name}</span>
          )}

          <div className="d-flex">
            <button
              className="mx-2"
              onClick={() => {
                setEditingParam(param.defaultName);
                setParamName(param.name);
              }}
            >
              <img src={editButton} alt="edit" />
            </button>

            <button onClick={() => handleRemoveParam(param.defaultName)}>
              <img src={deleteButton} alt="delete" width="20" height="20" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MapsEditor;
