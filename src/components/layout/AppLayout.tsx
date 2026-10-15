import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { ToastContainer } from '../ui/ToastContainer';
import { Search, X, ArrowRight, ShieldAlert } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AppLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { repositories, issues, patches } = useApp();
  const navigate = useNavigate();

  // Global Cmd+K / Ctrl+K keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
      if (e.key === 'Escape' && searchOpen) {
        setSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [searchOpen]);

  const quickLinks = [
    { label: 'Overview Dashboard', path: '/app/overview', category: 'Navigation' },
    { label: 'Repositories & Branch Analysis', path: '/app/repositories', category: 'Navigation' },
    { label: 'Code Analysis & Issues Table', path: '/app/analysis', category: 'Navigation' },
    { label: 'AI Patch Review & Diffs', path: '/app/patches', category: 'Navigation' },
    { label: 'Automated Test Suites', path: '/app/tests', category: 'Navigation' },
    { label: 'Container Images & Docker Registry', path: '/app/containers', category: 'Navigation' },
    { label: 'Deployments & Canary Pipelines', path: '/app/deployments', category: 'Navigation' },
    { label: 'Live Website & Service Monitoring', path: '/app/monitoring', category: 'Navigation' },
    { label: 'Incidents & Auto-Recovery Triage', path: '/app/incidents', category: 'Navigation' },
    { label: 'Activity & Audit Logs', path: '/app/activity', category: 'Navigation' },
    { label: 'Workspace Settings & Policies', path: '/app/settings', category: 'Navigation' }
  ];

  const filteredLinks = quickLinks.filter((l) =>
    l.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredIssues = issues.filter(
    (i) =>
      i.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.filePath.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredPatches = patches.filter(
    (p) =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.filePath.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 overflow-hidden font-sans">
      {/* Sidebar */}
      <Sidebar collapsed={collapsed} onToggleCollapse={() => setCollapsed(!collapsed)} />

      {/* Main Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Informative Demo Banner */}
        <div className="bg-blue-50/80 dark:bg-blue-950/30 border-b border-blue-200/50 dark:border-blue-900/30 px-4 py-1.5 flex items-center justify-between text-xs text-blue-900 dark:text-blue-300">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400" />
            <span className="font-medium">Demo Engineering Workspace:</span>
            <span className="text-neutral-600 dark:text-neutral-400 hidden sm:inline">
              Actions simulate local in-memory Git AST scans, test runners, Docker builds, and K8s canary deployments.
            </span>
          </div>
          <span className="font-mono text-[11px] text-blue-700 dark:text-blue-400 shrink-0">
            v1.0-demo
          </span>
        </div>

        {/* Top Header */}
        <Header onOpenSearch={() => setSearchOpen(true)} />

        {/* Scrollable Main Viewport */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>

      {/* Toast Notifications */}
      <ToastContainer />

      {/* Quick Search Modal (Cmd+K) */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/40 backdrop-blur-xs">
          <div
            className="w-full max-w-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-2xl overflow-hidden"
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-center gap-3 px-4 py-3 border-b border-neutral-200 dark:border-neutral-800">
              <Search className="w-4 h-4 text-neutral-400 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search pages, repositories, detected issues, or patches..."
                className="w-full text-sm bg-transparent border-0 focus:outline-hidden text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400"
                autoFocus
              />
              <button
                onClick={() => setSearchOpen(false)}
                className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="max-h-80 overflow-y-auto p-2 text-xs">
              {/* Filtered Pages */}
              <div className="mb-2">
                <span className="px-2.5 py-1 text-[10px] font-semibold text-neutral-400 uppercase tracking-wider block">
                  Workspace Pages
                </span>
                {filteredLinks.map((item) => (
                  <button
                    key={item.path}
                    onClick={() => {
                      navigate(item.path);
                      setSearchOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-2.5 py-2 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-left transition-colors"
                  >
                    <span>{item.label}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-neutral-400" />
                  </button>
                ))}
              </div>

              {/* Filtered Issues */}
              {searchQuery && filteredIssues.length > 0 && (
                <div className="mb-2 border-t border-neutral-100 dark:border-neutral-800 pt-2">
                  <span className="px-2.5 py-1 text-[10px] font-semibold text-neutral-400 uppercase tracking-wider block">
                    Issues
                  </span>
                  {filteredIssues.map((issue) => (
                    <button
                      key={issue.id}
                      onClick={() => {
                        navigate('/app/analysis');
                        setSearchOpen(false);
                      }}
                      className="w-full flex items-center justify-between px-2.5 py-2 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 text-left transition-colors"
                    >
                      <div>
                        <p className="font-medium text-neutral-900 dark:text-neutral-100">
                          {issue.title}
                        </p>
                        <p className="text-[11px] text-neutral-400 font-mono">{issue.filePath}</p>
                      </div>
                      <span className="font-mono text-[10px] text-amber-600 dark:text-amber-400">
                        {issue.severity}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {/* Filtered Patches */}
              {searchQuery && filteredPatches.length > 0 && (
                <div className="mb-2 border-t border-neutral-100 dark:border-neutral-800 pt-2">
                  <span className="px-2.5 py-1 text-[10px] font-semibold text-neutral-400 uppercase tracking-wider block">
                    AI Patches
                  </span>
                  {filteredPatches.map((patch) => (
                    <button
                      key={patch.id}
                      onClick={() => {
                        navigate('/app/patches');
                        setSearchOpen(false);
                      }}
                      className="w-full flex items-center justify-between px-2.5 py-2 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 text-left transition-colors"
                    >
                      <div>
                        <p className="font-medium text-neutral-900 dark:text-neutral-100">
                          {patch.title}
                        </p>
                        <p className="text-[11px] text-neutral-400 font-mono">{patch.filePath}</p>
                      </div>
                      <span className="font-mono text-[10px] text-blue-600 dark:text-blue-400">
                        {patch.status}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="px-4 py-2 bg-neutral-50 dark:bg-neutral-950 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-[11px] text-neutral-400 font-mono">
              <span>Use ↑ ↓ to navigate</span>
              <span>ESC to close</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
