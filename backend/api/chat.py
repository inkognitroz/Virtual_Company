"""Chat and rooms API routes."""
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from backend.core.security import get_current_user
from backend.db import get_session, User, Room, Message
from backend.models import RoomCreate, RoomRead, MessageRead

router = APIRouter(prefix="/api/rooms", tags=["rooms"])


@router.post("/", response_model=RoomRead, status_code=status.HTTP_201_CREATED)
async def create_room(
    room_data: RoomCreate,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """Create a new chat room."""
    room = Room(
        name=room_data.name,
        created_by=current_user.id
    )
    
    session.add(room)
    session.commit()
    session.refresh(room)
    
    return room


@router.get("/", response_model=List[RoomRead])
async def get_rooms(
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """Get all rooms for current user."""
    statement = select(Room).where(Room.created_by == current_user.id)
    rooms = session.exec(statement).all()
    return rooms


@router.get("/{room_id}", response_model=RoomRead)
async def get_room(
    room_id: int,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """Get a specific room."""
    statement = select(Room).where(Room.id == room_id)
    room = session.exec(statement).first()
    
    if not room:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Room not found"
        )
    
    return room


@router.get("/{room_id}/messages", response_model=List[MessageRead])
async def get_room_messages(
    room_id: int,
    limit: int = 100,
    offset: int = 0,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """Get messages for a room."""
    # Verify room exists
    room = session.get(Room, room_id)
    if not room:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Room not found"
        )
    
    # Get messages
    statement = (
        select(Message)
        .where(Message.room_id == room_id)
        .order_by(Message.timestamp.desc())
        .offset(offset)
        .limit(limit)
    )
    messages = session.exec(statement).all()
    
    # Return in chronological order
    return list(reversed(messages))
