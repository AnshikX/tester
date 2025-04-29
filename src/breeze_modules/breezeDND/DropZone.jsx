import PropTypes from "prop-types";
import { useEffect, useRef } from "react";
import { useDrop, useDragLayer } from "react-dnd";

const dropzoneRegistry = new Set();

// Maximum number of dropzones to show at once
const MAX_VISIBLE = 5;
// The maximum distance (in pixels) from the dropzone's edge at which it will be considered
const MAX_DISTANCE = 50; // adjust as needed

// Compute the minimal distance from a point to a rectangle
function distanceToRect(x, y, rect) {
  const dx = Math.max(rect.left - x, 0, x - rect.right);
  const dy = Math.max(rect.top - y, 0, y - rect.bottom);
  return Math.sqrt(dx * dx + dy * dy);
}

const ACCEPTS = ["HTML", "TEXT"];

const DropZone = ({ onDrop, children, isOnly, heirarchy = [] }) => {
  const dropZoneRef = useRef();

  const [, drop] = useDrop(
    {
      accept: ACCEPTS,
      drop: ({ item, myOnDrop, getItem }) => {
        if (myOnDrop) myOnDrop();
        if (getItem) {
          const temp = getItem(item);
          if (temp.elementType === "WIDGET") {
            // Send to Breeze, wait for response, then call onDrop
            const widgetListener = (event) => {
              if (
                event.data?.source === "BREEZE" &&
                event.data.type === "widgetConfig"
              ) {
                onDrop(event.data.config);
                window.removeEventListener("message", widgetListener);
              }
            };

            window.addEventListener("message", widgetListener);

            window.parent.postMessage(
              {
                source: "APP",
                action: "FETCH_CONFIG",
                widgetConfig: temp,
              },
              "*"
            );
          } else {
            onDrop(temp);
          }
        } else if (item) onDrop(item);
        else console.warn("Something went wrong");

        dropzoneRegistry.forEach((el) => {
          el.classList.remove("visible");
          el.classList.remove("highlighted");
        });
      },
      canDrop: ({ item }) => (item ? !heirarchy.includes(item.id) : true),
    },
    [onDrop, heirarchy]
  );

  const { isDragging } = useDragLayer((monitor) => ({
    isDragging: monitor.isDragging(),
  }));

  // Apply row/col drop class based on parent's layout
  useEffect(() => {
    const el = dropZoneRef.current;
    if (!el) return;

    const parent = el.parentElement;
    const computedStyle = window.getComputedStyle(parent);
    let isRow = false;

    const checkInline = (el) => {
      if (!el) return false;
      const style = window.getComputedStyle(el);
      return (
        el.classList.contains("thisIsSupposedToBeText") ||
        style.display === "inline" ||
        style.display === "inline-block"
      );
    };

    if (
      checkInline(el.previousElementSibling) &&
      checkInline(el.nextElementSibling)
    ) {
      el.style.display = "inline-block";
      el.style.minWidth = "10px";
      el.style.alignSelf = "center";
      el.style.width = "auto";
    } else {
      if (computedStyle.display === "flex") {
        isRow = computedStyle.flexDirection === "row";
      } else if (computedStyle.display === "grid") {
        isRow = computedStyle.gridAutoFlow.includes("row");
      }

      if (isRow) {
        if (!isOnly) el.classList.add("brDnd-col-drop");
        el.classList.remove("brDnd-row-drop");
      } else {
        el.classList.add("brDnd-row-drop");
        el.classList.remove("brDnd-col-drop");
      }
    }
  }, [isOnly]);

  useEffect(() => {
    const el = dropZoneRef.current;
    if (!el) return;
    dropzoneRegistry.add(el);
    return () => {
      dropzoneRegistry.delete(el);
    };
  }, []);

  // Proximity logic to determine which dropzones become visible and which one is highlighted
  useEffect(() => {
    if (!isDragging) {
      dropzoneRegistry.forEach((el) => {
        el.classList.remove("visible");
        el.classList.remove("highlighted");
      });
      return;
    }

    let animationFrame = null;
    let lastVisible = new Set();
    let lastRun = 0;
    const THROTTLE_MS = 300;

    const handleMouseMove = (e) => {
      const now = performance.now();
      if (now - lastRun < THROTTLE_MS) return;

      if (animationFrame !== null) {
        cancelAnimationFrame(animationFrame);
      }

      animationFrame = requestAnimationFrame(() => {
        lastRun = now;
        const { clientX: cursorX, clientY: cursorY } = e;

        // Bail out if the cursor is already over a highlighted dropzone
        for (const el of dropzoneRegistry) {
          if (el.classList.contains("highlighted")) {
            const rect = el.getBoundingClientRect();
            if (
              cursorX >= rect.left &&
              cursorX <= rect.right &&
              cursorY >= rect.top &&
              cursorY <= rect.bottom
            ) {
              return;
            }
          }
        }

        // Compute distances to each dropzone based on its full bounding box
        const distances = [];
        dropzoneRegistry.forEach((el) => {
          const rect = el.getBoundingClientRect();
          // Use the minimal distance from the cursor to the dropzone's boundary.
          const dist = distanceToRect(cursorX, cursorY, rect);
          distances.push({ el, dist, rect });
        });

        // Sort by distance (smallest first)
        distances.sort((a, b) => a.dist - b.dist);

        // Pick the closest MAX_VISIBLE dropzones that are within MAX_DISTANCE
        const newVisible = new Set(
          distances
            .filter(({ dist }) => dist <= MAX_DISTANCE)
            .slice(0, MAX_VISIBLE)
            .map((d) => d.el)
        );

        // Find which dropzone (among all) the cursor is actually over:
        let bestMatch = null;
        for (const { el, rect } of distances) {
          if (
            cursorX >= rect.left &&
            cursorX <= rect.right &&
            cursorY >= rect.top &&
            cursorY <= rect.bottom
          ) {
            bestMatch = el;
            break;
          }
        }

        // Apply new visibility and highlighting classes only if changed
        dropzoneRegistry.forEach((el) => {
          const shouldBeVisible = newVisible.has(el);
          const wasVisible = lastVisible.has(el);

          if (shouldBeVisible && !wasVisible) {
            el.classList.add("visible");
          } else if (!shouldBeVisible && wasVisible) {
            el.classList.remove("visible");
          }
          el.classList.remove("highlighted");
        });

        if (bestMatch) {
          bestMatch.classList.add("highlighted");
        }

        lastVisible = newVisible;
      });
    };

    window.addEventListener("dragover", handleMouseMove);
    return () => {
      window.removeEventListener("dragover", handleMouseMove);
      if (animationFrame !== null) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [isDragging]);

  return (
    <div
      ref={(node) => {
        drop(node);
        dropZoneRef.current = node;
      }}
    >
      <div className="brDnd-dropZone">{children}</div>
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
