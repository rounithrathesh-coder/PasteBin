import React, { useState } from 'react';
import { usePastes } from '../../context/PasteContext';
import { api } from '../../services/api';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { showToast, setIsAuthenticated } = usePastes();

  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email || !password) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    setIsLoading(true);

    try {
      // Validate Turnstile captcha token via backend API
      const turnstileRes = await api.verifyTurnstileToken('mock-turnstile-token');

      if (!turnstileRes.success) {
        setErrorMessage(turnstileRes.message || 'Captcha verification failed.');
        setIsLoading(false);
        return;
      }

      setTimeout(() => {
        setIsLoading(false);
        setIsAuthenticated(true);
        if (mode === 'login') {
          showToast(`Welcome back, ${email.split('@')[0]}!`);
        } else {
          showToast(`Account created successfully for ${name || email}!`);
        }
        onClose();
      }, 600);
    } catch (err: any) {
      setIsLoading(false);
      setErrorMessage(err.message || 'Authentication failed. Please try again.');
    }
  };

  const handleOAuthLogin = (provider: string) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsAuthenticated(true);
      showToast(`Authenticated via ${provider}!`);
      onClose();
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-surface-container-low border border-outline-variant/60 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden relative group">
        {/* Glowing Ambient Top Accent */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-purple-600 via-primary to-indigo-500"></div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-outline hover:text-on-surface hover:bg-surface-container-high transition-colors"
          title="Close Modal"
        >
          <span className="material-symbols-outlined text-lg">close</span>
        </button>

        <div className="p-6 sm:p-8 space-y-6">
          {/* Brand Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2">
              <div className="bg-primary-container p-2 rounded-xl shadow-md shadow-primary-container/40">
                <span className="material-symbols-outlined text-white text-xl">terminal</span>
              </div>
              <span className="text-2xl font-bold tracking-tight text-on-surface">PasteBin</span>
            </div>
            <h2 className="text-lg font-bold text-on-surface">
              {mode === 'login' ? 'Welcome back to PasteBin' : 'Create your PasteBin account'}
            </h2>
            <p className="text-xs text-outline font-medium">
              {mode === 'login'
                ? 'Sign in to access your snippets, favorites, and API keys'
                : 'Join over 500+ developers sharing code everyday'}
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex bg-surface-container-lowest p-1 rounded-xl border border-outline-variant/50 font-mono text-xs">
            <button
              onClick={() => {
                setMode('login');
                setErrorMessage(null);
              }}
              className={`flex-1 py-2 rounded-lg font-semibold transition-all ${
                mode === 'login'
                  ? 'bg-primary-container text-on-primary-container shadow-sm'
                  : 'text-outline hover:text-on-surface'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setMode('signup');
                setErrorMessage(null);
              }}
              className={`flex-1 py-2 rounded-lg font-semibold transition-all ${
                mode === 'signup'
                  ? 'bg-primary-container text-on-primary-container shadow-sm'
                  : 'text-outline hover:text-on-surface'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* OAuth Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleOAuthLogin('GitHub')}
              className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-surface-container-lowest border border-outline-variant/60 hover:bg-surface-container-high hover:border-outline text-xs font-mono font-semibold text-on-surface transition-all active:scale-95 shadow-sm"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              GitHub
            </button>

            <button
              type="button"
              onClick={() => handleOAuthLogin('Google')}
              className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-surface-container-lowest border border-outline-variant/60 hover:bg-surface-container-high hover:border-outline text-xs font-mono font-semibold text-on-surface transition-all active:scale-95 shadow-sm"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.29v3.15C3.26 21.3 7.31 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.29C.47 8.21 0 10.05 0 12s.47 3.79 1.29 5.42l3.99-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.58l3.99 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
              Google
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="h-[1px] bg-outline-variant/60 flex-1"></div>
            <span className="text-[10px] font-mono uppercase text-outline">or continue with email</span>
            <div className="h-[1px] bg-outline-variant/60 flex-1"></div>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs font-mono text-red-400 flex items-center gap-2 animate-fade-in">
              <span className="material-symbols-outlined text-base shrink-0">error</span>
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Form Controls */}
          <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
            {mode === 'signup' && (
              <div className="space-y-1.5">
                <label className="text-outline">Full Name</label>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-base group-focus-within:text-primary transition-colors">
                    person
                  </span>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Smith"
                    className="w-full bg-surface-container-lowest border border-outline-variant/60 rounded-xl py-2.5 pl-9 pr-3 text-xs font-mono text-on-surface focus:outline-none focus:border-primary-container transition-all placeholder:text-outline/50"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-outline">Email Address</label>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-base group-focus-within:text-primary transition-colors">
                  mail
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="developer@example.com"
                  className="w-full bg-surface-container-lowest border border-outline-variant/60 rounded-xl py-2.5 pl-9 pr-3 text-xs font-mono text-on-surface focus:outline-none focus:border-primary-container transition-all placeholder:text-outline/50"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-outline">Password</label>
                {mode === 'login' && (
                  <a href="#" onClick={(e) => { e.preventDefault(); showToast('Password reset link sent to your email!'); }} className="text-[11px] text-purple-400 hover:underline">
                    Forgot Password?
                  </a>
                )}
              </div>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-base group-focus-within:text-primary transition-colors">
                  lock
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-surface-container-lowest border border-outline-variant/60 rounded-xl py-2.5 pl-9 pr-9 text-xs font-mono text-on-surface focus:outline-none focus:border-primary-container transition-all placeholder:text-outline/50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface transition-colors"
                >
                  <span className="material-symbols-outlined text-base">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            {mode === 'login' && (
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none text-outline hover:text-on-surface">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-outline-variant text-primary focus:ring-primary cursor-pointer"
                  />
                  <span>Remember this device</span>
                </label>
              </div>
            )}

            {/* Cloudflare Turnstile Bot Protection Indicator */}
            <div className="bg-surface-container-lowest/80 border border-outline-variant/50 rounded-xl p-2.5 flex items-center justify-between text-[10px] font-mono text-outline">
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-emerald-400 text-sm">shield</span>
                Protected by Cloudflare Turnstile
              </span>
              <span className="text-emerald-400 font-semibold">Verified</span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-primary-container text-on-primary-container rounded-xl text-xs font-bold font-mono tracking-wider hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-md shadow-primary-container/30 active:scale-95 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <span className="material-symbols-outlined text-base animate-spin">progress_activity</span>
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-base">login</span>
                  <span>{mode === 'login' ? 'Sign In to Workspace' : 'Create Account'}</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
