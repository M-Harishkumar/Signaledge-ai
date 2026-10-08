import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl';
  showCloseButton?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  maxWidth = 'lg',
  showCloseButton = true,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidthStyles = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '4xl': 'max-w-4xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity animate-fade-in"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div
        role="dialog"
        aria-modal="true"
        className={twMerge(
          clsx(
            'relative w-full bg-[#111827] border border-[#2A374F] rounded-2xl shadow-2xl shadow-black ring-1 ring-black/80 overflow-hidden z-10 my-auto text-[#E5E7EB] min-w-0',
            maxWidthStyles[maxWidth]
          )
        )}
      >
        {(title || showCloseButton) && (
          <div className="flex items-start justify-between p-4 sm:p-5 border-b border-[#1F293D] bg-[#161F30]/60 gap-3 min-w-0">
            <div className="flex-1 min-w-0">
              {title && typeof title === 'string' ? (
                <h2 className="text-base sm:text-lg font-bold text-[#F3F4F6] tracking-tight font-display break-words">{title}</h2>
              ) : (
                title
              )}
              {description && <p className="text-xs text-[#9CA3AF] mt-1 break-words">{description}</p>}
            </div>
            {showCloseButton && (
              <button
                onClick={onClose}
                className="text-[#9CA3AF] hover:text-[#F3F4F6] p-1.5 rounded-lg hover:bg-[#1E293B] transition cursor-pointer shrink-0"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        )}

        <div className="p-4 sm:p-6 max-h-[75vh] overflow-y-auto min-w-0">{children}</div>
      </div>
    </div>
  );
};
