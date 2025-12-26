"""Roles API routes."""
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from backend.core.security import get_current_user
from backend.db import get_session, User, Role
from backend.models import RoleCreate, RoleRead

router = APIRouter(prefix="/api/roles", tags=["roles"])


@router.post("/", response_model=RoleRead, status_code=status.HTTP_201_CREATED)
async def create_role(
    role_data: RoleCreate,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """Create a new role."""
    role = Role(
        user_id=current_user.id,
        name=role_data.name,
        avatar=role_data.avatar,
        description=role_data.description,
        ai_instructions=role_data.ai_instructions
    )
    
    session.add(role)
    session.commit()
    session.refresh(role)
    
    return role


@router.get("/", response_model=List[RoleRead])
async def get_roles(
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """Get all roles for current user."""
    statement = select(Role).where(Role.user_id == current_user.id)
    roles = session.exec(statement).all()
    return roles


@router.get("/{role_id}", response_model=RoleRead)
async def get_role(
    role_id: int,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """Get a specific role."""
    statement = select(Role).where(
        (Role.id == role_id) & (Role.user_id == current_user.id)
    )
    role = session.exec(statement).first()
    
    if not role:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Role not found"
        )
    
    return role


@router.delete("/{role_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_role(
    role_id: int,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """Delete a role."""
    statement = select(Role).where(
        (Role.id == role_id) & (Role.user_id == current_user.id)
    )
    role = session.exec(statement).first()
    
    if not role:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Role not found"
        )
    
    session.delete(role)
    session.commit()
    
    return None
