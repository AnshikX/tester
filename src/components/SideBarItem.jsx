import { useDrag } from "react-dnd";
import PropTypes from "prop-types"; 

const SideBarItem = ({ data }) => {
  const [{ opacity }, drag] = useDrag({
    type: "HTML",
    item: { ...data, type: "HTML" },
    collect: (monitor) => ({
      opacity: monitor.isDragging() ? 0.4 : 1,
    }),
  });

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
