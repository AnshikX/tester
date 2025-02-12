import classNames from "classnames";
import PropTypes from "prop-types";
import { useEffect, useMemo, useRef } from "react";

import { useDrop } from "react-dnd";

const ACCEPTS = ["HTML", "TEXT"];

const DropZone = ({ onDrop, className, children, isOnly, heirarchy = [] }) => {
  const randomId = useMemo(() => crypto.randomUUID(), []);
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: ACCEPTS,

    drop: (item) => {
      onDrop(item);
    },

    canDrop: (item) => {
      return !heirarchy.includes(item.id);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  const dropZoneRef = useRef();

  useEffect(() => {
    if (dropZoneRef.current) {
      const parent = dropZoneRef.current.parentElement;
      const computedStyle = window.getComputedStyle(parent);
      var isRow = false;
      if (computedStyle.display === "inline") {
        dropZoneRef.current.style.display = "inline";
        const dropZone = document.getElementById(randomId)
        dropZone.style.paddingLeft = "10px";
        dropZone.style.paddingLeft = "10px";
        dropZone.style.display = "inline";
      }
      if (computedStyle.display === "flex") {
        isRow = computedStyle.flexDirection === "row";
      } else if (computedStyle.display === "grid") {
        isRow = computedStyle.gridAutoFlow.includes("row");
      }
      if (isRow) {
        if (!isOnly) {
          dropZoneRef.current.classList.add("col-drop");
        }
        dropZoneRef.current.classList.remove("row-drop");
      } else {
        dropZoneRef.current.classList.remove("col-drop");
        dropZoneRef.current.classList.add("row-drop");
      }
    }
  }, [dropZoneRef, isOnly, randomId]);

  const isActive = isOver && canDrop;

  return (
    <div ref={dropZoneRef}>
      <div
        className={classNames("dropZone", { active: isActive }, className)}
        ref={drop}
        id={randomId}
      >
        {children}
      </div>
    </div>
  );
};

DropZone.propTypes = {
  onDrop: PropTypes.func,
  className: PropTypes.string,
  children: PropTypes.node,
  isOnly: PropTypes.bool,
  heirarchy: PropTypes.array,
};

export default DropZone;
