import { useState } from "react";
import ICProfile from "./components/ICProfile";
import TeamSummary from "./components/TeamSummary";
import "./App.css";

export default function App() {
  const [view, setView] = useState("ic");

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-brand">
          <span className="header-icon">⚡</span>
          <span className="header-title">DevPulse</span>
          <span className="header-sub">Developer Productivity</span>
        </div>
        <nav className="header-nav">
          <button
            className={view === "ic" ? "nav-btn active" : "nav-btn"}
            onClick={() => setView("ic")}
          >
            My Profile
          </button>
          <button
            className={view === "team" ? "nav-btn active" : "nav-btn"}
            onClick={() => setView("team")}
          >
            Team Summary
          </button>
        </nav>
      </header>
      <main className="app-main">
        {view === "ic" ? <ICProfile /> : <TeamSummary />}
      </main>
    </div>
  );
}
