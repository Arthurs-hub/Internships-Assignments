"""
Demo script for video presentation
Shows both modules in action with clear output
"""

from backend.database.models import init_db
from backend.modules.category_generator import generate_category_and_tags
from backend.modules.b2b_proposal_generator import generate_b2b_proposal
import json

def demo():
    print("=" * 60)
    print("RAYEVA AI SYSTEMS - DEMO")
    print("=" * 60)
    
    # Initialize database
    print("\n[1] Initializing database...")
    init_db()
    print("✓ Database ready")
    
    # Demo Module 1
    print("\n" + "=" * 60)
    print("MODULE 1: AI Auto-Category & Tag Generator")
    print("=" * 60)
    
    products = [
        ("Bamboo Toothbrush", "Eco-friendly toothbrush made from sustainable bamboo"),
        ("Reusable Coffee Cup", "Insulated stainless steel cup for hot beverages")
    ]
    
    for product_name, description in products:
        print(f"\n📦 Product: {product_name}")
        print(f"Description: {description}")
        print("\n🤖 AI Processing...")
        
        result = generate_category_and_tags(product_name, description)
        
        print(f"\n✓ Results:")
        print(f"  Category: {result['primary_category']} > {result['sub_category']}")
        print(f"  Tags: {', '.join(result['tags'][:5])}")
        print(f"  Sustainability: {', '.join(result['sustainability_filters'])}")
        print(f"  Saved to DB with ID: {result['id']}")
    
    # Demo Module 2
    print("\n" + "=" * 60)
    print("MODULE 2: AI B2B Proposal Generator")
    print("=" * 60)
    
    proposals = [
        ("GreenCorp Ltd", 500, "Office supplies for 50 employees, focus on zero-waste"),
        ("EcoStart Inc", 1000, "Welcome kits for new employees, sustainable products")
    ]
    
    for client, budget, requirements in proposals:
        print(f"\n🏢 Client: {client}")
        print(f"💰 Budget: ${budget}")
        print(f"📋 Requirements: {requirements}")
        print("\n🤖 AI Processing...")
        
        result = generate_b2b_proposal(client, budget, requirements)
        
        print(f"\n✓ Proposal Generated:")
        print(f"  Products: {len(result['product_mix'])} items")
        print(f"  Total Cost: ${result['cost_breakdown']['total']}")
        print(f"  Impact: {result['impact_summary']}")
        print(f"  Saved to DB with ID: {result['id']}")
    
    print("\n" + "=" * 60)
    print("DEMO COMPLETE")
    print("=" * 60)
    print("\n✓ All AI interactions logged to database")
    print("✓ Structured JSON outputs stored")
    print("✓ Ready for production use")

if __name__ == "__main__":
    demo()
