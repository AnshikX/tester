import React, { useEffect, useState } from "react";
import { loadEntity } from "../../Entities";
import PropTypes from "prop-types";
import { libraries } from "../../utils/thirdPartyLibraries";

const SwitchRenderer = ({
  item,
  children,
  handleSelect,
  handleMouseOver,
  handleMouseOut,
  drag,
  opacity,
  processedAttributes,
}) => {
  const [importedComponent, setImportedComponent] = useState({
    isLoaded: false,
  });
  useEffect(() => {
    if (item.elementType === "COMPONENT") {
      loadEntity(item.id).then((data) => {
        setImportedComponent((comp) => {
          if (comp.component != data) {
            return { component: data, isLoaded: true };
          }
          return comp;
        });
      });
    } else {
      if (item.elementType === "html") {
        setImportedComponent({ isLoaded: true });
      }
      if (item.elementType === "THIRD_PARTY") {
        async function loadThirdPartyComponent() {
          try {
            // let module;
            // switch (item.library) {
            //   case "react-bootstrap":
            //     module = await import("react-bootstrap");
            //     break;
            //   default:
            //     console.error(`Unknown third-party library: ${item.library}`);
            //     return;
            // }
            // console.log(module)
            console.log(item.library)
            
            // const module = await import("react-bootstrap");
            const module = await libraries[item.library];
            // const pam = await import(/* @vite-ignore */ item.library);
            
            const component = module[item.tagName];
            if (!component) {
              console.error(`Component ${item.tagName} not found in ${item.library}`);
              return;
            }
  
            setImportedComponent({ component, isLoaded: true });
          } catch (error) {
            console.error(`Failed to load ${item.library}:`, error);
          }
        }
  
        loadThirdPartyComponent();
      } 
    }
  }, [item.$ref, item.elementType, item.id, item.library, item.tagName]);

  if (item.elementType === "COMPONENT" || item.tagName === "fragment") {
    return importedComponent.isLoaded ? (
      <div
        id={item.id}
        style={{ opacity }}
        onClick={handleSelect}
        onMouseOver={handleMouseOver}
        onMouseOut={handleMouseOut}
        ref={(node) => drag(node)}
      >
        {item.tagName === "fragment"
          ? children
          : React.createElement(
              importedComponent.component,
              { ...processedAttributes },
              children
            )}
      </div>
    ) : (
      <div>Loading...</div>
    );
  }

  if (item.elementType === "THIRD_PARTY") {
    return importedComponent.isLoaded ? (
      <div
        id={item.id}
        style={{ opacity }}
        onClick={handleSelect}
        onMouseOver={handleMouseOver}
        onMouseOut={handleMouseOut}
        ref={(node) => drag(node)}
      >
        {item.tagName === "fragment"
          ? children
          : React.createElement(
              importedComponent.component || item.tagName || "div",
              { ...processedAttributes },
              children
            )}
      </div>
    ) : (
      <div>Loading...</div>
    );
  }

  return React.createElement(
    item.tagName || "div",
    {
      ...processedAttributes,
      style: item.appliedStyles,
      onClick: handleSelect,
      onMouseOver: handleMouseOver,
      onMouseOut: handleMouseOut,
      id: item.id,
      ref: (node) => drag(node),
    },
    children?.filter((i) => i).length > 0 ? children : null
  );
};

export default SwitchRenderer;

SwitchRenderer.propTypes = {
  item: PropTypes.shape({
    elementType: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    tagName: PropTypes.string,
    $ref: PropTypes.string,
    attributes: PropTypes.object,
    appliedStyles: PropTypes.object,
    library: PropTypes.string,
  }).isRequired,
  children: PropTypes.array,
  handleSelect: PropTypes.func.isRequired,
  handleMouseOver: PropTypes.func.isRequired,
  handleMouseOut: PropTypes.func.isRequired,
  drag: PropTypes.func.isRequired,
  opacity: PropTypes.number.isRequired,
  processedAttributes: PropTypes.object.isRequired,
};
