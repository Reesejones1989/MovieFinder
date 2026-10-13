import React from "react";
import "./ListStatus.css";

// Shown in place of a row of cards when a TMDB request fails or returns
// nothing, so the user sees a message instead of a blank row.
export default function ListStatus({ error, empty, emptyText = "Nothing to show right now.", onRetry }) {
  if (error) {
    return (
      <div className="list-status list-status--error" role="alert">
        <p>{typeof error === "string" ? error : "Something went wrong loading this list."}</p>
        {onRetry && (
          <button className="list-status__retry" onClick={onRetry}>
            Try again
          </button>
        )}
      </div>
    );
  }

  if (empty) {
    return (
      <div className="list-status">
        <p>{emptyText}</p>
      </div>
    );
  }

  return null;
}
