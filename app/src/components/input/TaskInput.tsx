<<<<<<< HEAD
'use client';

import React, { useState, useEffect } from 'react';
import { MicButton } from './MicButton';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import styles from './TaskInput.module.css';

interface TaskInputProps {
  onSubmit: (taskName: string) => void;
=======
import React, { useState, useEffect } from 'react';
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition';
import { MicButton } from './MicButton';
import { motion } from 'framer-motion';

interface TaskInputProps {
  onSubmit: (task: string) => void;
>>>>>>> 5835434eb485624fa18f269208aeb7719b83112f
  isLoading?: boolean;
}

export const TaskInput: React.FC<TaskInputProps> = ({ onSubmit, isLoading = false }) => {
<<<<<<< HEAD
  const [inputValue, setInputValue] = useState('');
  const { text, isListening, startListening, stopListening, resetText, isSupported, error } = useSpeechRecognition();

  // 音声認識のテキストが更新されたら入力欄に反映
  useEffect(() => {
    if (text) {
      setInputValue(text);
    }
  }, [text]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inputValue.trim();
    if (trimmed && !isLoading) {
      onSubmit(trimmed);
      setInputValue('');
      resetText();
=======
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
>>>>>>> 5835434eb485624fa18f269208aeb7719b83112f
    }
  };

  return (
<<<<<<< HEAD
    <form onSubmit={handleSubmit} className={styles.formContainer}>
      <div className={styles.inputWrapper}>
=======
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
>>>>>>> 5835434eb485624fa18f269208aeb7719b83112f
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
<<<<<<< HEAD
          placeholder="タスクを入力（またはマイクを長押し）"
          className={styles.textInput}
          disabled={isLoading || isListening}
        />
        {isSupported && (
          <MicButton
            isListening={isListening}
            onStart={() => {
              resetText();
              startListening();
            }}
            onStop={stopListening}
            disabled={isLoading}
          />
        )}
      </div>
      {error && <p className={styles.errorText}>{error}</p>}
      <button
        type="submit"
        disabled={!inputValue.trim() || isLoading}
        className={styles.submitButton}
      >
        {isLoading ? '細分化中...' : 'タスクを細分化する'}
      </button>
    </form>
=======
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
>>>>>>> 5835434eb485624fa18f269208aeb7719b83112f
  );
};
