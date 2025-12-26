"""WebSocket connection manager."""
from typing import Dict, List
from fastapi import WebSocket


class ConnectionManager:
    """Manages WebSocket connections for chat rooms."""
    
    def __init__(self):
        # Dictionary of room_id -> list of WebSocket connections
        self.active_connections: Dict[int, List[WebSocket]] = {}
    
    async def connect(self, websocket: WebSocket, room_id: int):
        """Accept and register a WebSocket connection."""
        await websocket.accept()
        if room_id not in self.active_connections:
            self.active_connections[room_id] = []
        self.active_connections[room_id].append(websocket)
    
    def disconnect(self, websocket: WebSocket, room_id: int):
        """Remove a WebSocket connection."""
        if room_id in self.active_connections:
            if websocket in self.active_connections[room_id]:
                self.active_connections[room_id].remove(websocket)
            # Clean up empty rooms
            if not self.active_connections[room_id]:
                del self.active_connections[room_id]
    
    async def send_personal_message(self, message: str, websocket: WebSocket):
        """Send message to specific connection."""
        await websocket.send_text(message)
    
    async def broadcast(self, message: str, room_id: int):
        """Broadcast message to all connections in a room."""
        if room_id in self.active_connections:
            for connection in self.active_connections[room_id]:
                await connection.send_text(message)
    
    async def broadcast_json(self, data: dict, room_id: int):
        """Broadcast JSON data to all connections in a room."""
        if room_id in self.active_connections:
            for connection in self.active_connections[room_id]:
                await connection.send_json(data)


class SignalingManager:
    """Manages WebRTC signaling connections."""
    
    def __init__(self):
        # Dictionary of room_id -> list of WebSocket connections
        self.signaling_connections: Dict[int, List[WebSocket]] = {}
    
    async def connect(self, websocket: WebSocket, room_id: int):
        """Accept and register a signaling connection."""
        await websocket.accept()
        if room_id not in self.signaling_connections:
            self.signaling_connections[room_id] = []
        self.signaling_connections[room_id].append(websocket)
    
    def disconnect(self, websocket: WebSocket, room_id: int):
        """Remove a signaling connection."""
        if room_id in self.signaling_connections:
            if websocket in self.signaling_connections[room_id]:
                self.signaling_connections[room_id].remove(websocket)
            if not self.signaling_connections[room_id]:
                del self.signaling_connections[room_id]
    
    async def send_to_others(self, message: dict, websocket: WebSocket, room_id: int):
        """Send message to all other connections in the room."""
        if room_id in self.signaling_connections:
            for connection in self.signaling_connections[room_id]:
                if connection != websocket:
                    await connection.send_json(message)


# Global instances
chat_manager = ConnectionManager()
signaling_manager = SignalingManager()
