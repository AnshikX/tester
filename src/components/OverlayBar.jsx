import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import PropTypes from "prop-types";
import deleteButton from "./assets/svgs/delete-button.svg";

const OverlayBar = ({ itemId, itemLabel, onDelete, isVisible, setIsHovered, isFirst }) => {
  const [pos, setPos] = useState({ top: 0, left: 0, width: 0, height: 0 });

  const getPosition = useCallback(() => {
    const element = document.getElementById(itemId);
    if (!element) return pos;

    const rect = element.getBoundingClientRect();
    const newPos = {
      top: rect.top + window.scrollY,
      left: rect.left + window.scrollX,
      width: rect.width,
      height: rect.height,
    };

    if (
      pos.top === newPos.top &&
      pos.left === newPos.left &&
      pos.width === newPos.width &&
      pos.height === newPos.height
    ) {
      return pos;
    }

    return newPos;
  }, [itemId, pos]);

  useEffect(() => {
    const element = document.getElementById(itemId);
    if (!element) return;

    const updatePosition = () => {
      setTimeout(() => {
        setPos(getPosition());
      }, 0);
    };

    updatePosition();

    const observer = new MutationObserver(updatePosition);
    observer.observe(element, { attributes: true, childList: true, subtree: true });

    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [getPosition, itemId]);

  const overlayStyle = {
    position: "fixed",
    top: `${pos.top}px`,
    left: `${pos.left}px`,
    width: `${pos.width}px`,
    height: `${pos.height}px`,
    border: isVisible ? "2px solid #007bff" : "2px dashed #ccc",
    zIndex: 1000,
    pointerEvents: "none",
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
      {isVisible && (
        <div
          style={toolbarStyle}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <span>{itemLabel || "Unnamed Item"}</span>
          {!isFirst && (
            <img
              src={deleteButton}
              alt="Delete"
              style={{ width: "15px", cursor: "pointer", height: "15px" }}
              onClick={onDelete}
            />
          )}
        </div>
      )}
    </>,
    document.body
  );
};

OverlayBar.propTypes = {
  itemId: PropTypes.string.isRequired,
  itemLabel: PropTypes.string,
  onDelete: PropTypes.func.isRequired,
  isVisible: PropTypes.bool.isRequired,
  setIsHovered: PropTypes.func.isRequired,
  isFirst: PropTypes.bool.isRequired,
};

export default OverlayBar;
