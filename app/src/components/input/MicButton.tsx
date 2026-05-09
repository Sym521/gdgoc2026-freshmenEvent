import React from 'react';
<<<<<<< HEAD
import styles from './MicButton.module.css';
=======
import { motion } from 'framer-motion';
>>>>>>> 5835434eb485624fa18f269208aeb7719b83112f

interface MicButtonProps {
  isListening: boolean;
  onStart: () => void;
  onStop: () => void;
<<<<<<< HEAD
  disabled?: boolean;
}

export const MicButton: React.FC<MicButtonProps> = ({
  isListening,
  onStart,
  onStop,
  disabled = false,
}) => {
=======
}

export const MicButton: React.FC<MicButtonProps> = ({ isListening, onStart, onStop }) => {
>>>>>>> 5835434eb485624fa18f269208aeb7719b83112f
  return (
    <button
      type="button"
      onMouseDown={onStart}
      onMouseUp={onStop}
      onMouseLeave={onStop}
      onTouchStart={onStart}
      onTouchEnd={onStop}
<<<<<<< HEAD
      disabled={disabled}
      className={`${styles.micButton} ${isListening ? styles.listening : ''}`}
      aria-label="マイクボタン"
    >
      {/* 簡易的なビジュアルフィードバック */}
      {isListening && <span className={styles.ripple}></span>}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className={styles.icon}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z"
        />
=======
      style={{
        position: 'relative',
        width: '48px',
        height: '48px',
        borderRadius: 'var(--radius-full)',
        backgroundColor: isListening ? 'var(--color-error)' : 'var(--color-primary)',
        border: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        boxShadow: isListening ? 'var(--shadow-glow)' : 'var(--shadow-md)',
        transition: 'all 0.2s var(--ease-smooth)',
        outline: 'none',
        flexShrink: 0,
      }}
    >
      {/* Ripple effect when listening */}
      {isListening && (
        <motion.div
          animate={{ scale: [1, 1.5, 2], opacity: [0.5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            backgroundColor: 'var(--color-error)',
            zIndex: 0,
          }}
        />
      )}
      <svg 
        width="24" 
        height="24" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="var(--color-text-inverse)" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        style={{ position: 'relative', zIndex: 1 }}
      >
        <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
        <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
        <line x1="12" x2="12" y1="19" y2="22" />
>>>>>>> 5835434eb485624fa18f269208aeb7719b83112f
      </svg>
    </button>
  );
};
