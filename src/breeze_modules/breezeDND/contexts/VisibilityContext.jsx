import { createContext, useState, useContext, useEffect } from "react";
import PropTypes from "prop-types";

const VisibilityContext = createContext();

export const useVisibility = () => {
  return useContext(VisibilityContext);
};

export const VisibilityProvider = ({ children }) => {
  const [visibilityState, setVisibilityState] = useState({});
  const [hoveredItemId, setHoveredItemId] = useState(null);

  const toggleVisibility = (id) => {
    setVisibilityState((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  const setVisibility = (id, isVisible) => {
    setVisibilityState((prevState) => ({
      ...prevState,
      [id]: isVisible,
    }));
  };

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data?.source === "LayersEditor") {
        const { action, nodeId } = event.data;

        if (action === "toggleVisibility") {
          toggleVisibility(nodeId);
        } else if (action === "setHoveredItemId") {
          setHoveredItemId(nodeId);
        }
      }
    };

    window.addEventListener("message", handleMessage);

    return () => window.removeEventListener("message", handleMessage);
  }, []);

  useEffect(() => {
    window.parent.postMessage(
      {
        source: "VisibilityProvider",
        type: "visibilityState",
        data: visibilityState,
      },
      "*"
    );
  }, [visibilityState]);

  return (
    <VisibilityContext.Provider
      value={{
        visibilityState,
        toggleVisibility,
        setVisibility,
        hoveredItemId,
      }}
    >
      {children}
    </VisibilityContext.Provider>
  );
};

VisibilityProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
