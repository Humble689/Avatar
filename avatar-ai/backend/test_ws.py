"""
Simple WebSocket test client for Avatar AI backend.
Requires: Python 3.8+, `websockets` (already in backend/requirements.txt)

Usage:
  python test_ws.py "Hello from test client"

This will connect to ws://localhost:8000/ws/chat, send a JSON message with the provided text,
and print any messages received from the server until the connection closes.
"""
import asyncio
import json
import sys
import websockets

async def run(message_text):
    uri = "ws://localhost:8000/ws/chat"
    try:
        async with websockets.connect(uri) as websocket:
            print(f"Connected to {uri}")
            await websocket.send(json.dumps({"text": message_text}))
            print(f"Sent: {message_text}\nWaiting for responses...\n")

            async for msg in websocket:
                try:
                    data = json.loads(msg)
                except Exception:
                    print("Received non-JSON message:", msg)
                    continue

                print("<", json.dumps(data, indent=2))

    except Exception as e:
        print("Connection error:", e)

if __name__ == '__main__':
    text = ' '.join(sys.argv[1:]) or 'Hello from test client'
    asyncio.run(run(text))
