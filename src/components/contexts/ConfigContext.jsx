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
  ConfigProvider.propTypes = {
    children: PropTypes.node.isRequired,
  };

  return (
    <ConfigContext.Provider
      value={{ config, setConfig, removeChildById, updateItem, addItemToId }}
    >
      {children}
    </ConfigContext.Provider>
  );
};
