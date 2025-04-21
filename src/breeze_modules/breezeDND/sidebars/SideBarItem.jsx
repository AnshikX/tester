import { useCallback, useState } from "react";
import { useDrag } from "react-dnd";
import PropTypes from "prop-types";
import "../styles.css";
import upArrow from "../assets/svgs/up-arrow.svg";
import downArrow from "../assets/svgs/down-arrow.svg";
import { generateId } from "../utils/generateIds";
import deepCopy from "../../utils/deepcopy";

const SideBarItem = ({ sidebarItems, theme }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [openSections, setOpenSections] = useState({
    html: true,
    components: true,
    third_party: true,
  });

  const toggleSection = (section) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Filter function to search across all categories
  const filterItems = (items) => {
    return items.filter((item) =>
      item.label.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const filteredHtmlItems = filterItems(sidebarItems.htmlItems);
  const filteredComponents = filterItems(sidebarItems.components);
  const filteredThirdParty = filterItems(sidebarItems.third_party);

  return (
    <div className={`brDnd-sidebar ${theme === "dark" ? "dark" : "light"}`}>
      {/* Search Bar */}
      <div className="brDnd-search-container">
        <input
          type="text"
          className={`brDnd-search-bar ${theme === "dark" ? "dark" : "light"}`}
          placeholder="Search items..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* HTML Elements Section */}
      <div className="mb-2 mt-5">
        <span
          onClick={() => toggleSection("html")}
          className="brDnd-section-title"
        >
          HTML Elements
          {openSections.html ? (
            <img src={upArrow} alt="expand" />
          ) : (
            <img src={downArrow} alt="collapse" />
          )}
        </span>
        {openSections.html && (
          <div className="brDnd-section-content">
            {filteredHtmlItems.length > 0 ? (
              filteredHtmlItems.map((item, index) => (
                <DraggableItem key={index} data={item} theme={theme} />
              ))
            ) : (
              <div className="fst-italic fs-6">No results</div>
            )}
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
            <img src={upArrow} alt="expand" />
          ) : (
            <img src={downArrow} alt="collapse" />
          )}
        </span>
        {openSections.components && (
          <div className="brDnd-section-content">
            {filteredComponents.length > 0 ? (
              filteredComponents.map((item, index) => (
                <DraggableItem key={index} data={item} theme={theme} />
              ))
            ) : (
              <div className="fst-italic fs-6">No results</div>
            )}
          </div>
        )}
      </div>

      {/* Third party Section*/}
      <div className="mb-2">
        <span
          onClick={() => toggleSection("third_party")}
          className="brDnd-section-title"
        >
          Third Party
          {openSections.third_party ? (
            <img src={upArrow} alt="expand" />
          ) : (
            <img src={downArrow} alt="collapse" />
          )}
        </span>
        {openSections.third_party && (
          <div className="brDnd-section-content">
            {filteredThirdParty.length > 0 ? (
              filteredThirdParty.map((item, index) => (
                <DraggableItem key={index} data={item} theme={theme} />
              ))
            ) : (
              <div className="fst-italic fs-6">No results</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const DraggableItem = ({ data, theme }) => {
  const getItem = useCallback(() => {
    const newItem = deepCopy(data);
    generateId(newItem);
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
    third_party: PropTypes.array.isRequired,
  }).isRequired,
  theme: PropTypes.string.isRequired,
};

export default SideBarItem;
