"""Metric calculations and interpretation logic for the 5 assignment metrics."""
import pandas as pd
from pathlib import Path

DATA_PATH = Path(__file__).parent / "data" / "productivity_data.xlsx"


def _load() -> dict[str, pd.DataFrame]:
    sheets = ["Developers", "Issues", "PullRequests", "Deployments", "Bugs"]
    return {s: pd.read_excel(DATA_PATH, sheet_name=s) for s in sheets}


def get_developers() -> list[dict]:
    df = _load()["Developers"]
    return df.to_dict(orient="records")


def compute_metrics(dev_id: str, month: str) -> dict:
    data = _load()
    devs = data["Developers"]
    dev_row = devs[devs["dev_id"] == dev_id]
    if dev_row.empty:
        return {}

    issues = data["Issues"]
    prs = data["PullRequests"]
    deployments = data["Deployments"]
    bugs = data["Bugs"]

    d_issues = issues[(issues["dev_id"] == dev_id) & (issues["month"] == month)]
    d_prs = prs[(prs["dev_id"] == dev_id) & (prs["month"] == month)]
    d_deps = deployments[
        (deployments["dev_id"] == dev_id)
        & (deployments["month"] == month)
        & (deployments["status"] == "success")
    ]
    d_bugs = bugs[(bugs["dev_id"] == dev_id) & (bugs["month"] == month)]

    # Lead Time: PR opened → production deploy (days)
    merged = d_prs[["pr_id", "opened_date"]].merge(
        d_deps[["pr_id", "deploy_date"]], on="pr_id", how="inner"
    )
    if not merged.empty:
        merged["lead_days"] = (
            pd.to_datetime(merged["deploy_date"])
            - pd.to_datetime(merged["opened_date"])
        ).dt.days
        lead_time = round(merged["lead_days"].mean(), 1)
    else:
        lead_time = None

    # Cycle Time: issue In Progress → Done (days)
    if not d_issues.empty:
        d_issues = d_issues.copy()
        d_issues["cycle_days"] = (
            pd.to_datetime(d_issues["done_date"])
            - pd.to_datetime(d_issues["in_progress_date"])
        ).dt.days
        cycle_time = round(d_issues["cycle_days"].mean(), 1)
    else:
        cycle_time = None

    # Bug Rate: escaped bugs / issues completed
    issues_done = len(d_issues)
    bug_count = len(d_bugs)
    bug_rate = round(bug_count / issues_done, 2) if issues_done > 0 else 0.0

    # Deployment Frequency
    deploy_freq = len(d_deps)

    # PR Throughput
    pr_throughput = len(d_prs)

    return {
        "dev_id": dev_id,
        "name": dev_row.iloc[0]["name"],
        "team": dev_row.iloc[0]["team"],
        "role": dev_row.iloc[0]["role"],
        "month": month,
        "metrics": {
            "lead_time": lead_time,
            "cycle_time": cycle_time,
            "bug_rate": bug_rate,
            "deploy_frequency": deploy_freq,
            "pr_throughput": pr_throughput,
        },
        "interpretation": _interpret(lead_time, cycle_time, bug_rate, deploy_freq, pr_throughput),
    }


def _interpret(lead_time, cycle_time, bug_rate, deploy_freq, pr_throughput) -> list[dict]:
    insights = []

    if lead_time is not None:
        if lead_time <= 3:
            insights.append({
                "metric": "Lead Time",
                "value": f"{lead_time}d",
                "status": "good",
                "story": "PRs reach production fast — review and CI pipeline are healthy.",
                "next_step": "Keep it up. Consider documenting what makes your flow fast.",
            })
        elif lead_time <= 7:
            insights.append({
                "metric": "Lead Time",
                "value": f"{lead_time}d",
                "status": "ok",
                "story": "Moderate lead time. Likely some review wait or staging queue.",
                "next_step": "Check if PRs sit waiting for review > 1 day. Smaller PRs help.",
            })
        else:
            insights.append({
                "metric": "Lead Time",
                "value": f"{lead_time}d",
                "status": "warn",
                "story": "Long lead time suggests review bottleneck or large PRs.",
                "next_step": "Break PRs into smaller units. Discuss review SLA with team.",
            })

    if cycle_time is not None:
        if cycle_time <= 5:
            insights.append({
                "metric": "Cycle Time",
                "value": f"{cycle_time}d",
                "status": "good",
                "story": "Issues move quickly from In Progress to Done.",
                "next_step": "Ensure tasks are well-scoped before starting.",
            })
        elif cycle_time <= 10:
            insights.append({
                "metric": "Cycle Time",
                "value": f"{cycle_time}d",
                "status": "ok",
                "story": "Average cycle time. Some tasks may be blocked or under-scoped.",
                "next_step": "Flag blockers early in standups. Split large issues.",
            })
        else:
            insights.append({
                "metric": "Cycle Time",
                "value": f"{cycle_time}d",
                "status": "warn",
                "story": "High cycle time — tasks take long to complete once started.",
                "next_step": "Investigate if issues are too large or if there are hidden dependencies.",
            })

    if bug_rate == 0:
        insights.append({
            "metric": "Bug Rate",
            "value": "0%",
            "status": "good",
            "story": "No escaped bugs this month. Strong quality signal.",
            "next_step": "Maintain test coverage. Don't skip edge-case testing.",
        })
    elif bug_rate <= 0.2:
        insights.append({
            "metric": "Bug Rate",
            "value": f"{bug_rate:.0%}",
            "status": "ok",
            "story": "Low bug rate. A few issues slipped through.",
            "next_step": "Review the escaped bugs — were they edge cases or missing tests?",
        })
    else:
        insights.append({
            "metric": "Bug Rate",
            "value": f"{bug_rate:.0%}",
            "status": "warn",
            "story": "High bug rate. Quality may be suffering under delivery pressure.",
            "next_step": "Add unit tests for recent features. Consider a pre-release checklist.",
        })

    if deploy_freq >= 4:
        insights.append({
            "metric": "Deploy Frequency",
            "value": str(deploy_freq),
            "status": "good",
            "story": "Frequent deployments — good CI/CD hygiene and small batch sizes.",
            "next_step": "Ensure monitoring is in place to catch issues post-deploy.",
        })
    elif deploy_freq >= 2:
        insights.append({
            "metric": "Deploy Frequency",
            "value": str(deploy_freq),
            "status": "ok",
            "story": "Moderate deployment cadence.",
            "next_step": "Look for opportunities to ship smaller changes more often.",
        })
    else:
        insights.append({
            "metric": "Deploy Frequency",
            "value": str(deploy_freq),
            "status": "warn",
            "story": "Infrequent deployments increase risk and delay feedback.",
            "next_step": "Identify what's blocking more frequent releases.",
        })

    if pr_throughput >= 4:
        insights.append({
            "metric": "PR Throughput",
            "value": str(pr_throughput),
            "status": "good",
            "story": "High PR throughput — consistent delivery pace.",
            "next_step": "Balance throughput with review quality.",
        })
    elif pr_throughput >= 2:
        insights.append({
            "metric": "PR Throughput",
            "value": str(pr_throughput),
            "status": "ok",
            "story": "Steady PR output.",
            "next_step": "Check if any PRs are stale or waiting too long for merge.",
        })
    else:
        insights.append({
            "metric": "PR Throughput",
            "value": str(pr_throughput),
            "status": "warn",
            "story": "Low PR throughput. Could indicate large PRs or blocked work.",
            "next_step": "Break work into smaller, reviewable chunks.",
        })

    return insights


def compute_team_summary(month: str) -> list[dict]:
    devs = get_developers()
    return [compute_metrics(d["dev_id"], month) for d in devs]
