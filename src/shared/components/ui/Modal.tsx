import React, { useEffect, useCallback } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@shared/lib/utils';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  showCloseButton?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = 'md',
  closeOnOverlayClick = true,
  closeOnEscape = true,
  showCloseButton = true,
}) => {
  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape' && closeOnEscape) {
        onClose();
      }
    },
    [closeOnEscape, onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleEscape]);

  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-2xl',
    full: 'max-w-[90vw] max-h-[90vh]',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="absolute inset-0 bg-black/80"
            onClick={closeOnOverlayClick ? onClose : undefined}
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.15 }}
            className={cn(
              'relative w-full bg-brand-dark border border-[#333] shadow-retro-dim',
              'overflow-hidden font-mono',
              sizes[size]
            )}
          >
            {/* Header */}
            {(title || showCloseButton) && (
              <div className="flex items-start justify-between p-6 border-b border-[#333]">
                <div>
                  {title && (
                    <h2 className="text-xl font-display uppercase tracking-widest text-brand-primary">{title}</h2>
                  )}
                  {description && (
                    <p className="text-sm text-gray-400 mt-1">// {description}</p>
                  )}
                </div>
                {showCloseButton && (
                  <button
                    onClick={onClose}
                    className={cn(
                      'p-2 text-gray-400 border border-transparent',
                      'hover:text-brand-primary hover:border-brand-primary',
                      'transition-colors duration-100',
                      'focus:outline-none focus:border-brand-primary'
                    )}
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            )}

            {/* Body */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

// Confirmation Modal
export interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'default' | 'danger';
  isLoading?: boolean;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  variant = 'default',
  isLoading = false,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <p className="text-gray-300 mb-6 font-mono">{message}</p>
      <div className="flex gap-3 justify-end">
        <button
          onClick={onClose}
          disabled={isLoading}
          className={cn(
            'px-4 py-2 text-gray-400 border border-[#333] font-mono uppercase tracking-wider text-sm',
            'hover:text-white hover:border-white',
            'transition-colors duration-100',
            'disabled:opacity-50 disabled:cursor-not-allowed'
          )}
        >
          {cancelText}
        </button>
        <button
          onClick={onConfirm}
          disabled={isLoading}
          className={cn(
            'px-4 py-2 font-bold font-mono uppercase tracking-wider text-sm transition-all duration-100',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            variant === 'danger'
              ? 'bg-transparent text-red-400 border border-red-500 hover:bg-red-500 hover:text-black'
              : 'bg-brand-primary text-black border border-brand-primary hover:bg-white shadow-retro-sm hover:shadow-none'
          )}
        >
          {isLoading ? '[...]' : confirmText}
        </button>
      </div>
    </Modal>
  );
};
