'use client';

import React, { useState, useEffect } from 'react';
import { MicButton } from './MicButton';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import styles from './TaskInput.module.css';

interface TaskInputProps {
  onSubmit: (taskName: string) => void;
  isLoading?: boolean;
}

export const TaskInput: React.FC<TaskInputProps> = ({ onSubmit, isLoading = false }) => {
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
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.formContainer}>
      <div className={styles.inputWrapper}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
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
  );
};
