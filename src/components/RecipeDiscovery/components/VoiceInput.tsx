import { useState } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

interface VoiceInputProps {
  onIngredientsDetected: (ingredients: string[]) => void;
  isListening?: boolean;
}

export function VoiceInput({ onIngredientsDetected, isListening: externalIsListening }: VoiceInputProps) {
  const [isListening, setIsListening] = useState(false);

  const startVoiceInput = () => {
    if (!(window as any).webkitSpeechRecognition) {
      toast({
        title: "❌ Not Supported",
        description: "Voice input is not supported in your browser. Please use Chrome."
      });
      return;
    }

    const RecognitionCtor = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    const recognition = new RecognitionCtor();
    recognition.lang = "en-IN";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
      toast({
        title: "Listening...",
        description: "Speak your ingredients, separated by commas",
      });
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      const ingredients = transcript
        .split(",")
        .map(i => i.trim())
        .filter(Boolean); // Remove empty strings

      if (ingredients.length > 0) {
        onIngredientsDetected(ingredients);
        toast({
          title: "Ingredients Added",
          description: `Heard: ${ingredients.join(", ")}`,
        });
      }
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event.error);
      toast({
        title: "❌ Error",
        description: "Failed to recognize speech. Please try again."
      });
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  return (
    <Button
      variant="outline"
      size="icon"
      className={isListening ? "animate-pulse text-primary" : ""}
      onClick={startVoiceInput}
      disabled={isListening}
      title="Click to speak ingredients"
    >
      {isListening ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
    </Button>
  );
}