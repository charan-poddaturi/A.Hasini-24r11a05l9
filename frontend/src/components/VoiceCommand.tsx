import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

export const VoiceCommand: React.FC<{ onCommand: (cmd: string) => void }> = ({ onCommand }) => {
  const { t } = useTranslation();
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript?.toLowerCase() || "";
      onCommand(transcript);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
    };
  }, [onCommand]);

  const toggleListening = () => {
    if (!SpeechRecognition) return;

    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
    } else {
      recognitionRef.current?.start();
      setListening(true);
    }
  };

  return (
    <button
      onClick={toggleListening}
      className={`mt-3 inline-flex items-center gap-2 rounded px-4 py-2 text-sm font-medium ${
        listening ? "bg-red-500 text-white" : "bg-slate-200 text-slate-800"
      }`}
    >
      {listening ? "Listening..." : "Voice Command"}
      <span aria-hidden="true">🎙️</span>
      {!SpeechRecognition && <span className="text-xs text-red-600">(Not supported)</span>}
    </button>
  );
};
