import { useState } from "react";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip,
} from "recharts";
import { useFetch } from "../hooks/useFetch";

const METRIC_UNITS = {
  lead_time: "days avg",
  cycle_time: "days avg",
  bug_rate: "ratio",
  deploy_frequency: "deploys",
  pr_throughput: "PRs",
};

const METRIC_LABELS = {
  lead_time: "Lead Time",
  cycle_time: "Cycle Time",
  bug_rate: "Bug Rate",
  deploy_frequency: "Deploy Freq",
  pr_throughput: "PR Throughput",
};

function statusFromInsight(insights, metricLabel) {
  const found = insights.find((i) => i.metric === metricLabel);
  return found ? found.status : "ok";
}

function radarData(metrics, insights) {
  const scoreMap = { good: 100, ok: 60, warn: 25 };
  return [
    { metric: "Lead Time",    score: scoreMap[statusFromInsight(insights, "Lead Time")] },
    { metric: "Cycle Time",   score: scoreMap[statusFromInsight(insights, "Cycle Time")] },
    { metric: "Bug Rate",     score: scoreMap[statusFromInsight(insights, "Bug Rate")] },
    { metric: "Deploy Freq",  score: scoreMap[statusFromInsight(insights, "Deploy Frequency")] },
    { metric: "PR Throughput",score: scoreMap[statusFromInsight(insights, "PR Throughput")] },
  ];
}

export default function ICProfile() {
  const { data: devs } = useFetch("/developers");
  const [devId, setDevId] = useState("D001");
  const [month, setMonth] = useState("2024-01");
  const { data, loading, error } = useFetch(`/metrics/${devId}?month=${month}`);

  if (loading) return <div className="loading">Loading metrics…</div>;
  if (error)   return <div className="error">Backend not reachable. Start the API server.</div>;
  if (!data)   return null;

  const { name, team, role, metrics, interpretation } = data;
  const initials = name.split(" ").map((w) => w[0]).join("");

  return (
    <>
      <div className="selector-row">
        <label>Developer</label>
        <select value={devId} onChange={(e) => setDevId(e.target.value)}>
          {(devs || []).map((d) => (
            <option key={d.dev_id} value={d.dev_id}>
              {d.name} — {d.role}
            </option>
          ))}
        </select>
        <label>Month</label>
        <select value={month} onChange={(e) => setMonth(e.target.value)}>
          <option value="2024-01">Jan 2024</option>
          <option value="2024-02">Feb 2024</option>
        </select>
      </div>

      <div className="profile-header">
        <div className="profile-avatar">{initials}</div>
        <div>
          <div className="profile-name">{name}</div>
          <div className="profile-meta">{role} · {team} Team</div>
        </div>
        <div className="profile-month">📅 {data.month}</div>
      </div>

      <div className="metrics-grid">
        {Object.entries(metrics).map(([key, val]) => {
          const label = METRIC_LABELS[key];
          const status = statusFromInsight(interpretation, label);
          const display = key === "bug_rate"
            ? `${(val * 100).toFixed(0)}%`
            : val ?? "—";
          return (
            <div key={key} className={`metric-card ${status}`}>
              <div className="metric-label">
                <span className={`status-dot ${status}`} />
                {label}
              </div>
              <div className="metric-value">{display}</div>
              <div className="metric-unit">{METRIC_UNITS[key]}</div>
            </div>
          );
        })}
      </div>

      <div className="chart-section" style={{ marginBottom: 28 }}>
        <div className="section-title">Health Radar</div>
        <ResponsiveContainer width="100%" height={240}>
          <RadarChart data={radarData(metrics, interpretation)}>
            <PolarGrid stroke="#e5e7eb" />
            <PolarAngleAxis dataKey="metric" tick={{ fontSize: 12, fill: "#555" }} />
            <Radar
              dataKey="score"
              stroke="#6c63ff"
              fill="#6c63ff"
              fillOpacity={0.25}
              strokeWidth={2}
            />
            <Tooltip formatter={(v) => [`${v}/100`, "Health Score"]} />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <div className="section-title">What the metrics are telling you</div>
      <div className="insights-list">
        {interpretation.map((ins) => (
          <div key={ins.metric} className={`insight-card ${ins.status}`}>
            <div>
              <div className="insight-metric-name">{ins.metric}</div>
              <div className={`insight-value ${ins.status}`}>{ins.value}</div>
            </div>
            <div>
              <div className="insight-story-label">Story</div>
              <div className="insight-story-text">{ins.story}</div>
            </div>
            <div>
              <div className="insight-next-label">Next Step</div>
              <div className="insight-next-text">→ {ins.next_step}</div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
