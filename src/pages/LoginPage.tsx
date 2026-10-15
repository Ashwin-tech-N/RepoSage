import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import {
  Sparkles,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Lock,
  Mail,
  ShieldAlert
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, demoLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/app/overview';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email.trim()) {
      setErrorMessage('Please enter your email address.');
      return;
    }

    if (!password) {
      setErrorMessage('Please enter your password.');
      return;
    }

    setIsLoading(true);
    const res = await login(email, password);
    setIsLoading(false);

    if (res.success) {
      navigate(from, { replace: true });
    } else {
      setErrorMessage(res.error || 'Authentication failed. Please verify credentials.');
    }
  };

  const handleDemoLoginClick = () => {
    demoLogin();
    navigate('/app/overview', { replace: true });
  };

  const fillDemoCredentials = () => {
    setEmail('demo@reposage.dev');
    setPassword('demo-engineer-2026');
    setErrorMessage('');
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-2 mb-4 group">
          <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-xs group-hover:bg-blue-700 transition-colors">
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white">
            RepoSage
          </span>
        </Link>
        <h2 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
          Sign in to your engineering workspace
        </h2>
        <p className="mt-1 text-xs text-neutral-600 dark:text-neutral-400">
          Or{' '}
          <Link to="/signup" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
            create a demo developer account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-neutral-900 py-8 px-4 shadow-xl border border-neutral-200 dark:border-neutral-800 sm:rounded-xl sm:px-10">
          {/* Demo Sandbox Banner */}
          <div className="mb-6 p-3 bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200/60 dark:border-blue-900/40 rounded-lg text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-blue-900 dark:text-blue-300 flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Demo Authentication</span>
              </span>
              <button
                type="button"
                onClick={fillDemoCredentials}
                className="text-blue-700 dark:text-blue-400 font-medium hover:underline cursor-pointer text-[11px]"
              >
                Auto-fill demo credentials
              </button>
            </div>
            <p className="text-[11px] text-blue-800 dark:text-blue-300/80 leading-relaxed">
              Initialized from <code className="font-mono bg-blue-100/70 dark:bg-blue-900/50 px-1 py-0.2 rounded">users.json</code>. You can also sign in with 1 click:
            </p>
            <button
              type="button"
              onClick={handleDemoLoginClick}
              className="w-full py-1.5 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium text-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Instant 1-Click Demo Sign In</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {errorMessage && (
            <div className="mb-4 p-3 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 rounded-lg flex items-start gap-2.5 text-xs text-rose-700 dark:text-rose-300">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Work Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="demo@reposage.dev"
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                  required
                />
                <Mail className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5 pointer-events-none" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setForgotModalOpen(true)}
                  className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-9 py-2 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                  required
                />
                <Lock className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5 pointer-events-none" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded border-neutral-300 dark:border-neutral-700 focus:ring-blue-500"
                />
                <span className="text-xs text-neutral-600 dark:text-neutral-400">Remember session</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 bg-neutral-900 dark:bg-neutral-100 dark:text-neutral-900 text-white rounded-lg text-xs font-semibold hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white dark:border-neutral-900 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {forgotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-xl p-5">
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-1">
              Reset Demo Password
            </h3>
            <p className="text-xs text-neutral-500 mb-4 leading-relaxed">
              In this client demo environment, password recovery resets your local session back to the default developer profile.
            </p>
            {forgotSent ? (
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300 rounded-lg text-xs mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Demo recovery instructions sent to your email.</span>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setForgotSent(true)}
                className="w-full py-2 bg-blue-600 text-white rounded-md text-xs font-medium hover:bg-blue-700 transition-colors mb-2"
              >
                Send Reset Link
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                setForgotModalOpen(false);
                setForgotSent(false);
              }}
              className="w-full py-1.5 text-xs text-neutral-600 dark:text-neutral-400 hover:text-neutral-900"
            >
              Back to Sign In
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
