import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import PropTypes from "prop-types";
import deleteButton from "./assets/svgs/delete-button.svg";

const OverlayBar = ({
  itemId,
  itemLabel,
  elementType,
  onDelete,
  isVisible,
  setIsHovered,
  isFirst,
}) => {
  const [pos, setPos] = useState(null);

  useEffect(() => {
    if (!isVisible) return;

    const element = document.getElementById(itemId);

    if (!element) return;

    const updatePosition = () => {
      const rect = element.getBoundingClientRect();
      setPos({
        top: rect.top + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
        height: rect.height,
      });
    };

    // Update position initially
    updatePosition();

    // Observe DOM changes on the target element
    const observer = new MutationObserver(updatePosition);
    observer.observe(element, {
      attributes: true,
      childList: true,
      subtree: true,
    });

    // Listen for window scroll and resize events
    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [itemId, isVisible]);

  if (!isVisible || !pos) return null;

  const overlayStyle = {
    position: "fixed",
    top: `${pos.top}px`,
    left: `${pos.left}px`,
    width: `${pos.width}px`,
    height: `${pos.height}px`,
    border: isVisible ? "2px solid #007bff" : "2px dashed #ccc",
    boxShadow: "0 0 10px rgba(0, 123, 255, 0.7)",
    zIndex: 1000,
    pointerEvents: "none",
    resize: "both",
  };

  const toolbarStyle = {
    position: "fixed",
    top: `${pos.top - 34}px`,
    left: `${pos.left}px`,
    background: "#2680eb",
    color: "white",
    padding: "5px 10px",
    borderRadius: "5px",
    zIndex: 1001,
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
    display: "flex",
    gap: "10px",
    alignItems: "center",
  };

  return createPortal(
    <>
      <div
        style={overlayStyle}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      ></div>
      <div
        style={toolbarStyle}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <span>{itemLabel ? itemLabel : elementType || "Unnamed Item"}</span>
        {!isFirst && (
          <img
            src={deleteButton}
            alt="Delete"
            style={{ width: "15px", cursor: "pointer", height: "15px" }}
            onClick={onDelete}
          />
        )}
      </div>
    </>,
    document.body
  );
};

OverlayBar.propTypes = {
  itemId: PropTypes.string.isRequired,
  itemLabel: PropTypes.string,
  elementType: PropTypes.string,
  onDelete: PropTypes.func.isRequired,
  isVisible: PropTypes.bool.isRequired,
  setIsHovered: PropTypes.func.isRequired,
  isFirst: PropTypes.bool.isRequired,
};

export default OverlayBar;
