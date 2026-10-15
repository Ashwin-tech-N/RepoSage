import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Link } from 'react-router-dom';
import {
  AlertOctagon,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  GitCommit,
  Clock,
  Terminal,
  ShieldAlert,
  ArrowRight,
  FileSearch,
  Check
} from 'lucide-react';
import { StatusText } from '../components/ui/StatusText';
import { IncidentRecord } from '../types';

export const IncidentsPage: React.FC = () => {
  const { incidents, resolveIncident } = useApp();
  const [selectedIncidentId, setSelectedIncidentId] = useState<string>(incidents[0]?.id || '');

  const activeIncident = incidents.find((i) => i.id === selectedIncidentId) || incidents[0];

  const workflowSteps = [
    'Detect Failure',
    'Evaluate Health',
    'Abort Unsafe Canary',
    'Roll Back if Required',
    'Analyze Incident',
    'Recommend Fix',
    'Validate Recovery'
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white">
            Incident Management & Auto-Recovery Triage
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Automated SLA breach detection, Istio canary termination, rapid rollback orchestration, and root cause diagnosis.
          </p>
        </div>
      </div>

      {/* Incident Lifecycle Banner */}
      <div className="p-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg space-y-3 shadow-xs">
        <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider block">
          Automated Recovery Protocol
        </span>
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {workflowSteps.map((step, idx) => (
            <React.Fragment key={idx}>
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-neutral-100 dark:bg-neutral-800 rounded text-neutral-700 dark:text-neutral-300 font-mono text-[11px]">
                <span className="text-neutral-400 font-semibold">{idx + 1}.</span>
                <span>{step}</span>
              </div>
              {idx < workflowSteps.length - 1 && (
                <ArrowRight className="w-3 h-3 text-neutral-400 shrink-0 hidden sm:inline" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Incident Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Incidents list (4 cols) */}
        <div className="lg:col-span-4 space-y-2">
          <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider block px-1">
            Recorded Incidents ({incidents.length})
          </span>

          <div className="space-y-2">
            {incidents.map((inc) => {
              const isSelected = inc.id === activeIncident?.id;
              return (
                <button
                  key={inc.id}
                  onClick={() => setSelectedIncidentId(inc.id)}
                  className={`w-full text-left p-3.5 rounded-lg border transition-all text-xs ${
                    isSelected
                      ? 'bg-white dark:bg-neutral-900 border-neutral-900 dark:border-neutral-100 shadow-sm'
                      : 'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 hover:border-neutral-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-[11px] font-bold text-neutral-600 dark:text-neutral-300">
                      {inc.id}
                    </span>
                    <StatusText status={inc.status} />
                  </div>

                  <p className="font-semibold text-neutral-900 dark:text-neutral-100 leading-snug line-clamp-2">
                    {inc.title}
                  </p>

                  <div className="mt-2 flex items-center justify-between text-[11px] text-neutral-500 font-mono">
                    <span>{inc.appName}</span>
                    <span>{inc.firstDetectedAt}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Selected Incident Forensic Dossier (8 cols) */}
        {activeIncident ? (
          <div className="lg:col-span-8 space-y-5">
            {/* Top Detail Card */}
            <div className="p-5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-100 dark:border-neutral-800 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-rose-600 dark:text-rose-400 uppercase">
                      {activeIncident.severity} Severity
                    </span>
                    <span className="text-neutral-300 dark:text-neutral-700">·</span>
                    <span className="font-mono text-xs text-neutral-500">
                      {activeIncident.id}
                    </span>
                    <span className="text-neutral-300 dark:text-neutral-700">·</span>
                    <span className="font-mono text-xs text-neutral-500">
                      {activeIncident.appName}
                    </span>
                  </div>
                  <h2 className="text-base font-bold text-neutral-900 dark:text-white mt-1">
                    {activeIncident.title}
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  <StatusText status={activeIncident.status} />
                  {activeIncident.status !== 'resolved' && (
                    <button
                      onClick={() => resolveIncident(activeIncident.id)}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-medium transition-colors flex items-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Mark Resolved</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Error summary and Root Cause */}
              <div className="space-y-3 text-xs">
                <div>
                  <span className="font-semibold text-neutral-900 dark:text-neutral-100 block mb-0.5">
                    Impact & Error Summary:
                  </span>
                  <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed">
                    {activeIncident.errorSummary}
                  </p>
                </div>

                <div className="p-3 bg-neutral-50 dark:bg-neutral-800/60 rounded border border-neutral-200 dark:border-neutral-700 space-y-1">
                  <span className="font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                    <span>Agent Diagnosis & Probable Root Cause:</span>
                  </span>
                  <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed">
                    {activeIncident.rootCause}
                  </p>
                </div>

                <div>
                  <span className="font-semibold text-neutral-900 dark:text-neutral-100 block mb-0.5">
                    Recommended Corrective Action:
                  </span>
                  <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed">
                    {activeIncident.recommendedAction}
                  </p>
                </div>

                {activeIncident.suggestedPatchId && (
                  <div className="p-2.5 bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200/50 dark:border-blue-900/40 rounded flex items-center justify-between text-xs">
                    <span className="text-blue-900 dark:text-blue-300 font-medium">
                      AI Patch #{activeIncident.suggestedPatchId} is staged and verified.
                    </span>
                    <Link
                      to="/app/patches"
                      className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-[11px] font-medium"
                    >
                      Review Patch →
                    </Link>
                  </div>
                )}
              </div>

              {/* Automated Rollback Status */}
              <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs font-mono">
                <span className="text-neutral-500">Automated Rollback Status:</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                  {activeIncident.rollbackStatus.replace('_', ' ').toUpperCase()}
                </span>
              </div>
            </div>

            {/* Incident Forensic Logs */}
            <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-900 overflow-hidden space-y-2">
              <div className="p-3 bg-neutral-100 dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
                <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-neutral-500" />
                  <span>Telemetry Audit & Cluster Ingress Logs</span>
                </span>
              </div>
              <div className="p-4 bg-neutral-950 font-mono text-[11px] text-neutral-300 space-y-1.5 overflow-x-auto max-h-48">
                {activeIncident.logs.map((log, idx) => (
                  <p key={idx} className="leading-relaxed">
                    {log}
                  </p>
                ))}
              </div>
            </div>

            {/* Timeline of events */}
            <div className="p-5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg space-y-3">
              <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider block">
                Incident Triage Timeline
              </span>
              <div className="space-y-3 text-xs border-l border-neutral-200 dark:border-neutral-800 pl-4 ml-1">
                {activeIncident.timeline.map((item, idx) => (
                  <div key={idx} className="relative">
                    <span className="absolute -left-[21px] top-1.5 w-2 h-2 rounded-full bg-blue-500 ring-4 ring-white dark:ring-neutral-900" />
                    <div className="flex items-center gap-2 font-mono text-[11px] text-neutral-400">
                      <span>{item.time}</span>
                      <span>·</span>
                      <span className="capitalize">{item.actor}</span>
                    </div>
                    <p className="font-semibold text-neutral-900 dark:text-neutral-100 mt-0.5">
                      {item.event}
                    </p>
                    <p className="text-neutral-500 text-[11px] mt-0.5 leading-relaxed">
                      {item.detail}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-8 p-12 text-center text-neutral-400 border border-dashed rounded-lg">
            No incident selected.
          </div>
        )}
      </div>
    </div>
  );
};
