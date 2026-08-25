import { useEffect, useState } from "react";
import api from "../api/axios.js";
import "./Dashboard.css";

const WEEKDAY = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function formatDayLabel(dateStr) {
  const d = new Date(`${dateStr}T00:00:00`);
  return `${WEEKDAY[d.getDay()]} ${d.getMonth() + 1}/${d.getDate()}`;
}

function VisitorChart({ data }) {
  const [activeIndex, setActiveIndex] = useState(null);
  const max = Math.max(1, ...data.map((d) => d.visitors));

  return (
    <div className="chart-card">
      <h3 className="chart-title">Visitors — Last 14 Days</h3>
      <div className="bar-chart" role="img" aria-label="Daily visitors over the last 14 days">
        {data.map((d, i) => {
          const heightPct = Math.max(2, (d.visitors / max) * 100);
          return (
            <div
              key={d.date}
              className="bar-col"
              onMouseEnter={() => setActiveIndex(i)}
              onMouseLeave={() => setActiveIndex((cur) => (cur === i ? null : cur))}
            >
              {activeIndex === i && (
                <div className="bar-tooltip">
                  <strong>{d.visitors}</strong> visitor{d.visitors === 1 ? "" : "s"}
                  <div className="bar-tooltip-date">{formatDayLabel(d.date)}</div>
                </div>
              )}
              <div
                className={`bar${activeIndex === i ? " bar--active" : ""}`}
                style={{ height: `${heightPct}%` }}
              />
              <div className="bar-label">{formatDayLabel(d.date).split(" ")[0]}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TopList({ title, icon, items, emptyText }) {
  const max = Math.max(1, ...items.map((i) => i.count));

  return (
    <div className="top-list-card">
      <h3 className="chart-title">
        {icon} {title}
      </h3>

      {items.length === 0 ? (
        <p className="top-list-empty">{emptyText}</p>
      ) : (
        <ol className="top-list">
          {items.map((item, i) => (
            <li key={`${item.movieId}-${item.type}`} className="top-list-row">
              <span className="top-list-rank">{i + 1}</span>
              <div className="top-list-info">
                <div className="top-list-name">
                  {item.title || item.movieId}
                  <span className={`type-badge type-badge--${item.type}`}>{item.type}</span>
                </div>
                <div className="top-list-bar-track">
                  <div
                    className="top-list-bar-fill"
                    style={{ width: `${(item.count / max) * 100}%` }}
                  />
                </div>
              </div>
              <span className="top-list-count">{item.count}</span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function fetchStats() {
      try {
        setLoading(true);
        const { data } = await api.get("/analytics/dashboard");
        if (!cancelled) setStats(data);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
        if (!cancelled) setError("Couldn't load stats. Try refreshing.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchStats();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="dashboard-page">
        <p className="dashboard-status">Loading stats...</p>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="dashboard-page">
        <p className="dashboard-status dashboard-status--error">{error || "No data available."}</p>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <h1 className="dashboard-title">📊 Site Dashboard</h1>

      <div className="stat-tiles">
        <div className="stat-tile">
          <div className="stat-tile-value">{stats.totalVisitors.toLocaleString()}</div>
          <div className="stat-tile-label">Total Visitors</div>
        </div>
        <div className="stat-tile">
          <div className="stat-tile-value">{stats.todayVisitors.toLocaleString()}</div>
          <div className="stat-tile-label">Visitors Today</div>
        </div>
      </div>

      <VisitorChart data={stats.dailyVisitors} />

      <div className="top-lists">
        <TopList
          title="Top Picks Today"
          icon="🔥"
          items={stats.topToday}
          emptyText="No selections yet today."
        />
        <TopList
          title="All-Time Top Picks"
          icon="🏆"
          items={stats.topAllTime}
          emptyText="No selections recorded yet."
        />
      </div>
    </div>
  );
}
