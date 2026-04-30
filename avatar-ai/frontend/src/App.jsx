import { useState, useCallback, useRef, useEffect } from 'react'
import { AvatarScene } from './AvatarScene'
import { useVoiceInput } from './useVoiceInput'
import { speakWithLipSync } from './useTTS'
import { AVATARS, AVATAR_PRESETS } from './avatars'
import './App.css'

const EMOTION_TO_BLEND_SHAPES = {
  happy: { mouthSmileLeft: 0.7, mouthSmileRight: 0.7, cheekSquintLeft: 0.3 },
  sad: { mouthFrownLeft: 0.6, mouthFrownRight: 0.6, browDownLeft: 0.4 },
  surprised: { browOuterUpLeft: 0.8, browOuterUpRight: 0.8, jawOpen: 0.5 },
  thoughtful: { browDownLeft: 0.2, browDownRight: 0.2 },
  excited: { mouthSmileLeft: 1.0, mouthSmileRight: 1.0, browOuterUpLeft: 0.5 },
  neutral: {}
}

export default function App() {
  const [visemeWeights, setVisemeWeights] = useState({})
  const [emotionWeights, setEmotionWeights] = useState({})
  const [avatarState, setAvatarState] = useState('idle')
  const [transcript, setTranscript] = useState('')
  const [response, setResponse] = useState('')
  const [textInput, setTextInput] = useState('')
  const [selectedAvatarId, setSelectedAvatarId] = useState('avatar1')
  const wsRef = useRef(null)
  const reconnectTimeoutRef = useRef(null)

  const selectedAvatarConfig = AVATARS[selectedAvatarId]

  // Connect to backend WebSocket
  const connectWS = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return

    try {
      wsRef.current = new WebSocket('ws://localhost:8000/ws/chat')

      wsRef.current.onopen = () => {
        console.log('Connected to WebSocket')
      }

      wsRef.current.onmessage = async (event) => {
        const data = JSON.parse(event.data)

        if (data.type === 'text_chunk') {
          setResponse(prev => prev + data.chunk)
        }

        if (data.type === 'error') {
          console.error('Backend error:', data.message)
          setResponse(data.message || 'Something went wrong.')
          setAvatarState('idle')
          setVisemeWeights({})
          return
        }

        if (data.type === 'complete') {
          const emotion = data.emotion || 'neutral'
          setEmotionWeights(EMOTION_TO_BLEND_SHAPES[emotion] || {})
          setAvatarState('speaking')

          await speakWithLipSync(
            data.text,
            (viseme, weight) =>
              setVisemeWeights(prev => ({ ...prev, [viseme]: weight })),
            () => setAvatarState('speaking'),
            () => setAvatarState('idle')
          )
        }
      }

      wsRef.current.onerror = (error) => {
        console.error('WebSocket error:', error)
      }

      wsRef.current.onclose = () => {
        console.log('WebSocket disconnected')
        setVisemeWeights({})
        setAvatarState('idle')
        // Attempt to reconnect after 2 seconds
        reconnectTimeoutRef.current = setTimeout(connectWS, 2000)
      }
    } catch (error) {
      console.error('Failed to connect:', error)
    }
  }, [])

  useEffect(() => {
    connectWS()

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
      }
      wsRef.current?.close()
    }
  }, [connectWS])

  const { startListening, stopListening, isListening } = useVoiceInput({
    onTranscript: (text) => {
      setTranscript(text)
      setResponse('')
      setAvatarState('thinking')
      wsRef.current?.send(JSON.stringify({ text }))
    },
    onSpeaking: (text) => {
      setTranscript(text)
    }
  })

  const handleMicClick = () => {
    if (isListening) {
      stopListening()
    } else {
      startListening()
    }
  }

  const handleTextSubmit = () => {
    if (textInput.trim()) {
      if (wsRef.current?.readyState !== WebSocket.OPEN) {
        setResponse('Connection to the backend is not ready yet.')
        setAvatarState('idle')
        return
      }

      setTranscript(textInput)
      setResponse('')
      setAvatarState('thinking')
      wsRef.current?.send(JSON.stringify({ text: textInput }))
      setTextInput('')
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleTextSubmit()
    }
  }

  return (
    <div className="app">
      <div className="avatar-container">
        <AvatarScene 
          visemeWeights={visemeWeights} 
          emotionWeights={emotionWeights}
          avatarConfig={selectedAvatarConfig}
        />
      </div>

      {transcript && (
        <div className="transcript">
          <strong>You:</strong> {transcript}
        </div>
      )}

      {response && (
        <div className="transcript" style={{ bottom: '120px' }}>
          <strong>Avatar:</strong> {response}
        </div>
      )}

      <div className="avatar-selector">
        {AVATAR_PRESETS.map((preset) => (
          <button
            key={preset.id}
            className={`avatar-btn ${selectedAvatarId === preset.id ? 'active' : ''}`}
            onClick={() => setSelectedAvatarId(preset.id)}
            title={preset.label}
          >
            {preset.label}
          </button>
        ))}
      </div>

      <div className="controls">
        <div className={`state-indicator state-${avatarState}`}>
          <div className={`state-dot ${avatarState}`}></div>
          <span>{avatarState}</span>
        </div>
        <input 
          type="text"
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type message..."
          className="text-input"
          disabled={avatarState === 'thinking' || avatarState === 'speaking'}
        />
        <button onClick={handleTextSubmit} disabled={avatarState === 'thinking' || !textInput.trim()}>
          Send
        </button>
        <button onClick={handleMicClick} disabled={avatarState === 'thinking'}>
          {isListening ? '⏹ Stop' : '🎤 Speak'}
        </button>
      </div>
    </div>
  )
}
