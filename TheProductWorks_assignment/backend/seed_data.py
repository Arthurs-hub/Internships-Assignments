"""Generate sample Excel data matching the assignment workbook structure."""
import pandas as pd
from pathlib import Path

DATA_DIR = Path(__file__).parent / "data"
DATA_DIR.mkdir(exist_ok=True)

developers = pd.DataFrame([
    {"dev_id": "D001", "name": "Alice Chen",   "team": "Platform", "role": "Senior SWE"},
    {"dev_id": "D002", "name": "Bob Sharma",   "team": "Platform", "role": "SWE"},
    {"dev_id": "D003", "name": "Carol Lima",   "team": "Growth",   "role": "SWE"},
    {"dev_id": "D004", "name": "David Park",   "team": "Growth",   "role": "Junior SWE"},
    {"dev_id": "D005", "name": "Eva Müller",   "team": "Infra",    "role": "Senior SWE"},
])

issues = pd.DataFrame([
    # dev, issue_id, type, in_progress_date, done_date, month
    ("D001","J-101","feature","2024-01-03","2024-01-08","2024-01"),
    ("D001","J-102","feature","2024-01-10","2024-01-14","2024-01"),
    ("D001","J-103","feature","2024-01-15","2024-01-22","2024-01"),
    ("D001","J-104","bug",    "2024-01-23","2024-01-25","2024-01"),
    ("D002","J-201","feature","2024-01-02","2024-01-12","2024-01"),
    ("D002","J-202","feature","2024-01-13","2024-01-28","2024-01"),
    ("D003","J-301","feature","2024-01-05","2024-01-09","2024-01"),
    ("D003","J-302","feature","2024-01-10","2024-01-20","2024-01"),
    ("D003","J-303","feature","2024-01-21","2024-01-30","2024-01"),
    ("D004","J-401","feature","2024-01-07","2024-01-18","2024-01"),
    ("D004","J-402","feature","2024-01-20","2024-01-31","2024-01"),
    ("D005","J-501","feature","2024-01-01","2024-01-06","2024-01"),
    ("D005","J-502","feature","2024-01-07","2024-01-11","2024-01"),
    ("D005","J-503","feature","2024-01-12","2024-01-16","2024-01"),
    ("D005","J-504","feature","2024-01-17","2024-01-21","2024-01"),
    ("D005","J-505","feature","2024-01-22","2024-01-26","2024-01"),
], columns=["dev_id","issue_id","type","in_progress_date","done_date","month"])

prs = pd.DataFrame([
    # dev, pr_id, opened_date, merged_date, month
    ("D001","PR-101","2024-01-03","2024-01-05","2024-01"),
    ("D001","PR-102","2024-01-10","2024-01-13","2024-01"),
    ("D001","PR-103","2024-01-15","2024-01-19","2024-01"),
    ("D001","PR-104","2024-01-23","2024-01-24","2024-01"),
    ("D002","PR-201","2024-01-02","2024-01-09","2024-01"),
    ("D002","PR-202","2024-01-13","2024-01-22","2024-01"),
    ("D003","PR-301","2024-01-05","2024-01-07","2024-01"),
    ("D003","PR-302","2024-01-10","2024-01-15","2024-01"),
    ("D003","PR-303","2024-01-21","2024-01-27","2024-01"),
    ("D004","PR-401","2024-01-07","2024-01-16","2024-01"),
    ("D004","PR-402","2024-01-20","2024-01-29","2024-01"),
    ("D005","PR-501","2024-01-01","2024-01-03","2024-01"),
    ("D005","PR-502","2024-01-07","2024-01-09","2024-01"),
    ("D005","PR-503","2024-01-12","2024-01-14","2024-01"),
    ("D005","PR-504","2024-01-17","2024-01-19","2024-01"),
    ("D005","PR-505","2024-01-22","2024-01-24","2024-01"),
], columns=["dev_id","pr_id","opened_date","merged_date","month"])

deployments = pd.DataFrame([
    # dev, deploy_id, pr_id, deploy_date, status, month
    ("D001","DEP-101","PR-101","2024-01-06","success","2024-01"),
    ("D001","DEP-102","PR-102","2024-01-14","success","2024-01"),
    ("D001","DEP-103","PR-103","2024-01-20","success","2024-01"),
    ("D001","DEP-104","PR-104","2024-01-25","success","2024-01"),
    ("D002","DEP-201","PR-201","2024-01-10","success","2024-01"),
    ("D002","DEP-202","PR-202","2024-01-24","success","2024-01"),
    ("D003","DEP-301","PR-301","2024-01-08","success","2024-01"),
    ("D003","DEP-302","PR-302","2024-01-17","success","2024-01"),
    ("D003","DEP-303","PR-303","2024-01-29","success","2024-01"),
    ("D004","DEP-401","PR-401","2024-01-18","success","2024-01"),
    ("D004","DEP-402","PR-402","2024-01-31","success","2024-01"),
    ("D005","DEP-501","PR-501","2024-01-04","success","2024-01"),
    ("D005","DEP-502","PR-502","2024-01-10","success","2024-01"),
    ("D005","DEP-503","PR-503","2024-01-15","success","2024-01"),
    ("D005","DEP-504","PR-504","2024-01-20","success","2024-01"),
    ("D005","DEP-505","PR-505","2024-01-25","success","2024-01"),
], columns=["dev_id","deploy_id","pr_id","deploy_date","status","month"])

bugs = pd.DataFrame([
    # dev, bug_id, found_date, month
    ("D001","BUG-101","2024-01-28","2024-01"),
    ("D002","BUG-201","2024-01-26","2024-01"),
    ("D002","BUG-202","2024-01-29","2024-01"),
    ("D004","BUG-401","2024-01-30","2024-01"),
    ("D004","BUG-402","2024-01-31","2024-01"),
    ("D004","BUG-403","2024-01-31","2024-01"),
], columns=["dev_id","bug_id","found_date","month"])

# February 2024 data
issues_feb = pd.DataFrame([
    ("D001","J-111","feature","2024-02-01","2024-02-05","2024-02"),
    ("D001","J-112","feature","2024-02-06","2024-02-12","2024-02"),
    ("D001","J-113","bug",    "2024-02-13","2024-02-15","2024-02"),
    ("D002","J-211","feature","2024-02-01","2024-02-14","2024-02"),
    ("D002","J-212","feature","2024-02-15","2024-02-26","2024-02"),
    ("D003","J-311","feature","2024-02-02","2024-02-07","2024-02"),
    ("D003","J-312","feature","2024-02-08","2024-02-18","2024-02"),
    ("D004","J-411","feature","2024-02-05","2024-02-20","2024-02"),
    ("D005","J-511","feature","2024-02-01","2024-02-04","2024-02"),
    ("D005","J-512","feature","2024-02-05","2024-02-09","2024-02"),
    ("D005","J-513","feature","2024-02-10","2024-02-14","2024-02"),
    ("D005","J-514","feature","2024-02-15","2024-02-19","2024-02"),
], columns=["dev_id","issue_id","type","in_progress_date","done_date","month"])

prs_feb = pd.DataFrame([
    ("D001","PR-111","2024-02-01","2024-02-03","2024-02"),
    ("D001","PR-112","2024-02-06","2024-02-10","2024-02"),
    ("D001","PR-113","2024-02-13","2024-02-14","2024-02"),
    ("D002","PR-211","2024-02-01","2024-02-11","2024-02"),
    ("D002","PR-212","2024-02-15","2024-02-24","2024-02"),
    ("D003","PR-311","2024-02-02","2024-02-05","2024-02"),
    ("D003","PR-312","2024-02-08","2024-02-14","2024-02"),
    ("D004","PR-411","2024-02-05","2024-02-17","2024-02"),
    ("D005","PR-511","2024-02-01","2024-02-02","2024-02"),
    ("D005","PR-512","2024-02-05","2024-02-07","2024-02"),
    ("D005","PR-513","2024-02-10","2024-02-12","2024-02"),
    ("D005","PR-514","2024-02-15","2024-02-17","2024-02"),
], columns=["dev_id","pr_id","opened_date","merged_date","month"])

deployments_feb = pd.DataFrame([
    ("D001","DEP-111","PR-111","2024-02-04","success","2024-02"),
    ("D001","DEP-112","PR-112","2024-02-11","success","2024-02"),
    ("D001","DEP-113","PR-113","2024-02-15","success","2024-02"),
    ("D002","DEP-211","PR-211","2024-02-13","success","2024-02"),
    ("D002","DEP-212","PR-212","2024-02-26","success","2024-02"),
    ("D003","DEP-311","PR-311","2024-02-06","success","2024-02"),
    ("D003","DEP-312","PR-312","2024-02-16","success","2024-02"),
    ("D004","DEP-411","PR-411","2024-02-19","success","2024-02"),
    ("D005","DEP-511","PR-511","2024-02-03","success","2024-02"),
    ("D005","DEP-512","PR-512","2024-02-08","success","2024-02"),
    ("D005","DEP-513","PR-513","2024-02-13","success","2024-02"),
    ("D005","DEP-514","PR-514","2024-02-18","success","2024-02"),
], columns=["dev_id","deploy_id","pr_id","deploy_date","status","month"])

bugs_feb = pd.DataFrame([
    ("D002","BUG-211","2024-02-20","2024-02"),
    ("D004","BUG-411","2024-02-22","2024-02"),
    ("D004","BUG-412","2024-02-25","2024-02"),
], columns=["dev_id","bug_id","found_date","month"])

issues_all = pd.concat([issues, issues_feb], ignore_index=True)
prs_all = pd.concat([prs, prs_feb], ignore_index=True)
deployments_all = pd.concat([deployments, deployments_feb], ignore_index=True)
bugs_all = pd.concat([bugs, bugs_feb], ignore_index=True)

with pd.ExcelWriter(DATA_DIR / "productivity_data.xlsx") as writer:
    developers.to_excel(writer, sheet_name="Developers", index=False)
    issues_all.to_excel(writer, sheet_name="Issues", index=False)
    prs_all.to_excel(writer, sheet_name="PullRequests", index=False)
    deployments_all.to_excel(writer, sheet_name="Deployments", index=False)
    bugs_all.to_excel(writer, sheet_name="Bugs", index=False)

print("Data generated at", DATA_DIR / "productivity_data.xlsx")
