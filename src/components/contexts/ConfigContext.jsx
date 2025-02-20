import { createContext, useState, useContext, useCallback } from "react";
import PropTypes from "prop-types";

const ConfigContext = createContext();

export const useConfig = () => {
  return useContext(ConfigContext);
};

export const ConfigProvider = ({ children }) => {
  const [config, setConfig] = useState({});

  const updateConfig = useCallback((newConfig) => {
    setConfig(newConfig);
  }, []);

  const removeChildById = useCallback((id) => {
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

    updateConfig((prevConfig) => {
      const updatedConfig = removeChildRecursive(prevConfig);
      console.log("Updated config after removal:", updatedConfig);
      return updatedConfig;
    });
  }, [updateConfig]);

  const updateItem = useCallback((updatedItem) => {
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

    updateConfig((prevConfig) => {
      const updatedConfig = updateItemRecursive(prevConfig);
      console.log("Updated config after item update:", updatedConfig);
      return updatedConfig;
    });
  }, [updateConfig]);

  const addItemToId = useCallback((newItem, parentId, pos) => {
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

    updateConfig((prevConfig) => {
      const updatedConfig = processTree(prevConfig);
      console.log("Updated config after adding:", updatedConfig);
      return updatedConfig;
    });
  }, [updateConfig]);

  const updateStyles = useCallback((updatedItem) => {
    const updateStylesRecursive = (parent) => {
      if (parent.id === updatedItem.id) {
        return {
          ...parent,
          attributes: {
            ...parent.attributes,
            style: updatedItem.attributes.style,
          },
        };
      }
      if (parent.children) {
        return {
          ...parent,
          children: parent.children.map(updateStylesRecursive),
        };
      }
      return parent;
    };

    updateConfig((prevConfig) => {
      const updatedConfig = updateStylesRecursive(prevConfig);
      console.log("Updated config after style update:", updatedConfig);
      return updatedConfig;
    });
  }, [updateConfig]);

  const updateProp = useCallback((itemId, propName, propValue, propType) => {
    const updatePropRecursive = (parent) => {
      if (parent.id === itemId) {
        const updatedAttributes = { ...parent.attributes };
        if (propValue === null || propValue === undefined) {
          delete updatedAttributes[propName];
        } else {
          updatedAttributes[propName] = { type: propType, value: propValue };
        }
        return {
          ...parent,
          attributes: updatedAttributes,
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

    updateConfig((prevConfig) => {
      const updatedConfig = updatePropRecursive(prevConfig);
      console.log("Updated config after prop update:", updatedConfig);
      return {...updatedConfig};
    });
  }, [updateConfig]);

  const updateMapConfig = useCallback((itemId, mapParams, mapVariable) => {
    const updateMapRecursive = (parent) => {
      if (parent.id === itemId) {
        return {
          ...parent,
          mapParams: mapParams ?? parent.mapParams,
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

    updateConfig((prevConfig) => {
      const updatedConfig = updateMapRecursive(prevConfig);
      console.log("Updated config after map update:", updatedConfig);
      return updatedConfig;
    });
  }, [updateConfig]);

  ConfigProvider.propTypes = {
    children: PropTypes.node.isRequired,
  };

  return (
    <ConfigContext.Provider
      value={{
        config,
        setConfig,
        updateConfig,
        removeChildById,
        updateItem,
        addItemToId,
        updateStyles,
        updateProp,
        updateMapConfig,
      }}
    >
      {children}
    </ConfigContext.Provider>
  );
};

