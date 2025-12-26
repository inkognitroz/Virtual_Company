#!/bin/bash
# Quick start script for Virtual Company backend

set -e

echo "=========================================="
echo "Virtual Company Backend - Quick Start"
echo "=========================================="
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.8 or higher."
    exit 1
fi

echo "✓ Python 3 found: $(python3 --version)"

# Navigate to backend directory
cd "$(dirname "$0")/backend"

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo ""
    echo "Creating virtual environment..."
    python3 -m venv venv
    echo "✓ Virtual environment created"
fi

# Activate virtual environment
echo ""
echo "Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo ""
echo "Installing dependencies..."
pip install -q --upgrade pip
pip install -q -r requirements.txt
echo "✓ Dependencies installed"

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    echo ""
    echo "Creating .env file..."
    cp .env.example .env
    
    # Generate random secret key
    SECRET_KEY=$(python3 -c "import secrets; print(secrets.token_urlsafe(32))")
    
    # Update .env with generated secret key
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        sed -i '' "s/your-secret-key-change-this-in-production/$SECRET_KEY/" .env
    else
        # Linux
        sed -i "s/your-secret-key-change-this-in-production/$SECRET_KEY/" .env
    fi
    
    echo "✓ .env file created with random SECRET_KEY"
    echo ""
    echo "⚠️  Please edit backend/.env to configure:"
    echo "   - LLM API keys (OPENAI_API_KEY, ANTHROPIC_API_KEY, etc.)"
    echo "   - Database URL (if using PostgreSQL)"
    echo "   - Allowed origins for CORS"
fi

# Run setup test
echo ""
echo "Running setup test..."
python3 test_setup.py 2>&1 | grep -v "INFO sqlalchemy"

echo ""
echo "=========================================="
echo "✓ Backend setup complete!"
echo "=========================================="
echo ""
echo "To start the server, run:"
echo "  cd backend"
echo "  source venv/bin/activate"
echo "  uvicorn main:app --reload --host 0.0.0.0 --port 8000"
echo ""
echo "Or use Docker:"
echo "  docker-compose up -d"
echo ""
echo "API will be available at:"
echo "  - http://localhost:8000"
echo "  - Docs: http://localhost:8000/docs"
echo ""
