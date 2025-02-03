import { useState, useEffect } from "react";
import PropsDynamicInput from "./PropsDynamicInput.jsx";

const PropsConfig = ({
  propList,
  handlePropChange,
  configuredPropsList,
  scopeData,
}) => {
  const [activeIndex, setActiveIndex] = useState(null); // To track which prop is active
  const [props, setProps] = useState(propList);
  const [testValues, setTestValues] = useState({});

  console.log(configuredPropsList);
  console.log(props);
  useEffect(() => {
    setProps(propList);
  }, [propList]);
  useEffect(() => {
    const propValues = Object.assign({}, configuredPropsList);
    setTestValues(propValues);
  }, []);
  const toggleSection = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };
  const handleTestValueChange = (e, propName, type) => {
    const value = e.target.value;
    console.log(e)
    setTestValues((prev) => ({
      ...prev,
      [propName]: { type, value },
    }));
  };
  const showTest = ()=>{
    console.log(testValues);
  }
  console.log(testValues);
  return (
    <div>
      <h3>Props</h3>
      {props?.props && Object.values(props.props).length > 0 ? (
        Object.values(props.props).map((property, index) => (
          <div
            key={property.id}
            style={{
              border: "1px solid #ddd",
              marginBottom: "10px",
              borderRadius: "4px",
              backgroundColor: "rgba(0, 0, 0, 0.05)",
            }}
          >
            {/* Header Section with Toggle Button */}
            <div
              style={{
                padding: "3px",
                cursor: "pointer",
                backgroundColor: "#f1f1f1",
                fontWeight: "bold",
                display: "flex",
                justifyContent: "space-between", // Align name and toggle icon
              }}
              onClick={() =>{ toggleSection(index)}} // Toggle section on click
            >
              <span
                className="br-text-primary"
                style={{ fontSize: "14px", width: "90%" }}
                data-bs-toggle="tooltip"
                data-bs-placement="top"
                title={property.type}
              >
                {property.prop_name}
              </span>
              <span style={{ fontSize: "16px", color: "#007bff" }}>
                {activeIndex === index ? "-" : "+"} {/* Toggle Icon */}
              </span>
            </div>

            {/* Body Section (Only visible when the section is active) */}
            {activeIndex === index && (
              <div style={{ padding: "10px" }}>
                <PropsDynamicInput
                  property={property}
                  handlePropChange={handlePropChange}
                  configuredPropsList={configuredPropsList}
                  scopeData={scopeData}
                  handleTestValueChange={handleTestValueChange}
                  testValues={testValues}
                />
              </div>
            )}
          </div>
        ))
      ) : (
        <p className="br-text-primary ps-4">No props available</p>
      )}
                  <button onClick={showTest}>click</button>

    </div>
  );
};

export default PropsConfig;
