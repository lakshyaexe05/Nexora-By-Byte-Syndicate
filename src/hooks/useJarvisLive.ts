import { useState, useRef, useEffect, useCallback } from 'react';
import { JarvisState } from '../types';

export interface UseJarvisLiveReturn {
  isVoiceActive: boolean;
  isConnecting: boolean;
  isListening: boolean;
  isSpeaking: boolean;
  isProcessing: boolean;
  jarvisState: JarvisState;
  audioLevel: number;
  liveMode: 'gemini-live' | 'browser-fallback' | 'offline';
  error: string | null;
  startVoiceSession: () => Promise<void>;
  endVoiceSession: () => void;
  interruptSpeaking: () => void;
  transcriptHistory: { role: 'user' | 'jarvis'; text: string; time: string }[];
}

/**
 * Converts Float32Array audio data to 16-bit linear PCM ArrayBuffer
 */
function floatTo16BitPCM(input: Float32Array): ArrayBuffer {
  const output = new Int16Array(input.length);
  for (let i = 0; i < input.length; i++) {
    const s = Math.max(-1, Math.min(1, input[i]));
    output[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
  }
  return output.buffer;
}

/**
 * Base64 encodes an ArrayBuffer
 */
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

/**
 * Converts base64 PCM string to Float32Array for AudioContext buffer
 */
function base64ToFloat32(base64: string): Float32Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  const int16 = new Int16Array(bytes.buffer);
  const float32 = new Float32Array(int16.length);
  for (let i = 0; i < int16.length; i++) {
    float32[i] = int16[i] / 32768.0;
  }
  return float32;
}

export function useJarvisLive(onNewMessage?: (role: 'user' | 'model', content: string) => void): UseJarvisLiveReturn {
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [liveMode, setLiveMode] = useState<'gemini-live' | 'browser-fallback' | 'offline'>('offline');
  const [error, setError] = useState<string | null>(null);
  const [transcriptHistory, setTranscriptHistory] = useState<{ role: 'user' | 'jarvis'; text: string; time: string }[]>([]);

  // Refs for audio hardware and WebSocket connection
  const wsRef = useRef<WebSocket | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const inputAudioCtxRef = useRef<AudioContext | null>(null);
  const outputAudioCtxRef = useRef<AudioContext | null>(null);
  const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
  const scheduledTimeRef = useRef<number>(0);
  const activeSourcesRef = useRef<AudioBufferSourceNode[]>([]);
  const animFrameRef = useRef<number | null>(null);
  const outputAnalyserRef = useRef<AnalyserNode | null>(null);
  const recognitionRef = useRef<any>(null);

  // Derive high-level JarvisState
  let jarvisState: JarvisState = 'idle';
  if (isSpeaking) {
    jarvisState = 'speaking';
  } else if (isProcessing) {
    jarvisState = 'processing';
  } else if (isListening) {
    jarvisState = 'listening';
  }

  // Interrupt active speech playback
  const interruptSpeaking = useCallback(() => {
    activeSourcesRef.current.forEach((src) => {
      try {
        src.stop();
        src.disconnect();
      } catch (e) {}
    });
    activeSourcesRef.current = [];
    if (outputAudioCtxRef.current) {
      scheduledTimeRef.current = outputAudioCtxRef.current.currentTime;
    }
    setIsSpeaking(false);
    setAudioLevel(0);

    // Send interruption packet to server if connected
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ interrupted: true }));
    }

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }, []);

  // Cleanup all audio and network resources
  const endVoiceSession = useCallback(() => {
    setIsVoiceActive(false);
    setIsConnecting(false);
    setIsListening(false);
    setIsSpeaking(false);
    setIsProcessing(false);
    setAudioLevel(0);

    // Stop microphone tracks
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }

    // Stop script processor
    if (scriptProcessorRef.current) {
      try {
        scriptProcessorRef.current.disconnect();
      } catch (e) {}
      scriptProcessorRef.current = null;
    }

    // Stop input AudioContext
    if (inputAudioCtxRef.current) {
      try {
        inputAudioCtxRef.current.close();
      } catch (e) {}
      inputAudioCtxRef.current = null;
    }

    // Stop active audio output sources
    activeSourcesRef.current.forEach((src) => {
      try {
        src.stop();
        src.disconnect();
      } catch (e) {}
    });
    activeSourcesRef.current = [];

    // Stop output AudioContext
    if (outputAudioCtxRef.current) {
      try {
        outputAudioCtxRef.current.close();
      } catch (e) {}
      outputAudioCtxRef.current = null;
    }

    // Close WebSocket
    if (wsRef.current) {
      try {
        wsRef.current.close();
      } catch (e) {}
      wsRef.current = null;
    }

    // Cancel animation frame
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }

    // Stop browser recognition fallback
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }, []);

  // Browser speech fallback engine when Gemini Live WebSocket is unavailable
  const startBrowserSpeechFallback = useCallback(async () => {
    setLiveMode('browser-fallback');
    setIsConnecting(false);
    setIsVoiceActive(true);
    setIsListening(true);

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError('Voice interaction not supported in this browser environment.');
      return;
    }

    const recog = new SpeechRecognition();
    recog.continuous = true;
    recog.interimResults = false;
    recog.lang = 'en-US';

    recog.onstart = () => {
      setIsListening(true);
      setIsProcessing(false);
    };

    recog.onresult = async (event: any) => {
      const results = event.results;
      const latest = results[results.length - 1];
      if (latest && latest[0] && latest[0].transcript) {
        const text = latest[0].transcript.trim();
        if (!text) return;

        // User spoke
        setIsListening(false);
        setIsProcessing(true);
        const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        setTranscriptHistory((prev) => [...prev, { role: 'user', text, time: timeStr }]);
        if (onNewMessage) onNewMessage('user', text);

        try {
          // Call JARVIS chat API
          const res = await fetch('/api/gemini/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              messages: [{ role: 'user', content: text }],
              persona: 'jarvis',
            }),
          });
          const data = await res.json();
          const reply = data.content || "Understood. Let's arrange your focus for the day.";
          
          setIsProcessing(false);
          setIsSpeaking(true);
          setTranscriptHistory((prev) => [...prev, { role: 'jarvis', text: reply, time: timeStr }]);
          if (onNewMessage) onNewMessage('model', reply);

          // Speak reply using browser speech synthesis
          if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(reply);
            utterance.rate = 1.0;
            utterance.pitch = 0.95; // Slightly lower, refined tone

            // Pick British or deep English voice if available
            const voices = window.speechSynthesis.getVoices();
            const preferred =
              voices.find((v) => /en[-_]GB|British|Oliver|Daniel|Arthur/i.test(v.name || v.lang)) ||
              voices.find((v) => v.lang.startsWith('en'));
            if (preferred) utterance.voice = preferred;

            // Simulate amplitude during synthesis
            let tick = 0;
            const synthInterval = setInterval(() => {
              tick++;
              setAudioLevel(0.25 + Math.sin(tick * 0.4) * 0.2 + (Math.random() * 0.15));
            }, 80);

            utterance.onend = () => {
              clearInterval(synthInterval);
              setIsSpeaking(false);
              setAudioLevel(0);
              setIsListening(true);
            };

            utterance.onerror = () => {
              clearInterval(synthInterval);
              setIsSpeaking(false);
              setAudioLevel(0);
              setIsListening(true);
            };

            window.speechSynthesis.speak(utterance);
          } else {
            setIsSpeaking(false);
            setIsListening(true);
          }
        } catch (err: any) {
          setIsProcessing(false);
          setIsListening(true);
          setError(err?.message || 'Chat request failed');
        }
      }
    };

    recog.onerror = (e: any) => {
      console.warn('[JARVIS Fallback] Speech error:', e);
      if (e.error !== 'no-speech') {
        setIsListening(false);
      }
    };

    recog.onend = () => {
      // Re-start if still active
      if (isVoiceActive) {
        try {
          recog.start();
        } catch (e) {}
      }
    };

    try {
      recog.start();
      recognitionRef.current = recog;
    } catch (e) {
      console.warn('[JARVIS Fallback] Start failed:', e);
    }
  }, [isVoiceActive, onNewMessage]);

  // Main start voice session function
  const startVoiceSession = useCallback(async () => {
    setError(null);
    setIsConnecting(true);

    // 1. Request microphone permission
    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          sampleRate: 16000,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      mediaStreamRef.current = stream;
    } catch (err: any) {
      setIsConnecting(false);
      setError('Microphone access was denied. Please allow microphone permissions to converse with JARVIS.');
      return;
    }

    // 2. Setup AudioContexts and Real-Time Output Analyser
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    const inputCtx = new AudioContextClass({ sampleRate: 16000 });
    const outputCtx = new AudioContextClass({ sampleRate: 24000 });
    inputAudioCtxRef.current = inputCtx;
    outputAudioCtxRef.current = outputCtx;
    scheduledTimeRef.current = outputCtx.currentTime;

    const outputAnalyser = outputCtx.createAnalyser();
    outputAnalyser.fftSize = 128;
    outputAnalyser.smoothingTimeConstant = 0.25;
    outputAnalyser.connect(outputCtx.destination);
    outputAnalyserRef.current = outputAnalyser;

    // Continuous audioLevel polling loop for live playback
    const sampleOutputAudio = () => {
      if (outputAnalyserRef.current && activeSourcesRef.current.length > 0) {
        const dataArray = new Uint8Array(outputAnalyserRef.current.frequencyBinCount);
        outputAnalyserRef.current.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const avg = sum / (dataArray.length * 255);
        // Sensitive mapping to 0..1 for speech mouth envelope
        const level = Math.min(1.0, Math.max(0, (avg - 0.04) * 3.8));
        setAudioLevel(level);
      }
      animFrameRef.current = requestAnimationFrame(sampleOutputAudio);
    };
    animFrameRef.current = requestAnimationFrame(sampleOutputAudio);

    // 3. Connect to server-side Gemini Live WebSocket bridge
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/api/live`;

    let socket: WebSocket;
    try {
      socket = new WebSocket(wsUrl);
      wsRef.current = socket;
    } catch (e) {
      console.warn('[JARVIS] WebSocket connect error, falling back to browser speech:', e);
      await startBrowserSpeechFallback();
      return;
    }

    const connectionTimeout = setTimeout(() => {
      if (socket.readyState !== WebSocket.OPEN) {
        console.warn('[JARVIS] WebSocket connection timeout, falling back to browser voice.');
        try {
          socket.close();
        } catch (e) {}
        startBrowserSpeechFallback();
      }
    }, 5000);

    socket.onopen = () => {
      clearTimeout(connectionTimeout);
      setIsConnecting(false);
      setIsVoiceActive(true);
      setIsListening(true);
      setLiveMode('gemini-live');

      // Setup microphone streaming
      const source = inputCtx.createMediaStreamSource(stream);
      const processor = inputCtx.createScriptProcessor(2048, 1, 1);
      scriptProcessorRef.current = processor;

      processor.onaudioprocess = (e) => {
        if (socket.readyState !== WebSocket.OPEN) return;
        const channelData = e.inputBuffer.getChannelData(0);

        // Compute input audio RMS for visual responsiveness
        let sum = 0;
        for (let i = 0; i < channelData.length; i++) {
          sum += channelData[i] * channelData[i];
        }
        const rms = Math.sqrt(sum / channelData.length);
        if (!isSpeaking) {
          setAudioLevel(Math.min(1, rms * 4.5));
        }

        // Send PCM chunk to server
        const pcmBuffer = floatTo16BitPCM(channelData);
        const base64Pcm = arrayBufferToBase64(pcmBuffer);
        socket.send(JSON.stringify({ audio: base64Pcm }));
      };

      source.connect(processor);
      processor.connect(inputCtx.destination);
    };

    socket.onmessage = async (event) => {
      try {
        const data = JSON.parse(event.data);

        // Handle model interruption
        if (data.interrupted) {
          interruptSpeaking();
          return;
        }

        // Handle received audio chunk
        if (data.audio) {
          setIsListening(false);
          setIsProcessing(false);
          setIsSpeaking(true);

          const float32 = base64ToFloat32(data.audio);
          const audioBuffer = outputCtx.createBuffer(1, float32.length, 24000);
          audioBuffer.getChannelData(0).set(float32);

          const bufferSource = outputCtx.createBufferSource();
          bufferSource.buffer = audioBuffer;

          // Connect to output analyser (which routes to outputCtx.destination)
          if (outputAnalyserRef.current) {
            bufferSource.connect(outputAnalyserRef.current);
          } else {
            bufferSource.connect(outputCtx.destination);
          }

          // Calculate start time to schedule gapless audio playback
          const currentTime = outputCtx.currentTime;
          if (scheduledTimeRef.current < currentTime) {
            scheduledTimeRef.current = currentTime;
          }

          bufferSource.start(scheduledTimeRef.current);
          scheduledTimeRef.current += audioBuffer.duration;
          activeSourcesRef.current.push(bufferSource);

          // Modulate real-time audioLevel
          let sum = 0;
          for (let i = 0; i < float32.length; i++) {
            sum += float32[i] * float32[i];
          }
          const rms = Math.sqrt(sum / float32.length);
          setAudioLevel(Math.min(1, 0.15 + rms * 3.5));

          bufferSource.onended = () => {
            activeSourcesRef.current = activeSourcesRef.current.filter((s) => s !== bufferSource);
            if (activeSourcesRef.current.length === 0) {
              setIsSpeaking(false);
              setAudioLevel(0);
              setIsListening(true);
            }
          };
        }

        // Handle text transcription/content
        if (data.text) {
          const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          setTranscriptHistory((prev) => [...prev, { role: 'jarvis', text: data.text, time: timeStr }]);
          if (onNewMessage) onNewMessage('model', data.text);
        }

        if (data.error) {
          console.warn('[JARVIS Live] Backend error:', data.error);
          setError(data.error);
        }
      } catch (err) {
        console.warn('[JARVIS Live] Message parse error:', err);
      }
    };

    socket.onerror = (err) => {
      clearTimeout(connectionTimeout);
      console.warn('[JARVIS Live] WebSocket error, switching to browser speech:', err);
      try {
        socket.close();
      } catch (e) {}
      startBrowserSpeechFallback();
    };

    socket.onclose = () => {
      clearTimeout(connectionTimeout);
      if (isVoiceActive) {
        endVoiceSession();
      }
    };
  }, [endVoiceSession, interruptSpeaking, isSpeaking, isVoiceActive, onNewMessage, startBrowserSpeechFallback]);

  // Clean up on component unmount
  useEffect(() => {
    return () => {
      endVoiceSession();
    };
  }, [endVoiceSession]);

  return {
    isVoiceActive,
    isConnecting,
    isListening,
    isSpeaking,
    isProcessing,
    jarvisState,
    audioLevel,
    liveMode,
    error,
    startVoiceSession,
    endVoiceSession,
    interruptSpeaking,
    transcriptHistory,
  };
}
