import React, { useCallback, useEffect, useRef, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Cards from "../Cards.jsx";
import ListStatus from "../ListStatus.jsx";
import "./MediaRow.css";

// Netflix-style horizontal row: a title, then a single line of posters that
// scrolls sideways. Arrow buttons page through the row on desktop; on touch
// devices the row is swiped natively.
export default function MediaRow({
  title,
  items = [],
  type = "movie",
  error = null,
  empty = false,
  emptyText,
  onRetry,
}) {
  const trackRef = useRef(null);
  // overflows: the row is wider than the screen, so arrows are needed.
  // atStart / atEnd: used to wrap around when an arrow is pressed at an edge.
  const [overflows, setOverflows] = useState(false);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const updateArrows = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setOverflows(max > 4);
    setAtStart(el.scrollLeft <= 4);
    setAtEnd(el.scrollLeft >= max - 4);
  }, []);

  useEffect(() => {
    updateArrows();
    window.addEventListener("resize", updateArrows);
    return () => window.removeEventListener("resize", updateArrows);
  }, [items, updateArrows]);

  // Page through the row; at either end, wrap around to the other end.
  const scrollByPage = (dir) => {
    const el = trackRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;

    if (dir > 0 && el.scrollLeft >= max - 4) {
      el.scrollTo({ left: 0, behavior: "smooth" });
    } else if (dir < 0 && el.scrollLeft <= 4) {
      el.scrollTo({ left: max, behavior: "smooth" });
    } else {
      // Snap the last partial page straight to the edge so it never takes
      // an extra click that barely moves the row.
      let target = el.scrollLeft + dir * el.clientWidth * 0.9;
      const slack = el.clientWidth * 0.3;
      if (target >= max - slack) target = max;
      if (target <= slack) target = 0;
      el.scrollTo({ left: target, behavior: "smooth" });
    }
  };

  return (
    <section className="media-row">
      <h3 className="media-row__title">{title}</h3>

      <ListStatus error={error} empty={empty} emptyText={emptyText} onRetry={onRetry} />

      {items.length > 0 && (
        <div className="media-row__viewport">
          <button
            type="button"
            className={`media-row__arrow media-row__arrow--left ${overflows ? "" : "is-hidden"}`}
            onClick={() => scrollByPage(-1)}
            aria-label={atStart ? `Jump to end of ${title}` : `Scroll ${title} left`}
            title={atStart ? "Jump to end" : undefined}
            tabIndex={overflows ? 0 : -1}
          >
            <FaChevronLeft />
          </button>

          <div className="media-row__track" ref={trackRef} onScroll={updateArrows}>
            {items.map((item) => (
              <Cards key={item.id} item={item} type={type} />
            ))}
          </div>

          <button
            type="button"
            className={`media-row__arrow media-row__arrow--right ${overflows ? "" : "is-hidden"}`}
            onClick={() => scrollByPage(1)}
            aria-label={atEnd ? `Back to start of ${title}` : `Scroll ${title} right`}
            title={atEnd ? "Back to start" : undefined}
            tabIndex={overflows ? 0 : -1}
          >
            <FaChevronRight />
          </button>
        </div>
      )}
    </section>
  );
}
