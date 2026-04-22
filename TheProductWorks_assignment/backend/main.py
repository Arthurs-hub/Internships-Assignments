from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from metrics import get_developers, compute_metrics, compute_team_summary

app = FastAPI(title="Developer Productivity API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["GET"],
    allow_headers=["*"],
)


@app.get("/developers")
def list_developers():
    return get_developers()


@app.get("/metrics/{dev_id}")
def developer_metrics(dev_id: str, month: str = "2024-01"):
    result = compute_metrics(dev_id, month)
    if not result:
        raise HTTPException(status_code=404, detail="Developer not found")
    return result


@app.get("/team-summary")
def team_summary(month: str = "2024-01"):
    return compute_team_summary(month)
