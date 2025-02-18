import { createContext, useContext, useState } from "react";
import PropTypes from "prop-types";

const PropContext = createContext();

export const usePropContext = () => {
  return useContext(PropContext);
};

export const PropProvider = ({ children }) => {
  const [scope, setScope] = useState();
  const [props, setProps] = useState();

  PropProvider.propTypes = {
    children: PropTypes.node.isRequired,
  };

  return (
    <PropContext.Provider
      value={{
        scope,
        setScope,
        props,
        setProps,
      }}
    >
      {children}
    </PropContext.Provider>
  );
};
