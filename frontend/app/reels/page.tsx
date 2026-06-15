'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Heart, MessageSquare, Send, Music, Volume2, VolumeX, Sparkles, RefreshCw } from 'lucide-react';

interface Reel {
  id: string;
  videoUrl: string;
  caption: string;
  author: {
    username: string;
    fullName: string;
    profilePicUrl: string;
    isVerified: boolean;
  };
  aiRecommendationScore: number;
}

export default function ReelsFeed() {
  const [reels, setReels] = useState<Reel[]>([]);
  const [muted, setMuted] = useState(true);
  const [likes, setLikes] = useState<Record<string, boolean>>({});
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Fetch reels from NestJS backend, fall back to high-fidelity mock stream
    fetch('http://localhost:4000/posts/reels')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.data) {
          setReels(data.data);
        } else {
          throw new Error();
        }
      })
      .catch(() => {
        setReels([
          {
            id: 'r1',
            videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-girl-in-neon-light-in-a-cyberpunk-setting-42289-large.mp4',
            caption: 'Synthesized waves and future visual beats! ⚡🔊 #reels #cyberpunk #neon',
            author: {
              username: 'cyber_tunes',
              fullName: 'Vibe Synth',
              profilePicUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150',
              isVerified: true,
            },
            aiRecommendationScore: 0.9412,
          },
          {
            id: 'r2',
            videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-vertical-video-of-a-beautiful-waterfall-in-a-forest-42416-large.mp4',
            caption: 'Escape to nature. Found this amazing waterfall in the deep woods! 🌲🏞️ #nature #explore',
            author: {
              username: 'earth_wanderer',
              fullName: 'Nature Visuals',
              profilePicUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
              isVerified: false,
            },
            aiRecommendationScore: 0.7684,
          },
        ]);
      });
  }, []);

  const toggleLike = (id: string) => {
    setLikes((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="h-screen w-full bg-[#030303] flex items-center justify-center p-0 md:py-8 overflow-hidden">
      
      {/* Scroll Snapping Container */}
      <div
        ref={containerRef}
        className="h-full md:h-[800px] w-full md:w-[450px] overflow-y-scroll snap-y snap-mandatory no-scrollbar bg-black md:rounded-3xl border border-white/5 relative"
      >
        {reels.map((reel) => (
          <div
            key={reel.id}
            className="h-full w-full snap-start relative flex flex-col justify-end p-6 bg-gradient-to-t from-black/80 via-transparent to-black/20"
          >
            {/* HTML5 Video Player */}
            <video
              src={reel.videoUrl}
              className="absolute inset-0 w-full h-full object-cover z-0"
              autoPlay
              loop
              muted={muted}
              playsInline
              onClick={() => setMuted(!muted)}
            />

            {/* Muted/Volume visual notifier */}
            <div
              onClick={() => setMuted(!muted)}
              className="absolute top-6 right-6 z-20 w-10 h-10 rounded-full glass flex items-center justify-center cursor-pointer hover:scale-105 transition-transform"
            >
              {muted ? <VolumeX className="w-5 h-5 text-white" /> : <Volume2 className="w-5 h-5 text-white" />}
            </div>

            {/* AI Recommendation Badge */}
            <div className="absolute top-6 left-6 z-20 flex items-center space-x-1 px-3 py-1 rounded-full glass text-[10px] text-cyan-300 font-bold border border-cyan-500/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Score: {(reel.aiRecommendationScore * 100).toFixed(1)}% Match</span>
            </div>

            {/* Overlay: Action Sidebar Buttons */}
            <div className="absolute right-4 bottom-24 z-20 flex flex-col items-center space-y-6">
              <button
                onClick={() => toggleLike(reel.id)}
                className="flex flex-col items-center group"
              >
                <div className="w-12 h-12 rounded-full glass flex items-center justify-center transition-all group-hover:scale-110 active:scale-90">
                  <Heart className={`w-6 h-6 ${likes[reel.id] ? 'text-red-500 fill-red-500' : 'text-white'}`} />
                </div>
                <span className="text-[10px] text-gray-400 mt-1 font-semibold">
                  {likes[reel.id] ? '1.2k' : '1.1k'}
                </span>
              </button>

              <button className="flex flex-col items-center group">
                <div className="w-12 h-12 rounded-full glass flex items-center justify-center transition-all group-hover:scale-110">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
                <span className="text-[10px] text-gray-400 mt-1 font-semibold">89</span>
              </button>

              <button className="flex flex-col items-center group">
                <div className="w-12 h-12 rounded-full glass flex items-center justify-center transition-all group-hover:scale-110">
                  <Send className="w-6 h-6 text-white" />
                </div>
                <span className="text-[10px] text-gray-400 mt-1 font-semibold">Share</span>
              </button>

              <button className="flex flex-col items-center group">
                <div className="w-12 h-12 rounded-full glass flex items-center justify-center transition-all group-hover:scale-110">
                  <RefreshCw className="w-5 h-5 text-white" />
                </div>
                <span className="text-[10px] text-gray-400 mt-1 font-semibold">Remix</span>
              </button>
            </div>

            {/* Bottom Overlay: Creator info & Caption */}
            <div className="z-10 text-white space-y-4 max-w-[80%]">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/80">
                  <img src={reel.author.profilePicUrl} alt={reel.author.username} className="w-full h-full object-cover" />
                </div>
                <div>
                  <div className="flex items-center space-x-1">
                    <span className="font-bold text-sm">{reel.author.username}</span>
                    {reel.author.isVerified && (
                      <span className="w-3.5 h-3.5 bg-[#0095f6] text-white text-[8px] font-black rounded-full flex items-center justify-center">✓</span>
                    )}
                  </div>
                  <span className="text-[10px] text-gray-300">{reel.author.fullName}</span>
                </div>
                <button className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-lg transition-colors">
                  Follow
                </button>
              </div>

              <p className="text-xs text-gray-200 line-clamp-2">{reel.caption}</p>

              <div className="flex items-center space-x-2 text-xs text-gray-300">
                <Music className="w-4 h-4 animate-spin" style={{ animationDuration: '4s' }} />
                <span className="truncate">Original audio - {reel.author.username}</span>
              </div>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
