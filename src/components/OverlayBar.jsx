import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import PropTypes from "prop-types";

const OverlayBar = ({
  itemId,
  itemLabel,
  itemTagName,
  onDelete,
  isVisible,
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
    border: "2px solid #007bff",
    zIndex: 1000,
    pointerEvents: "none",
  };

  const toolbarStyle = {
    position: "fixed",
    top: `${pos.top - 32}px`,
    left: `${pos.left}px`,
    background: "#2680eb",
    color: "white",
    padding: "5px 10px",
    borderRadius: "5px",
    zIndex: 1001,
  };

  return createPortal(
    <>
      <div style={overlayStyle}></div>
      <div style={toolbarStyle}>
        <span>{itemLabel ? itemLabel : itemTagName || "Unnamed Item"}</span>
        <button
          onClick={onDelete}
          style={{
            // border: "none",
            // background: "none",
            cursor: "pointer",
            color: "red ",
          }}
        >
          <i className="fa fa-trash"></i>
        </button>
      </div>
    </>,
    document.body
  );
};

OverlayBar.propTypes = {
  itemId: PropTypes.string.isRequired,
  itemLabel: PropTypes.string,
  itemTagName: PropTypes.string,
  onDelete: PropTypes.func.isRequired,
  isVisible: PropTypes.bool.isRequired,
};

export default OverlayBar;
