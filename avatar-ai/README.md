# Avatar AI - Interactive Digital Avatar

A web-based AI avatar that listens to voice, thinks with an AI brain, and speaks back with realistic animations, lip sync, and emotional expressions.

## Features

- 🎭 **3D Avatar Rendering** - React Three Fiber with realistic animations
- 🎤 **Voice Input** - Web Speech API for real-time transcription
- 🧠 **AI Conversation** - Claude API with streaming responses
- 🎙️ **Text-to-Speech** - Simulated TTS with lip sync
- 😊 **Emotional Expressions** - Dynamic facial expressions based on conversation tone
- 🚀 **Real-time Interaction** - WebSocket-based low-latency communication

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React + React Three Fiber |
| 3D Rendering | Three.js |
| Voice Input | Web Speech API |
| AI Brain | Claude API (Anthropic) |
| Backend | FastAPI + WebSockets |
| Speech Synthesis | Web Audio API (demo) |

## Quick Start

### Prerequisites

- Node.js 16+ and npm
- Python 3.9+
- Anthropic API key ([get one here](https://console.anthropic.com))

### Setup

1. **Clone and install dependencies**
   ```bash
   cd avatar-ai
   
   # Frontend
   cd frontend
   npm install
   
   # Backend (in separate terminal)
   cd backend
   pip install -r requirements.txt
   ```

2. **Configure API Keys**
   ```bash
   cd backend
   cp .env.example .env
   # Edit .env and add your ANTHROPIC_API_KEY
   ```

3. **Start the backend**
   ```bash
   cd backend
   python main.py
   ```
   Backend runs on `http://localhost:8000`

4. **Start the frontend** (in another terminal)
   ```bash
   cd frontend
   npm run dev
   ```
   Frontend runs on `http://localhost:3000` or `http://localhost:5173`

5. **Open in browser**
   Navigate to `http://localhost:3000` and click the microphone button to start talking!

## How It Works

1. **Voice Input** - Click the microphone button and speak. Web Speech API transcribes your speech in real-time.

2. **AI Processing** - Your transcript is sent to the backend via WebSocket. Claude processes it and generates a response with emotion tags.

3. **Avatar Response** - The avatar speaks back using Web Audio API with simulated lip sync. Facial expressions update based on detected emotions.

4. **Real-time Sync** - All communication happens via WebSocket for minimal latency.

## Project Structure

```
avatar-ai/
├── frontend/                 # React + Three.js
│   ├── src/
│   │   ├── App.jsx          # Main component
│   │   ├── AvatarScene.jsx  # 3D avatar rendering
│   │   ├── useVoiceInput.js # Voice input hook
│   │   └── useTTS.js        # Text-to-speech hook
│   ├── package.json
│   └── vite.config.js
└── backend/                  # FastAPI
    ├── main.py              # WebSocket server
    ├── requirements.txt
    └── .env
```

## Configuration

### Avatar System Prompt

Edit the `AVATAR_SYSTEM_PROMPT` in `backend/main.py` to customize the avatar's personality, tone, and behavior.

### Emotion Mapping

Modify `EMOTION_TO_BLEND_SHAPES` in `frontend/src/App.jsx` to adjust which facial expressions correspond to emotions.

## API

### WebSocket: `/ws/chat`

**Request:**
```json
{
  "text": "Hello, how are you?"
}
```

**Response (streaming):**
```json
{
  "type": "text_chunk",
  "chunk": "I'm "
}
```

**Response (complete):**
```json
{
  "type": "complete",
  "text": "I'm doing great, thanks for asking!",
  "emotion": "happy"
}
```

## Roadmap

- [ ] Integrate Ready Player Me for realistic avatars
- [ ] Add ElevenLabs for professional voice synthesis
- [ ] Implement advanced lip sync with viseme data
- [ ] Add idle animations and eye tracking
- [ ] Support for multiple avatar styles
- [ ] Conversation history and context awareness
- [ ] Emotion detection from user voice
- [ ] Custom voice selection
- [ ] Multi-language support

## Troubleshooting

**WebSocket connection fails:**
- Ensure backend is running on `localhost:8000`
- Check CORS settings in `backend/main.py`

**No voice input detected:**
- Web Speech API only works in Chrome, Edge, Safari (not Firefox)
- Grant microphone permissions when prompted
- Check browser console for errors

**API key errors:**
- Verify `ANTHROPIC_API_KEY` is set in `backend/.env`
- Check that your key hasn't expired or been revoked

**Slow responses:**
- Streaming is working as designed - first token typically arrives in <1s
- Check network latency between frontend and backend

## Testing & Utilities

There is a small WebSocket test client you can use to verify the backend without opening the frontend UI.

Run it from the `backend` folder:

```bash
cd avatar-ai/backend
python test_ws.py "Hello from test client"
```

This script connects to `ws://localhost:8000/ws/chat`, sends a JSON `{ "text": ... }` payload and prints streamed `text_chunk`, `complete`, and `error` messages.

Also check `backend/.env.example` for the expected environment variable name and format. Copy it to `.env` and replace with your real Anthropic key:

```text
ANTHROPIC_API_KEY=sk-ant-<your-key-here>
```

## Screenshots

Add a screenshot or GIF to `docs/screenshot.png` and it will appear in the README when you reference it. Example markdown to add at the top of this README:

```md
![Avatar demo](docs/screenshot.png)
```

If you don't have an image yet, create `docs/README_ASSETS.md` or place a file at `docs/screenshot.png` when ready.

## Contributing

Feel free to extend this project! Some ideas:
- Better avatar models from Ready Player Me
- Professional TTS from ElevenLabs
- Advanced emotion detection
- Conversation persistence
- Mobile support

## License

MIT

## Resources

- [React Three Fiber Docs](https://docs.pmnd.rs/react-three-fiber/)
- [Claude API Docs](https://docs.anthropic.com/)
- [FastAPI WebSockets](https://fastapi.tiangolo.com/advanced/websockets/)
- [Ready Player Me](https://readyplayer.me/)
- [ElevenLabs](https://elevenlabs.io/)
