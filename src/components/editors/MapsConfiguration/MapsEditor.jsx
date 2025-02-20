import { useState, useEffect, useMemo } from "react";
import { useSelection } from "../../contexts/SelectionContext";
import { useConfig } from "../../contexts/ConfigContext";
import deleteButton from "../../assets/svgs/delete-button.svg";
import editButton from "../../assets/svgs/edit-button.svg";
import { usePropContext } from "../../contexts/PropContext";

const MapsEditor = () => {
  const { selectedItem } = useSelection();
  const { updateMapConfig } = useConfig();
  const { scope } = usePropContext();

  const [paramName, setParamName] = useState("");
  const [editingParam, setEditingParam] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedVariable, setSelectedVariable] = useState({});
  const mapParams = useMemo(() => {
    return Array.isArray(selectedItem?.mapParams) ? selectedItem.mapParams : [];
  }, [selectedItem]);
  console.log(selectedItem);
  useEffect(() => {
    if (selectedItem?.mapVariable) {
      setSelectedVariable(selectedItem.mapVariable);
    }
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
  }, [selectedItem, mapParams]);

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
    updateMapConfig(selectedItem.id, updatedParams, selectedVariable);
    setParamName("");
  };

  const handleRemoveParam = (defaultName) => {
    updateMapConfig(
      selectedItem.id,
      mapParams.filter((p) => p.defaultName !== defaultName),
      selectedVariable
    );
  };

  const handleEditParam = (defaultName) => {
    if (!editingParam || !paramName) return;

    const updatedParams = mapParams.map((p) =>
      p.defaultName === defaultName ? { ...p, name: paramName } : p
    );

    updateMapConfig(selectedItem.id, updatedParams, selectedVariable);
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
  console.log(scope);
  const handleVariableSelect = (e) => {
    const selectedName = e.target.value;
    const selectedScope = scope.find(
      (variable) => variable.label === selectedName
    );

    if (!selectedScope) return;

    const newVariable = {
      name: selectedScope.label,
      $ref: selectedScope.$ref,
      type: "SCOPE_VAR",
    };

    setSelectedVariable(newVariable.name);
    updateMapConfig(selectedItem.id, mapParams, newVariable);
  };

  if (!selectedItem || selectedItem.elementType !== "MAP") return null;

  return (
    <div className="maps-editor">
      {errorMessage && <p className="text-danger small-font">{errorMessage}</p>}

      <div className="mb-2">
        <strong>Map Variable:</strong>
        <select
          value={scope.find((variable) => variable.$ref === selectedVariable.$ref)?.label || ""}
          onChange={handleVariableSelect}
          className="form-select mt-2"
        >
          <option value="">Select a variable</option>
          {Array.isArray(scope) &&
            scope.map((variable, index) => (
              <option key={index} value={variable.$ref}>
                {variable.label}
              </option>
            ))}
        </select>
      </div>

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
