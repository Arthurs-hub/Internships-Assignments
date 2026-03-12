from backend.database.models import init_db
from backend.modules.category_generator import generate_category_and_tags
from backend.modules.b2b_proposal_generator import generate_b2b_proposal
import json

def test_module_1():
    print("\n=== Testing Module 1: Category Generator ===")
    result = generate_category_and_tags(
        "Bamboo Toothbrush",
        "Eco-friendly toothbrush made from sustainable bamboo"
    )
    print(json.dumps(result, indent=2))

def test_module_2():
    print("\n=== Testing Module 2: B2B Proposal Generator ===")
    result = generate_b2b_proposal(
        "GreenCorp Ltd",
        500,
        "Office supplies for 50 employees, focus on zero-waste"
    )
    print(json.dumps(result, indent=2))

if __name__ == "__main__":
    init_db()
    test_module_1()
    test_module_2()
