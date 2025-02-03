import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import Select from "react-select";
const inputTypeMapping = Object.freeze({
  text: "STRING",
  number: "NUMERIC",
});
const getAllQuotedStringsContent = (typeString) => {
  const regex = /"([^"]*)"/g;
  const matches = typeString.match(regex)?.map((str) => str.replace(/"/g, ""));
  return matches || [];
};

const determineInputType = (typeString) => {
  const typeCounts = {
    // boolean: typeString.includes('boolean') ? 1 : 0,
    number: typeString.includes("number") ? 1 : 0,
    string: typeString.includes("string") ? 1 : 0,
  };

  const validTypeCount = Object.values(typeCounts).reduce(
    (sum, count) => sum + count,
    0
  );

  if (validTypeCount > 1) {
    return "text";
  }

  // if (typeCounts.booean === 1) return 'checkbox';
  if (typeCounts.number === 1) return "number";
  if (typeCounts.string === 1) return "text";

  return "text";
};

const PropsDynamicInput = ({
  property,
  handlePropChange,
  configuredPropsList,
  scopeData,
  handleTestValueChange,
  testValues,
}) => {
  console.log(property)
  const { prop_name, default_value, type } = property;
  const options = getAllQuotedStringsContent(type);
  const inputType = determineInputType(type);
  // const [scopedVariable, setScopedVariables] = useState(['hj']);
  const [valueCustom, setValueCustom] = useState(false);
  const [defaultValue, setDefaultValue] = useState(undefined);
  const [testCheckbox, setTestCheckbox] = useState(false);

  // const value =
  //   configuredPropsList && configuredPropsList[prop_name] ? configuredPropsList[prop_name]?.value : default_value;
  // console.log('value', configuredPropsList);

  useEffect(() => {
    setValueCustom(
      configuredPropsList &&
        configuredPropsList[property.prop_name]?.type === "CUSTOM"
        ? true
        : false
    );

    if (
      configuredPropsList &&
      configuredPropsList[property.prop_name]?.type === "SCOPE_VAR"
    ) {
      const targetId = configuredPropsList[property.prop_name]?.$ref;

      const matchingObject = scopeData.find((item) => {
        return item.id === targetId;
      });

      if (matchingObject) {
        setDefaultValue(matchingObject);
      } else {
        console.log("No matching object found.");
      }
    }
  }, [configuredPropsList, property.prop_name, scopeData]);
  // console.log(scopeData, configuredPropsList[property.prop_name]?.type === 'SCOPE_VAR');
  return (
    <span style={{ width: "60%" }} className="d-flex">
      {scopeData.length > 0 && valueCustom === false ? (
        <>
          {/* <select
            className="form-control-sm w-100 br-background-secondary br-text-primary border-0 removeFocusedBorder"
            defaultValue={default_value}
            value={
              configuredPropsList &&
              (configuredPropsList[property.prop_name]
                ? configuredPropsList[property.prop_name]?.$ref
                : property.default_value)
            }
            onChange={(e) => handlePropChange(e, prop_name, 'SCOPE_VAR')}
          >
            <option value="">Select a scope value</option>
            {scopeData.map((value, index) => (
              <option key={index} value={value.value}>
                {value.label}
              </option>
            ))}
          </select> */}
          <input
            type="checkbox"
            onClick={() => setTestCheckbox(!testCheckbox)}
          ></input>
          {testCheckbox ? (
            <textarea
              className="form-control-sm w-100 br-background-secondary br-text-primary border-0 removeFocusedBorder"
              value={
                testValues &&
                (testValues[property.prop_name]
                  ? testValues[property.prop_name]?.value
                  : property.default_value)
              }
              onChange={(e) => handleTestValueChange(e, prop_name, "CUSTOM")}
            />
          ) : (
            <Select
              isClearable={true}
              isSearchable={true}
              name="select"
              options={scopeData}
              styles={{ width: "100%" }}
              className="react-select-container react-select-width "
              classNamePrefix="react-select"
              value={defaultValue}
              onChange={(e) => {
                console.log("eValue", e);

                handlePropChange(e, prop_name, "SCOPE_VAR");
                if (e === null) setDefaultValue(null);
              }}
            />
          )}
        </>
      ) : options.length > 0 ? (
        <select
          className="form-control-sm w-100 br-background-secondary br-text-primary border-0 removeFocusedBorder"
          defaultValue={default_value}
          onChange={(e) =>
            handlePropChange(e, prop_name, inputTypeMapping[inputType])
          }
        >
          <option value="">Select an option</option>
          {options.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : (
        <textarea
          className="form-control-sm w-100 br-background-secondary br-text-primary border-0 removeFocusedBorder"
          value={
            configuredPropsList &&
            (configuredPropsList[property.prop_name]
              ? configuredPropsList[property.prop_name]?.value
              : property.default_value)
          }
          onChange={(e) => handlePropChange(e, prop_name, "CUSTOM")}
        />
      )}
      <input
        type="checkbox"
        className="form-control-sm ms-2"
        checked={valueCustom}
        onChange={(e) => setValueCustom(e.target.checked)}
        data-bs-toggle="tooltip"
        data-bs-placement="top"
        title="Custom"
      ></input>
    </span>
  );
};
PropsDynamicInput.propTypes = {
  property: PropTypes.shape({
    prop_name: PropTypes.string.isRequired,
    default_value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    type: PropTypes.string.isRequired,
  }).isRequired,
  handlePropChange: PropTypes.func.isRequired,
  configuredPropsList: PropTypes.object.isRequired,
  scopeData: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default PropsDynamicInput;
