"""LLM API routes."""
from typing import List
from fastapi import APIRouter, Depends
from backend.core.security import get_current_user
from backend.db import User
from backend.models import ModelInfo
from backend.services import llm_service

router = APIRouter(prefix="/api/llm", tags=["llm"])


@router.get("/models", response_model=List[ModelInfo])
async def get_available_models(current_user: User = Depends(get_current_user)):
    """Get list of available LLM models."""
    models = await llm_service.get_available_models()
    return models
