import "./LoadingScreen.css";

export default function LoadingScreen() {
  return (
    <div className="loading-screen">
      <div className="spinner"></div>
      <h2>Loading your movie...</h2>
    </div>
  );
}