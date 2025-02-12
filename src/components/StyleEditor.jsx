import { useEffect, useState, useRef } from "react";
import { STYLECATEGORIES } from "./constants/StyleCategoriesConstants";
import { useConfig } from "./contexts/ConfigContext";
import { useSelection } from "./contexts/SelectionContext";

const debounce = (func, delay) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
};

const StyleEditor = () => {
  const { updateStyles } = useConfig();
  const { selectedItem, selectedItemId, localStyles, setLocalStyles } =
    useSelection();
  const [expandedCategory, setExpandedCategory] = useState(null);

  const stylesRef = useRef(localStyles);

  useEffect(() => {
    setLocalStyles(selectedItem?.attributes?.style || {});
  }, [selectedItemId, selectedItem, setLocalStyles]);
  const handleStyleChange = (property, value) => {
    const newValue =
      typeof value === "object" ? `${value.value}${value.unit}` : value;

    const updatedStyles = {
      ...stylesRef.current,
      [property]: {
        id: property,
        value: { type: "STRING", value: newValue },
      },
    };

    stylesRef.current = updatedStyles;
    setLocalStyles(updatedStyles);

    const updateConfigDebounce = debounce(() => {
      if (selectedItem) {
        updateStyles({
          ...selectedItem,
          attributes: {
            ...selectedItem.attributes,
            style: {
              type: "OBJECT",
              properties: stylesRef.current,
            },
          },
        });
      }
    }, 500);

    updateConfigDebounce();
  };

  const getStyleValue = (name) => {
    if (localStyles?.[name]?.value?.value) {
      return localStyles[name].value.value;
    }
    if (selectedItem?.attributes?.style?.properties?.[name]?.value?.value) {
      return selectedItem.attributes.style.properties[name].value.value;
    }
    const defaultValues = {
      color: "#ffffff",
      width: "0px",
      height: "0px",
    };
    return defaultValues[name] || "";
  };

  const handleClear = (name) => {
    const updatedStyles = { ...localStyles };
    delete updatedStyles[name];
    setLocalStyles({ ...updatedStyles });
    stylesRef.current = updatedStyles;
  };

  return (
    <div
      style={{ border: "2px solid black", padding: "4px", fontSize: "16px" }}
    >
      {STYLECATEGORIES.map(({ category, properties }) => (
        <div key={category} style={{ marginBottom: "5px" }}>
          <div
            onClick={() =>
              setExpandedCategory(
                expandedCategory === category ? null : category
              )
            }
            style={{
              cursor: "pointer",
              padding: "4px",
              backgroundColor: "#ddd",
              border: "1px solid #bbb",
              fontSize: "14px",
            }}
          >
            {category}
          </div>

          {expandedCategory === category && (
            <div
              style={{
                padding: "10px",
                border: "1px solid #bbb",
                background: "#f9f9f9",
              }}
            >
              {properties.map(({ name, type, options }) => (
                <div
                  key={name}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    marginBottom: "10px",
                  }}
                >
                  <label style={{ fontWeight: "bold", fontSize: "16px" }}>
                    {name}:
                  </label>

                  {type === "text" && (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                      }}
                    >
                      <input
                        type="text"
                        placeholder={`Enter ${name}`}
                        value={getStyleValue(name) || ""}
                        onChange={(e) =>
                          handleStyleChange(name, e.target.value)
                        }
                        style={{
                          padding: "2px",
                          width: "50%",
                          fontSize: "13px",
                        }}
                      />
                      {/* {(getStyleValue(name)|| getStyleValue(name) )&& (
                        <button
                          onClick={() => handleClear(name)}
                          style={{ padding: "2px 6px", fontSize: "12px", cursor: "pointer" }}
                        >
                          Clearsdddd
                        </button>
                      )} */}
                    </div>
                  )}

                  {type === "color" && (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                      }}
                    >
                      <input
                        type="color"
                        value={getStyleValue(name) || "#ffffff"}
                        onChange={(e) =>
                          handleStyleChange(name, e.target.value)
                        }
                        style={{ width: "60px", height: "40px" }}
                      />
                      {/* {getStyleValue(name) !== "#ffffff" && getStyleValue(name) && (
                        <button
                          onClick={() => handleClear(name)}
                          style={{ padding: "2px 6px", fontSize: "12px", cursor: "pointer" }}
                        >
                          Clearasd
                        </button>
                      )} */}
                    </div>
                  )}

                  {type === "select" && (
                    <div style={{ padding: "10px", width: "100%" }}>
                      {options.map((option) => (
                        <label
                          key={option}
                          style={{
                            display: "block",
                            marginBottom: "5px",
                            fontSize: "14px",
                          }}
                        >
                          <input
                            type="radio"
                            name={name}
                            value={option}
                            checked={getStyleValue(name) === option}
                            onChange={(e) =>
                              handleStyleChange(name, e.target.value)
                            }
                            style={{ marginRight: "8px" }}
                          />
                          {option}
                        </label>
                      ))}
                      {/* {getStyleValue(name) && (
                        <button
                          onClick={() => handleClear(name)}
                          style={{ padding: "2px 6px", fontSize: "12px", cursor: "pointer" }}
                        >
                          Clearssfd
                        </button>
                      )} */}
                    </div>
                  )}

                  {type === "dimension" && (
                    <>
                      <div
                        style={{
                          display: "flex",
                          gap: "10px",
                          alignItems: "center",
                        }}
                      >
                        <input
                          type="number"
                          placeholder={`Enter ${name}`}
                          value={parseFloat(getStyleValue(name)) || 0}
                          onChange={(e) =>
                            handleStyleChange(name, {
                              value: e.target.value,
                              unit:
                                getStyleValue(name).replace(/[0-9.-]/g, "") ||
                                "px",
                            })
                          }
                          style={{
                            padding: "4px",
                            width: "70%",
                            fontSize: "13px",
                          }}
                        />
                        <select
                          value={
                            getStyleValue(name).replace(/[0-9.-]/g, "") || "px"
                          }
                          onChange={(e) =>
                            handleStyleChange(name, {
                              value: parseFloat(getStyleValue(name)) || 0,
                              unit: e.target.value,
                            })
                          }
                          style={{
                            padding: "5px",
                            width: "30%",
                            fontSize: "12px",
                          }}
                        >
                          <option value="px">px</option>
                          <option value="rem">rem</option>
                          <option value="%">%</option>
                          <option value="em">em</option>
                          <option value="vw">vw</option>
                          <option value="vh">vh</option>
                        </select>
                        {/* { (getStyleValue(name) !== "0px" && getStyleValue(name)) && (
                          <button
                            onClick={() => handleClear(name)}
                            style={{ padding: "2px 6px", fontSize: "12px", cursor: "pointer" }}
                          >
                            Clearxczxc
                          </button>
                        )} */}
                      </div>
                      <br />
                      <input
                        type="range"
                        min="-50"
                        max="200"
                        value={parseFloat(getStyleValue(name)) || 0}
                        onChange={(e) =>
                          handleStyleChange(name, {
                            value: e.target.value,
                            unit:
                              getStyleValue(name).replace(/[0-9.-]/g, "") ||
                              "px",
                          })
                        }
                        style={{ width: "100%" }}
                      />
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      <h4 style={{ marginTop: "20px", fontSize: "18px" }}>
        Generated React Style Object
      </h4>
      <pre
        style={{
          background: "#f4f4f4",
          padding: "10px",
          borderRadius: "6px",
          fontSize: "14px",
        }}
      >
        {JSON.stringify(localStyles, null, 2)}
      </pre>
    </div>
  );
};

export default StyleEditor;
