import React, { useState } from 'react';
import { useAuth } from '../../auth/AuthContext';
import { useApp } from '../../context/AppContext';
import {
  Search,
  Bell,
  Sun,
  Moon,
  LogOut,
  ChevronDown,
  Layers,
  CheckCircle2,
  AlertTriangle,
  GitBranch,
  ShieldCheck
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

interface HeaderProps {
  onOpenSearch?: () => void;
  breadcrumbs?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSearch, breadcrumbs }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme, repositories, activeRepoId, setActiveRepoId } = useApp();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const navigate = useNavigate();

  const activeRepo = repositories.find((r) => r.id === activeRepoId) || repositories[0];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="h-14 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-4 flex items-center justify-between gap-4 sticky top-0 z-30">
      {/* Left: Context Breadcrumb or Active Repo Switcher */}
      <div className="flex items-center gap-3 min-w-0">
        {breadcrumbs ? (
          breadcrumbs
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider hidden sm:inline">
              Repository
            </span>
            <div className="relative">
              <select
                value={activeRepoId}
                onChange={(e) => setActiveRepoId(e.target.value)}
                className="appearance-none bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200/70 dark:hover:bg-neutral-700/70 border border-neutral-200 dark:border-neutral-700 text-xs font-medium text-neutral-900 dark:text-neutral-100 rounded-md pl-2.5 pr-7 py-1 cursor-pointer focus:outline-hidden focus:ring-1 focus:ring-blue-500"
              >
                {repositories.map((repo) => (
                  <option key={repo.id} value={repo.id}>
                    {repo.owner}/{repo.name} ({repo.defaultBranch})
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-neutral-500 absolute right-2 top-2 pointer-events-none" />
            </div>

            <div className="hidden md:flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400 pl-2">
              <GitBranch className="w-3.5 h-3.5 text-neutral-400" />
              <span className="font-mono text-[11px]">{activeRepo?.defaultBranch || 'main'}</span>
              <span className="text-neutral-300 dark:text-neutral-700">·</span>
              <span className="font-mono text-[11px] text-neutral-400">
                {activeRepo?.latestCommit?.hash || '9f3b8e1'}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Right Action Cluster */}
      <div className="flex items-center gap-2.5 shrink-0">
        {/* Quick Search Button */}
        <button
          onClick={onOpenSearch}
          className="hidden sm:flex items-center gap-2 px-2.5 py-1 text-xs text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-md transition-colors"
        >
          <Search className="w-3.5 h-3.5 text-neutral-400" />
          <span>Quick Find...</span>
          <kbd className="font-mono text-[10px] bg-white dark:bg-neutral-900 px-1 py-0.5 rounded border border-neutral-300 dark:border-neutral-700 text-neutral-400">
            ⌘K
          </kbd>
        </button>

        {/* Sandbox Environment Tag */}
        <div className="hidden lg:flex items-center gap-1.5 px-2 py-0.5 text-[11px] font-mono text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-800 rounded">
          <ShieldCheck className="w-3 h-3 text-neutral-400" />
          <span>Demo Sandbox</span>
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-1.5 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md transition-colors"
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setNotificationsOpen(!notificationsOpen);
              setUserMenuOpen(false);
            }}
            className="p-1.5 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md relative transition-colors"
            title="Notifications"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-blue-600" />
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-xl py-2 z-50 text-xs">
              <div className="px-3 py-1.5 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
                <span className="font-semibold text-neutral-900 dark:text-neutral-100">Notifications</span>
                <span className="text-[11px] text-neutral-400">3 unread</span>
              </div>
              <div className="divide-y divide-neutral-100 dark:divide-neutral-800/60 max-h-64 overflow-y-auto">
                <div className="p-3 hover:bg-neutral-50 dark:hover:bg-neutral-800/40">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-neutral-900 dark:text-neutral-200">
                        Canary Traffic Step (20%)
                      </p>
                      <p className="text-[11px] text-neutral-500 mt-0.5">
                        checkout-service canary step to 20% healthy in prod cluster.
                      </p>
                      <span className="text-[10px] text-neutral-400 font-mono mt-1 block">2m ago</span>
                    </div>
                  </div>
                </div>

                <div className="p-3 hover:bg-neutral-50 dark:hover:bg-neutral-800/40">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-neutral-900 dark:text-neutral-200">
                        Patch Approved
                      </p>
                      <p className="text-[11px] text-neutral-500 mt-0.5">
                        Constant-Time HMAC patch approved by Lead Engineer.
                      </p>
                      <span className="text-[10px] text-neutral-400 font-mono mt-1 block">8m ago</span>
                    </div>
                  </div>
                </div>

                <div className="p-3 hover:bg-neutral-50 dark:hover:bg-neutral-800/40">
                  <div className="flex items-start gap-2">
                    <Layers className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-neutral-900 dark:text-neutral-200">
                        Image Build Ready
                      </p>
                      <p className="text-[11px] text-neutral-500 mt-0.5">
                        ghcr.io/reposage-org/checkout-service:v2.4.1 packaged cleanly.
                      </p>
                      <span className="text-[10px] text-neutral-400 font-mono mt-1 block">35m ago</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="px-3 pt-2 pb-1 border-t border-neutral-100 dark:border-neutral-800 text-center">
                <Link
                  to="/app/activity"
                  onClick={() => setNotificationsOpen(false)}
                  className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline"
                >
                  View full activity audit log →
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Avatar & Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setUserMenuOpen(!userMenuOpen);
              setNotificationsOpen(false);
            }}
            className="flex items-center gap-2 p-1 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            aria-label="User profile menu"
          >
            <div className="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 flex items-center justify-center text-xs font-semibold uppercase">
              {user?.name ? user.name.slice(0, 2) : 'DD'}
            </div>
            <div className="hidden xl:block text-left">
              <p className="text-xs font-medium text-neutral-900 dark:text-neutral-100 leading-tight truncate max-w-[110px]">
                {user?.name || 'Developer'}
              </p>
              <p className="text-[10px] text-neutral-500 dark:text-neutral-400 leading-none truncate max-w-[110px]">
                {user?.role || 'Engineer'}
              </p>
            </div>
            <ChevronDown className="w-3 h-3 text-neutral-400 hidden xl:block" />
          </button>

          {userMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-xl py-1.5 z-50 text-xs">
              <div className="px-3.5 py-2 border-b border-neutral-100 dark:border-neutral-800">
                <p className="font-semibold text-neutral-900 dark:text-neutral-100 truncate">
                  {user?.name || 'Demo Developer'}
                </p>
                <p className="text-neutral-500 dark:text-neutral-400 text-[11px] truncate">
                  {user?.email || 'demo@reposage.dev'}
                </p>
                <div className="mt-1 text-[10px] text-neutral-400 font-mono">
                  Role: {user?.role || 'Lead Software Engineer'}
                </div>
              </div>

              <div className="py-1">
                <Link
                  to="/app/settings"
                  onClick={() => setUserMenuOpen(false)}
                  className="flex items-center px-3.5 py-1.5 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                >
                  Workspace Settings
                </Link>
                <Link
                  to="/app/activity"
                  onClick={() => setUserMenuOpen(false)}
                  className="flex items-center px-3.5 py-1.5 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                >
                  Audit Logs
                </Link>
              </div>

              <div className="pt-1 border-t border-neutral-100 dark:border-neutral-800">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3.5 py-1.5 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-left"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
