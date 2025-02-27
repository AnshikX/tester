import { createContext, useCallback, useContext, useState } from "react";
import PropTypes from "prop-types";

const MapContext = createContext();

export const MapProvider = ({  children }) => {
    const[allMaps, setAllMaps] = useState({});

    const setReturnLayer = useCallback((mapId, layer) => {
        setAllMaps((prevState) => ({
            ...prevState,
            [mapId]: layer,
        }));
    },[]);

    const getReturnLayer = useCallback((mapId) => {
        return allMaps[mapId];
    },[allMaps]);

  return (
    <MapContext.Provider
      value={{
        setReturnLayer,
        getReturnLayer
      }}
    >
      {children}
    </MapContext.Provider>
  );
};

MapProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
export const useMap = () => useContext(MapContext);
