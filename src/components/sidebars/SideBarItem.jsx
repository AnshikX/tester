import { useCallback, useState } from "react";
import { useDrag } from "react-dnd";
import PropTypes from "prop-types";
import "../../styles/styles.css";
import upArrow from "../../../src/components/assets/svgs/up-arrow.svg";
import downArrow from "../../../src/components/assets/svgs/down-arrow.svg";

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
    <div className={`sideBar ${theme === "dark" ? "dark" : "light"}`}>
      {/* HTML Elements Section */}
      <div className="section">
        <span onClick={() => toggleSection("html")} className="section-title">
          HTML Elements
          {openSections.html ? <img src={downArrow} alt="collapse" /> : <img src={upArrow} alt="expand" />}
        </span>
        {openSections.html && (
          <div className="section-content">
            {sidebarItems.htmlItems.map((item, index) => (
              <DraggableItem key={index} data={item} theme={theme} />
            ))}
          </div>
        )}
      </div>

      {/* Components Section */}
      <div className="section">
        <span onClick={() => toggleSection("components")} className="section-title">
          Components
          {openSections.components ? <img src={downArrow} alt="collapse" /> : <img src={upArrow} alt="expand" />}
        </span>
        {openSections.components && (
          <div className="section-content">
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

  const [{ opacity }, drag] = useDrag(() => ({
    type: "HTML",
    item: { getItem },
    collect: (monitor) => ({
      opacity: monitor.isDragging() ? 0.4 : 1,
    }),
  }), [data]);

  return (
    <div
      className={`sideBarItem ${theme === "dark" ? "dark" : "light"}`}
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
