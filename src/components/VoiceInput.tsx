import { useState, useCallback, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface VoiceInputProps {
  onResult: (text: string) => void;
  className?: string;
}

// Type for SpeechRecognition
type SpeechRecognitionType = typeof window.SpeechRecognition | typeof window.webkitSpeechRecognition;

export function VoiceInput({ onResult, className = "" }: VoiceInputProps) {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const recognitionRef = useRef<InstanceType<SpeechRecognitionType> | null>(null);

  useEffect(() => {
    // Check for browser support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "en-IN"; // Indian English
      
      recognition.onstart = () => {
        setIsListening(true);
        setIsProcessing(false);
      };
      
      recognition.onend = () => {
        setIsListening(false);
        setIsProcessing(false);
      };
      
      recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
        setIsProcessing(false);
        
        if (event.error === "not-allowed") {
          toast({
            title: "Microphone Access Denied",
            description: "Please allow microphone access to use voice input.",
            variant: "destructive",
          });
        } else if (event.error !== "aborted") {
          toast({
            title: "Voice Input Error",
            description: "Could not understand. Please try again.",
            variant: "destructive",
          });
        }
      };
      
      recognition.onresult = (event) => {
        setIsProcessing(true);
        const transcript = event.results[0][0].transcript;
        console.log("Voice input:", transcript);
        onResult(transcript);
        setIsProcessing(false);
        
        toast({
          title: "Voice Input Received",
          description: `"${transcript}"`,
        });
      };
      
      recognitionRef.current = recognition;
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [onResult]);

  const toggleListening = useCallback(() => {
    if (!recognitionRef.current) {
      toast({
        title: "Voice Input Not Supported",
        description: "Your browser doesn't support voice input. Try Chrome or Edge.",
        variant: "destructive",
      });
      return;
    }

    if (isListening) {
      recognitionRef.current.abort();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
      } catch (error) {
        console.error("Failed to start recognition:", error);
      }
    }
  }, [isListening]);

  const isSupported = typeof window !== "undefined" && 
    (window.SpeechRecognition || window.webkitSpeechRecognition);

  if (!isSupported) {
    return null;
  }

  return (
    <Button
      type="button"
      variant={isListening ? "destructive" : "outline"}
      size="icon"
      onClick={toggleListening}
      disabled={isProcessing}
      className={`relative ${className} ${isListening ? "animate-pulse" : ""}`}
      title={isListening ? "Stop listening" : "Start voice input"}
    >
      {isProcessing ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : isListening ? (
        <MicOff className="h-4 w-4" />
      ) : (
        <Mic className="h-4 w-4" />
      )}
      {isListening && (
        <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-destructive animate-ping" />
      )}
    </Button>
  );
}

interface SpeechRecognitionInstance extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onstart: ((this: SpeechRecognitionInstance, ev: Event) => void) | null;
  onend: ((this: SpeechRecognitionInstance, ev: Event) => void) | null;
  onerror: ((this: SpeechRecognitionInstance, ev: SpeechRecognitionErrorEventCustom) => void) | null;
  onresult: ((this: SpeechRecognitionInstance, ev: SpeechRecognitionEventCustom) => void) | null;
}

interface SpeechRecognitionErrorEventCustom extends Event {
  error: string;
}

interface SpeechRecognitionEventCustom extends Event {
  results: {
    readonly length: number;
    [index: number]: {
      [index: number]: {
        transcript: string;
        confidence: number;
      };
    };
  };
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    SpeechRecognition: {
      new (): SpeechRecognitionInstance;
    };
    webkitSpeechRecognition: {
      new (): SpeechRecognitionInstance;
    };
  }
}
