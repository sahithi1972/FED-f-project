import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { SpeechRecognition, SpeechRecognitionEvent, SpeechRecognitionErrorEvent } from '../types/speech-recognition';

interface VoiceInputProps {
  onTranscript: (text: string) => void;
  placeholder?: string;
  className?: string;
  // theme: 'light' | 'dark' - adjusts internal colors when used on dark backgrounds
  theme?: 'light' | 'dark';
  // compact mode hides the extended help block and uses tighter spacing
  compact?: boolean;
}

export const VoiceInput: React.FC<VoiceInputProps> = ({
  onTranscript,
  placeholder = "Say your ingredients...",
  className = "",
  theme = 'light',
  compact = false,
}) => {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const [interimTranscript, setInterimTranscript] = useState('');

  useEffect(() => {
    // Check for browser support
    if (!('SpeechRecognition' in window) && !('webkitSpeechRecognition' in window)) {
      setIsSupported(false);
      return;
    }
    
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognitionInstance = new SpeechRecognitionAPI();
    recognitionInstance.continuous = false;
    recognitionInstance.interimResults = true;
    recognitionInstance.lang = 'en-US';

    recognitionInstance.onstart = (event: Event) => {
      setIsListening(true);
      setInterimTranscript('');
    };

    recognitionInstance.onresult = (event: SpeechRecognitionEvent) => {
      let finalTranscript = '';
      let interim = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interim += transcript;
        }
      }

      setInterimTranscript(interim);

      if (finalTranscript) {
        onTranscript(finalTranscript);
        setIsListening(false);
      }
    };

    recognitionInstance.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      
      if (event.error === 'not-allowed') {
        alert('Please allow microphone access for voice input');
      }
    };

    recognitionInstance.onend = (event: Event) => {
      setIsListening(false);
    };

    setRecognition(recognitionInstance);

    return () => {
      if (recognitionInstance) {
        recognitionInstance.stop();
      }
    };
  }, [onTranscript]);

  const startListening = () => {
    if (recognition && !isListening) {
      try {
        recognition.start();
      } catch (error) {
        console.error('Error starting voice recognition:', error);
      }
    }
  };

  const stopListening = () => {
    if (recognition && isListening) {
      recognition.stop();
    }
  };

  if (!isSupported) {
    const unsupportedCls = theme === 'dark' ? 'text-center p-4 bg-yellow-900/40 rounded-lg border border-yellow-700' : 'text-center p-4 bg-yellow-50 rounded-lg border border-yellow-200';
    const textCls = theme === 'dark' ? 'text-yellow-200 text-sm' : 'text-yellow-800 text-sm';
    return (
      <div className={`${unsupportedCls} ${className}`}>
        <p className={textCls}>
          Voice input is not supported in your browser. Try Chrome or Edge.
        </p>
      </div>
    );
  }

  const outerCls = theme === 'dark' ? 'space-y-3 text-emerald-200' : 'space-y-3';
  const boxBg = theme === 'dark' ? 'bg-card/40 border border-green-900' : 'bg-gray-50 border border-gray-300';
  const textCls = theme === 'dark' ? 'text-emerald-200' : 'text-gray-700';

  return (
    <div className={`${outerCls} ${className}`}>
      <div className="flex gap-2">
        <Button
          type="button"
          onClick={isListening ? stopListening : startListening}
          variant={isListening ? "destructive" : "outline"}
          className={`flex items-center gap-2 flex-shrink-0 ${theme === 'dark' ? 'bg-emerald-700/10 border-emerald-800 text-emerald-200' : ''}`}
        >
          {isListening ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Mic className="w-4 h-4" />
          )}
          {isListening ? 'Listening...' : 'Voice Input'}
        </Button>

        <div className="flex-1 relative">
          <div className={`w-full p-3 rounded-lg text-left min-h-[44px] ${boxBg}`}>
            <AnimatePresence>
              {interimTranscript ? (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className={textCls}
                >
                  {interimTranscript}
                </motion.p>
              ) : (
                <p className={`${theme === 'dark' ? 'text-emerald-300' : 'text-gray-500'}`}>
                  {isListening ? 'Speak now...' : placeholder}
                </p>
              )}
            </AnimatePresence>
          </div>

          {/* Listening animation */}
          <AnimatePresence>
            {isListening && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="absolute -top-1 -right-1"
              >
                <div className="relative">
                  <div className="absolute -inset-1 bg-red-500 rounded-full animate-ping" />
                  <div className="relative w-2 h-2 bg-red-600 rounded-full" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Voice commands help (optional compact) */}
      {!compact && (
        <div className={`${theme === 'dark' ? 'bg-[#062016] p-3 rounded-lg border border-emerald-900' : 'bg-blue-50 p-3 rounded-lg border border-blue-200'}`}>
          <p className={`${theme === 'dark' ? 'text-emerald-200' : 'text-blue-800'} text-sm font-medium mb-1`}>
            Try saying:
          </p>
          <div className={`${theme === 'dark' ? 'text-emerald-300' : 'text-blue-700'} text-xs space-y-1`}>
            <p>"tomatoes onions chicken"</p>
            <p>"vegetarian pasta recipes"</p>
            <p>"quick dinner with rice"</p>
          </div>
        </div>
      )}
    </div>
  );
};