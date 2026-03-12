# API Testing Examples

## Start the server
uvicorn main:app --reload

## Test Module 1: Category Generator

curl -X POST "http://localhost:8000/api/category/generate" \
  -H "Content-Type: application/json" \
  -d "{\"product_name\": \"Bamboo Toothbrush\", \"product_description\": \"Eco-friendly toothbrush made from sustainable bamboo\"}"

curl -X POST "http://localhost:8000/api/category/generate" \
  -H "Content-Type: application/json" \
  -d "{\"product_name\": \"Organic Cotton T-Shirt\", \"product_description\": \"100% organic cotton, fair trade certified\"}"

## Test Module 2: B2B Proposal Generator

curl -X POST "http://localhost:8000/api/proposal/generate" \
  -H "Content-Type: application/json" \
  -d "{\"client_name\": \"GreenCorp Ltd\", \"budget\": 500, \"requirements\": \"Office supplies for 50 employees\"}"

curl -X POST "http://localhost:8000/api/proposal/generate" \
  -H "Content-Type: application/json" \
  -d "{\"client_name\": \"EcoStart Inc\", \"budget\": 1000, \"requirements\": \"Welcome kits for new employees\"}"

## Check API status
curl http://localhost:8000/
