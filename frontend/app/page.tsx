'use client';

import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Post {
  id: string;
  caption: string;
  mediaUrls: string[];
  postType: string;
  author: {
    username: string;
    fullName: string;
    profilePicUrl: string;
    isVerified: boolean;
  };
  likesCount: number;
  commentsCount: number;
  isLikedByMe: boolean;
  createdAt: string;
}

export default function HomeFeed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [postComments, setPostComments] = useState<Record<string, Array<{ user: string; text: string }>>>({
    p1: [
      { user: 'design_expert', text: 'This glassmorphism layout is absolutely stunning! 🤯💎' },
      { user: 'react_dev_26', text: 'Clean stack, NestJS WebSockets deliver fast. 👍' }
    ],
    p2: [
      { user: 'traveler_101', text: 'Wow, Tokyo nights are unmatched. Missing this place!' }
    ]
  });
  const [showHeartPop, setShowHeartPop] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // Attempt to retrieve posts from backend endpoint, fallback to standard mock datasets
    fetch('http://localhost:4000/posts/feed')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.data) {
          setPosts(data.data);
        } else {
          throw new Error('Fallback needed');
        }
      })
      .catch(() => {
        // High-fidelity fallback mock data
        setPosts([
          {
            id: 'p1',
            caption: 'Building the Instagram Clone of 2026! Incorporating Next.js 15, React 19, and full real-time WebRTC support. #nextgen #coding #meta',
            mediaUrls: ['https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800'],
            postType: 'POST',
            author: {
              username: 'tech_creator',
              fullName: 'NextGen Engineer',
              profilePicUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
              isVerified: true,
            },
            likesCount: 1420,
            commentsCount: 2,
            isLikedByMe: false,
            createdAt: new Date().toISOString(),
          },
          {
            id: 'p2',
            caption: 'Neon vibes in the cyber city. 🌌🕶️ #tokyo #cyberpunk #aesthetic',
            mediaUrls: [
              'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800',
              'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800'
            ],
            postType: 'POST',
            author: {
              username: 'cyber_voyage',
              fullName: 'Neon Explorer',
              profilePicUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
              isVerified: false,
            },
            likesCount: 840,
            commentsCount: 1,
            isLikedByMe: true,
            createdAt: new Date(Date.now() - 3600000).toISOString(),
          },
        ]);
      });
  }, []);

  const handleDoubleTap = (postId: string) => {
    // Visual double-tap heart indicator
    setShowHeartPop((prev) => ({ ...prev, [postId]: true }));
    setTimeout(() => {
      setShowHeartPop((prev) => ({ ...prev, [postId]: false }));
    }, 800);

    // Toggle post like
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            isLikedByMe: true,
            likesCount: post.isLikedByMe ? post.likesCount : post.likesCount + 1,
          };
        }
        return post;
      })
    );
  };

  const toggleLike = (postId: string) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          const liked = !post.isLikedByMe;
          return {
            ...post,
            isLikedByMe: liked,
            likesCount: liked ? post.likesCount + 1 : post.likesCount - 1,
          };
        }
        return post;
      })
    );
  };

  const submitComment = (postId: string) => {
    const text = commentInputs[postId]?.trim();
    if (!text) return;

    setPostComments((prev) => ({
      ...prev,
      [postId]: [...(prev[postId] || []), { user: 'you_nextgen', text }],
    }));

    setCommentInputs((prev) => ({ ...prev, [postId]: '' }));
  };

  const stories = [
    { username: 'your_story', active: false, pic: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150' },
    { username: 'design_daily', active: true, pic: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150' },
    { username: 'react_core', active: true, pic: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150' },
    { username: 'traveler', active: true, pic: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150' },
    { username: 'ai_innovator', active: true, pic: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 md:py-12 flex space-x-12 pb-24 md:pb-12">
      
      {/* Feed Area */}
      <div className="flex-1 max-w-xl space-y-6">
        
        {/* Stories Horizontal Row */}
        <div className="flex space-x-4 overflow-x-auto no-scrollbar py-2">
          {stories.map((story, idx) => (
            <div key={idx} className="flex flex-col items-center flex-shrink-0 cursor-pointer">
              <div className={story.active ? 'story-ring' : 'p-[3px] rounded-full border border-gray-800'}>
                <div className="border-2 border-[#000000] rounded-full overflow-hidden w-16 h-16">
                  <img src={story.pic} alt={story.username} className="w-full h-full object-cover" />
                </div>
              </div>
              <span className="text-[11px] text-gray-400 mt-1 truncate w-16 text-center">{story.username}</span>
            </div>
          ))}
        </div>

        {/* Dynamic Post Feed */}
        <div className="space-y-8 mt-4">
          {posts.map((post) => (
            <article key={post.id} className="glass rounded-2xl overflow-hidden shadow-2xl relative">
              {/* Post Header */}
              <div className="flex items-center justify-between p-4 border-b border-white/5">
                <div className="flex items-center space-x-3">
                  <div className="story-ring p-[2px]">
                    <div className="w-9 h-9 rounded-full overflow-hidden border border-[#000000]">
                      <img src={post.author.profilePicUrl} alt={post.author.username} className="w-full h-full object-cover" />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center space-x-1">
                      <span className="font-bold text-sm hover:underline cursor-pointer">{post.author.username}</span>
                      {post.author.isVerified && (
                        <span className="w-3.5 h-3.5 bg-[#0095f6] text-white text-[8px] font-black rounded-full flex items-center justify-center">✓</span>
                      )}
                    </div>
                    <span className="text-[10px] text-gray-500">1h ago</span>
                  </div>
                </div>
                <MoreHorizontal className="w-5 h-5 text-gray-400 cursor-pointer" />
              </div>

              {/* Post Media content (Double Tap Enabled) */}
              <div
                className="relative aspect-square bg-black cursor-pointer overflow-hidden group"
                onDoubleClick={() => handleDoubleTap(post.id)}
              >
                <img src={post.mediaUrls[0]} alt="Media" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />

                {/* Double Tap Heart Pop up */}
                <AnimatePresence>
                  {showHeartPop[post.id] && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1.3, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="absolute inset-0 flex items-center justify-center text-white drop-shadow-2xl z-20 pointer-events-none"
                    >
                      <Heart className="w-24 h-24 text-red-500 fill-red-500 drop-shadow-lg" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Action Toolbar */}
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex space-x-4">
                    <button onClick={() => toggleLike(post.id)} className="transition-transform active:scale-125">
                      <Heart
                        className={`w-6 h-6 ${
                          post.isLikedByMe ? 'text-red-500 fill-red-500' : 'text-white light:text-black hover:text-red-400'
                        }`}
                      />
                    </button>
                    <MessageCircle className="w-6 h-6 cursor-pointer hover:text-[#0095f6]" />
                    <Send className="w-6 h-6 cursor-pointer hover:text-[#0095f6]" />
                  </div>
                  <Bookmark className="w-6 h-6 cursor-pointer hover:text-[#0095f6]" />
                </div>

                {/* Likes Count */}
                <p className="font-bold text-sm">{post.likesCount.toLocaleString()} likes</p>

                {/* Caption */}
                <p className="text-sm leading-relaxed">
                  <span className="font-bold mr-2">{post.author.username}</span>
                  {post.caption}
                </p>

                {/* Inline comments section */}
                <div className="pt-2 border-t border-white/5 space-y-1">
                  {(postComments[post.id] || []).map((c, i) => (
                    <p key={i} className="text-xs">
                      <span className="font-bold mr-2">{c.user}</span>
                      <span className="text-gray-300 light:text-gray-700">{c.text}</span>
                    </p>
                  ))}
                </div>

                {/* Comment Entry bar */}
                <div className="flex items-center space-x-3 pt-2 border-t border-white/5">
                  <input
                    type="text"
                    placeholder="Add a comment..."
                    value={commentInputs[post.id] || ''}
                    onChange={(e) => setCommentInputs({ ...commentInputs, [post.id]: e.target.value })}
                    onKeyDown={(e) => e.key === 'Enter' && submitComment(post.id)}
                    className="flex-1 bg-transparent border-none outline-none text-xs focus:ring-0 text-white light:text-black placeholder-gray-500"
                  />
                  <button
                    onClick={() => submitComment(post.id)}
                    className="text-[#0095f6] font-semibold text-xs active:scale-95"
                  >
                    Post
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Recommended Creators Sidebar (Desktop Only) */}
      <aside className="hidden lg:block w-72 space-y-6 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-tr from-purple-500 to-pink-500 p-[2px]">
              <div className="w-full h-full rounded-full overflow-hidden bg-black border-2 border-black">
                <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150" alt="Self" className="object-cover w-full h-full" />
              </div>
            </div>
            <div>
              <p className="font-bold text-sm">you_nextgen</p>
              <p className="text-xs text-gray-500">NextGen Developer</p>
            </div>
          </div>
          <span className="text-xs text-[#0095f6] font-bold cursor-pointer">Switch</span>
        </div>

        <div className="glass p-4 rounded-2xl space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Suggested for you</span>
            <span className="text-xs text-white light:text-black hover:text-[#0095f6] cursor-pointer font-semibold">See All</span>
          </div>

          <div className="space-y-3">
            {[
              { name: 'futurism_news', source: 'Followed by tech_creator', img: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=150' },
              { name: 'creative_studio', source: 'Popular on NextGen', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150' },
            ].map((suggest, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full overflow-hidden">
                    <img src={suggest.img} alt={suggest.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="text-xs font-bold hover:underline cursor-pointer">{suggest.name}</p>
                    <p className="text-[10px] text-gray-500">{suggest.source}</p>
                  </div>
                </div>
                <span className="text-xs text-[#0095f6] font-bold cursor-pointer hover:text-white">Follow</span>
              </div>
            ))}
          </div>

          <div className="flex items-center space-x-2 text-[10px] text-cyan-400/80 pt-2 border-t border-white/5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI recommendation engine active</span>
          </div>
        </div>
      </aside>

    </div>
  );
}
