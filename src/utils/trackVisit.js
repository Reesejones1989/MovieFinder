import api from "../api/axios";

const STORAGE_KEY = "lastVisitDate";

// Pings the backend once per browser per calendar day. Deduped client-side
// via localStorage so we don't fire on every page navigation.
export function trackVisitOnce() {
  const today = new Date().toISOString().slice(0, 10);
  if (localStorage.getItem(STORAGE_KEY) === today) return;

  localStorage.setItem(STORAGE_KEY, today);
  api.post("/analytics/visit").catch(() => {});
}
