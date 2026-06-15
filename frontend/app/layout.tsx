'use client';

import React, { useState, useEffect } from 'react';
import '../app/globals.css';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Search,
  Compass,
  Film,
  MessageSquare,
  Heart,
  PlusSquare,
  User,
  Moon,
  Sun,
  Menu,
} from 'lucide-react';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [darkMode, setDarkMode] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
  }, [darkMode]);

  const navItems = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Search', href: '#search', icon: Search },
    { name: 'Explore', href: '#explore', icon: Compass },
    { name: 'Reels', href: '/reels', icon: Film },
    { name: 'Messages', href: '/direct', icon: MessageSquare },
    { name: 'Notifications', href: '#notifications', icon: Heart },
    { name: 'Create', href: '#create', icon: PlusSquare },
    { name: 'Profile', href: '/profile', icon: User },
  ];

  return (
    <html lang="en" className="dark">
      <head>
        <title>Instagram NextGen</title>
        <meta name="description" content="The future of social media - Realtime, Glassmorphism, 2026 Edition" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased min-h-screen text-white bg-[#000000] light:bg-[#fafafa] light:text-black transition-colors duration-300">
        <div className="flex h-screen overflow-hidden">
          
          {/* Sidebar Left Navigation (Desktop & Tablet) */}
          <aside className="hidden md:flex flex-col justify-between w-64 p-6 border-r border-[#1f1f23] light:border-[#e2e2e8] glass z-50">
            <div className="space-y-8">
              {/* Premium Logo */}
              <div className="px-3">
                <h1 className="text-2xl font-bold tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-[#f09433] via-[#e6683c] to-[#bc1888]">
                  INSTAGRAM
                </h1>
                <span className="text-[10px] uppercase font-semibold text-gray-500 tracking-widest">NEXTGEN</span>
              </div>

              {/* Navigation Menu Links */}
              <nav className="space-y-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`flex items-center space-x-4 px-4 py-3 rounded-xl transition-all duration-200 group hover:bg-white/5 light:hover:bg-black/5 ${
                        isActive ? 'font-bold scale-105 text-[#0095f6]' : 'text-gray-400 light:text-gray-600'
                      }`}
                    >
                      <Icon className="w-6 h-6 transition-transform group-hover:scale-110" />
                      <span className="text-sm font-medium">{item.name}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Bottom Actions */}
            <div className="space-y-4">
              {/* Dark mode Toggle */}
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="flex items-center space-x-4 px-4 py-3 w-full rounded-xl hover:bg-white/5 light:hover:bg-black/5 transition-all text-gray-400 light:text-gray-600"
              >
                {darkMode ? <Sun className="w-6 h-6 text-yellow-400" /> : <Moon className="w-6 h-6 text-indigo-500" />}
                <span className="text-sm font-medium">{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
              </button>
            </div>
          </aside>

          {/* Core Content Area */}
          <main className="flex-1 overflow-y-auto no-scrollbar relative">
            {children}
          </main>

          {/* Bottom Navigation (Mobile Viewports Only) */}
          <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 border-t border-[#1f1f23] light:border-[#e2e2e8] glass flex items-center justify-around px-4 z-50">
            {navItems.filter(item => ['Home', 'Reels', 'Messages', 'Profile'].includes(item.name)).map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex flex-col items-center justify-center w-12 h-12 rounded-full transition-transform ${
                    isActive ? 'text-[#0095f6] scale-105' : 'text-gray-400'
                  }`}
                >
                  <Icon className="w-6 h-6" />
                </Link>
              );
            })}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="text-gray-400 flex items-center justify-center w-12 h-12"
            >
              {darkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-indigo-500" />}
            </button>
          </nav>

        </div>
      </body>
    </html>
  );
}
