import React from 'react';
import PropTypes from 'prop-types';
import { COLORS } from '../../app.config';

const MESSAGE_ROLES = {
  USER: 'user',
  ASSISTANT: 'assistant',
};

function formatTimestamp(date) {
  if (!date) return '';
  const d = date instanceof Date ? date : new Date(date);
  const hours = d.getHours().toString().padStart(2, '0');
  const minutes = d.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

function UserAvatar({ initials }) {
  return (
    <div
      className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
      style={{ backgroundColor: COLORS.PRIMARY }}
      aria-hidden="true"
    >
      {initials || 'U'}
    </div>
  );
}

UserAvatar.propTypes = {
  initials: PropTypes.string,
};

function AssistantAvatar() {
  return (
    <div
      className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
      style={{ backgroundColor: COLORS.SECONDARY }}
      aria-hidden="true"
    >
      <svg
        className="w-4 h-4 text-white"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
        />
      </svg>
    </div>
  );
}

export function ChatMessage({ role, content, timestamp, userInitials = 'U', className = '' }) {
  const isUser = role === MESSAGE_ROLES.USER;
  const isAssistant = role === MESSAGE_ROLES.ASSISTANT;

  if (!content) {
    return null;
  }

  return (
    <div
      className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'} ${className}`}
      role="listitem"
      aria-label={`${isUser ? 'Your' : 'Assistant'} message`}
    >
      {isUser ? (
        <UserAvatar initials={userInitials} />
      ) : (
        <AssistantAvatar />
      )}

      <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-[80%]`}>
        <div
          className={`
            px-4 py-2.5 rounded-2xl text-sm leading-relaxed
            ${
              isUser
                ? 'bg-[#0070C0] text-white rounded-br-md'
                : 'bg-[#F3F2F1] text-[#323130] rounded-bl-md'
            }
          `}
        >
          <p className="whitespace-pre-wrap break-words">{content}</p>
        </div>

        {timestamp && (
          <span
            className="text-[10px] text-[#605E5C] mt-1 px-1"
            aria-label={`Sent at ${formatTimestamp(timestamp)}`}
          >
            {formatTimestamp(timestamp)}
          </span>
        )}
      </div>
    </div>
  );
}

ChatMessage.propTypes = {
  role: PropTypes.oneOf([MESSAGE_ROLES.USER, MESSAGE_ROLES.ASSISTANT]).isRequired,
  content: PropTypes.string.isRequired,
  timestamp: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.string]),
  userInitials: PropTypes.string,
  className: PropTypes.string,
};