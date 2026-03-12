from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from backend.database.models import init_db
from backend.modules.category_generator import generate_category_and_tags
from backend.modules.b2b_proposal_generator import generate_b2b_proposal

app = FastAPI(title="Rayeva AI Systems")

@app.on_event("startup")
def startup():
    init_db()

class CategoryRequest(BaseModel):
    product_name: str
    product_description: str = ""

class ProposalRequest(BaseModel):
    client_name: str
    budget: float
    requirements: str = ""

@app.post("/api/category/generate")
async def create_category(request: CategoryRequest):
    try:
        result = generate_category_and_tags(request.product_name, request.product_description)
        return {"success": True, "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/proposal/generate")
async def create_proposal(request: ProposalRequest):
    try:
        result = generate_b2b_proposal(request.client_name, request.budget, request.requirements)
        return {"success": True, "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
async def root():
    return {"message": "Rayeva AI Systems API", "modules": ["category_generator", "b2b_proposal_generator"]}
