'use client';

import React, { useState } from 'react';
import { Grid, Film, Bookmark, ShoppingBag, BarChart2, TrendingUp, Users, Clock, ShieldCheck } from 'lucide-react';

export default function ProfileView() {
  const [activeTab, setActiveTab] = useState<'posts' | 'reels' | 'saved' | 'shop' | 'creator'>('posts');

  const profile = {
    username: 'you_nextgen',
    fullName: 'NextGen Developer',
    profilePicUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
    bio: 'Building the Instagram Clone of 2026. Micro-animations, responsive layout, real-time message sync, and WebRTC capability. 🌌💻',
    website: 'https://nextgen.instagram.clone',
    isVerified: true,
    followersCount: 14820,
    followingCount: 382,
    postsCount: 12,
  };

  const mockPosts = [
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400',
    'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=400',
    'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400',
    'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=400',
    'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400',
    'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400',
  ];

  const mockReels = [
    'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=400',
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 md:py-12 pb-24 md:pb-12 space-y-12">
      
      {/* Profile Info Header */}
      <header className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-16 pb-8 border-b border-white/5">
        
        {/* Profile Pic */}
        <div className="w-28 h-28 md:w-40 md:h-40 rounded-full overflow-hidden bg-gradient-to-tr from-purple-500 via-red-500 to-yellow-500 p-[3px]">
          <div className="w-full h-full rounded-full overflow-hidden bg-black border-4 border-black">
            <img src={profile.profilePicUrl} alt={profile.fullName} className="w-full h-full object-cover" />
          </div>
        </div>

        {/* Bio & Details */}
        <div className="flex-1 space-y-6 text-center md:text-left">
          <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-semibold">{profile.username}</h2>
              {profile.isVerified && <ShieldCheck className="w-5 h-5 text-blue-400 fill-blue-400" />}
            </div>
            
            <div className="flex space-x-3">
              <button className="px-4 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-lg transition-colors">
                Edit Profile
              </button>
              <button className="px-4 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-lg transition-colors">
                View Archive
              </button>
            </div>
          </div>

          {/* Stats counts */}
          <div className="flex justify-center md:justify-start space-x-8 text-sm">
            <span><strong>{profile.postsCount}</strong> posts</span>
            <span className="cursor-pointer hover:underline"><strong>{profile.followersCount.toLocaleString()}</strong> followers</span>
            <span className="cursor-pointer hover:underline"><strong>{profile.followingCount}</strong> following</span>
          </div>

          {/* Bio statement */}
          <div className="text-sm space-y-2">
            <p className="font-bold">{profile.fullName}</p>
            <p className="text-gray-300 whitespace-pre-line leading-relaxed max-w-md mx-auto md:mx-0">{profile.bio}</p>
            {profile.website && (
              <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline block font-semibold">
                {profile.website}
              </a>
            )}
          </div>
        </div>

      </header>

      {/* Tabs Filter Bar */}
      <nav className="flex justify-center space-x-12 border-b border-white/5 pb-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
        <button
          onClick={() => setActiveTab('posts')}
          className={`flex items-center space-x-2 pb-4 -mb-4 border-b-2 transition-colors ${
            activeTab === 'posts' ? 'border-white text-white' : 'border-transparent hover:text-white'
          }`}
        >
          <Grid className="w-4 h-4" />
          <span>Posts</span>
        </button>
        <button
          onClick={() => setActiveTab('reels')}
          className={`flex items-center space-x-2 pb-4 -mb-4 border-b-2 transition-colors ${
            activeTab === 'reels' ? 'border-white text-white' : 'border-transparent hover:text-white'
          }`}
        >
          <Film className="w-4 h-4" />
          <span>Reels</span>
        </button>
        <button
          onClick={() => setActiveTab('saved')}
          className={`flex items-center space-x-2 pb-4 -mb-4 border-b-2 transition-colors ${
            activeTab === 'saved' ? 'border-white text-white' : 'border-transparent hover:text-white'
          }`}
        >
          <Bookmark className="w-4 h-4" />
          <span>Saved</span>
        </button>
        <button
          onClick={() => setActiveTab('shop')}
          className={`flex items-center space-x-2 pb-4 -mb-4 border-b-2 transition-colors ${
            activeTab === 'shop' ? 'border-white text-white' : 'border-transparent hover:text-white'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Shop</span>
        </button>
        <button
          onClick={() => setActiveTab('creator')}
          className={`flex items-center space-x-2 pb-4 -mb-4 border-b-2 transition-colors ${
            activeTab === 'creator' ? 'border-white text-white' : 'border-transparent hover:text-white'
          }`}
        >
          <BarChart2 className="w-4 h-4" />
          <span>Creator Studio</span>
        </button>
      </nav>

      {/* Dynamic Tab Contents */}
      <div className="min-h-[200px]">
        {/* Posts Tab */}
        {activeTab === 'posts' && (
          <div className="grid grid-cols-3 gap-2 md:gap-4">
            {mockPosts.map((url, i) => (
              <div key={i} className="aspect-square bg-gray-900 rounded-xl overflow-hidden cursor-pointer group relative">
                <img src={url} alt={`Post ${i}`} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-6 text-white font-bold">
                  <span>Likes: 1.4k</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Reels Tab */}
        {activeTab === 'reels' && (
          <div className="grid grid-cols-3 gap-2 md:gap-4">
            {mockReels.map((url, i) => (
              <div key={i} className="aspect-[9/16] bg-gray-900 rounded-xl overflow-hidden cursor-pointer group relative">
                <img src={url} alt={`Reel ${i}`} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-bold">
                  <span>Views: 12.8k</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Saved Tab */}
        {activeTab === 'saved' && (
          <div className="text-center py-16 text-gray-500 text-sm">
            <Bookmark className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p>Only you can see what you have saved</p>
          </div>
        )}

        {/* Shop Tab */}
        {activeTab === 'shop' && (
          <div className="grid grid-cols-3 gap-2 md:gap-4">
            {[
              { title: 'Cyber Hoodie v2', price: '$85.00', img: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400' },
              { title: 'Retro Coding Cap', price: '$29.00', img: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=400' },
            ].map((prod, i) => (
              <div key={i} className="glass rounded-xl overflow-hidden cursor-pointer group">
                <div className="aspect-square overflow-hidden bg-black">
                  <img src={prod.img} alt={prod.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                </div>
                <div className="p-3">
                  <p className="text-xs font-bold truncate">{prod.title}</p>
                  <p className="text-[10px] text-[#0095f6] font-bold mt-1">{prod.price}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Creator Studio Tab */}
        {activeTab === 'creator' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass p-6 rounded-2xl flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <span className="text-xs font-semibold text-gray-400">Total Reach</span>
                <TrendingUp className="w-4 h-4 text-green-400" />
              </div>
              <div className="mt-4">
                <p className="text-2xl font-bold">45.2k</p>
                <p className="text-[10px] text-green-400 font-semibold mt-1">+14.2% since last week</p>
              </div>
            </div>

            <div className="glass p-6 rounded-2xl flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <span className="text-xs font-semibold text-gray-400">New Followers</span>
                <Users className="w-4 h-4 text-blue-400" />
              </div>
              <div className="mt-4">
                <p className="text-2xl font-bold">1,824</p>
                <p className="text-[10px] text-blue-400 font-semibold mt-1">+8.1% since last week</p>
              </div>
            </div>

            <div className="glass p-6 rounded-2xl flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <span className="text-xs font-semibold text-gray-400">Watch Retention</span>
                <Clock className="w-4 h-4 text-purple-400" />
              </div>
              <div className="mt-4">
                <p className="text-2xl font-bold">78.4%</p>
                <p className="text-[10px] text-purple-400 font-semibold mt-1">Average video duration: 42s</p>
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
