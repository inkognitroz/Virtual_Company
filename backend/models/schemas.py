"""Pydantic models for API requests and responses."""
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr


# User schemas
class UserCreate(BaseModel):
    """User registration request."""
    email: EmailStr
    username: str
    name: str
    password: str


class UserLogin(BaseModel):
    """User login request."""
    username: str  # Can be username or email
    password: str


class UserRead(BaseModel):
    """User response."""
    id: int
    email: str
    username: str
    name: str
    created_at: datetime
    
    class Config:
        from_attributes = True


class Token(BaseModel):
    """Authentication token response."""
    access_token: str
    token_type: str


class TokenData(BaseModel):
    """Token payload data."""
    username: Optional[str] = None


# Role schemas
class RoleCreate(BaseModel):
    """Create role request."""
    name: str
    avatar: str
    description: Optional[str] = None
    ai_instructions: Optional[str] = None


class RoleRead(BaseModel):
    """Role response."""
    id: int
    user_id: int
    name: str
    avatar: str
    description: Optional[str]
    ai_instructions: Optional[str]
    created_at: datetime
    
    class Config:
        from_attributes = True


# Message schemas
class MessageCreate(BaseModel):
    """Create message request."""
    room_id: int
    content: str
    role_id: Optional[int] = None
    message_type: str = "text"


class MessageRead(BaseModel):
    """Message response."""
    id: int
    room_id: int
    user_id: int
    role_id: Optional[int]
    content: str
    message_type: str
    timestamp: datetime
    
    class Config:
        from_attributes = True


# Room schemas
class RoomCreate(BaseModel):
    """Create room request."""
    name: str


class RoomRead(BaseModel):
    """Room response."""
    id: int
    name: str
    created_by: int
    created_at: datetime
    
    class Config:
        from_attributes = True


# LLM schemas
class LLMRequest(BaseModel):
    """LLM generation request."""
    prompt: str
    model: str = "gpt-3.5-turbo"
    role_id: Optional[int] = None
    conversation_id: Optional[int] = None


class LLMResponse(BaseModel):
    """LLM generation response."""
    content: str
    model: str
    tokens_used: Optional[int] = None


class ModelInfo(BaseModel):
    """Available model information."""
    id: str
    name: str
    provider: str
    description: Optional[str] = None


# WebRTC schemas
class EphemeralTokenRequest(BaseModel):
    """Request for ephemeral token."""
    room_id: int


class EphemeralTokenResponse(BaseModel):
    """Ephemeral token response."""
    token: str
    expires_in: int


# WebSocket schemas
class WSMessage(BaseModel):
    """WebSocket message format."""
    type: str  # chat, join, leave, offer, answer, ice_candidate
    data: dict
