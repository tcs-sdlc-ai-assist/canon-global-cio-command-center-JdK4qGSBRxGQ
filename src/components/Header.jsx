import React from 'react';
import PropTypes from 'prop-types';
import { useAuth } from '../context/AuthContext';
import { BRAND, COLORS } from '../app.config';

export function Header({ className = '' }) {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 bg-white border-b border-[#EDEBE9] ${className}`}
      style={{ height: 48 }}
      role="banner"
    >
      <div className="h-full flex items-center justify-between px-4 lg:px-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center"
              style={{ backgroundColor: COLORS.PRIMARY }}
              aria-hidden="true"
            >
              <span className="text-white text-xs font-bold">C</span>
            </div>
            <span className="text-sm font-semibold text-[#323130] hidden sm:inline">
              {BRAND.NAME}
            </span>
          </div>
          <span className="text-xs text-[#605E5C] hidden md:inline">
            {BRAND.TAGLINE}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            className="relative p-1.5 rounded-md text-[#605E5C] hover:text-[#323130] hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#0070C0] focus:ring-offset-1 transition-colors"
            aria-label="Notifications"
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
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
            <span
              className="absolute top-1 right-1 w-2 h-2 rounded-full"
              style={{ backgroundColor: COLORS.DANGER }}
              aria-label="Unread notifications"
            />
          </button>

          {user && (
            <div className="flex items-center gap-2">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-medium text-[#323130] leading-tight">
                  {user.name}
                </p>
                <p className="text-[10px] text-[#605E5C] leading-tight">
                  {user.role}
                </p>
              </div>
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                style={{ backgroundColor: COLORS.PRIMARY }}
                aria-label={`Avatar for ${user.name}`}
              >
                {user.avatarInitials || user.name.charAt(0).toUpperCase()}
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={handleLogout}
            className="p-1.5 rounded-md text-[#605E5C] hover:text-[#323130] hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#0070C0] focus:ring-offset-1 transition-colors"
            aria-label="Logout"
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
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}

Header.propTypes = {
  className: PropTypes.string,
};