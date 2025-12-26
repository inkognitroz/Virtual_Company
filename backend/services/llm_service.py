"""LLM service for AI model integration."""
import httpx
from typing import Optional, List, Dict
from backend.core.config import settings


class LLMService:
    """Service for interacting with LLM providers."""
    
    def __init__(self):
        self.client = httpx.AsyncClient(timeout=30.0)
    
    async def generate_response(
        self,
        prompt: str,
        model_name: str = "gpt-3.5-turbo",
        system_prompt: Optional[str] = None,
        conversation_history: Optional[List[Dict]] = None,
        api_key: Optional[str] = None
    ) -> Dict:
        """Generate response from LLM."""
        # Use provided API key or fall back to environment variable
        key = api_key or settings.openai_api_key
        
        if not key:
            return {
                "content": "Please configure an API key to use AI features.",
                "model": model_name,
                "tokens_used": 0
            }
        
        # Determine provider based on model name
        if model_name.startswith("gpt") or model_name.startswith("o1"):
            return await self._call_openai(prompt, model_name, system_prompt, conversation_history, key)
        elif model_name.startswith("claude"):
            return await self._call_anthropic(prompt, model_name, system_prompt, conversation_history, key)
        else:
            # Default to OpenRouter for other models
            return await self._call_openrouter(prompt, model_name, system_prompt, conversation_history, key)
    
    async def _call_openai(
        self,
        prompt: str,
        model: str,
        system_prompt: Optional[str],
        conversation_history: Optional[List[Dict]],
        api_key: str
    ) -> Dict:
        """Call OpenAI API."""
        messages = []
        
        if system_prompt:
            messages.append({"role": "system", "content": system_prompt})
        
        if conversation_history:
            messages.extend(conversation_history)
        
        messages.append({"role": "user", "content": prompt})
        
        try:
            response = await self.client.post(
                "https://api.openai.com/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {api_key}",
                    "Content-Type": "application/json"
                },
                json={
                    "model": model,
                    "messages": messages,
                    "temperature": 0.7
                }
            )
            
            if response.status_code == 200:
                data = response.json()
                return {
                    "content": data["choices"][0]["message"]["content"],
                    "model": model,
                    "tokens_used": data.get("usage", {}).get("total_tokens", 0)
                }
            else:
                return {
                    "content": f"Error: {response.status_code} - {response.text}",
                    "model": model,
                    "tokens_used": 0
                }
        except Exception as e:
            return {
                "content": f"Error calling OpenAI API: {str(e)}",
                "model": model,
                "tokens_used": 0
            }
    
    async def _call_anthropic(
        self,
        prompt: str,
        model: str,
        system_prompt: Optional[str],
        conversation_history: Optional[List[Dict]],
        api_key: str
    ) -> Dict:
        """Call Anthropic API."""
        messages = []
        
        if conversation_history:
            messages.extend(conversation_history)
        
        messages.append({"role": "user", "content": prompt})
        
        try:
            payload = {
                "model": model,
                "messages": messages,
                "max_tokens": 1024
            }
            
            if system_prompt:
                payload["system"] = system_prompt
            
            response = await self.client.post(
                "https://api.anthropic.com/v1/messages",
                headers={
                    "x-api-key": api_key,
                    "anthropic-version": "2023-06-01",
                    "Content-Type": "application/json"
                },
                json=payload
            )
            
            if response.status_code == 200:
                data = response.json()
                usage = data.get("usage", {})
                total_tokens = usage.get("input_tokens", 0) + usage.get("output_tokens", 0)
                return {
                    "content": data["content"][0]["text"],
                    "model": model,
                    "tokens_used": total_tokens
                }
            else:
                return {
                    "content": f"Error: {response.status_code} - {response.text}",
                    "model": model,
                    "tokens_used": 0
                }
        except Exception as e:
            return {
                "content": f"Error calling Anthropic API: {str(e)}",
                "model": model,
                "tokens_used": 0
            }
    
    async def _call_openrouter(
        self,
        prompt: str,
        model: str,
        system_prompt: Optional[str],
        conversation_history: Optional[List[Dict]],
        api_key: str
    ) -> Dict:
        """Call OpenRouter API (aggregator for multiple models)."""
        messages = []
        
        if system_prompt:
            messages.append({"role": "system", "content": system_prompt})
        
        if conversation_history:
            messages.extend(conversation_history)
        
        messages.append({"role": "user", "content": prompt})
        
        try:
            response = await self.client.post(
                "https://openrouter.ai/api/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {api_key}",
                    "Content-Type": "application/json"
                },
                json={
                    "model": model,
                    "messages": messages
                }
            )
            
            if response.status_code == 200:
                data = response.json()
                return {
                    "content": data["choices"][0]["message"]["content"],
                    "model": model,
                    "tokens_used": data.get("usage", {}).get("total_tokens", 0)
                }
            else:
                return {
                    "content": f"Error: {response.status_code} - {response.text}",
                    "model": model,
                    "tokens_used": 0
                }
        except Exception as e:
            return {
                "content": f"Error calling OpenRouter API: {str(e)}",
                "model": model,
                "tokens_used": 0
            }
    
    async def get_available_models(self) -> List[Dict]:
        """Get list of available models."""
        models = [
            {
                "id": "gpt-3.5-turbo",
                "name": "GPT-3.5 Turbo",
                "provider": "OpenAI",
                "description": "Fast and efficient for most tasks"
            },
            {
                "id": "gpt-4",
                "name": "GPT-4",
                "provider": "OpenAI",
                "description": "Most capable OpenAI model"
            },
            {
                "id": "gpt-4-turbo-preview",
                "name": "GPT-4 Turbo",
                "provider": "OpenAI",
                "description": "Latest GPT-4 with improved performance"
            },
            {
                "id": "claude-3-opus-20240229",
                "name": "Claude 3 Opus",
                "provider": "Anthropic",
                "description": "Most capable Claude model"
            },
            {
                "id": "claude-3-sonnet-20240229",
                "name": "Claude 3 Sonnet",
                "provider": "Anthropic",
                "description": "Balanced performance and speed"
            },
            {
                "id": "meta-llama/llama-3-70b-instruct",
                "name": "Llama 3 70B",
                "provider": "OpenRouter",
                "description": "Meta's latest open model"
            },
            {
                "id": "mistralai/mistral-large",
                "name": "Mistral Large",
                "provider": "OpenRouter",
                "description": "Mistral's flagship model"
            }
        ]
        return models
    
    async def close(self):
        """Close HTTP client."""
        await self.client.aclose()


# Global service instance
llm_service = LLMService()
