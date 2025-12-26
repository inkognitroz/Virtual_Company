"""WebSocket routes for chat and signaling."""
import json
from typing import Optional
from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Query, Depends
from sqlmodel import Session, select
from jose import jwt, JWTError
from contextlib import contextmanager
from backend.core.config import settings
from backend.db import get_session, User, Message, Room, Role, engine
from backend.websockets import chat_manager, signaling_manager
from backend.services import llm_service

router = APIRouter(tags=["websockets"])


@contextmanager
def get_db_session():
    """Context manager for database sessions."""
    session = Session(engine)
    try:
        yield session
    finally:
        session.close()


async def get_user_from_token(token: str, session: Session) -> Optional[User]:
    """Extract user from JWT token."""
    try:
        payload = jwt.decode(token, settings.secret_key, algorithms=[settings.algorithm])
        username: str = payload.get("sub")
        if username is None:
            return None
        
        statement = select(User).where(User.username == username)
        user = session.exec(statement).first()
        return user
    except JWTError:
        return None


@router.websocket("/ws/chat/{room_id}")
async def websocket_chat_endpoint(
    websocket: WebSocket,
    room_id: int,
    token: str = Query(...),
):
    """WebSocket endpoint for chat."""
    # Get database session with context manager
    with get_db_session() as session:
        # Authenticate user
        user = await get_user_from_token(token, session)
        if not user:
            await websocket.close(code=1008, reason="Unauthorized")
            return
        
        # Verify room exists
        room = session.get(Room, room_id)
        if not room:
            await websocket.close(code=1008, reason="Room not found")
            return
        
        # Connect to chat
        await chat_manager.connect(websocket, room_id)
        
        # Send join notification
        await chat_manager.broadcast_json({
            "type": "join",
            "user": user.username,
            "room_id": room_id
        }, room_id)
        
        try:
            # Handle messages
            while True:
                # Receive message
                data = await websocket.receive_text()
                message_data = json.loads(data)
                
                # Create new session for each message to avoid session issues
                with get_db_session() as msg_session:
                    # Save message to database
                    message = Message(
                        room_id=room_id,
                        user_id=user.id,
                        role_id=message_data.get("role_id"),
                        content=message_data.get("content"),
                        message_type=message_data.get("message_type", "text")
                    )
                    msg_session.add(message)
                    msg_session.commit()
                    msg_session.refresh(message)
                    
                    # Broadcast to room
                    await chat_manager.broadcast_json({
                        "type": "message",
                        "id": message.id,
                        "user": user.username,
                        "role_id": message.role_id,
                        "content": message.content,
                        "timestamp": message.timestamp.isoformat()
                    }, room_id)
                    
                    # If message is from a role with AI instructions, generate AI response
                    if message.role_id:
                        role = msg_session.get(Role, message.role_id)
                        if role and role.ai_instructions:
                            # Generate AI response
                            response = await llm_service.generate_response(
                                prompt=message.content,
                                model_name=message_data.get("model", "gpt-3.5-turbo"),
                                system_prompt=role.ai_instructions,
                                api_key=message_data.get("api_key")
                            )
                            
                            # Save AI response
                            ai_message = Message(
                                room_id=room_id,
                                user_id=user.id,
                                role_id=role.id,
                                content=response["content"],
                                message_type="ai_response"
                            )
                            msg_session.add(ai_message)
                            msg_session.commit()
                            msg_session.refresh(ai_message)
                            
                            # Broadcast AI response
                            await chat_manager.broadcast_json({
                                "type": "message",
                                "id": ai_message.id,
                                "user": role.name,
                                "role_id": role.id,
                                "content": ai_message.content,
                                "message_type": "ai_response",
                                "timestamp": ai_message.timestamp.isoformat()
                            }, room_id)
        
        except WebSocketDisconnect:
            chat_manager.disconnect(websocket, room_id)
            await chat_manager.broadcast_json({
                "type": "leave",
                "user": user.username,
                "room_id": room_id
            }, room_id)


@router.websocket("/ws/signaling/{room_id}")
async def websocket_signaling_endpoint(
    websocket: WebSocket,
    room_id: int,
    token: str = Query(...),
):
    """WebSocket endpoint for WebRTC signaling."""
    # Get database session with context manager
    with get_db_session() as session:
        # Authenticate user
        user = await get_user_from_token(token, session)
        if not user:
            await websocket.close(code=1008, reason="Unauthorized")
            return
        
        # Connect to signaling
        await signaling_manager.connect(websocket, room_id)
        
        try:
            # Handle signaling messages
            while True:
                data = await websocket.receive_text()
                message = json.loads(data)
                
                # Forward signaling messages to other peers
                await signaling_manager.send_to_others(message, websocket, room_id)
        
        except WebSocketDisconnect:
            signaling_manager.disconnect(websocket, room_id)
