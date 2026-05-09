import { useState, useEffect, useCallback } from 'react';

// Web Speech API interfaces (Basic types for TypeScript)
interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: (event: any) => void;
  onerror: (event: any) => void;
  onend: () => void;
}

interface UseSpeechRecognitionReturn {
  text: string;
  isListening: boolean;
  error: string | null;
  startListening: () => void;
  stopListening: () => void;
  resetText: () => void;
  isSupported: boolean;
}

export const useSpeechRecognition = (): UseSpeechRecognitionReturn => {
  const [text, setText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognitionConstructor = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognitionConstructor) {
        setIsSupported(true);
        const recog = new SpeechRecognitionConstructor();
        recog.continuous = true;
        recog.interimResults = true;
        recog.lang = 'ja-JP';

        recog.onresult = (event: any) => {
          const fullTranscript = Array.from(event.results)
            .map((res: any) => res[0].transcript)
            .join('');
          setText(fullTranscript);
        };

        recog.onerror = (event: any) => {
          setError(event.error);
          setIsListening(false);
        };

        recog.onend = () => {
          setIsListening(false);
        };

        setRecognition(recog);
      }
    }
  }, []);

  const startListening = useCallback(() => {
    setError(null);
    if (!recognition) return;
    try {
      recognition.start();
      setIsListening(true);
    } catch (e) {
      console.error('Speech recognition error on start:', e);
    }
  }, [recognition]);

  const stopListening = useCallback(() => {
    if (!recognition) return;
    try {
      recognition.stop();
    } catch (e) {
      console.error('Speech recognition error on stop:', e);
    }
    setIsListening(false);
  }, [recognition]);

  const resetText = useCallback(() => {
    setText('');
  }, []);

  return {
    text,
    isListening,
    error,
    startListening,
    stopListening,
    resetText,
    isSupported,
  };
};
