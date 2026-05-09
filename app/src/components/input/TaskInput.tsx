'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { MicButton } from './MicButton';
import { motion, AnimatePresence } from 'framer-motion';

interface TaskInputProps {
  onSubmit: (taskName: string) => Promise<void>;
  isLoading: boolean;
}

export function TaskInput({ onSubmit, isLoading }: TaskInputProps) {
  const [text, setText] = useState('');
  const { 
    isRecording, 
    transcript, 
    error: speechError, 
    isSupported, 
    toggleRecording,
    resetTranscript 
  } = useSpeechRecognition();
  
  const inputRef = useRef<HTMLInputElement>(null);

  // Update input text when transcript changes
  useEffect(() => {
    if (transcript) {
      setText(transcript);
    }
  }, [transcript]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || isLoading) return;

    if (isRecording) {
      toggleRecording(); // Stop recording if submitting
    }
    
    await onSubmit(text.trim());
    setText('');
    resetTranscript();
  };

  return (
    <div style={{ width: '100%', maxWidth: '600px', margin: '0 auto' }}>
      <form 
        onSubmit={handleSubmit}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-sm)',
          backgroundColor: 'var(--color-surface)',
          padding: 'var(--space-sm)',
          borderRadius: 'var(--radius-full)',
          boxShadow: 'var(--shadow-md)',
          border: `1px solid var(--color-border)`,
          position: 'relative',
        }}
      >
        <input
          ref={inputRef}
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="今日やりたいことは何ですか？"
          disabled={isLoading || isRecording}
          style={{
            flex: 1,
            border: 'none',
            background: 'transparent',
            padding: 'var(--space-sm) var(--space-md)',
            fontSize: 'var(--font-size-md)',
            color: 'var(--color-text)',
            outline: 'none',
            fontFamily: 'var(--font-body)',
          }}
        />

        {isSupported && (
          <MicButton 
            isRecording={isRecording} 
            onToggle={toggleRecording} 
            disabled={isLoading}
          />
        )}

        <motion.button
          type="submit"
          disabled={!text.trim() || isLoading}
          whileHover={text.trim() && !isLoading ? { scale: 1.05 } : {}}
          whileTap={text.trim() && !isLoading ? { scale: 0.95 } : {}}
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            border: 'none',
            backgroundColor: text.trim() && !isLoading ? 'var(--color-primary)' : 'var(--color-border)',
            color: 'var(--color-text-inverse)',
            cursor: text.trim() && !isLoading ? 'pointer' : 'not-allowed',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background-color 0.3s',
            flexShrink: 0,
          }}
          aria-label="送信"
        >
          {isLoading ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              style={{
                width: '20px',
                height: '20px',
                border: '3px solid rgba(255,255,255,0.3)',
                borderTopColor: 'var(--color-text-inverse)',
                borderRadius: '50%',
              }}
            />
          ) : (
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              style={{ transform: 'translateX(-1px)' }} // Visual alignment for send icon
            >
              <line x1="22" x2="11" y1="2" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          )}
        </motion.button>
      </form>

      {/* Error Message */}
      <AnimatePresence>
        {speechError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            style={{
              marginTop: 'var(--space-sm)',
              padding: 'var(--space-sm) var(--space-md)',
              backgroundColor: 'var(--color-error-light)',
              color: 'var(--color-error)',
              borderRadius: 'var(--radius-md)',
              fontSize: 'var(--font-size-sm)',
              textAlign: 'center',
            }}
          >
            {speechError}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
