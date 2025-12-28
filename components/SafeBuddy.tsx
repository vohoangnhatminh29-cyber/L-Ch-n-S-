
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality, GenerateContentResponse } from '@google/genai';
import { normalizeTeenCode, SAFE_BUDDY_INSTRUCTION } from '../services/geminiService';
import { ChatMessage } from '../types';

interface SafeBuddyProps {
  onClose: () => void;
  initialLiveMode?: boolean;
}

// Manual implementation of encode/decode as per guidelines
function decodeBase64(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

function encodeBase64(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

const SafeBuddy: React.FC<SafeBuddyProps> = ({ onClose, initialLiveMode = false }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { 
      role: 'model', 
      text: 'Chào bạn! Mình là Trợ lý AI Lá Chắn Số. 🛡️\n\nHôm nay mình có thể giúp gì để bảo vệ an toàn mạng cho bạn không? [GỢI Ý: 🔍 Kiểm tra đường link nghi ngờ] [GỢI Ý: 📚 Thủ đoạn lừa đảo mới nhất] [GỢI Ý: 🛡️ Cách bảo mật tài khoản]' 
    }
  ]);
  const [input, setInput] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isLive, setIsLive] = useState(false);
  const [expandedMessageIdx, setExpandedMessageIdx] = useState<number | null>(null);
  const [readingMessageIdx, setReadingMessageIdx] = useState<number | null>(null);
  const [liveError, setLiveError] = useState<string | null>(null);
  
  // Real-time transcription states
  const [liveInputTranscript, setLiveInputTranscript] = useState('');
  const [liveOutputTranscript, setLiveOutputTranscript] = useState('');
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Live API Refs
  const audioContextInRef = useRef<AudioContext | null>(null);
  const audioContextOutRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const activeSourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const sessionPromiseRef = useRef<Promise<any> | null>(null);
  const liveTransRef = useRef({ input: '', output: '' });
  const micStreamRef = useRef<MediaStream | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const isConnectingRef = useRef(false);
  const isSessionActiveRef = useRef(false);
  const hasStartedInitialRef = useRef(false);

  // Visualizer Animation
  const [waveAmplitudes, setWaveAmplitudes] = useState<number[]>(new Array(15).fill(10));

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, loading, expandedMessageIdx, liveInputTranscript, liveOutputTranscript]);

  useEffect(() => {
    let animationFrame: number;
    const updateWaves = () => {
      if (isLive && analyserRef.current) {
        const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
        analyserRef.current.getByteFrequencyData(dataArray);
        const newAmps = [];
        const step = Math.floor(dataArray.length / 15);
        for (let i = 0; i < 15; i++) {
          const val = dataArray[i * step] || 0;
          newAmps.push(15 + (val / 255) * 75);
        }
        setWaveAmplitudes(newAmps);
      }
      animationFrame = requestAnimationFrame(updateWaves);
    };

    if (isLive) animationFrame = requestAnimationFrame(updateWaves);
    else setWaveAmplitudes(new Array(15).fill(10));

    return () => cancelAnimationFrame(animationFrame);
  }, [isLive]);

  useEffect(() => {
    if (initialLiveMode && !hasStartedInitialRef.current) {
      hasStartedInitialRef.current = true;
      const t = setTimeout(() => {
        startLiveSession();
      }, 500);
      return () => clearTimeout(t);
    }
    
    return () => {
      stopLiveSession();
    };
  }, [initialLiveMode]);

  const speakMessage = async (idx: number, text: string) => {
    if (readingMessageIdx !== null) return;
    setReadingMessageIdx(idx);
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const { cleanText, detail } = parseContent(text);
      const textToRead = cleanText + (detail ? ". Thông tin thêm: " + detail : "");
      
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: `Đọc to bằng tiếng Việt một cách tự nhiên và nhanh: ${textToRead}` }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } },
          },
        },
      });
      
      const audioData = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (audioData) {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)({sampleRate: 24000});
        const buffer = await decodeAudioData(decodeBase64(audioData), ctx, 24000, 1);
        const source = ctx.createBufferSource();
        source.buffer = buffer;
        source.connect(ctx.destination);
        source.onended = () => { setReadingMessageIdx(null); ctx.close(); };
        source.start();
      } else {
        setReadingMessageIdx(null);
      }
    } catch (e) {
      console.error('TTS Error:', e);
      setReadingMessageIdx(null);
    }
  };

  const handleApiKeyCheck = async () => {
    if (typeof (window as any).aistudio?.hasSelectedApiKey === 'function') {
      const hasKey = await (window as any).aistudio.hasSelectedApiKey();
      if (!hasKey) {
        await (window as any).aistudio.openSelectKey();
        // Assuming success to avoid race conditions
      }
    }
  };

  const startLiveSession = async () => {
    if (isConnectingRef.current || isSessionActiveRef.current) return;
    
    setLiveError(null);
    setLiveInputTranscript('');
    setLiveOutputTranscript('');
    setIsLive(true);
    isConnectingRef.current = true;
    
    try {
      await handleApiKeyCheck();
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      if (!audioContextInRef.current || audioContextInRef.current.state === 'closed') {
        audioContextInRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      }
      if (!audioContextOutRef.current || audioContextOutRef.current.state === 'closed') {
        audioContextOutRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      }
      
      await Promise.all([
        audioContextInRef.current.resume(),
        audioContextOutRef.current.resume()
      ]);
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      micStreamRef.current = stream;
      
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        config: {
          responseModalities: [Modality.AUDIO],
          systemInstruction: SAFE_BUDDY_INSTRUCTION + ' (Bạn đang đàm thoại trực tiếp. Trả lời cực kỳ ngắn gọn, súc tích và ưu tiên cảnh báo nhanh).',
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } },
          },
          inputAudioTranscription: {},
          outputAudioTranscription: {},
        },
        callbacks: {
          onopen: () => {
            isConnectingRef.current = false;
            isSessionActiveRef.current = true;
            
            if (!audioContextInRef.current || !micStreamRef.current) return;

            const source = audioContextInRef.current.createMediaStreamSource(micStreamRef.current);
            const analyser = audioContextInRef.current.createAnalyser();
            analyser.fftSize = 64;
            analyserRef.current = analyser;
            source.connect(analyser);

            const scriptProcessor = audioContextInRef.current.createScriptProcessor(4096, 1, 1);
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const int16 = new Int16Array(inputData.length);
              for (let i = 0; i < inputData.length; i++) {
                int16[i] = inputData[i] * 32768;
              }
              const base64 = encodeBase64(new Uint8Array(int16.buffer));
              sessionPromise.then((session) => {
                session.sendRealtimeInput({ 
                  media: { data: base64, mimeType: 'audio/pcm;rate=16000' } 
                });
              }).catch(err => {
                console.warn('Realtime input error:', err);
              });
            };
            source.connect(scriptProcessor);
            scriptProcessor.connect(audioContextInRef.current.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            const audioData = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (audioData && audioContextOutRef.current) {
              const ctx = audioContextOutRef.current;
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
              const buffer = await decodeAudioData(decodeBase64(audioData), ctx, 24000, 1);
              const source = ctx.createBufferSource();
              source.buffer = buffer;
              source.connect(ctx.destination);
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += buffer.duration;
              activeSourcesRef.current.add(source);
              source.onended = () => activeSourcesRef.current.delete(source);
            }

            if (message.serverContent?.interrupted) {
              activeSourcesRef.current.forEach(s => { try { s.stop(); } catch(e) {} });
              activeSourcesRef.current.clear();
              nextStartTimeRef.current = 0;
            }

            if (message.serverContent?.inputTranscription) {
              const text = message.serverContent.inputTranscription.text;
              liveTransRef.current.input += text;
              setLiveInputTranscript(prev => prev + text);
            }
            if (message.serverContent?.outputTranscription) {
              const text = message.serverContent.outputTranscription.text;
              liveTransRef.current.output += text;
              setLiveOutputTranscript(prev => prev + text);
            }
            
            if (message.serverContent?.turnComplete) {
              const uInput = liveTransRef.current.input.trim();
              const mOutput = liveTransRef.current.output.trim();
              if (uInput || mOutput) {
                setMessages(prev => [
                  ...prev,
                  ...(uInput ? [{ role: 'user', text: uInput } as ChatMessage] : []),
                  ...(mOutput ? [{ role: 'model', text: mOutput } as ChatMessage] : [])
                ]);
              }
              liveTransRef.current = { input: '', output: '' };
              setLiveInputTranscript('');
              setLiveOutputTranscript('');
            }
          },
          onerror: (e: any) => {
            console.error('Live API Error:', e);
            const errMsg = e.message || "";
            if (errMsg.includes("Requested entity was not found")) {
              setLiveError("Không tìm thấy dự án hoặc mô hình. Vui lòng chọn lại API Key hợp lệ.");
            } else {
              setLiveError("Lỗi kết nối mạng (Network Error). Vui lòng kiểm tra API Key và kết nối Internet.");
            }
            stopLiveSession();
          },
          onclose: () => {
            isSessionActiveRef.current = false;
            setIsLive(false);
          },
        },
      });

      sessionPromise.catch(err => {
        console.error("Live connection failed:", err);
        setLiveError("Không thể thiết lập kết nối: " + (err.message || "Network Error"));
        stopLiveSession();
      });

      sessionPromiseRef.current = sessionPromise;
    } catch (err: any) {
      console.error("Initialization error:", err);
      setLiveError(err.message || "Lỗi khởi tạo hệ thống.");
      stopLiveSession();
    }
  };

  const stopLiveSession = () => {
    isConnectingRef.current = false;
    isSessionActiveRef.current = false;
    if (sessionPromiseRef.current) {
      sessionPromiseRef.current.then(session => { try { session.close(); } catch(e) {} });
      sessionPromiseRef.current = null;
    }
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach(track => track.stop());
      micStreamRef.current = null;
    }
    activeSourcesRef.current.forEach(s => { try { s.stop(); } catch(e) {} });
    activeSourcesRef.current.clear();
    setIsLive(false);
    setLiveInputTranscript('');
    setLiveOutputTranscript('');
  };

  const handleSend = async (textOverride?: string) => {
    const msgText = textOverride || input;
    if (!msgText.trim() && !image) return;

    setInput('');
    setImage(null);
    setMessages(prev => [...prev, { role: 'user', text: msgText || "[Hình ảnh]" }]);
    setLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const chat = ai.chats.create({
        model: "gemini-3-flash-preview",
        config: { 
          systemInstruction: SAFE_BUDDY_INSTRUCTION,
          thinkingConfig: { thinkingBudget: 4096 }
        }
      });

      const streamResponse = await chat.sendMessageStream({ message: normalizeTeenCode(msgText) });
      let fullResponse = "";
      setMessages(prev => [...prev, { role: 'model', text: "" }]);
      setLoading(false);

      for await (const chunk of streamResponse) {
        const c = chunk as GenerateContentResponse;
        fullResponse += (c.text || "");
        setMessages(prev => {
          const newMsgs = [...prev];
          newMsgs[newMsgs.length - 1].text = fullResponse;
          return newMsgs;
        });
      }
    } catch (e) {
      console.error("Chat Error:", e);
      setMessages(prev => [...prev, { role: 'model', text: 'LCS đang gặp sự cố kết nối AI. Vui lòng thử lại.' }]);
      setLoading(false);
    }
  };

  const parseContent = (text: string) => {
    const suggestions: string[] = [];
    const suggestionsRegex = /\[GỢI Ý:\s*(.*?)\]/g;
    let sMatch;
    while ((sMatch = suggestionsRegex.exec(text)) !== null) suggestions.push(sMatch[1]);
    const detailRegex = /\[CHI TIẾT:\s*([\s\S]*?)\]/;
    const dMatch = text.match(detailRegex);
    const detail = dMatch ? dMatch[1].trim() : null;
    let cleanText = text.replace(suggestionsRegex, '').replace(detailRegex, '').trim();
    return { cleanText, suggestions, detail };
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col w-[92vw] max-w-[420px] h-[78vh] bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-10 duration-300 relative">
      
      {/* Immersive Voice Overlay */}
      {isLive && (
        <div className="absolute inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col items-center justify-between p-8 animate-in fade-in duration-300">
           <div className="w-full flex justify-end">
              <button onClick={stopLiveSession} className="p-3 bg-white/10 rounded-full text-white hover:bg-white/20 transition-all border border-white/10">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
           </div>

           <div className="flex-1 flex flex-col items-center justify-center w-full text-center space-y-8">
              {liveError ? (
                <div className="space-y-4 px-6">
                  <p className="text-red-500 font-bold leading-relaxed">{liveError}</p>
                  <div className="flex flex-col gap-3">
                    <button onClick={startLiveSession} className="w-full py-3 bg-blue-600 text-white rounded-2xl font-bold active:scale-95 transition-all">Thử kết nối lại</button>
                    <button 
                      onClick={async () => {
                        if ((window as any).aistudio?.openSelectKey) {
                          await (window as any).aistudio.openSelectKey();
                          startLiveSession();
                        }
                      }} 
                      className="w-full py-3 bg-slate-800 text-slate-300 rounded-2xl text-xs font-black uppercase tracking-widest active:scale-95 transition-all border border-slate-700"
                    >
                      Chọn API Key khác
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-end gap-1.5 h-24">
                    {waveAmplitudes.map((amp, i) => (
                      <div key={i} className="w-1.5 rounded-full bg-blue-500 animate-pulse" style={{ height: `${amp}%`, opacity: 0.6 + (amp / 100) }}></div>
                    ))}
                  </div>

                  <div className="w-full space-y-4 px-4 overflow-y-auto max-h-[40vh] no-scrollbar">
                    {liveInputTranscript && (
                      <div className="bg-white/5 p-4 rounded-2xl animate-in slide-in-from-bottom-2">
                        <p className="text-[10px] text-blue-400 font-black uppercase tracking-widest mb-1 text-left">Bạn đang nói:</p>
                        <p className="text-white text-sm text-left italic">{liveInputTranscript}</p>
                      </div>
                    )}
                    {liveOutputTranscript && (
                      <div className="bg-blue-600/10 p-4 rounded-2xl animate-in slide-in-from-bottom-2">
                        <p className="text-[10px] text-emerald-400 font-black uppercase tracking-widest mb-1 text-left">LCS trả lời:</p>
                        <p className="text-white text-sm text-left">{liveOutputTranscript}</p>
                      </div>
                    )}
                  </div>

                  <div className="pt-4">
                    <h2 className="text-white font-black text-xl tracking-widest uppercase mb-2">Lá Chắn Số Live</h2>
                    <p className="text-slate-400 text-xs italic">{isConnectingRef.current ? "Đang kết nối trung tâm..." : "Đang lắng nghe & Phân tích rủi ro..."}</p>
                  </div>
                </>
              )}
           </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-4 text-white flex items-center justify-between shadow-md shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md">
            <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none">
              <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="white" strokeWidth="1.5" strokeDasharray="2 2" />
              <rect x="7" y="11" width="10" height="7" rx="3" fill="white" fillOpacity="0.2" stroke="white" strokeWidth="1.5"/>
            </svg>
          </div>
          <div>
            <h3 className="font-black text-xs sm:text-sm leading-none mb-1">Trợ lý AI Lá Chắn Số</h3>
            <p className="text-[9px] text-emerald-300 font-bold uppercase tracking-widest">ONLINE</p>
          </div>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>

      {/* Chat Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-6 bg-slate-50/50 dark:bg-slate-950/20 no-scrollbar">
        {messages.map((msg, i) => {
          const { cleanText, suggestions, detail } = parseContent(msg.text);
          const isExpanded = expandedMessageIdx === i;
          const isReading = readingMessageIdx === i;

          return (
            <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
              <div className={`relative max-w-[92%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm transition-all duration-300 ${
                msg.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none font-medium' : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-100 dark:border-slate-700 rounded-tl-none font-medium'
              }`}>
                {msg.role === 'model' && (
                  <button onClick={() => speakMessage(i, msg.text)} className={`absolute -right-10 top-0 p-2 rounded-full shadow-sm ${isReading ? 'bg-blue-600 text-white animate-pulse' : 'bg-white dark:bg-slate-800 text-slate-400'}`}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg>
                  </button>
                )}
                <div className="whitespace-pre-wrap font-sans">{cleanText}</div>
                {detail && !isExpanded && (
                  <button onClick={() => setExpandedMessageIdx(i)} className="mt-3 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-lg text-[10px] font-black uppercase flex items-center gap-1">Xem chi tiết <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/></svg></button>
                )}
                {detail && isExpanded && (
                  <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700 animate-in fade-in slide-in-from-top-3">
                    <div className="whitespace-pre-wrap text-slate-600 dark:text-slate-300 italic text-sm">{detail}</div>
                    <button onClick={() => setExpandedMessageIdx(null)} className="mt-3 text-[10px] font-black uppercase text-slate-400">Thu gọn</button>
                  </div>
                )}
              </div>
              {suggestions.map((s, idx) => (
                <button key={idx} onClick={() => handleSend(s)} className="mt-2 px-4 py-2 bg-white dark:bg-slate-800 border border-blue-100 dark:border-blue-900 text-blue-600 dark:text-blue-400 rounded-xl text-xs font-bold hover:bg-blue-600 hover:text-white transition-all shadow-sm self-start">
                  {s}
                </button>
              ))}
            </div>
          );
        })}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white dark:bg-slate-800 px-5 py-3 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex gap-1 items-center">
              <div className="w-1 h-1 bg-blue-600 rounded-full animate-bounce"></div>
              <div className="w-1 h-1 bg-blue-600 rounded-full animate-bounce [animation-delay:0.2s]"></div>
              <div className="w-1 h-1 bg-blue-600 rounded-full animate-bounce [animation-delay:0.4s]"></div>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 border-t dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0">
        {image && (
          <div className="relative inline-block mb-3">
            <img src={image} className="w-16 h-16 object-cover rounded-xl border border-blue-200" />
            <button onClick={() => setImage(null)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth="3"/></svg></button>
          </div>
        )}
        <div className="flex gap-2 items-center">
          <button onClick={() => fileInputRef.current?.click()} className="p-3 bg-slate-100 dark:bg-slate-800 rounded-2xl text-slate-500 hover:bg-blue-50 transition-all">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
          </button>
          <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
          <button onClick={startLiveSession} className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 border border-blue-100 dark:border-blue-800" title="Trò chuyện giọng nói">
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-20a3 3 0 00-3 3v8a3 3 0 006 0V5a3 3 0 00-3-3z"/></svg>
          </button>
          <input ref={inputRef} type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()} placeholder="Nhắn tin..." className="flex-1 bg-slate-100 dark:bg-slate-800 border-none rounded-2xl px-5 py-3 text-sm outline-none" />
          <button onClick={() => handleSend()} disabled={(!input.trim() && !image) || loading} className="p-3 bg-blue-600 text-white rounded-2xl disabled:opacity-50">
            <svg className="w-6 h-6 rotate-45" fill="currentColor" viewBox="0 0 20 20"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"/></svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SafeBuddy;
