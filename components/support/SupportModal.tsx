import React, { useEffect, useRef } from 'react';
import { SupportMenu } from './SupportMenu';
import { SupportOption } from './types';

interface SupportModalProps {
  isOpen: boolean;
  onClose: () => void;
  phoneNumber?: string;
  dir?: 'rtl' | 'ltr';
  onOptionSelect?: (option: SupportOption, whatsappUrl: string) => void;
}

export const SupportModal: React.FC<SupportModalProps> = ({
  isOpen,
  onClose,
  phoneNumber = '213555123456',
  dir = 'rtl',
  onOptionSelect,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  // Handle ESC key press to close modal
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      previousActiveElement.current = document.activeElement as HTMLElement;
      window.addEventListener('keydown', handleKeyDown);
      // Lock body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
      if (previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
    };
  }, [isOpen, onClose]);

  // Handle outside click
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="support-modal-title"
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-6 bg-slate-900/20 backdrop-blur-sm transition-opacity duration-300 animate-fadeIn"
      onClick={handleBackdropClick}
      dir={dir}
    >
      {/* Modal Container: Bottom sheet on mobile, centered modal on desktop */}
      <div
        ref={modalRef}
        className="w-full md:w-[680px] md:max-w-3xl bg-white/95 backdrop-blur-xl rounded-t-[32px] md:rounded-[40px] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.14)] overflow-hidden transform transition-all duration-300 animate-slideUp md:animate-scaleUp border border-white/60"
      >
        {/* Top visual grab bar for mobile bottom sheet UX */}
        <div className="md:hidden flex justify-center pt-2.5 pb-1 bg-slate-100/60">
          <div className="w-12 h-1.5 rounded-full bg-slate-300/80" />
        </div>

        {/* Render Menu Component */}
        <SupportMenu
          phoneNumber={phoneNumber}
          dir={dir}
          onOptionSelect={onOptionSelect}
          onClose={onClose}
        />
      </div>
    </div>
  );
};
