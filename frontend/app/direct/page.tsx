'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Phone, Video, Info, Send, Smile, Mic, Image as ImageIcon, Camera, PhoneOff, VideoOff, ScreenShare } from 'lucide-react';
import io, { Socket } from 'socket.io-client';

interface ChatUser {
  id: string;
  username: string;
  fullName: string;
  profilePicUrl: string;
  isOnline: boolean;
  note: string;
}

interface Message {
  id: string;
  senderId: string;
  text: string;
  createdAt: string;
}

export default function DirectChat() {
  const [users, setUsers] = useState<ChatUser[]>([
    { id: 'u1', username: 'tech_creator', fullName: 'NextGen Engineer', profilePicUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150', isOnline: true, note: 'Coding NestJS...💻' },
    { id: 'u2', username: 'cyber_voyage', fullName: 'Neon Explorer', profilePicUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', isOnline: true, note: 'Tokyo is lit 🔥' },
    { id: 'u3', username: 'design_daily', fullName: 'Creative Designer', profilePicUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', isOnline: false, note: 'Sleeping 💤' },
  ]);

  const [activeUser, setActiveUser] = useState<ChatUser>(users[0]);
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', senderId: 'u1', text: 'Hey there! How do you like the new 2026 UI layout?', createdAt: new Date(Date.now() - 600000).toISOString() },
    { id: '2', senderId: 'you', text: 'It feels incredibly premium! Glassmorphic cards look great.', createdAt: new Date(Date.now() - 300000).toISOString() },
  ]);
  const [inputText, setInputText] = useState('');
  const [inCall, setInCall] = useState(false);
  const [callMuted, setCallMuted] = useState(false);
  const [videoDisabled, setVideoDisabled] = useState(false);
  
  const socketRef = useRef<Socket | null>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const localStreamRef = useRef<MediaStream | null>(null);

  // Initialize socket connections with fallback modes
  useEffect(() => {
    socketRef.current = io('http://localhost:4000', {
      query: { userId: 'you' },
      transports: ['websocket'],
    });

    socketRef.current.on('connect', () => {
      console.log('Socket.io connected for realtime chats');
    });

    socketRef.current.on('new_message', (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  // Set up active room subscriptions
  useEffect(() => {
    if (socketRef.current && activeUser) {
      socketRef.current.emit('join_room', { roomId: `room_you_${activeUser.id}` });
    }
  }, [activeUser]);

  const sendMessage = () => {
    if (!inputText.trim()) return;

    const newMsg = {
      id: Math.random().toString(36).substr(2, 9),
      senderId: 'you',
      text: inputText,
      createdAt: new Date().toISOString(),
    };

    // Emit via WebSocket
    socketRef.current?.emit('send_message', {
      roomId: `room_you_${activeUser.id}`,
      senderId: 'you',
      text: inputText,
    });

    // Add locally immediately (for quick visual responsive feedback)
    setMessages((prev) => [...prev, newMsg]);
    setInputText('');
  };

  // WebRTC call handlers
  const startCall = async () => {
    setInCall(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      localStreamRef.current = stream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.warn('Could not access media devices:', err);
    }
  };

  const endCall = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
    }
    setInCall(false);
  };

  return (
    <div className="h-screen w-full flex bg-[#030303] overflow-hidden pt-0 pb-16 md:pb-0">
      
      {/* Users & Notes Sidebar */}
      <aside className="w-full md:w-80 border-r border-white/5 flex flex-col glass z-10 shrink-0">
        
        {/* Notes (Bubble states) Section */}
        <div className="p-4 border-b border-white/5 space-y-4">
          <h2 className="text-xl font-bold">Messages</h2>
          <div className="flex space-x-4 overflow-x-auto no-scrollbar py-2">
            {users.map((u) => (
              <div key={u.id} className="flex flex-col items-center flex-shrink-0 cursor-pointer w-16" onClick={() => setActiveUser(u)}>
                <div className="relative">
                  <div className="w-12 h-12 rounded-full overflow-hidden border border-white/10">
                    <img src={u.profilePicUrl} alt={u.username} className="w-full h-full object-cover" />
                  </div>
                  {/* Presence indicator */}
                  {u.isOnline && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-black" />
                  )}
                  {/* Status bubble */}
                  {u.note && (
                    <span className="absolute -top-3 -right-3 bg-gray-800 text-[8px] text-white px-2 py-0.5 rounded-full border border-white/10 w-16 truncate text-center scale-90 shadow-md">
                      {u.note}
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-gray-400 mt-2 truncate w-full text-center">{u.username}</span>
              </div>
            ))}
          </div>
        </div>

        {/* User DM list */}
        <div className="flex-1 overflow-y-auto no-scrollbar p-2 space-y-2">
          {users.map((u) => (
            <div
              key={u.id}
              onClick={() => setActiveUser(u)}
              className={`flex items-center justify-between p-3 rounded-2xl cursor-pointer transition-colors ${
                activeUser.id === u.id ? 'bg-white/10' : 'hover:bg-white/5'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full overflow-hidden">
                  <img src={u.profilePicUrl} alt={u.username} className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="text-sm font-bold">{u.username}</p>
                  <p className="text-[11px] text-gray-500 truncate w-36">Active now</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* Main Messaging Interface */}
      <section className="flex-1 flex flex-col bg-black relative">
        {/* Active Chat Header */}
        <header className="h-16 border-b border-white/5 glass flex items-center justify-between px-6 z-10 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-full overflow-hidden">
              <img src={activeUser.profilePicUrl} alt={activeUser.username} className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="text-sm font-bold">{activeUser.username}</p>
              <span className="text-[10px] text-green-400">Online</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Phone className="w-5 h-5 text-gray-400 cursor-pointer hover:text-white" />
            <Video className="w-5 h-5 text-gray-400 cursor-pointer hover:text-white" onClick={startCall} />
            <Info className="w-5 h-5 text-gray-400 cursor-pointer hover:text-white" />
          </div>
        </header>

        {/* Messages Body */}
        <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-4">
          {messages.map((msg) => {
            const isMe = msg.senderId === 'you';
            return (
              <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-xs px-4 py-2.5 rounded-2xl text-sm ${
                    isMe ? 'bg-[#0095f6] text-white rounded-tr-none' : 'glass text-gray-100 rounded-tl-none'
                  }`}
                >
                  <p>{msg.text}</p>
                  <span className="text-[9px] text-white/50 block text-right mt-1">
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Message Input toolbar */}
        <footer className="p-4 border-t border-white/5 glass shrink-0">
          <div className="flex items-center space-x-3 bg-white/5 rounded-2xl px-4 py-2">
            <Smile className="w-5 h-5 text-gray-400 cursor-pointer hover:text-white" />
            <input
              type="text"
              placeholder="Message..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              className="flex-1 bg-transparent border-none outline-none text-xs focus:ring-0 text-white placeholder-gray-500"
            />
            {inputText ? (
              <button onClick={sendMessage} className="text-[#0095f6] font-bold text-xs">Send</button>
            ) : (
              <>
                <Mic className="w-5 h-5 text-gray-400 cursor-pointer hover:text-white" />
                <ImageIcon className="w-5 h-5 text-gray-400 cursor-pointer hover:text-white" />
              </>
            )}
          </div>
        </footer>

        {/* WebRTC Video Call Screen Overlay */}
        {inCall && (
          <div className="absolute inset-0 bg-black/90 z-50 flex flex-col justify-between p-8">
            <div className="flex justify-between items-center text-white">
              <div className="flex items-center space-x-3">
                <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-ping" />
                <h3 className="font-bold text-lg">WebRTC Call: {activeUser.username}</h3>
              </div>
              <span className="text-xs text-gray-400">HD Call Encrypted</span>
            </div>

            {/* Video Streams Display */}
            <div className="flex-1 flex items-center justify-center relative my-8">
              {/* Fake Callee video */}
              <div className="w-full h-full max-w-2xl bg-gray-900 rounded-2xl overflow-hidden relative border border-white/10 flex items-center justify-center">
                <img src={activeUser.profilePicUrl} alt="Bob" className="w-32 h-32 rounded-full border-4 border-white/20 filter blur-sm" />
                <span className="absolute bottom-4 left-4 text-xs bg-black/60 px-3 py-1 rounded-full text-white font-medium">
                  {activeUser.username} (Remote Stream)
                </span>
              </div>

              {/* Local PiP camera view */}
              <div className="absolute bottom-4 right-4 w-40 h-52 bg-black border border-white/20 rounded-xl overflow-hidden shadow-2xl z-10">
                <video ref={localVideoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
                <span className="absolute bottom-2 left-2 text-[10px] bg-black/60 px-2 py-0.5 rounded-full text-white">
                  You (Local)
                </span>
              </div>
            </div>

            {/* Action buttons controls */}
            <div className="flex justify-center space-x-6">
              <button
                onClick={() => setCallMuted(!callMuted)}
                className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  callMuted ? 'bg-red-500' : 'glass'
                }`}
              >
                {callMuted ? <VideoOff className="w-5 h-5" /> : <Mic className="w-5 h-5 text-white" />}
              </button>

              <button
                onClick={endCall}
                className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center hover:bg-red-700 transition-colors"
              >
                <PhoneOff className="w-5 h-5 text-white" />
              </button>

              <button
                onClick={() => setVideoDisabled(!videoDisabled)}
                className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  videoDisabled ? 'bg-red-500' : 'glass'
                }`}
              >
                {videoDisabled ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5 text-white" />}
              </button>

              <button className="w-12 h-12 rounded-full glass flex items-center justify-center">
                <ScreenShare className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        )}
      </section>

    </div>
  );
}
