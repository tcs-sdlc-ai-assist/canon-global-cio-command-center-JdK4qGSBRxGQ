import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useAuth } from '../context/AuthContext';
import { BRAND, COLORS } from '../app.config';

export function LoginPage({ className = '' }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Email and password are required');
      return;
    }

    if (!email.includes('@') || !email.includes('.')) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);

    try {
      const result = await login(email.trim(), password);
      if (!result.success) {
        setError(result.error || 'Login failed. Please try again.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center bg-[#F3F2F1] ${className}`}>
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#0070C0] flex items-center justify-center">
              <span className="text-white text-2xl font-bold" aria-hidden="true">C</span>
            </div>
            <h1 className="text-2xl font-bold text-[#323130]">{BRAND.NAME}</h1>
            <p className="text-sm text-[#605E5C] mt-1">{BRAND.TAGLINE}</p>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-4">
              <label htmlFor="login-email" className="block text-sm font-medium text-[#323130] mb-1">
                Email address
              </label>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@canon.com"
                disabled={isLoading}
                autoComplete="email"
                className="w-full px-3 py-2 border border-[#EDEBE9] rounded-md text-sm text-[#323130] placeholder-[#605E5C] focus:outline-none focus:ring-2 focus:ring-[#0070C0] focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                aria-describedby={error ? 'login-error' : undefined}
              />
            </div>

            <div className="mb-6">
              <label htmlFor="login-password" className="block text-sm font-medium text-[#323130] mb-1">
                Password
              </label>
              <input
                id="login-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                disabled={isLoading}
                autoComplete="current-password"
                className="w-full px-3 py-2 border border-[#EDEBE9] rounded-md text-sm text-[#323130] placeholder-[#605E5C] focus:outline-none focus:ring-2 focus:ring-[#0070C0] focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                aria-describedby={error ? 'login-error' : undefined}
              />
            </div>

            {error && (
              <div
                id="login-error"
                role="alert"
                className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-700"
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 bg-[#0070C0] text-white text-sm font-medium rounded-md hover:bg-[#005a9e] focus:outline-none focus:ring-2 focus:ring-[#0070C0] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <p className="mt-6 text-xs text-center text-[#605E5C]">
            Mock authentication — any valid email and password will work
          </p>
        </div>
      </div>
    </div>
  );
}

LoginPage.propTypes = {
  className: PropTypes.string,
};