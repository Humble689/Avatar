import { useEffect, useRef, useCallback, useState } from 'react'

export function useVoiceInput({ onTranscript, onSpeaking }) {
  const recognitionRef = useRef(null)
  const [isListening, setIsListening] = useState(false)

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition

    if (!SpeechRecognition) {
      console.warn('Web Speech API not supported in this browser')
      return
    }

    const recognition = new SpeechRecognition()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = 'en-US'

    recognition.onresult = (event) => {
      const results = Array.from(event.results)
      const finalTranscript = results
        .filter(r => r.isFinal)
        .map(r => r[0].transcript)
        .join('')

      const interimTranscript = results
        .filter(r => !r.isFinal)
        .map(r => r[0].transcript)
        .join('')

      if (interimTranscript) onSpeaking?.(interimTranscript)
      if (finalTranscript) onTranscript(finalTranscript)
    }

    recognition.onerror = (e) => {
      console.error('STT error:', e.error)
    }

    recognition.onend = () => {
      setIsListening(false)
    }

    recognitionRef.current = recognition
  }, [onTranscript, onSpeaking])

  const startListening = useCallback(() => {
    recognitionRef.current?.start()
    setIsListening(true)
  }, [])

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop()
    setIsListening(false)
  }, [])

  return { startListening, stopListening, isListening }
}
