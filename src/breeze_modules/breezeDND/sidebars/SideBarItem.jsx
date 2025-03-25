import { useCallback, useState } from "react";
import { useDrag } from "react-dnd";
import PropTypes from "prop-types";
import "../styles.css";
import upArrow from "../assets/svgs/up-arrow.svg";
import downArrow from "../assets/svgs/down-arrow.svg";
import generate_uuid from "../../utils/UuidGenerator";

const SideBarItem = ({ sidebarItems, theme }) => {
  const [openSections, setOpenSections] = useState({
    html: true,
    components: true,
  });

  const toggleSection = (section) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <div className={`brDnd-sidebar ${theme === "dark" ? "dark" : "light"}`}>
      {/* HTML Elements Section */}
      <div className="mb-2">
        <span
          onClick={() => toggleSection("html")}
          className="brDnd-section-title"
        >
          HTML Elements
          {openSections.html ? (
            <img src={downArrow} alt="collapse" />
          ) : (
            <img src={upArrow} alt="expand" />
          )}
        </span>
        {openSections.html && (
          <div className="brDnd-section-content">
            {sidebarItems.htmlItems.map((item, index) => (
              <DraggableItem key={index} data={item} theme={theme} />
            ))}
          </div>
        )}
      </div>

      {/* Components Section */}
      <div className="mb-2">
        <span
          onClick={() => toggleSection("components")}
          className="brDnd-section-title"
        >
          Components
          {openSections.components ? (
            <img src={downArrow} alt="collapse" />
          ) : (
            <img src={upArrow} alt="expand" />
          )}
        </span>
        {openSections.components && (
          <div className="brDnd-section-content">
            {sidebarItems.components.map((item, index) => (
              <DraggableItem key={index} data={item} theme={theme} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const DraggableItem = ({ data, theme }) => {
  const getItem = useCallback(() => {
    const newItem = JSON.parse(JSON.stringify(data));
    newItem.id = generate_uuid();
    if (newItem.elementType === "MAP") {
      newItem.bodyConfig.statements[0].value.id = generate_uuid();
    }
    if (newItem.elementType === "CONDITIONAL") {
      newItem.trueCase.id = generate_uuid();
      newItem.falseCase.id = generate_uuid();
    }
    return newItem;
  }, [data]);

  const [{ opacity }, drag] = useDrag(
    () => ({
      type: "HTML",
      item: { getItem },
      collect: (monitor) => ({
        opacity: monitor.isDragging() ? 0.4 : 1,
      }),
    }),
    [data]
  );

  return (
    <div
      className={`brDnd-sideBarItem ${theme === "dark" ? "dark" : "light"}`}
      ref={drag}
      style={{ opacity }}
    >
      {data.label}
    </div>
  );
};

DraggableItem.propTypes = {
  data: PropTypes.object.isRequired,
  theme: PropTypes.string.isRequired,
};

SideBarItem.propTypes = {
  sidebarItems: PropTypes.shape({
    htmlItems: PropTypes.array.isRequired,
    components: PropTypes.array.isRequired,
  }).isRequired,
  theme: PropTypes.string.isRequired,
};

export default SideBarItem;
