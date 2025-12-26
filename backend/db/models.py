"""Database models using SQLModel."""
from datetime import datetime
from typing import Optional
from sqlmodel import Field, SQLModel, Relationship


class User(SQLModel, table=True):
    """User model."""
    id: Optional[int] = Field(default=None, primary_key=True)
    email: str = Field(unique=True, index=True)
    username: str = Field(unique=True, index=True)
    name: str
    hashed_password: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Relationships
    messages: list["Message"] = Relationship(back_populates="user")


class Role(SQLModel, table=True):
    """Role model for AI characters."""
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    name: str
    avatar: str
    description: Optional[str] = None
    ai_instructions: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)


class Room(SQLModel, table=True):
    """Chat room model."""
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    created_by: int = Field(foreign_key="user.id")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Relationships
    messages: list["Message"] = Relationship(back_populates="room")


class Message(SQLModel, table=True):
    """Chat message model."""
    id: Optional[int] = Field(default=None, primary_key=True)
    room_id: int = Field(foreign_key="room.id")
    user_id: int = Field(foreign_key="user.id")
    role_id: Optional[int] = Field(default=None, foreign_key="role.id")
    content: str
    message_type: str = Field(default="text")  # text, system, ai_response
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    
    # Relationships
    user: Optional[User] = Relationship(back_populates="messages")
    room: Optional[Room] = Relationship(back_populates="messages")


class APIKey(SQLModel, table=True):
    """User's API keys for LLM providers."""
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    provider: str  # openai, anthropic, openrouter, custom
    encrypted_key: str
    endpoint: Optional[str] = None  # For custom providers
    created_at: datetime = Field(default_factory=datetime.utcnow)
