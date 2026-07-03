import React, { useState, useEffect, useRef } from 'react';
import { api } from '../api';
import { services } from './Services';

const Chatbot = () => {
  const initialMessage = {
    text: 'Welcome to AI Solutions. I’m your strategic AI advisor for enterprise services, pilots, and onboarding. How can I support your project today?',
    sender: 'bot',
  };
  const [messages, setMessages] = useState([initialMessage]);
  const [input, setInput] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState('Click the microphone to search services');
  const [serviceResults, setServiceResults] = useState([]);
  const [voiceSupported, setVoiceSupported] = useState(false);
  const recognitionRef = useRef(null);
  const scrollRef = useRef(null);

  const suggestions = [
    'Request a service overview',
    'Share project goals',
    'How can we engage the team?',
    'What is your pricing model?',
    'Show uploaded event registrations',
    'Schedule a discovery session'
  ];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping, serviceResults]);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setVoiceSupported(false);
      return;
    }

    setVoiceSupported(true);
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = true;
    recognition.continuous = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
      setVoiceStatus('Listening... speak clearly into your microphone.');
    };

    recognition.onend = () => {
      setIsListening(false);
      if (voiceStatus.includes('Searching') || voiceStatus.includes('complete')) return;
      setVoiceStatus('Click the microphone to search services');
    };

    recognition.onerror = (event) => {
      setIsListening(false);
      setVoiceStatus('Voice recognition error, try again.');
      console.error('Speech recognition error:', event.error);
    };

    recognition.onresult = (event) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      if (interimTranscript) {
        setInput(interimTranscript);
        setVoiceStatus(`Listening: ${interimTranscript}`);
      }

      if (finalTranscript) {
        setInput(finalTranscript);
        setVoiceStatus(`Heard: ${finalTranscript}`);
        handleVoiceSearch(finalTranscript);
      }
    };

    recognitionRef.current = recognition;
  }, []);

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const sendMessage = async (messageText = input) => {
    const trimmedMessage = messageText.trim();
    if (!trimmedMessage) return;

    setServiceResults([]);
    setMessages((prev) => [...prev, { text: trimmedMessage, sender: 'user' }]);
    setInput('');
    setIsTyping(true);
    const startTime = Date.now();

    try {
      const res = await api.post('/chatbot', { userMessage: trimmedMessage });
      const elapsed = Date.now() - startTime;
      if (elapsed < 1000) {
        await delay(1000 - elapsed);
      }
      setMessages((prev) => [...prev, { text: res.data.botResponse, sender: 'bot' }]);
    } catch (error) {
      console.error(error);
      const elapsed = Date.now() - startTime;
      if (elapsed < 1000) {
        await delay(1000 - elapsed);
      }
      setMessages((prev) => [...prev, { text: 'Unable to reach the bot. Please try again later.', sender: 'bot' }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSend = () => {
    if (!input.trim()) return;
    sendMessage(input);
  };

  const handleSuggestion = (suggestion) => {
    setServiceResults([]);
    sendMessage(suggestion);
  };

  const clearChat = () => {
    setMessages([initialMessage]);
    setServiceResults([]);
    setVoiceStatus('Click the microphone to search services');
  };

  const findMatchingServices = (query) => {
    const cleanedQuery = query.trim().toLowerCase();
    if (!cleanedQuery) return [];
    return services.filter((service) => {
      const title = service.title.toLowerCase();
      const description = service.description.toLowerCase();
      return title.includes(cleanedQuery) || description.includes(cleanedQuery) || cleanedQuery.split(' ').some((term) => title.includes(term) || description.includes(term));
    });
  };

  const handleVoiceSearch = async (query) => {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) {
      setVoiceStatus('No speech detected, please try again.');
      return;
    }

    setIsTyping(true);
    setVoiceStatus('Searching services...');
    setServiceResults([]);

    const results = findMatchingServices(trimmedQuery);
    setMessages((prev) => [...prev, { text: trimmedQuery, sender: 'user' }]);
    await delay(250);

    if (results.length > 0) {
      setMessages((prev) => [...prev, {
        text: `I found ${results.length} matching service${results.length > 1 ? 's' : ''} for "${trimmedQuery}". See the results below.`,
        sender: 'bot',
      }]);
      setVoiceStatus('Search complete. Review the matching services.');
    } else {
      setMessages((prev) => [...prev, {
        text: `I couldn't find any services matching "${trimmedQuery}". Try a different phrase.`,
        sender: 'bot',
      }]);
      setVoiceStatus('No matching services found. Try another voice query.');
    }

    setServiceResults(results);
    setIsTyping(false);
  };

  const handleMicrophone = () => {
    if (!voiceSupported) return;
    if (isListening) {
      recognitionRef.current?.stop();
      return;
    }

    setVoiceStatus('Preparing microphone...');
    setServiceResults([]);

    try {
      recognitionRef.current?.start();
    } catch (error) {
      console.error('Speech recognition start failed:', error);
      setVoiceStatus('Unable to access microphone, please try again.');
    }
  };

  if (isMinimized) {
    return (
      <div className="fixed bottom-6 right-6 z-50 animate-fade-in-up chatbot-widget">
        <button
          onClick={() => setIsMinimized(false)}
          className="flex items-center justify-center bg-slate-900 text-white p-3 rounded-full shadow-[0_20px_60px_-20px_rgba(15,23,42,0.6)] transition-colors duration-300 hover:bg-slate-800"
          aria-label="Open chat widget"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </button>
      </div>
    );
  }

  const renderMessageText = (text) => {
    if (typeof text !== 'string') return text;
    const contactToken = '/contact';
    if (!text.includes(contactToken)) return text;

    const parts = text.split(contactToken);
    return parts.flatMap((part, index) => {
      if (index === parts.length - 1) return part;
      return [
        part,
        <a
          key={`contact-link-${index}`}
          href="/contact"
          className="text-cyan-500 underline hover:text-cyan-300"
        >
          Contact page
        </a>,
      ];
    });
  };

  return (
    <div className="fixed bottom-4 right-4 left-4 sm:right-6 sm:left-auto z-50 animate-fade-in-up chatbot-widget">
      <div className="chatbot-panel w-full max-w-md mx-auto overflow-hidden rounded-[2rem] border border-white/15 bg-white/75 shadow-[0_40px_120px_-48px_rgba(15,23,42,0.32)] backdrop-blur-xl transition-all duration-300 ease-out">
        <div className="chatbot-header relative overflow-hidden bg-slate-950 px-5 py-5 text-white">
          <div className="absolute inset-x-0 top-0 h-32 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.22),transparent_30%),radial-gradient(circle_at_top_right,rgba(52,211,153,0.18),transparent_35%)] pointer-events-none" />
          <div className="relative flex items-start gap-4">
            <div className="relative flex h-16 w-16 items-center justify-center rounded-[1.75rem] bg-gradient-to-br from-cyan-500 to-sky-500 shadow-[0_24px_64px_-32px_rgba(14,165,233,0.6)] ring-1 ring-white/15">
              <span className="text-2xl">🤖</span>
            </div>
            <div className="min-w-0">
              <p className="text-[11px] uppercase tracking-[0.4em] text-cyan-200 font-semibold">AI Solutions</p>
              <h3 className="text-2xl font-semibold tracking-tight text-white">Virtual Assistant</h3>
              <p className="mt-1 text-sm text-slate-300/90">A premium AI assistant for intelligent service discovery and support.</p>
            </div>
          </div>
          <div className="relative mt-5 flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold text-slate-100 shadow-sm backdrop-blur-sm">
              <span className="inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_0_8px_rgba(16,185,129,0.16)]" />
              Online
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={clearChat}
                className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-sm text-slate-100 transition hover:border-white/20 hover:bg-white/15"
                aria-label="Clear chat history"
              >
                Clear
              </button>
              <button
                onClick={() => setIsMinimized(true)}
                className="rounded-full border border-white/15 bg-white/10 p-2 text-slate-100 transition hover:border-white/20 hover:bg-white/15"
                aria-label="Minimize chat widget"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        <div className="p-5 pt-6">
          <div ref={scrollRef} aria-live="polite" className="chatbot-history h-72 overflow-y-auto mb-4 space-y-3 pr-1 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent">
            {messages.length === 0 && (
              <div className="rounded-[1.75rem] border border-dashed border-slate-200/70 bg-slate-50/75 p-4 text-sm text-slate-500">
                Start a conversation to get fast AI guidance.
              </div>
            )}
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`chatbot-msg ${msg.sender === 'user' ? 'user' : 'bot'}`}>
                  {renderMessageText(msg.text)}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="chatbot-typing rounded-[1.75rem] bg-slate-100/90 p-4 text-slate-700 shadow-sm">
                  <div className="mb-2 text-sm font-medium text-slate-900">AI is composing a response</div>
                  <div className="flex items-center gap-2">
                    <span className="typing-dot" />
                    <span className="typing-dot delay-150" />
                    <span className="typing-dot delay-300" />
                  </div>
                </div>
              </div>
            )}
            {serviceResults.length > 0 && (
              <div className="mb-4 rounded-[1.75rem] border border-slate-200/70 bg-slate-50/90 p-4 text-sm text-slate-700 shadow-sm">
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Service search results</p>
                    <p className="text-xs text-slate-500">Voice search matched the services below.</p>
                  </div>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-500">{serviceResults.length} result{serviceResults.length > 1 ? 's' : ''}</span>
                </div>
                <div className="space-y-3">
                  {serviceResults.map((result, index) => (
                    <div key={index} className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
                      <p className="text-sm font-semibold text-slate-900">{result.title}</p>
                      <p className="mt-1 text-xs text-slate-600">{result.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="mb-3 rounded-[1.75rem] border border-slate-200/70 bg-slate-50/90 p-3 text-sm text-slate-600 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-semibold text-slate-900">Voice Search</p>
                <p className="mt-1 text-xs text-slate-500">{voiceStatus}</p>
              </div>
              <button
                type="button"
                onClick={handleMicrophone}
                disabled={!voiceSupported}
                className={`chatbot-voice-button inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold transition ${isListening ? 'bg-emerald-500 text-white border-emerald-500 shadow-[0_8px_24px_-12px_rgba(16,185,129,0.4)]' : 'bg-white text-slate-700 hover:bg-slate-100'} ${!voiceSupported ? 'opacity-50 cursor-not-allowed' : ''}`}
                aria-label="Activate voice search"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 1.75a3.75 3.75 0 0 1 3.75 3.75v3.75a3.75 3.75 0 0 1-7.5 0V5.5A3.75 3.75 0 0 1 12 1.75z" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M19.5 10.25a7.5 7.5 0 0 1-15 0" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M12 18.5v3.75" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M8.5 22.25h7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {isListening ? 'Stop' : 'Voice search'}
              </button>
            </div>
          </div>

          <div className="mb-3 grid gap-2 sm:grid-cols-2">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => handleSuggestion(suggestion)}
                className="chatbot-action-pill rounded-3xl border border-slate-200 bg-slate-50 px-4 py-2 text-left text-xs font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-100"
              >
                {suggestion}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleSend(); } }}
              className="chatbot-input flex-1 rounded-full border border-slate-200 bg-white/90 px-4 py-3 text-sm text-slate-800 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
              placeholder="Type your question or project details..."
            />
            <button
              onClick={handleSend}
              className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-slate-950 text-white shadow-lg shadow-slate-950/10 hover:bg-slate-800 transition-colors duration-300"
              aria-label="Send message"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;