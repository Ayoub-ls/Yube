"use client"

import React, { useState } from 'react';
import { Headphones, MessageCircle, X, Sparkles } from 'lucide-react';
import { SupportModal } from './SupportModal';
import { SupportBubbleProps, SupportOption } from './types';

export const SupportBubble: React.FC<SupportBubbleProps> = ({
  phoneNumber = '213652651635',
  badgeText = '؟',
  defaultOpen = false,
  positionClass = 'bottom-6 right-6',
  dir = 'rtl',
  onOptionClick,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [hasUnread, setHasUnread] = useState(true);

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
    if (hasUnread) {
      setHasUnread(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleOptionSelect = (option: SupportOption, url: string) => {
    if (onOptionClick) {
      onOptionClick(option, url);
    } else {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
    setIsOpen(false);
  };

  return (
    <>
      {/* Floating Support Button */}
      <div className={`fixed z-40 ${positionClass}`} dir={dir}>
        <div className="relative group flex items-center justify-center">
          {/* Subtle Pulse Effect Ping Rings */}
          <div className="absolute w-20 h-20 bg-blue-400/20 rounded-full animate-ping opacity-75 pointer-events-none" />
          <div className="absolute w-16 h-16 bg-blue-500/10 rounded-full pointer-events-none" />

          {/* Main Circular Floating Button 16x16 (64x64px) */}
          <button
            type="button"
            onClick={handleToggle}
            aria-label="فتح مركز دعم Yube"
            aria-expanded={isOpen}
            className="relative w-16 h-16 rounded-full bg-gradient-to-tr from-blue-700 via-blue-600 to-blue-500 text-white shadow-[0_8px_24px_rgba(37,99,235,0.4)] hover:shadow-[0_12px_28px_rgba(37,99,235,0.5)] hover:-translate-y-1 hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center focus:outline-none focus:ring-4 focus:ring-blue-400/50 cursor-pointer overflow-visible"
          >
            {/* Animated Icon Swap */}
            {isOpen ? (
              <X className="w-7 h-7 transform rotate-0 transition-transform duration-300" />
            ) : (
              <div className="relative flex items-center justify-center">
                <Headphones className="w-7 h-7 transform transition-transform duration-300 group-hover:rotate-12" />
                <Sparkles className="w-3.5 h-3.5 text-amber-300 absolute -top-1 -right-1 animate-bounce" />
              </div>
            )}

            {/* Notification Unread Badge with '؟' */}
            {hasUnread && !isOpen && (
              <div className="absolute -top-1 -left-1 w-6 h-6 bg-red-500 border-2 border-white rounded-full flex items-center justify-center text-[11px] text-white font-extrabold shadow-sm animate-bounce">
                {badgeText}
              </div>
            )}
          </button>

          {/* Quick Tooltip on Hover */}
          {!isOpen && (
            <div className="absolute bottom-full mb-3 right-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap bg-slate-900/90 backdrop-blur-xs text-white text-xs font-semibold px-3 py-1.5 rounded-xl shadow-lg border border-slate-700/80">
              الدعم الفني والخدمات
              <div className="absolute top-full right-6 -mt-1 border-4 border-transparent border-t-slate-900/90" />
            </div>
          )}
        </div>
      </div>

      {/* Support Modal Component */}
      <SupportModal
        isOpen={isOpen}
        onClose={handleClose}
        phoneNumber={phoneNumber}
        dir={dir}
        onOptionSelect={handleOptionSelect}
      />
    </>
  );
};

export default SupportBubble;
