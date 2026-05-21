import React, { useState, useCallback, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { COLORS } from '../../app.config';

const MAX_INPUT_LENGTH = 1000;
const MIN_INPUT_HEIGHT = 44;
const MAX_INPUT_HEIGHT = 160;

export function ChatInput({ onSend, disabled = false, prefill = '', placeholder = 'Ask about your dashboard...', className = '' }) {
  const [inputValue, setInputValue] = useState('');
  const textareaRef = useRef(null);

  useEffect(() => {
    if (prefill && prefill !== inputValue) {
      setInputValue(prefill);
    }
  }, [prefill]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = `${MIN_INPUT_HEIGHT}px`;
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${Math.min(Math.max(scrollHeight, MIN_INPUT_HEIGHT), MAX_INPUT_HEIGHT)}px`;
    }
  }, [inputValue]);

  const handleChange = useCallback((e) => {
    const value = e.target.value;
    if (value.length <= MAX_INPUT_LENGTH) {
      setInputValue(value);
    }
  }, []);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        const trimmedValue = inputValue.trim();
        if (trimmedValue && !disabled) {
          onSend(trimmedValue);
          setInputValue('');
        }
      }
    },
    [inputValue, onSend, disabled]
  );

  const handleSendClick = useCallback(() => {
    const trimmedValue = inputValue.trim();
    if (trimmedValue && !disabled) {
      onSend(trimmedValue);
      setInputValue('');
    }
  }, [inputValue, onSend, disabled]);

  const charCount = inputValue.length;
  const isNearLimit = charCount > MAX_INPUT_LENGTH * 0.9;

  return (
    <div className={`flex items-end gap-2 p-3 border-t border-[#EDEBE9] bg-white ${className}`}>
      <div className="flex-1 relative">
        <textarea
          ref={textareaRef}
          value={inputValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder={placeholder}
          maxLength={MAX_INPUT_LENGTH}
          rows={1}
          aria-label="Chat message input"
          className={`
            w-full resize-none rounded-lg border border-[#EDEBE9] bg-white
            px-3 py-2.5 text-sm text-[#323130] placeholder-[#605E5C]
            focus:outline-none focus:ring-2 focus:ring-[#0070C0] focus:border-transparent
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-colors duration-150 ease-out
          `}
          style={{ minHeight: MIN_INPUT_HEIGHT, maxHeight: MAX_INPUT_HEIGHT }}
        />
        {isNearLimit && (
          <span
            className="absolute bottom-1 right-2 text-[10px] font-medium"
            style={{ color: charCount >= MAX_INPUT_LENGTH ? COLORS.DANGER : COLORS.WARNING }}
            aria-live="polite"
            aria-label={`${MAX_INPUT_LENGTH - charCount} characters remaining`}
          >
            {MAX_INPUT_LENGTH - charCount}
          </span>
        )}
      </div>

      <button
        type="button"
        onClick={handleSendClick}
        disabled={disabled || !inputValue.trim()}
        aria-label="Send message"
        className={`
          flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-lg
          transition-all duration-150 ease-out
          focus:outline-none focus:ring-2 focus:ring-[#0070C0] focus:ring-offset-1
          ${
            inputValue.trim() && !disabled
              ? 'bg-[#0070C0] text-white hover:bg-[#005a9e] active:scale-95 shadow-sm'
              : 'bg-[#F3F2F1] text-[#605E5C] cursor-not-allowed'
          }
        `}
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
          />
        </svg>
      </button>
    </div>
  );
}

ChatInput.propTypes = {
  onSend: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  prefill: PropTypes.string,
  placeholder: PropTypes.string,
  className: PropTypes.string,
};