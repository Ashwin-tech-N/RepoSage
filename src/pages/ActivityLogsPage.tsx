import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ScrollText,
  Search,
  Download,
  Filter,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Clock,
  User,
  Bot,
  Cpu
} from 'lucide-react';
import { ActivityCategory, ActivityLogEntry } from '../types';

export const ActivityLogsPage: React.FC = () => {
  const { activityLogs } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories: { label: string; value: string }[] = [
    { label: 'All Events', value: 'all' },
    { label: 'Auth & Sessions', value: 'auth' },
    { label: 'AST Analysis', value: 'analysis' },
    { label: 'AI Patches', value: 'patch' },
    { label: 'Test Suites', value: 'test' },
    { label: 'Container Builds', value: 'image' },
    { label: 'Deployments', value: 'deployment' },
    { label: 'Incidents & Rollbacks', value: 'incident' },
    { label: 'Repositories', value: 'repository' }
  ];

  const filteredLogs = activityLogs.filter((log) => {
    const matchesSearch =
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.target.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.actor.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || log.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleExport = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(activityLogs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `reposage-audit-logs-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white">
            Workspace Activity & Audit Logs
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Immutable audit record of developer approvals, autonomous agent interventions, test runs, and cluster canary transitions.
          </p>
        </div>

        <button
          onClick={handleExport}
          className="px-3.5 py-1.5 text-xs font-medium text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Download className="w-3.5 h-3.5 text-neutral-500" />
          <span>Export Audit Log (JSON)</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search action, target, or actor..."
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
          />
          <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-2 pointer-events-none" />
        </div>

        {/* Category selector */}
        <div className="flex items-center gap-1 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors whitespace-nowrap shrink-0 ${
                selectedCategory === cat.value
                  ? 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 shadow-xs'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Logs Table */}
      <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-900 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800 text-neutral-500 font-medium">
              <tr>
                <th className="py-2.5 px-4 font-medium">Timestamp</th>
                <th className="py-2.5 px-4 font-medium">Category</th>
                <th className="py-2.5 px-4 font-medium">Actor</th>
                <th className="py-2.5 px-4 font-medium">Action</th>
                <th className="py-2.5 px-4 font-medium">Target Resource</th>
                <th className="py-2.5 px-4 font-medium text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-neutral-400">
                    No activity logs recorded matching query.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => {
                  const isAgent = log.actorType === 'agent';
                  const isSystem = log.actorType === 'system';

                  return (
                    <tr key={log.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40 transition-colors">
                      <td className="py-3 px-4 font-mono text-[11px] text-neutral-500 whitespace-nowrap">
                        {log.timestamp}
                      </td>

                      <td className="py-3 px-4 font-mono text-[11px] uppercase text-neutral-500">
                        {log.category}
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5 font-medium text-neutral-800 dark:text-neutral-200">
                          {isAgent ? (
                            <Bot className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                          ) : isSystem ? (
                            <Cpu className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                          ) : (
                            <User className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                          )}
                          <span className="truncate max-w-[130px]">{log.actor}</span>
                        </div>
                      </td>

                      <td className="py-3 px-4 font-medium text-neutral-900 dark:text-neutral-100">
                        {log.action}
                      </td>

                      <td className="py-3 px-4 font-mono text-[11px] text-neutral-600 dark:text-neutral-300 max-w-xs truncate">
                        {log.target}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <span
                          className={`font-mono text-[11px] font-semibold uppercase ${
                            log.status === 'success'
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : log.status === 'warning'
                              ? 'text-amber-600 dark:text-amber-400'
                              : log.status === 'error'
                              ? 'text-rose-600 dark:text-rose-400'
                              : 'text-blue-600 dark:text-blue-400'
                          }`}
                        >
                          {log.status}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
