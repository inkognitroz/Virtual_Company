#!/usr/bin/env python3
"""Simple test script to verify backend setup."""
import asyncio
import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.db import create_db_and_tables
from backend.core.config import settings


async def main():
    """Test basic backend functionality."""
    print("=" * 60)
    print("Virtual Company Backend - Setup Test")
    print("=" * 60)
    
    # Test configuration
    print("\n1. Testing Configuration...")
    print(f"   Database URL: {settings.database_url}")
    print(f"   Debug Mode: {settings.debug}")
    print(f"   Token Expiry: {settings.access_token_expire_minutes} minutes")
    print("   ✓ Configuration loaded")
    
    # Test database
    print("\n2. Testing Database...")
    try:
        create_db_and_tables()
        print("   ✓ Database tables created")
    except Exception as e:
        print(f"   ✗ Database error: {e}")
        return False
    
    # Test imports
    print("\n3. Testing Module Imports...")
    try:
        from backend.api import auth, roles, chat, llm, websocket
        from backend.services import llm_service
        from backend.websockets import chat_manager, signaling_manager
        print("   ✓ All modules imported successfully")
    except Exception as e:
        print(f"   ✗ Import error: {e}")
        return False
    
    # Test LLM service
    print("\n4. Testing LLM Service...")
    try:
        models = await llm_service.get_available_models()
        print(f"   ✓ Found {len(models)} available models")
        for model in models[:3]:
            print(f"     - {model['name']} ({model['provider']})")
    except Exception as e:
        print(f"   ✗ LLM service error: {e}")
        return False
    
    print("\n" + "=" * 60)
    print("✓ All tests passed! Backend is ready.")
    print("=" * 60)
    print("\nNext steps:")
    print("  1. Start the server: uvicorn main:app --reload")
    print("  2. Visit API docs: http://localhost:8000/docs")
    print("  3. Test health check: http://localhost:8000/health")
    print()
    
    return True


if __name__ == "__main__":
    result = asyncio.run(main())
    sys.exit(0 if result else 1)
