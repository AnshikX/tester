import { createContext, useState, useContext } from "react";
import PropTypes from "prop-types";

const ConfigContext = createContext();

export const useConfig = () => {
  return useContext(ConfigContext);
};

export const ConfigProvider = ({ children }) => {
  const [config, setConfig] = useState({});

  const removeChildById = (id) => {
    const removeChildRecursive = (parent) => {
      if (parent.children) {
        return {
          ...parent,
          children: parent.children
            .filter((child) => child.id !== id)
            .map(removeChildRecursive),
        };
      }
      return parent;
    };

    setConfig((prevConfig) => {
      const updatedConfig = removeChildRecursive(prevConfig);
      console.log("Updated config after removal:", updatedConfig);
      return updatedConfig;
    });
  };

  const updateItem = (updatedItem) => {
    console.log(updateItem,"asdfghjkjhgfd")
    const updateItemRecursive = (parent) => {
      if (parent.id === updatedItem.id) {
        return { ...updatedItem };
      }
      if (parent.children) {
        return {
          ...parent,
          children: parent.children.map(updateItemRecursive),
        };
      }
      return parent;
    };

    setConfig((prevConfig) => {
      const updatedConfig = updateItemRecursive(prevConfig);
      console.log("Updated config after item update:", updatedConfig);
      return updatedConfig;
    });
  };

  const addItemToId = (newItem, parentId, pos) => {
    const processTree = (parent) => {
      if (!parent?.children || !Array.isArray(parent.children)) {
        return parent;
      }

      const newChildren = parent.children.filter(
        (child) => child.id !== newItem.id
      );

      if (parent.id === parentId) {
        newChildren.splice(pos, 0, {
          ...newItem,
          id: newItem.id || Math.random().toString(),
        });
      }
      return {
        ...parent,
        children: newChildren.map(processTree),
      };
    };

    setConfig((prevConfig) => {
      const updatedConfig = processTree(prevConfig);
      console.log("Updated config after adding:", updatedConfig);
      return updatedConfig;
    });
  };

  const updateStyles = (updatedItem) => {
    const updateStylesRecursive = (parent) => {
      if (parent.id === updatedItem.id) {
        return { ...parent, attributes: { ...parent.attributes, style: updatedItem.attributes.style } };
      }
      if (parent.children) {
        return {
          ...parent,
          children: parent.children.map(updateStylesRecursive),
        };
      }
      return parent;
    };
  
    setConfig((prevConfig) => {
      const updatedConfig = updateStylesRecursive(prevConfig);
      console.log("Updated config after style update:", updatedConfig);
      return updatedConfig;
    });
  };
  
  const updateProp = (itemId, propName, propValue, propType) => {
    const updatePropRecursive = (parent) => {
      if (parent.id === itemId) {
        return {
          ...parent,
          attributes: {
            ...parent.attributes,
            [propName]: { type: propType, value: propValue },
          },
        };
      }
      if (parent.children) {
        return {
          ...parent,
          children: parent.children.map(updatePropRecursive),
        };
      }
      return parent;
    };
  
    setConfig((prevConfig) => {
      const updatedConfig = updatePropRecursive(prevConfig);
      console.log("Updated config after prop update:", updatedConfig);
      return updatedConfig;
    });
  };

  const updateMapConfig = (itemId, mapParams, mapVariable) => {
    const updateMapRecursive = (parent) => {
      if (parent.id === itemId) {
        return {
          ...parent,
          mapParams: mapParams ?? parent.mapParams, // Update only if provided
          mapVariable: mapVariable ?? parent.mapVariable,
        };
      }
      if (parent.children) {
        return {
          ...parent,
          children: parent.children.map(updateMapRecursive),
        };
      }
      return parent;
    };
  
    setConfig((prevConfig) => {
      const updatedConfig = updateMapRecursive(prevConfig);
      console.log("Updated config after map update:", updatedConfig);
      return updatedConfig;
    });
  };
  
  
  ConfigProvider.propTypes = {
    children: PropTypes.node.isRequired,
  };

  return (
    <ConfigContext.Provider
      value={{ config, setConfig, removeChildById, updateItem, addItemToId, updateStyles, updateProp, updateMapConfig }}
    >
      {children}
    </ConfigContext.Provider>
  );
};
