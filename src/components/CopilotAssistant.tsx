import React, { useState, useRef, useEffect } from 'react';
import { LocationData, ChatMessage } from '../types';
import { Send, Sparkles, MessageSquareCode, Trash2, Cpu, HelpCircle, Mic, MicOff, Volume2 } from 'lucide-react';

interface CopilotAssistantProps {
  locations: LocationData[];
}

export default function CopilotAssistant({ locations }: CopilotAssistantProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  // Initialize with a welcome brief introductory message
  useEffect(() => {
    setMessages([
      {
        id: 'init-1',
        sender: 'assistant',
        text: `### Traffic Assistant
Welcome to the Bengaluru Traffic Assistance desk. Ask me anything about active traffic congestion, signal cycles, or emergency corridor routing.

**Suggested Queries:**
- *Optimize signal timings at Silk Board*
- *Clear green corridor route for fire trucks*
- *Report wrong-side violation patterns*
- *Twin simulation for monsoon rain forecast*`,
        timestamp: new Date().toLocaleTimeString(),
        source: 'assistant'
      }
    ]);
  }, []);

  // Securely scroll messages container downwards
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Trigger voice operator macro commands safely as spoken audio mock inputs
  const triggerSpokenCommand = async (commandText: string) => {
    if (isLoading) return;
    setIsLoading(true);
    setIsListening(false);

    const userMsg: ChatMessage = {
      id: `m-vuser-${Date.now()}`,
      sender: 'user',
      text: `🎤 Operator spoken command: "${commandText}"`,
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages((p) => [...p, userMsg]);

    const avgDensity = Math.round(locations.reduce((acc, l) => acc + l.avgDensity, 0) / locations.length);
    const congestedRoads = locations.filter((l) => l.avgDensity > 80).map((l) => l.name);
    
    try {
      const response = await fetch('/api/copilot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt: commandText,
          cityStats: {
            avgDensity,
            congestedRoads,
            totalLocations: locations.length,
            time: new Date().toISOString()
          }
        })
      });

      if (!response.ok) {
        throw new Error('API server communications disrupted');
      }

      const outputData = await response.json();
      const assistMsg: ChatMessage = {
        id: `m-vbot-${Date.now()}`,
        sender: 'assistant',
        text: outputData.text || 'System experienced a localized exception.',
        timestamp: new Date().toLocaleTimeString(),
        source: outputData.source || 'gemini-3.5-flash'
      };

      setMessages((p) => [...p, assistMsg]);

      // Synthesize a cool retro computer verbal sound beep alert using browser API optionally if standard is allowed
      if ('speechSynthesis' in window) {
        const u = new SpeechSynthesisUtterance("Dispatching dynamic action.");
        u.volume = 0.35;
        u.rate = 1.05;
        window.speechSynthesis.speak(u);
      }
    } catch (err: any) {
      console.error('Spoken dispatch failed:', err);
      setMessages((p) => [
        ...p,
        {
          id: `m-err-${Date.now()}`,
          sender: 'assistant',
          text: `### ⚠️ Connection Link Interrupted\nFailed to process voice command query. Verify backend socket routes.`,
          timestamp: new Date().toLocaleTimeString()
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Submit message to fullstack backend Gemini proxy
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `m-user-${Date.now()}`,
      sender: 'user',
      text: inputText,
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages((p) => [...p, userMsg]);
    setInputText('');
    setIsLoading(true);

    // Context citywide stats payload
    const avgDensity = Math.round(locations.reduce((acc, l) => acc + l.avgDensity, 0) / locations.length);
    const congestedRoads = locations.filter((l) => l.avgDensity > 80).map((l) => l.name);
    
    try {
      const response = await fetch('/api/copilot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt: userMsg.text,
          cityStats: {
            avgDensity,
            congestedRoads,
            totalLocations: locations.length,
            time: new Date().toISOString()
          }
        })
      });

      if (!response.ok) {
        throw new Error('API server communications disrupted');
      }

      const outputData = await response.json();
      const assistMsg: ChatMessage = {
        id: `m-bot-${Date.now()}`,
        sender: 'assistant',
        text: outputData.text || 'System experienced a localized exception.',
        timestamp: new Date().toLocaleTimeString(),
        source: outputData.source || 'gemini-3.5-flash'
      };

      setMessages((p) => [...p, assistMsg]);
    } catch (err: any) {
      console.error('Copilot send failure:', err);
      // Failover fallback warning bubble
      setMessages((p) => [
        ...p,
        {
          id: `m-err-${Date.now()}`,
          sender: 'assistant',
          text: `### ⚠️ Connection Link Interrupted
Failed to connect to the backend controller. Please restart the deployment or verify server port variables.`,
          timestamp: new Date().toLocaleTimeString()
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Convert raw markdown strings into stylized DOM nodes safely
  const renderFormattedMarkdown = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      // Headers ###
      if (line.startsWith('###')) {
        return (
          <h4 key={`h4-${idx}`} className="text-sm font-bold font-sans text-cyan-400 mt-2 mb-1 uppercase tracking-wider flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5" /> {line.replace('###', '').trim()}
          </h4>
        );
      }
      // List nodes - or *
      if (line.trim().startsWith('-') || line.trim().startsWith('*')) {
        const cleaned = line.replace(/^[-\*]/, '').trim();
        return (
          <li key={`li-${idx}`} className="ml-4 list-disc text-xs font-mono text-slate-300 leading-normal pl-0.5 my-1">
            {parseBoldText(cleaned)}
          </li>
        );
      }
      // Number lines
      if (/^\d+\./.test(line.trim())) {
        return (
          <div key={`num-${idx}`} className="ml-4 text-xs font-sans text-slate-300 leading-normal my-1 pl-1">
            {parseBoldText(line.trim())}
          </div>
        );
      }

      return (
        <p key={`p-${idx}`} className="text-xs font-sans text-slate-300 leading-relaxed my-1.5">
          {parseBoldText(line)}
        </p>
      );
    });
  };

  // Safe inner bold parser using basic regex search
  const parseBoldText = (txt: string) => {
    const parts = txt.split('**');
    return parts.map((chunk, index) => {
      // odd element indices correspond to text surrounded by asterisks
      if (index % 2 === 1) {
        return <strong key={`str-${index}`} className="font-bold text-white bg-slate-900 border border-slate-800 px-1.5 py-0.5 rounded text-[11px] font-sans">{chunk}</strong>;
      }
      // Check for code quotes `
      const quoteParts = chunk.split('`');
      return quoteParts.map((sub, sIdx) => {
        if (sIdx % 2 === 1) {
          return <code key={`code-${sIdx}`} className="bg-slate-900 text-indigo-400 px-1 rounded font-mono text-[11px]"> {sub} </code>;
        }
        return sub;
      });
    });
  };

  return (
    <div className="bg-slate-950/95 border border-slate-900 rounded-2xl p-5 backdrop-blur-md shadow-xl flex flex-col h-[400px] xl:h-[480px]">
      {/* Title Header */}
      <div className="flex justify-between items-center border-b border-slate-900 pb-3 mb-2 shrink-0">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/30">
            <Sparkles className="w-4 h-4 text-indigo-400 animate-spin" style={{ animationDuration: '4s' }} />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-100 uppercase tracking-tight font-sans flex items-center gap-1.5">
              Digital Copilot
            </h3>
            <span className="text-[10px] text-slate-400 font-sans font-medium">Traffic Support Assistant</span>
          </div>
        </div>

        {/* Clear logs action */}
        <button
          onClick={() => setMessages([])}
          className="p-1.5 text-slate-500 hover:text-white rounded transition cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Messages Scroll viewport area */}
      <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-3 scrollbar-thin">
        {messages.map((m) => {
          const isMe = m.sender === 'user';
          return (
            <div
              key={m.id}
              className={`flex flex-col max-w-[85%] rounded-2xl p-3 text-xs leading-normal relative ${
                isMe
                  ? 'self-end bg-accent-blue/15 border border-accent-blue/35 text-slate-200 rounded-tr-none'
                  : 'self-start bg-black/45 border border-border-dark text-slate-300 rounded-tl-none'
              }`}
            >
              <div className="flex justify-between items-center gap-4 text-[9px] font-mono text-slate-500 mb-1 border-b border-border-dark pb-1">
                <span>{m.sender.toUpperCase()}</span>
                <span>{m.timestamp}</span>
              </div>

              {isMe ? (
                <p className="text-[11.5px] font-mono text-slate-250 leading-relaxed whitespace-pre-wrap">{m.text}</p>
              ) : (
                <div className="flex flex-col gap-1 pr-[3px]">{renderFormattedMarkdown(m.text)}</div>
              )}

              {/* Bot source signature overlay */}
              {!isMe && m.source && (
                <span className="text-[8px] font-mono text-slate-600 self-end mt-1 uppercase tracking-wider">
                  SOURCE: {m.source}
                </span>
              )}
            </div>
          );
        })}

        {isLoading && (
          <div className="self-start rounded-2xl rounded-tl-none p-3 border border-border-dark bg-black/35 text-xs text-slate-400 font-mono flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-cyan opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-cyan" />
            </span>
            Copilot synthesizing Bengaluru data matrix...
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Voice Assistant Operators Panel Overlay */}
      {isListening && (
        <div className="bg-slate-900 border border-border-dark p-3 rounded-2xl mb-1.5 flex flex-col gap-2.5 animate-fadeIn shrink-0">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-mono font-bold text-slate-300 flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-red-500 animate-ping" />
              microphone recording active (listen mode)
            </span>
            <div className="flex items-baseline gap-0.5">
              <div className="w-1 h-3.5 bg-red-500 animate-pulse" />
              <div className="w-1 h-2 bg-red-400 animate-pulse delay-75" />
              <div className="w-1 h-4 bg-red-500 animate-pulse delay-100" />
              <div className="w-1 h-1.5 bg-red-400 animate-pulse delay-150" />
            </div>
          </div>
          <p className="text-[10.5px] font-mono text-slate-400">
            Select an operator command to simulate speech-to-text input:
          </p>
          <div className="flex flex-wrap gap-1.5">
            {[
              "Show accidents in Bengaluru South",
              "Create green corridor",
              "Predict traffic after rainfall",
              "Optimize KR Puram junction"
            ].map((voiceCmd) => (
              <button
                key={voiceCmd}
                type="button"
                id={`voice-btn-${voiceCmd.replace(/\s+/g, '-').toLowerCase()}`}
                onClick={() => triggerSpokenCommand(voiceCmd)}
                className="bg-black/60 hover:bg-black/90 active:bg-slate-950 border border-slate-800 text-[10.5px] font-mono text-cyan-400 font-semibold py-1.5 px-3 rounded-xl transition duration-150 cursor-pointer flex items-center gap-1 hover:border-cyan-500/40"
              >
                🎙️ "{voiceCmd}"
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Submit Input form */}
      <form onSubmit={handleSubmit} className="flex gap-2 border-t border-border-dark pt-3 shrink-0 items-center">
        {/* Toggle Simulated Audio Input Microphones */}
        <button
          type="button"
          id="toggle-listening-mic-btn"
          onClick={() => setIsListening(!isListening)}
          className={`p-2.5 rounded-xl border transition-all duration-200 cursor-pointer ${
            isListening
              ? 'bg-red-500 border-red-400 text-white shadow-[0_0_12px_rgba(239,68,68,0.5)] animate-pulse'
              : 'bg-black/45 border-border-dark text-slate-400 hover:text-white'
          }`}
          title="Toggle Mic Operator"
        >
          {isListening ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
        </button>

        <input
          id="copilot-input-box"
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={isListening ? "Listening for voice operators..." : "Ask Copilot (e.g., 'optimize KR Puram timings')"}
          disabled={isListening}
          className="flex-1 bg-black/45 border border-border-dark rounded-xl px-3 py-2 text-xs font-mono text-slate-100 placeholder-slate-500 focus:outline-none focus:border-accent-cyan/40 transition-all"
        />

        <button
          id="copilot-submit-btn"
          type="submit"
          disabled={!inputText.trim() || isLoading || isListening}
          className="p-2.5 rounded-xl bg-accent-blue text-white font-bold transition hover:bg-opacity-90 shadow-[0_0_8px_rgba(59,130,246,0.3)] disabled:opacity-50 cursor-pointer"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
