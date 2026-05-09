'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface MicButtonProps {
  isRecording: boolean;
  onToggle: () => void;
  disabled?: boolean;
}

export function MicButton({ isRecording, onToggle, disabled = false }: MicButtonProps) {
  return (
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <AnimatePresence>
        {isRecording && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.3, scale: 1.5 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            style={{
              position: 'absolute',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: 'var(--color-primary)',
              zIndex: 0,
            }}
          />
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        // onClick is better for both mobile tap and desktop click than mousedown/up
        onClick={onToggle}
        disabled={disabled}
        whileHover={!disabled ? { scale: 1.05 } : {}}
        whileTap={!disabled ? { scale: 0.95 } : {}}
        animate={isRecording ? { scale: [1, 1.1, 1] } : {}}
        transition={{ repeat: isRecording ? Infinity : 0, duration: 1.5 }}
        style={{
          position: 'relative',
          zIndex: 1,
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          border: 'none',
          backgroundColor: isRecording ? 'var(--color-surface)' : 'var(--color-primary)',
          color: isRecording ? 'var(--color-primary)' : 'var(--color-text-inverse)',
          cursor: disabled ? 'not-allowed' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: isRecording ? 'var(--shadow-glow)' : 'var(--shadow-md)',
          opacity: disabled ? 0.5 : 1,
          outline: 'none',
          flexShrink: 0,
        }}
        aria-label={isRecording ? '録音を停止' : '録音を開始'}
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
          <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
          <line x1="12" x2="12" y1="19" y2="22" />
        </svg>
      </motion.button>
    </div>
  );
}
