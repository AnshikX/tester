import classNames from "classnames";
import PropTypes from "prop-types";
import { useEffect, useRef } from "react";

import { useDrop } from "react-dnd";

const ACCEPTS = ["HTML", "TEXT"];

const DropZone = ({ onDrop, className, children, isOnly, heirarchy = [] }) => {
  const [{ isOver, canDrop }, drop] = useDrop(
    {
      accept: ACCEPTS,

      drop: ({ item, myOnDrop, getItem }) => {
        if (myOnDrop) {
          myOnDrop();
        }
        if (getItem) {
          onDrop(getItem(item));
        } else if (item) {
          onDrop(item);
        } else {
          console.warn("Something went wrong");
        }
      },

      canDrop: ({ item }) => {
        return item ? !heirarchy.includes(item.id) : true;
      },
      collect: (monitor) => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      }),
    },
    [onDrop, heirarchy]
  );

  const dropZoneRef = useRef();

  const checkInline = (element)=>{
    if(!element) return false;
    const computedStyle = window.getComputedStyle(element);
    return element.classList.contains("thisIsSupposedToBeText") || (computedStyle.display === "inline" || computedStyle.display === "inline-block");
  }

  useEffect(() => {
    if (dropZoneRef.current) {
      const parent = dropZoneRef.current.parentElement;
      const computedStyle = window.getComputedStyle(parent);
      var isRow = false;

      if (checkInline(dropZoneRef.current.previousElementSibling) && checkInline(dropZoneRef.current.nextElementSibling)) {
        dropZoneRef.current.style.display = "inline-block";
        dropZoneRef.current.style.minWidth = "10px";
        dropZoneRef.current.style.alignSelf = "center";
        dropZoneRef.current.style.width = "auto";
      } else {
        if (computedStyle.display === "flex") {
          isRow = computedStyle.flexDirection === "row";
        } else if (computedStyle.display === "grid") {
          isRow = computedStyle.gridAutoFlow.includes("row");
        }
        if (isRow) {
          if (!isOnly) {
            dropZoneRef.current.classList.add("brDnd-col-drop");
          }
          dropZoneRef.current.classList.remove("brDnd-row-drop");
        } else {
          dropZoneRef.current.classList.remove("brDnd-col-drop");
          dropZoneRef.current.classList.add("brDnd-row-drop");
        }
      }
    }
  }, [dropZoneRef, isOnly]);

  const isActive = isOver && canDrop;

  return (
    <div ref={dropZoneRef}>
      <div
        className={classNames(
          "brDnd-dropZone",
          { active: isActive },
          className
        )}
        ref={drop}
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
