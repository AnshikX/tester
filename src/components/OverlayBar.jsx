import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import PropTypes from "prop-types";
import deleteButton from "./assets/svgs/delete-button.svg";

const OverlayBar = ({ itemId, itemLabel, onDelete, isVisible, setIsHovered, isFirst, overDetails }) => {
  const [pos, setPos] = useState({ top: 0, left: 0, width: 0, height: 0 });

  const getPosition = useCallback(() => {
    const element = document.getElementById(itemId);
    if (!element) return { top: 0, left: 0, width: 0, height: 0 };
    const rect = element.getBoundingClientRect();
    return {
      top: rect.top + window.scrollY,
      left: rect.left + window.scrollX,
      width: rect.width,
      height: rect.height,
    };
  }, [itemId]);

  useEffect(() => {
    let animationFrameId;

    const updatePosition = () => {
      setPos((prevPos) => {
        const newPos = getPosition();

        // Keep updating until the final position is stable
        if (
          prevPos.top !== newPos.top ||
          prevPos.left !== newPos.left ||
          prevPos.width !== newPos.width ||
          prevPos.height !== newPos.height
        ) {
          animationFrameId = requestAnimationFrame(updatePosition);
          return newPos;
        }
        return prevPos;
      });
    };

    updatePosition(); // Initial update

    const element = document.getElementById(itemId);
    if (!element) {
      const observer = new MutationObserver(() => {
        const element = document.getElementById(itemId);
        if (element) {
          updatePosition();
        }
      });
      observer.observe(document.body, { childList: true, subtree: true });
      return () => observer.disconnect();
    }

    // Observe any mutations in the item's subtree
    const mutationObserver = new MutationObserver(updatePosition);
    mutationObserver.observe(element, { attributes: true, characterData: true, subtree: true, childList: true });

    // Observe resizing
    const resizeObserver = new ResizeObserver(updatePosition);
    resizeObserver.observe(element);

    // Observe visibility changes
    const intersectionObserver = new IntersectionObserver(updatePosition);
    intersectionObserver.observe(element);

    // Update on animations
    const handleAnimation = () => {
      updatePosition();
      animationFrameId = requestAnimationFrame(updatePosition);
    };

    document.body.addEventListener("animationstart", handleAnimation);
    document.body.addEventListener("animationiteration", handleAnimation);
    document.body.addEventListener("animationend", handleAnimation);
    document.body.addEventListener("transitionend", handleAnimation);

    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);

    return () => {
      mutationObserver.disconnect();
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      document.body.removeEventListener("animationstart", handleAnimation);
      document.body.removeEventListener("animationiteration", handleAnimation);
      document.body.removeEventListener("animationend", handleAnimation);
      document.body.removeEventListener("transitionend", handleAnimation);
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
      cancelAnimationFrame(animationFrameId);
    };
  }, [getPosition, itemId, isVisible]);

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
          <span>{overDetails?.label || itemLabel || "Unnamed Item"} {overDetails && overDetails.labelSuffix}</span>
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
  onDelete: PropTypes.func,
  isVisible: PropTypes.bool.isRequired,
  setIsHovered: PropTypes.func.isRequired,
  isFirst: PropTypes.bool.isRequired,
};

export default OverlayBar;
