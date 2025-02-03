import { useEffect, useState, useRef } from "react";
import { STYLECATEGORIES } from "./StyleCategoriesConstants";
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
  const { selectedItem, selectedItemId, localStyles, setLocalStyles } = useSelection();
  const [expandedCategory, setExpandedCategory] = useState(null);

  const stylesRef = useRef(localStyles);

  useEffect(() => {
    setLocalStyles(selectedItem?.attributes?.style || {});
  }, [selectedItemId, selectedItem, setLocalStyles]);

  // Handles instant UI updates
  const handleStyleChange = (property, value) => {
    stylesRef.current = { ...stylesRef.current, [property]: typeof value === "object" ? `${value.value}${value.unit}` : value };
    
    const setStyleDebounce  = debounce(()=>{
      setLocalStyles(stylesRef.current);
    },50)
    setStyleDebounce();
  };
  
  const handleStyleBlur = () => {
    if (selectedItem) {
      const formattedStyles = Object.fromEntries(
        Object.entries(localStyles).map(([key, value]) => {
          if (typeof value === "object") {
            return [key, `${value.value}${value.unit}`];
          }
          return [key, value]; 
        })
      );
  
      updateStyles({
        ...selectedItem,
        attributes: { ...selectedItem.attributes, style: formattedStyles },
      });
  
      setLocalStyles({});
    }
  };

  const getStyleValue = (name) => {
    if (localStyles && localStyles[name] !== undefined) {
      const val = localStyles[name];
      return typeof val === "string"
        ? { value: parseFloat(val) || 0, unit: val.replace(/[0-9.-]/g, "") || "px" }
        : val;
    }
  
    if (selectedItem && selectedItem.attributes?.style && selectedItem.attributes.style[name] !== undefined) {
      const val = selectedItem.attributes.style[name];
      return typeof val === "string"
        ? { value: parseFloat(val) || 0, unit: val.replace(/[0-9.-]/g, "") || "px" }
        : val;
    }
  
    return { value: 0, unit: "px" }; // Default to 0px
  };
  

  return (
    <div style={{ border: "2px solid black", padding: "4px", fontSize: "16px" }}>
      {STYLECATEGORIES.map(({ category, properties }) => (
        <div key={category} style={{ marginBottom: "5px" }}>
          <div
            onClick={() => setExpandedCategory(expandedCategory === category ? null : category)}
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
                <div key={name} style={{ display: "flex", flexDirection: "column", marginBottom: "10px" }}>
                  <label style={{ fontWeight: "bold", fontSize: "16px" }}>{name}:</label>

                  {type === "text" && (
                    <input
                      type="text"
                      placeholder={`Enter ${name}`}
                      value={getStyleValue(name, "dimension")?.value || ""}
                      onChange={(e) => handleStyleChange(name, e.target.value)}
                      onBlur={handleStyleBlur} 
                      style={{ padding: "2px", width: "50%", fontSize: "13px" }}
                    />
                  )}

                  {type === "color" && (
                    <input
                      type="color"
                      value={getStyleValue(name) || "#ffffff"}
                      onChange={(e) => handleStyleChange(name, e.target.value)}
                      onBlur={handleStyleBlur} 
                      style={{ width: "60px", height: "40px" }}
                    />
                  )}

                  {type === "select" && (
                    <div style={{ padding: "10px", width: "100%" }}>
                      {options.map((option) => (
                        <label key={option} style={{ display: "block", marginBottom: "5px", fontSize: "14px" }}>
                          <input
                            type="radio"
                            name={name}
                            value={option}
                            checked={getStyleValue(name) === option}
                            onChange={(e) => handleStyleChange(name, e.target.value)}
                            onBlur={handleStyleBlur} 
                            style={{ marginRight: "8px" }}
                          />
                          {option}
                        </label>
                      ))}
                    </div>
                  )}

                  {type === "dimension" && (
                    <>
                      <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                        <input
                          type="number"
                          placeholder={`Enter ${name}`}
                          value={getStyleValue(name)?.value || ""}
                          onChange={(e) =>
                            handleStyleChange(name, {
                              value: e.target.value,
                              unit: getStyleValue(name)?.unit || "px",
                            })
                          }
                          onBlur={handleStyleBlur} 
                          style={{ padding: "4px", width: "70%", fontSize: "13px" }}
                        />
                        <select
                          value={getStyleValue(name)?.unit || "px"}
                          onChange={(e) =>
                            handleStyleChange(name, {
                              value: getStyleValue(name)?.value || "",
                              unit: e.target.value,
                            })
                          }
                          onBlur={handleStyleBlur} 
                          style={{ padding: "5px", width: "30%", fontSize: "12px" }}
                        >
                          <option value="px">px</option>
                          <option value="rem">rem</option>
                          <option value="%">%</option>
                          <option value="em">em</option>
                          <option value="vw">vw</option>
                          <option value="vh">vh</option>
                        </select>
                      </div>
                      <br />
                      <input
                        type="range"
                        min="-50"
                        max="200"
                        value={parseFloat(getStyleValue(name)?.value) || 0}
                        onChange={(e) =>
                          handleStyleChange(name, {
                            value: e.target.value,
                            unit: getStyleValue(name)?.unit || "px",
                          })
                        }
                        onBlur={handleStyleBlur} 
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

      <h4 style={{ marginTop: "20px", fontSize: "18px" }}>Generated React Style Object</h4>
      <pre style={{ background: "#f4f4f4", padding: "10px", borderRadius: "6px", fontSize: "14px" }}>
        {JSON.stringify(localStyles, null, 2)}
      </pre>
    </div>
  );
};

export default StyleEditor;
