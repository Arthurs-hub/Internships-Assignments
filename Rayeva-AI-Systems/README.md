# Rayeva AI Systems - Sustainable Commerce AI Platform

## Overview
Production-ready AI modules for sustainable commerce: automated product categorization and B2B proposal generation with structured outputs, database persistence, and comprehensive logging.

## Implemented Modules

### Module 1: AI Auto-Category & Tag Generator
Automatically categorizes products and generates SEO-optimized tags with sustainability filters.

**Features:**
- Primary category assignment from predefined list
- Sub-category suggestions
- 5-10 SEO tags generation
- Sustainability filter detection (plastic-free, compostable, vegan, recycled, etc.)
- Structured JSON output with database persistence

**API Endpoint:** `POST /api/category/generate`

**Request:**
```json
{
  "product_name": "Bamboo Toothbrush",
  "product_description": "Eco-friendly toothbrush made from sustainable bamboo"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "primary_category": "Personal Care",
    "sub_category": "Oral Care",
    "tags": ["bamboo", "eco-friendly", "sustainable", "toothbrush", "zero-waste"],
    "sustainability_filters": ["plastic-free", "biodegradable", "vegan"]
  }
}
```

### Module 2: AI B2B Proposal Generator
Creates customized B2B proposals with product recommendations and budget optimization.

**Features:**
- Sustainable product mix suggestions
- Budget allocation within limits
- Detailed cost breakdown
- Impact positioning summary
- Structured JSON output with database storage

**API Endpoint:** `POST /api/proposal/generate`

**Request:**
```json
{
  "client_name": "GreenCorp Ltd",
  "budget": 500,
  "requirements": "Office supplies for 50 employees, focus on zero-waste"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "product_mix": [
      {"product": "Recycled Paper Notebooks", "quantity": 20, "subtotal": 240},
      {"product": "Bamboo Cutlery Set", "quantity": 10, "subtotal": 150}
    ],
    "budget_allocation": {"office": 240, "sustainable": 150},
    "cost_breakdown": {"subtotal": 390, "tax": 31.2, "total": 421.2},
    "impact_summary": "Saves 15kg plastic, supports local sourcing"
  }
}
```

## Architecture

### Project Structure
```
rayeva-ai-systems/
├── backend/
│   ├── config.py              # Environment configuration
│   ├── database/
│   │   └── models.py          # SQLAlchemy models
│   ├── modules/
│   │   ├── category_generator.py
│   │   └── b2b_proposal_generator.py
│   └── utils/
│       └── logger.py          # AI interaction logging
├── main.py                    # FastAPI application
├── test_modules.py            # Testing script
├── requirements.txt
├── .env.example
└── README.md
```

### Design Principles

**1. Separation of Concerns**
- AI logic isolated in module files
- Business logic separated from API layer
- Database operations abstracted in models

**2. Structured Outputs**
- All AI responses parsed to JSON
- Validated against business requirements
- Stored in relational database

**3. Logging & Observability**
- Every AI interaction logged (prompt + response)
- Timestamped entries for audit trail
- Separate table for AI logs

**4. Environment-Based Configuration**
- API keys managed via .env
- No hardcoded credentials
- Easy deployment across environments

## AI Prompt Design

### Category Generator Prompt Strategy
- **Constraint-based**: Provides predefined category list to ensure consistency
- **Multi-output**: Requests multiple fields in single call for efficiency
- **Format enforcement**: Explicitly requests JSON-only response
- **Context-aware**: Uses product name + description for accurate categorization

### B2B Proposal Prompt Strategy
- **Budget-constrained**: Enforces budget limits in prompt
- **Product catalog grounding**: Provides real product data to prevent hallucination
- **Structured requirements**: Breaks down output into specific components
- **Business-focused**: Emphasizes sustainability impact for value proposition

## Installation

1. Clone repository:
```bash
git clone <repository-url>
cd rayeva-ai-systems
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Configure environment:
```bash
copy .env.example .env
# Edit .env and add your OPENAI_API_KEY
```

4. Run application:
```bash
uvicorn main:app --reload
```

5. Test modules:
```bash
python test_modules.py
```

## API Documentation
Access interactive API docs at: `http://localhost:8000/docs`

## Database Schema

**product_categories**
- id, product_name, primary_category, sub_category, tags, sustainability_filters, created_at

**b2b_proposals**
- id, client_name, budget, product_mix, cost_breakdown, impact_summary, created_at

**ai_logs**
- id, module, prompt, response, created_at

## Future Modules (Architecture Outline)

### Module 3: AI Impact Reporting Generator
- Calculate plastic saved based on product materials
- Estimate carbon footprint reduction
- Generate human-readable impact statements
- Store with order records

### Module 4: AI WhatsApp Support Bot
- Query order status from database
- Answer policy questions using RAG
- Escalation logic for refunds
- Conversation logging

## Technical Stack
- **Framework:** FastAPI
- **AI:** Mock implementation (keyword-based logic for demo)
- **Database:** SQLAlchemy + SQLite
- **Validation:** Pydantic

**Note:** Current implementation uses mock AI logic for demonstration purposes. Can be easily switched to real OpenAI API by uncommenting the API calls in module files.

## Error Handling
- Try-catch blocks around AI calls
- HTTP exception handling in API layer
- Database transaction rollback on failure
- Graceful degradation

## Security
- Environment-based API key management
- No credentials in code
- Input validation via Pydantic
- SQL injection prevention via ORM

## Performance Considerations
- Single AI call per request
- Database connection pooling
- Async API endpoints
- Efficient JSON parsing

## Testing
Run test script to verify both modules:
```bash
python test_modules.py
```

## Deployment
1. Set production environment variables
2. Use production-grade database (PostgreSQL)
3. Add rate limiting
4. Implement caching for common queries
5. Monitor AI costs and latency

## License
MIT

## Contact
For questions or support, contact the development team.
