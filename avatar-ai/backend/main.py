import asyncio
import json
import re
from contextlib import asynccontextmanager

import anthropic
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware

# Load environment variables
import os
from dotenv import load_dotenv

load_dotenv()

# Initialize Anthropic client
client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

# Persona prompt - defines the avatar's personality
AVATAR_SYSTEM_PROMPT = """
You are Aria, a warm and empathetic AI assistant with a professional yet friendly tone.
Respond naturally in 1-3 sentences for casual chat, longer for complex topics.

IMPORTANT - emotion tagging:
Wrap your response in an emotion tag so the avatar can show the right expression.
Format: [EMOTION:happy] your response here [/EMOTION]

Available emotions: happy, sad, surprised, thoughtful, concerned, excited, neutral
Choose the emotion that best matches the sentiment of your response.

Example responses:
- "That's a great question! I'd love to help you with that." → [EMOTION:happy] That's a great question! I'd love to help you with that. [/EMOTION]
- "I understand how frustrating that must be." → [EMOTION:concerned] I understand how frustrating that must be. [/EMOTION]
- "Wow, that's interesting! Tell me more!" → [EMOTION:excited] Wow, that's interesting! Tell me more! [/EMOTION]

Keep responses concise and natural. Don't acknowledge the emotion tags in your response.
"""


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    print("Avatar AI Backend Starting...")
    yield
    # Shutdown
    print("Avatar AI Backend Shutting Down...")


app = FastAPI(title="Avatar AI Backend", lifespan=lifespan)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.websocket("/ws/chat")
async def chat_endpoint(websocket: WebSocket):
    await websocket.accept()
    print("Client connected")
    conversation_history = []

    try:
        while True:
            # Receive user transcript from frontend
            data = await websocket.receive_text()
            message = json.loads(data)
            user_text = message.get("text", "").strip()

            if not user_text:
                continue

            print(f"User: {user_text}")

            # Add to conversation history
            conversation_history.append({"role": "user", "content": user_text})

            # Stream response from Claude
            full_response = ""

            try:
                with client.messages.stream(
                    model="claude-3-5-sonnet-20241022",
                    max_tokens=300,
                    system=AVATAR_SYSTEM_PROMPT,
                    messages=conversation_history,
                ) as stream:
                    for text_chunk in stream.text_stream:
                        full_response += text_chunk
                        # Stream tokens to frontend as they arrive
                        await websocket.send_text(
                            json.dumps({"type": "text_chunk", "chunk": text_chunk})
                        )

                # Extract emotion tag from response
                emotion_match = re.search(r"\[EMOTION:(\w+)\]", full_response)
                emotion = emotion_match.group(1) if emotion_match else "neutral"

                # Clean text for TTS (strip the tags)
                clean_text = (
                    re.sub(r"\[/?EMOTION:[^\]]*\]", "", full_response).strip()
                )

                print(f"Avatar ({emotion}): {clean_text}")

                # Send emotion + clean text to frontend
                await websocket.send_text(
                    json.dumps(
                        {"type": "complete", "text": clean_text, "emotion": emotion}
                    )
                )

                # Add assistant reply to history
                conversation_history.append(
                    {"role": "assistant", "content": clean_text}
                )

            except anthropic.APIConnectionError as e:
                print(f"Connection error: {e}")
                await websocket.send_text(
                    json.dumps(
                        {
                            "type": "error",
                            "message": "Failed to connect to AI service. Please check your API key.",
                        }
                    )
                )
            except anthropic.AuthenticationError as e:
                print(f"Authentication error: {e}")
                await websocket.send_text(
                    json.dumps(
                        {
                            "type": "error",
                            "message": "Invalid API key. Please check your ANTHROPIC_API_KEY.",
                        }
                    )
                )

    except WebSocketDisconnect:
        print("Client disconnected")
    except Exception as e:
        print(f"Error: {e}")
        try:
            await websocket.send_text(json.dumps({"type": "error", "message": str(e)}))
        except:
            pass


@app.get("/health")
async def health_check():
    return {"status": "ok", "service": "Avatar AI Backend"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
