import { useState, useEffect, useCallback } from 'react';

<<<<<<< HEAD
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
=======
// Extend window object for webkitSpeechRecognition
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export function useSpeechRecognition() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognitionInstance = new SpeechRecognition();
        recognitionInstance.continuous = true;
        recognitionInstance.interimResults = true;
        recognitionInstance.lang = 'ja-JP'; // Default to Japanese

        recognitionInstance.onresult = (event: any) => {
          let currentTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript;
          }
          setTranscript(currentTranscript);
        };

        recognitionInstance.onerror = (event: any) => {
>>>>>>> 5835434eb485624fa18f269208aeb7719b83112f
          setError(event.error);
          setIsListening(false);
        };

<<<<<<< HEAD
        recog.onend = () => {
          setIsListening(false);
        };

        setRecognition(recog);
=======
        recognitionInstance.onend = () => {
          setIsListening(false);
        };

        setRecognition(recognitionInstance);
      } else {
        setError('お使いのブラウザは音声認識をサポートしていません。');
>>>>>>> 5835434eb485624fa18f269208aeb7719b83112f
      }
    }
  }, []);

  const startListening = useCallback(() => {
<<<<<<< HEAD
    setError(null);
    if (!recognition) return;
    try {
      recognition.start();
      setIsListening(true);
    } catch (e) {
      console.error('Speech recognition error on start:', e);
=======
    if (recognition) {
      setTranscript('');
      setError(null);
      try {
        recognition.start();
        setIsListening(true);
      } catch (e) {
        console.error(e);
      }
>>>>>>> 5835434eb485624fa18f269208aeb7719b83112f
    }
  }, [recognition]);

  const stopListening = useCallback(() => {
<<<<<<< HEAD
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
=======
    if (recognition) {
      recognition.stop();
      setIsListening(false);
    }
  }, [recognition]);

  return {
    isListening,
    transcript,
    error,
    startListening,
    stopListening,
    setTranscript
  };
}
>>>>>>> 5835434eb485624fa18f269208aeb7719b83112f
