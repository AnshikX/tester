import { useEffect, useState, useRef } from "react";
import { STYLECATEGORIES } from "../../constants/StyleCategoriesConstants";
import { useSelectedItemDetails,  } from "../../contexts/SelectionContext";

const debounce = (func, delay) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
};

const StyleEditor = () => {
  const itemDetails  = useSelectedItemDetails();
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [localStyles, setLocalStyles] = useState({});
  const stylesRef = useRef(localStyles);
  console.log(itemDetails)
  useEffect(() => {
    if (itemDetails?.config?.attributes?.style) {
      setLocalStyles({
        type: "OBJECT",
        properties: { ...itemDetails?.config.attributes.style.properties },
      });
    } else {
      setLocalStyles({ type: "OBJECT", properties: {} });
    }
  }, [itemDetails]);

  const handleStyleChange = (property, value) => {
    const newValue =
      typeof value === "object" ? `${value.value}${value.unit}` : value;

    stylesRef.current = {
      ...stylesRef.current,
      properties: {
        ...stylesRef.current.properties,
        [property]: {
          id: property,
          type: "STRING",
          value: newValue,
        },
      },
    };

    setLocalStyles(stylesRef.current);

    const updateConfigDebounce = debounce(() => {
      if (itemDetails?.config) {
        console.log('insideee')
        itemDetails.setConfig({
          ...itemDetails?.config,
          attributes: {
            ...itemDetails?.config.attributes,
            style: {
              type: "OBJECT",
              properties: {
                ...itemDetails?.config.attributes?.style?.properties,
                ...stylesRef.current.properties,
              },
            },
          },
        });
      }
    }, 500);

    updateConfigDebounce();
  };

  const handleReset = (property) => {
    const updatedStyles = { ...stylesRef.current };
    delete updatedStyles.properties[property];

    setLocalStyles(updatedStyles);
    stylesRef.current = updatedStyles;

    if (itemDetails?.config) {
      itemDetails?.setConfig({
        ...itemDetails?.config,
        attributes: {
          ...itemDetails?.config.attributes,
          style: {
            type: "OBJECT",
            properties: {
              ...updatedStyles.properties,
            },
          },
        },
      });
    }
  };

  const getStyleValue = (name) => {
    if (localStyles?.properties?.[name]?.value) {
      return localStyles.properties[name].value;
    }
    const defaultValues = {
      color: "#ffffff",
      width: "0px",
      height: "0px",
    };
    return defaultValues[name] || "";
  };

  return (
    <div
      style={{ border: "2px solid black", padding: "4px", fontSize: "16px" }}
    >
      {STYLECATEGORIES.map(({ category, properties }) => (
        <div key={category} style={{ marginBottom: "5px" }}>
          <div
            onClick={() =>
              setExpandedCategory(expandedCategory === category ? null : category)
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
                      {getStyleValue(name) && (
                        <button onClick={() => handleReset(name)}>Reset</button>
                      )}
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
                      {(getStyleValue(name) !== "#ffffff" && getStyleValue(name)) && (
                        <button onClick={() => handleReset(name)}>Reset</button>
                      )}
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
                      {getStyleValue(name) && (
                        <button onClick={() => handleReset(name)}>Reset</button>
                      )}
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
                        {(getStyleValue(name) !== "0px" && getStyleValue(name)) && (
                          <button onClick={() => handleReset(name)}>Reset</button>
                        )}
                      </div>
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
  