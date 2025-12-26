# Virtual Company Backend

FastAPI backend for the Virtual Company platform with LLM integration and WebRTC support.

## Features

- **Authentication**: JWT-based user authentication
- **Database**: SQLModel with PostgreSQL/SQLite support
- **LLM Integration**: Support for OpenAI, Anthropic, and OpenRouter
- **WebSocket**: Real-time chat and WebRTC signaling
- **CORS**: Configured for frontend integration

## Quick Start

### Local Development (SQLite)

1. **Create virtual environment**:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. **Install dependencies**:
```bash
pip install -r requirements.txt
```

3. **Create .env file**:
```bash
cp .env.example .env
# Edit .env and set your configuration
```

4. **Run the server**:
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

5. **Access the API**:
- API: http://localhost:8000
- Docs: http://localhost:8000/docs
- Health: http://localhost:8000/health

### Docker Development (PostgreSQL)

1. **Start services**:
```bash
docker-compose up -d
```

2. **View logs**:
```bash
docker-compose logs -f backend
```

3. **Stop services**:
```bash
docker-compose down
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login and get JWT token
- `GET /api/auth/me` - Get current user info

### Roles
- `POST /api/roles/` - Create new role
- `GET /api/roles/` - Get all roles
- `GET /api/roles/{id}` - Get specific role
- `DELETE /api/roles/{id}` - Delete role

### Rooms & Chat
- `POST /api/rooms/` - Create chat room
- `GET /api/rooms/` - Get all rooms
- `GET /api/rooms/{id}` - Get specific room
- `GET /api/rooms/{id}/messages` - Get room messages

### LLM
- `GET /api/llm/models` - Get available models

### WebSockets
- `WS /ws/chat/{room_id}?token={jwt}` - Chat WebSocket
- `WS /ws/signaling/{room_id}?token={jwt}` - WebRTC signaling

## Environment Variables

```env
# Database
DATABASE_URL=sqlite:///./virtual_company.db
# For PostgreSQL: postgresql://user:password@localhost/dbname

# Security
SECRET_KEY=your-secret-key-change-this-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# LLM Providers (optional)
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
OPENROUTER_API_KEY=sk-or-...

# Server
HOST=0.0.0.0
PORT=8000
DEBUG=True

# CORS
ALLOWED_ORIGINS=http://localhost:8000,https://inkognitroz.github.io
```

## Architecture

```
backend/
├── main.py              # FastAPI application entry point
├── core/
│   ├── config.py        # Configuration settings
│   └── security.py      # Authentication utilities
├── api/
│   ├── auth.py          # Authentication endpoints
│   ├── roles.py         # Role management endpoints
│   ├── chat.py          # Chat and room endpoints
│   ├── llm.py           # LLM endpoints
│   └── websocket.py     # WebSocket endpoints
├── db/
│   ├── database.py      # Database connection
│   └── models.py        # SQLModel database models
├── models/
│   └── schemas.py       # Pydantic request/response models
├── services/
│   └── llm_service.py   # LLM integration service
└── websockets/
    └── manager.py       # WebSocket connection managers
```

## WebSocket Usage

### Chat WebSocket

Connect to `/ws/chat/{room_id}?token={jwt_token}`

**Send message**:
```json
{
  "content": "Hello world",
  "role_id": 1,
  "message_type": "text",
  "model": "gpt-3.5-turbo",
  "api_key": "optional-api-key"
}
```

**Receive messages**:
```json
{
  "type": "message",
  "id": 123,
  "user": "username",
  "role_id": 1,
  "content": "Hello world",
  "timestamp": "2024-01-01T00:00:00"
}
```

### Signaling WebSocket

Connect to `/ws/signaling/{room_id}?token={jwt_token}`

**Send/Receive**:
```json
{
  "type": "offer" | "answer" | "ice_candidate",
  "data": { ... }
}
```

## LLM Integration

The backend supports multiple LLM providers:

1. **OpenAI** (gpt-3.5-turbo, gpt-4, etc.)
2. **Anthropic** (claude-3-opus, claude-3-sonnet, etc.)
3. **OpenRouter** (meta-llama, mistral, etc.)

Users can provide their own API keys via:
- Environment variables (server-wide)
- Message payload (per-request)

## Development

### Running Tests

```bash
# Install test dependencies
pip install pytest pytest-asyncio httpx

# Run tests
pytest
```

### Code Quality

```bash
# Format code
black .

# Lint
flake8 .

# Type checking
mypy .
```

## Deployment

### Railway / Render / Fly.io

1. Connect your GitHub repository
2. Set environment variables
3. Deploy from `backend` directory
4. Use PostgreSQL add-on for database

### Manual Deployment

1. **Build Docker image**:
```bash
docker build -t virtual-company-backend ./backend
```

2. **Run container**:
```bash
docker run -p 8000:8000 \
  -e DATABASE_URL=postgresql://... \
  -e SECRET_KEY=... \
  virtual-company-backend
```

## Security Considerations

- Change `SECRET_KEY` in production
- Use HTTPS for all connections
- Store API keys securely (environment variables)
- Enable rate limiting for LLM endpoints
- Implement proper access control for rooms
- Validate all user inputs

## Troubleshooting

**Database connection errors**:
- Check DATABASE_URL format
- Ensure PostgreSQL is running (if using)
- Verify connection credentials

**WebSocket connection fails**:
- Verify JWT token is valid
- Check CORS settings
- Ensure room_id exists

**LLM API errors**:
- Verify API keys are set correctly
- Check rate limits with provider
- Review error messages in logs

## License

MIT License - See LICENSE file for details
