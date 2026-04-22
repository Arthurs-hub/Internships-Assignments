import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from "recharts";
import { useState } from "react";
import { useFetch } from "../hooks/useFetch";

function overallStatus(interpretation) {
  if (interpretation.some((i) => i.status === "warn")) return "warn";
  if (interpretation.some((i) => i.status === "ok"))   return "ok";
  return "good";
}

const STATUS_LABEL = { good: "Healthy", ok: "Watch", warn: "At Risk" };

export default function TeamSummary() {
  const [month, setMonth] = useState("2024-01");
  const { data, loading, error } = useFetch(`/team-summary?month=${month}`);

  if (loading) return <div className="loading">Loading team data…</div>;
  if (error)   return <div className="error">Backend not reachable. Start the API server.</div>;
  if (!data)   return null;

  const chartData = data.map((d) => ({
    name: d.name.split(" ")[0],
    "Lead Time": d.metrics.lead_time ?? 0,
    "Cycle Time": d.metrics.cycle_time ?? 0,
    "Bug Rate %": Math.round(d.metrics.bug_rate * 100),
    "Deploy Freq": d.metrics.deploy_frequency,
    "PR Throughput": d.metrics.pr_throughput,
  }));

  const monthLabel = month === "2024-01" ? "January 2024" : "February 2024";

  return (
    <>
      <div className="selector-row" style={{ marginBottom: 20 }}>
        <label>Month</label>
        <select value={month} onChange={(e) => setMonth(e.target.value)}>
          <option value="2024-01">Jan 2024</option>
          <option value="2024-02">Feb 2024</option>
        </select>
      </div>

      <div className="section-title" style={{ marginBottom: 20 }}>
        Team Overview — {monthLabel}
      </div>

      <div className="chart-section" style={{ marginBottom: 28 }}>
        <div className="section-title">Lead Time vs Cycle Time (days)</div>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={chartData} barCategoryGap="30%">
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="Lead Time"  fill="#6c63ff" radius={[4,4,0,0]} />
            <Bar dataKey="Cycle Time" fill="#22c55e" radius={[4,4,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-section" style={{ marginBottom: 28 }}>
        <div className="section-title">Deploy Frequency & PR Throughput</div>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={chartData} barCategoryGap="30%">
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="Deploy Freq"    fill="#f59e0b" radius={[4,4,0,0]} />
            <Bar dataKey="PR Throughput"  fill="#3b82f6" radius={[4,4,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-section" style={{ marginBottom: 28 }}>
        <div className="section-title">Bug Rate per Developer (%)</div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={chartData} barCategoryGap="30%">
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} unit="%" />
            <Tooltip formatter={(v) => [`${v}%`, "Bug Rate"]} />
            <Bar dataKey="Bug Rate %" fill="#ef4444" radius={[4,4,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="section-title" style={{ marginBottom: 12 }}>Developer Breakdown</div>
      <div className="team-table-wrap">
        <table className="team-table">
          <thead>
            <tr>
              <th>Developer</th>
              <th>Role</th>
              <th>Lead Time</th>
              <th>Cycle Time</th>
              <th>Bug Rate</th>
              <th>Deploys</th>
              <th>PRs</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {data.map((d) => {
              const s = overallStatus(d.interpretation);
              return (
                <tr key={d.dev_id}>
                  <td><strong>{d.name}</strong></td>
                  <td>{d.role}</td>
                  <td>{d.metrics.lead_time != null ? `${d.metrics.lead_time}d` : "—"}</td>
                  <td>{d.metrics.cycle_time != null ? `${d.metrics.cycle_time}d` : "—"}</td>
                  <td>{(d.metrics.bug_rate * 100).toFixed(0)}%</td>
                  <td>{d.metrics.deploy_frequency}</td>
                  <td>{d.metrics.pr_throughput}</td>
                  <td><span className={`badge ${s}`}>{STATUS_LABEL[s]}</span></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
