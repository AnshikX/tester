import { createContext, useState, useContext } from 'react';
import PropTypes from 'prop-types';

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

  const setHoveredItem = (id) => {
    setHoveredItemId(id);
  };

  return (
    <VisibilityContext.Provider value={{ visibilityState, toggleVisibility, setVisibility, hoveredItemId, setHoveredItem }}>
      {children}
    </VisibilityContext.Provider>
  );
};

VisibilityProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

