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
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);

  const updateArrows = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 4);
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    updateArrows();
    window.addEventListener("resize", updateArrows);
    return () => window.removeEventListener("resize", updateArrows);
  }, [items, updateArrows]);

  const scrollByPage = (dir) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.9, behavior: "smooth" });
  };

  return (
    <section className="media-row">
      <h3 className="media-row__title">{title}</h3>

      <ListStatus error={error} empty={empty} emptyText={emptyText} onRetry={onRetry} />

      {items.length > 0 && (
        <div className="media-row__viewport">
          <button
            type="button"
            className={`media-row__arrow media-row__arrow--left ${canLeft ? "" : "is-hidden"}`}
            onClick={() => scrollByPage(-1)}
            aria-label={`Scroll ${title} left`}
            tabIndex={canLeft ? 0 : -1}
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
            className={`media-row__arrow media-row__arrow--right ${canRight ? "" : "is-hidden"}`}
            onClick={() => scrollByPage(1)}
            aria-label={`Scroll ${title} right`}
            tabIndex={canRight ? 0 : -1}
          >
            <FaChevronRight />
          </button>
        </div>
      )}
    </section>
  );
}
