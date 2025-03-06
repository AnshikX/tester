import { useDrag } from "react-dnd";
import PropTypes from "prop-types";
import { useCallback } from "react";

const SideBarItem = ({ data }) => {
  const getItem = useCallback(() => {
    const newItem = JSON.parse(JSON.stringify(data));
    newItem.id = crypto.randomUUID();
    if (newItem.elementType === "MAP") {
      newItem.bodyConfig.statements[0].value.id = crypto.randomUUID();
    }
    if (newItem.elementType === "CONDITIONAL") {
      newItem.trueCase.id = crypto.randomUUID();  
      newItem.falseCase.id = crypto.randomUUID();
    }
    return newItem;
  }, [data]);
  
  const [{ opacity }, drag] = useDrag(
    {
      type: "HTML",
      item: { getItem },
      collect: (monitor) => ({
        opacity: monitor.isDragging() ? 0.4 : 1,
      }),
    },
    [data]
  );
  return (
    <div className="sideBarItem" ref={drag} style={{ opacity }}>
      {data.label}
    </div>
  );

};

SideBarItem.propTypes = {
  data: PropTypes.shape({
    elementType: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    tagName: PropTypes.string,
    attributes: PropTypes.object,
    children: PropTypes.array,
    value: PropTypes.string,
  }).isRequired,
};

export default SideBarItem;
