@echo off
echo Starting DevPulse Backend on http://localhost:8000
cd /d %~dp0backend
python -m uvicorn main:app --reload --port 8000
