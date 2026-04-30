# 🚀 Avatar AI - Quick Start

## ✅ Project Status

**Backend**: ✓ Running on `http://localhost:8000`  
**Frontend**: ✓ Running on `http://localhost:3000`

---

## 🎯 Next Steps

### 1. **Add Your Anthropic API Key**

The backend needs your Claude API key to work:

```bash
# Edit backend/.env
ANTHROPIC_API_KEY=sk-ant-YOUR_KEY_HERE
```

Get your key from: https://console.anthropic.com/account/keys

### 2. **Open the App**

Visit: **http://localhost:3000**

You should see:
- A 3D gray box avatar (placeholder)
- Microphone button at the bottom
- State indicator (idle, listening, thinking, speaking)

### 3. **Test Voice Interaction**

1. Click the **🎤 Speak** button
2. Say something like: "Hi, how are you?"
3. Your speech appears in the transcript box
4. Wait for avatar response (requires API key)
5. Avatar speaks back and shows emotion

---

## 🎭 Current Features

✓ **Voice Input** - Web Speech API (Chrome/Edge/Safari)  
✓ **AI Brain** - Claude API with streaming  
✓ **Emotion Tagging** - Avatar shows happy/sad/surprised/etc  
✓ **Real-time Chat** - WebSocket connection  
✓ **3D Avatar** - Placeholder cube (ready for 3D model)  

---

## 🔧 Troubleshooting

**No voice input?**
- Use Chrome, Edge, or Safari (not Firefox)
- Grant microphone permissions

**API errors?**
- Check `backend/.env` has valid `ANTHROPIC_API_KEY`
- Restart backend after adding key

**WebSocket errors?**
- Ensure backend is running on `localhost:8000`
- Check browser console (F12)

---

## 📦 Project Structure

```
avatar-ai/
├── frontend/          React + Three.js + Vite
│   ├── src/
│   │   ├── App.jsx              Main orchestrator
│   │   ├── AvatarScene.jsx      3D rendering
│   │   ├── useVoiceInput.js     Voice capture
│   │   └── useTTS.js            Speech synthesis
│   └── package.json
└── backend/           FastAPI + WebSocket
    ├── main.py                  Chat server
    ├── requirements.txt
    └── .env                     API keys
```

---

## 🚀 Next: Upgrade the Avatar

To replace the placeholder cube with a real avatar:

1. **Get a 3D Model**
   - Ready Player Me: https://readyplayer.me/ (free, realistic)
   - Sketchfab: https://sketchfab.com/ (various styles)

2. **Place GLB file**
   - Save as `frontend/public/avatar.glb`

3. **Update AvatarScene.jsx**
   - Uncomment the `useGLTF()` loader
   - Update mesh names to match your model

---

## 💡 Pro Tips

- **Customize personality** - Edit `AVATAR_SYSTEM_PROMPT` in `backend/main.py`
- **Adjust animations** - Edit `EMOTION_TO_BLEND_SHAPES` in `frontend/src/App.jsx`
- **Better TTS** - Swap Web Audio API for ElevenLabs in `useTTS.js`
- **Better STT** - Use Whisper API for more accurate transcription

---

## 📚 Resources

- [Anthropic Claude Docs](https://docs.anthropic.com/)
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber/)
- [FastAPI WebSockets](https://fastapi.tiangolo.com/advanced/websockets/)
- [Ready Player Me SDK](https://docs.readyplayer.me/)

---

## 🎉 You're Ready!

Everything is set up and running. Just add your API key and start chatting with your avatar!

Questions? Check `README.md` for full documentation.
