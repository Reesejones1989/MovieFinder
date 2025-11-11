import React, { useState } from "react";
import "./Cards.css";

export default function Card({ item, type, getWatchLinks }) {
  const [showModal, setShowModal] = useState(false);

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const links = getWatchLinks ? getWatchLinks(item) : [];

  return (
    <>
      <div className="card" onClick={handleOpenModal}>
        <img
          src={item.poster || "/no-poster.png"}
          alt={item.title}
          className="card-poster"
        />
        <div className="card-title">
          {item.title} ({item.year})
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={handleCloseModal}>
              ✖
            </button>
            <img
              src={item.poster || "/no-poster.png"}
              alt={item.title}
              className="modal-poster"
            />
            <h2>{item.title}</h2>
            <p className="modal-overview">
              {item.overview || "No description available."}
            </p>
            <div className="modal-links">
              {links.map((link, i) => (
                <a
                  key={i}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="modal-watch-link"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
