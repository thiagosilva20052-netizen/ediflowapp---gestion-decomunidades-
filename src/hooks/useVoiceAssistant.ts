import { useState, useEffect, useRef } from 'react';

type OperationType = 'encomienda' | 'visita' | 'novedad' | 'pago' | null;

interface VoiceAssistantResult {
  isListening: boolean;
  transcript: string;
  startListening: () => void;
  stopListening: () => void;
  simulateCommand: (text: string) => void;
  error: string | null;
}

export const useVoiceAssistant = (onCommandMatch: (operation: OperationType, details: any) => void): VoiceAssistantResult => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'es-ES';

      recognition.onresult = (event: any) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setTranscript(currentTranscript);
      };

      recognition.onend = () => {
        setIsListening(false);
        if (recognitionRef.current?.finalTranscript) {
           processCommand(recognitionRef.current.finalTranscript);
           recognitionRef.current.finalTranscript = '';
        }
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
        if (event.error === 'not-allowed') {
            setError("Permiso de micrófono denegado por el navegador.");
        }
      };

      recognitionRef.current = recognition;
    } else {
      setError("Tu navegador no soporta reconocimiento de voz.");
    }
  }, []);

  useEffect(() => {
      if (recognitionRef.current && !isListening && transcript) {
          recognitionRef.current.finalTranscript = transcript;
      }
  }, [transcript, isListening]);

  const processCommand = (text: string) => {
      if (!text.trim()) return;
      
      const lowerText = text.toLowerCase();
      
      if (lowerText.includes('encomienda') || lowerText.includes('paquete')) {
          const deptos = text.match(/\d+/g) || [];
          onCommandMatch('encomienda', { deptos, raw: text });
      } else if (lowerText.includes('visita')) {
          const deptoMatch = text.match(/\d+/);
          const depto = deptoMatch ? deptoMatch[0] : 'Desconocido';
          let name = lowerText.replace(/visita/g, '').replace(depto, '').replace(/al|para|el|de/g, '').trim();
          name = name.charAt(0).toUpperCase() + name.slice(1);
          onCommandMatch('visita', { depto, name, raw: text });
      } else if (lowerText.includes('pago') || lowerText.includes('pagó')) {
          const deptoMatch = text.match(/\d+/);
          const depto = deptoMatch ? deptoMatch[0] : 'Desconocido';
          onCommandMatch('pago', { depto, raw: text });
      } else if (lowerText.includes('novedad') || lowerText.includes('libro')) {
          let desc = text.replace(/libro de novedades/gi, '').replace(/novedad/gi, '').replace(/registrar/gi, '').trim();
          desc = desc.charAt(0).toUpperCase() + desc.slice(1);
          onCommandMatch('novedad', { desc, raw: text });
      } else {
          onCommandMatch(null, { raw: text });
      }
      
      setTranscript('');
  };

  const startListening = () => {
    if (!recognitionRef.current) return;
    setTranscript('');
    setError(null);
    recognitionRef.current.start();
    setIsListening(true);
  };

  const stopListening = () => {
    if (!recognitionRef.current) return;
    recognitionRef.current.stop();
    setIsListening(false);
  };

  const simulateCommand = (text: string) => {
    processCommand(text);
  };

  return { isListening, transcript, startListening, stopListening, simulateCommand, error };
};
