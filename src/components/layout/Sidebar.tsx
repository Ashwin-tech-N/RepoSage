import React from 'react';
import { NavLink } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  GitFork,
  FileSearch,
  GitPullRequest,
  CheckCheck,
  Layers,
  Server,
  Activity,
  AlertOctagon,
  ScrollText,
  Settings,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Terminal
} from 'lucide-react';

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ collapsed, onToggleCollapse }) => {
  const { issues, patches, incidents, deployments } = useApp();

  const openIssuesCount = issues.filter((i) => i.status === 'open').length;
  const pendingPatchesCount = patches.filter((p) => p.status === 'pending_review').length;
  const activeIncidentsCount = incidents.filter((i) => i.status !== 'resolved').length;
  const canaryActive = deployments.some((d) => d.status === 'canary_in_progress');

  const navItems = [
    { label: 'Overview', to: '/app/overview', icon: LayoutDashboard },
    { label: 'Repositories', to: '/app/repositories', icon: GitFork },
    {
      label: 'Code Analysis',
      to: '/app/analysis',
      icon: FileSearch,
      badge: openIssuesCount > 0 ? `${openIssuesCount}` : undefined,
      badgeVariant: 'warning'
    },
    {
      label: 'AI Patches',
      to: '/app/patches',
      icon: GitPullRequest,
      badge: pendingPatchesCount > 0 ? `${pendingPatchesCount}` : undefined,
      badgeVariant: 'info'
    },
    { label: 'Automated Tests', to: '/app/tests', icon: CheckCheck },
    { label: 'Container Images', to: '/app/containers', icon: Layers },
    {
      label: 'Deployments',
      to: '/app/deployments',
      icon: Server,
      badge: canaryActive ? 'Canary' : undefined,
      badgeVariant: 'warning'
    },
    { label: 'Live Monitoring', to: '/app/monitoring', icon: Activity },
    {
      label: 'Incidents',
      to: '/app/incidents',
      icon: AlertOctagon,
      badge: activeIncidentsCount > 0 ? `${activeIncidentsCount}` : undefined,
      badgeVariant: 'error'
    },
    { label: 'Activity Logs', to: '/app/activity', icon: ScrollText },
    { label: 'Settings', to: '/app/settings', icon: Settings }
  ];

  return (
    <aside
      className={`h-screen bg-neutral-900 text-neutral-300 border-r border-neutral-800 flex flex-col justify-between shrink-0 transition-all duration-200 z-40 select-none ${
        collapsed ? 'w-16' : 'w-60'
      }`}
    >
      {/* Brand Header */}
      <div>
        <div className="h-14 flex items-center justify-between px-3.5 border-b border-neutral-800/80">
          <NavLink
            to="/app/overview"
            className="flex items-center gap-2.5 overflow-hidden group focus:outline-hidden"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-xs">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            {!collapsed && (
              <div className="truncate">
                <span className="font-semibold text-white tracking-tight text-sm">
                  RepoSage
                </span>
                <span className="text-[10px] text-neutral-400 block font-mono">
                  Autonomous Agent
                </span>
              </div>
            )}
          </NavLink>

          <button
            onClick={onToggleCollapse}
            className="p-1 rounded text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-label="Toggle sidebar collapse"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation List */}
        <nav className="p-2 space-y-0.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center justify-between px-2.5 py-2 rounded-md text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-neutral-800 text-white font-semibold shadow-xs'
                      : 'text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800/60'
                  }`
                }
                title={collapsed ? item.label : undefined}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Icon className="w-4 h-4 shrink-0 text-neutral-400 group-hover:text-white" />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </div>

                {!collapsed && item.badge && (
                  <span
                    className={`font-mono text-[10px] tabular-nums px-1.5 py-0.2 rounded ${
                      item.badgeVariant === 'error'
                        ? 'bg-rose-950 text-rose-300 border border-rose-900/60'
                        : item.badgeVariant === 'warning'
                        ? 'bg-amber-950 text-amber-300 border border-amber-900/60'
                        : 'bg-blue-950 text-blue-300 border border-blue-900/60'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Sidebar Footer with system telemetry & simulator status */}
      <div className="p-3 border-t border-neutral-800/80 bg-neutral-950/40 text-[11px]">
        {!collapsed ? (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-neutral-400">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>Runtime healthy</span>
              </span>
              <span className="font-mono tabular-nums text-neutral-500 text-[10px]">99.98%</span>
            </div>
            <div className="flex items-center justify-between text-[10px] text-neutral-500 font-mono">
              <span>Agent: Ready</span>
              <span>K8s: Connected</span>
            </div>
          </div>
        ) : (
          <div className="flex justify-center" title="Runtime healthy">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
          </div>
        )}
      </div>
    </aside>
  );
};
