
import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-gray-100 py-4 px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center text-white font-serif italic font-bold text-xl shadow-lg">
            S
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-bold tracking-tight text-gray-900 leading-none">Styling Virtuel AI</h1>
            <span className="text-[10px] font-bold text-gray-400 tracking-widest uppercase mt-0.5">Fashion Technology</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
            v1.3 Demo
          </span>
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 shadow-sm border-2 border-white overflow-hidden">
            <img src="https://picsum.photos/100/100" alt="Avatar" />
          </div>
        </div>
      </div>
    </header>
  );
};
