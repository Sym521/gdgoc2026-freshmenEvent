import React, { useState, useEffect } from 'react';
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition';
import { MicButton } from './MicButton';
import { motion } from 'framer-motion';

interface TaskInputProps {
  onSubmit: (task: string) => void;
  isLoading?: boolean;
}

export const TaskInput: React.FC<TaskInputProps> = ({ onSubmit, isLoading = false }) => {
  const { isListening, transcript, error, startListening, stopListening } = useSpeechRecognition();
  const [inputValue, setInputValue] = useState('');

  // Update input value when transcript changes
  useEffect(() => {
    if (transcript) {
      setInputValue(transcript);
    }
  }, [transcript]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !isLoading) {
      onSubmit(inputValue.trim());
      setInputValue('');
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="task-input-container"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-sm)',
        width: '100%',
        maxWidth: '600px',
        margin: '0 auto',
      }}
    >
      <form 
        onSubmit={handleSubmit}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-sm)',
          backgroundColor: 'var(--color-surface)',
          padding: 'var(--space-sm)',
          borderRadius: 'var(--radius-xl)',
          boxShadow: 'var(--shadow-lg)',
          border: '1px solid var(--color-border)',
        }}
      >
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={isListening ? '話しかけてください...' : 'どんなタスクを分解しますか？'}
          disabled={isLoading}
          style={{
            flex: 1,
            border: 'none',
            outline: 'none',
            padding: 'var(--space-sm) var(--space-md)',
            fontSize: 'var(--font-size-md)',
            fontFamily: 'var(--font-body)',
            backgroundColor: 'transparent',
            color: 'var(--color-text)',
          }}
        />
        
        <MicButton 
          isListening={isListening} 
          onStart={startListening} 
          onStop={stopListening} 
        />

        <button
          type="submit"
          disabled={!inputValue.trim() || isLoading}
          style={{
            backgroundColor: inputValue.trim() && !isLoading ? 'var(--color-primary)' : 'var(--color-border)',
            color: 'var(--color-text-inverse)',
            border: 'none',
            borderRadius: 'var(--radius-full)',
            padding: 'var(--space-sm) var(--space-lg)',
            fontWeight: 600,
            cursor: inputValue.trim() && !isLoading ? 'pointer' : 'not-allowed',
            transition: 'background-color 0.2s',
            height: '48px',
          }}
        >
          {isLoading ? '処理中...' : '追加'}
        </button>
      </form>
      
      {error && (
        <div style={{ color: 'var(--color-error)', fontSize: 'var(--font-size-sm)', paddingLeft: 'var(--space-md)' }}>
          {error}
        </div>
      )}
      
      <div style={{ color: 'var(--color-text-light)', fontSize: 'var(--font-size-xs)', textAlign: 'center' }}>
        ※ マイクボタンを長押し（またはタップしたまま）で音声入力ができます。
      </div>
    </motion.div>
  );
};
