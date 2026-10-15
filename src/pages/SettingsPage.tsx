import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../auth/AuthContext';
import {
  Settings,
  User,
  Sliders,
  Bell,
  Shield,
  Key,
  Save,
  CheckCircle2,
  Lock,
  GitBranch,
  Server,
  Sparkles
} from 'lucide-react';
import { AppSettings } from '../types';

export const SettingsPage: React.FC = () => {
  const { settings, updateSettings, theme, setTheme } = useApp();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState<'profile' | 'canary' | 'ai' | 'notifications' | 'integrations'>('profile');

  // Form states
  const [profileName, setProfileName] = useState(user?.name || settings.profile.name);
  const [profileRole, setProfileRole] = useState(user?.role || settings.profile.role);
  const [profileEmail, setProfileEmail] = useState(user?.email || settings.profile.email);

  const [canaryThreshold, setCanaryThreshold] = useState(settings.canaryPolicies.errorRateThresholdPercent);
  const [latencyThreshold, setLatencyThreshold] = useState(settings.canaryPolicies.latencyP99ThresholdMs);
  const [soakMinutes, setSoakMinutes] = useState(settings.canaryPolicies.soakDurationMinutes);
  const [requireTestPass, setRequireTestPass] = useState(settings.canaryPolicies.requireTestPassBeforeDeploy);

  const [autoGenPatches, setAutoGenPatches] = useState(settings.aiPolicies.autoGeneratePatchesForCritical);
  const [humanApproval, setHumanApproval] = useState(settings.aiPolicies.humanApprovalRequired);

  const [emailAlerts, setEmailAlerts] = useState(settings.notifications.emailOnFailure);
  const [slackAlerts, setSlackAlerts] = useState(settings.notifications.slackAlerts);
  const [canaryAlerts, setCanaryAlerts] = useState(settings.notifications.canaryAlerts);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      profile: {
        name: profileName,
        email: profileEmail,
        username: user?.username || settings.profile.username,
        role: profileRole
      },
      canaryPolicies: {
        autoRollbackOnHttp5xx: true,
        errorRateThresholdPercent: Number(canaryThreshold),
        latencyP99ThresholdMs: Number(latencyThreshold),
        soakDurationMinutes: Number(soakMinutes),
        requireTestPassBeforeDeploy: requireTestPass
      },
      aiPolicies: {
        autoGeneratePatchesForCritical: autoGenPatches,
        humanApprovalRequired: humanApproval,
        enforceTestRegressionCheck: true
      },
      notifications: {
        emailOnFailure: emailAlerts,
        slackAlerts: slackAlerts,
        canaryAlerts: canaryAlerts,
        dailyDigest: settings.notifications.dailyDigest
      }
    });
  };

  const tabs = [
    { id: 'profile', label: 'User Profile & Theme', icon: User },
    { id: 'canary', label: 'Canary & Rollback Policies', icon: Sliders },
    { id: 'ai', label: 'AI Patch Governance', icon: Sparkles },
    { id: 'notifications', label: 'Alert Preferences', icon: Bell },
    { id: 'integrations', label: 'API & CI Integrations', icon: Key }
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white">
          Workspace Settings & Automation Policies
        </h1>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
          Configure canary health gates, automated rollback thresholds, AI human-in-the-loop controls, and API integrations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left Navigation Tabs (3 cols) */}
        <div className="md:col-span-3 space-y-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-left transition-colors ${
                  isActive
                    ? 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 shadow-xs'
                    : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right Content Form (9 cols) */}
        <div className="md:col-span-9 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 shadow-xs">
          <form onSubmit={handleSave} className="space-y-6">
            {/* Tab: Profile */}
            {activeTab === 'profile' && (
              <div className="space-y-4 text-xs">
                <div>
                  <h2 className="text-sm font-semibold text-neutral-900 dark:text-white">
                    Engineer Profile
                  </h2>
                  <p className="text-neutral-500 text-[11px] mt-0.5">
                    Your local demonstration identity and interface preferences.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      className="w-full p-2 text-xs rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                      Engineering Role
                    </label>
                    <input
                      type="text"
                      value={profileRole}
                      onChange={(e) => setProfileRole(e.target.value)}
                      className="w-full p-2 text-xs rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={profileEmail}
                      onChange={(e) => setProfileEmail(e.target.value)}
                      className="w-full p-2 text-xs rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                      Workspace Theme
                    </label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setTheme('light')}
                        className={`flex-1 py-1.5 px-3 rounded text-xs font-medium border ${
                          theme === 'light'
                            ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900'
                            : 'border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300'
                        }`}
                      >
                        Light Mode
                      </button>
                      <button
                        type="button"
                        onClick={() => setTheme('dark')}
                        className={`flex-1 py-1.5 px-3 rounded text-xs font-medium border ${
                          theme === 'dark'
                            ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900'
                            : 'border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300'
                        }`}
                      >
                        Dark Mode
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Canary & Rollback Policies */}
            {activeTab === 'canary' && (
              <div className="space-y-4 text-xs">
                <div>
                  <h2 className="text-sm font-semibold text-neutral-900 dark:text-white">
                    Canary Rollout & Automated Rollback Policies
                  </h2>
                  <p className="text-neutral-500 text-[11px] mt-0.5">
                    Define rigorous automated circuit-breakers to halt regressions in Kubernetes canary stages.
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  <div>
                    <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                      HTTP 5xx Error Rate Circuit-Breaker Threshold (%)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={canaryThreshold}
                      onChange={(e) => setCanaryThreshold(Number(e.target.value))}
                      className="w-48 p-2 text-xs rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 font-mono"
                    />
                    <p className="text-[11px] text-neutral-400 mt-1">
                      If canary pod error rate exceeds this percentage within a 2-minute sliding window, traffic is immediately throttled back to 0%.
                    </p>
                  </div>

                  <div>
                    <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                      Latency P99 SLA Spike Threshold (ms)
                    </label>
                    <input
                      type="number"
                      value={latencyThreshold}
                      onChange={(e) => setLatencyThreshold(Number(e.target.value))}
                      className="w-48 p-2 text-xs rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                      Minimum Soak Duration Per Step (Minutes)
                    </label>
                    <input
                      type="number"
                      value={soakMinutes}
                      onChange={(e) => setSoakMinutes(Number(e.target.value))}
                      className="w-48 p-2 text-xs rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 font-mono"
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <input
                      type="checkbox"
                      id="reqTest"
                      checked={requireTestPass}
                      onChange={(e) => setRequireTestPass(e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                    <label htmlFor="reqTest" className="font-medium text-neutral-700 dark:text-neutral-300">
                      Block deployment if automated unit or security regression tests fail
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Tab: AI Patch Governance */}
            {activeTab === 'ai' && (
              <div className="space-y-4 text-xs">
                <div>
                  <h2 className="text-sm font-semibold text-neutral-900 dark:text-white">
                    AI Patch Synthesis & Governance
                  </h2>
                  <p className="text-neutral-500 text-[11px] mt-0.5">
                    Strict human-in-the-loop boundaries for automated source-code modifications.
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="flex items-start gap-3 p-3 bg-neutral-50 dark:bg-neutral-800/60 rounded border border-neutral-200 dark:border-neutral-700">
                    <input
                      type="checkbox"
                      id="humanApprove"
                      checked={humanApproval}
                      onChange={(e) => setHumanApproval(e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded mt-0.5"
                    />
                    <div>
                      <label htmlFor="humanApprove" className="font-semibold text-neutral-900 dark:text-neutral-100 block">
                        Require Explicit Human Developer Approval Before Git Merge
                      </label>
                      <p className="text-[11px] text-neutral-500 mt-0.5 leading-relaxed">
                        Enforces that no AI-generated code patches are committed to the default branch without senior engineer code review.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-neutral-50 dark:bg-neutral-800/60 rounded border border-neutral-200 dark:border-neutral-700">
                    <input
                      type="checkbox"
                      id="autoGen"
                      checked={autoGenPatches}
                      onChange={(e) => setAutoGenPatches(e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded mt-0.5"
                    />
                    <div>
                      <label htmlFor="autoGen" className="font-semibold text-neutral-900 dark:text-neutral-100 block">
                        Auto-Synthesize Patches for Critical Severity AST Issues
                      </label>
                      <p className="text-[11px] text-neutral-500 mt-0.5 leading-relaxed">
                        When an immediate panic or memory leak is detected in static analysis, automatically generate a diff and run test harnesses.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Notifications */}
            {activeTab === 'notifications' && (
              <div className="space-y-4 text-xs">
                <div>
                  <h2 className="text-sm font-semibold text-neutral-900 dark:text-white">
                    Notification & Alert Channels
                  </h2>
                  <p className="text-neutral-500 text-[11px] mt-0.5">
                    Configure real-time DevOps incident dispatch.
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  <label className="flex items-center gap-2.5">
                    <input
                      type="checkbox"
                      checked={emailAlerts}
                      onChange={(e) => setEmailAlerts(e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                    <span className="text-neutral-700 dark:text-neutral-300 font-medium">
                      Email notification on canary rollback and critical SLA breaches
                    </span>
                  </label>

                  <label className="flex items-center gap-2.5">
                    <input
                      type="checkbox"
                      checked={slackAlerts}
                      onChange={(e) => setSlackAlerts(e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                    <span className="text-neutral-700 dark:text-neutral-300 font-medium">
                      Send Webhook notifications to team Slack channel (#prod-alerts)
                    </span>
                  </label>

                  <label className="flex items-center gap-2.5">
                    <input
                      type="checkbox"
                      checked={canaryAlerts}
                      onChange={(e) => setCanaryAlerts(e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                    <span className="text-neutral-700 dark:text-neutral-300 font-medium">
                      Notify when canary stages step traffic (10% → 20% → 50% → 100%)
                    </span>
                  </label>
                </div>
              </div>
            )}

            {/* Tab: Integrations */}
            {activeTab === 'integrations' && (
              <div className="space-y-4 text-xs">
                <div>
                  <h2 className="text-sm font-semibold text-neutral-900 dark:text-white">
                    API & Infrastructure Integrations
                  </h2>
                  <p className="text-neutral-500 text-[11px] mt-0.5">
                    Credentials are protected and never revealed in browser DOM.
                  </p>
                </div>

                <div className="space-y-3 pt-2 font-mono">
                  <div className="p-3 bg-neutral-50 dark:bg-neutral-800/60 rounded border border-neutral-200 dark:border-neutral-700 space-y-1">
                    <div className="flex items-center justify-between text-neutral-800 dark:text-neutral-200 font-sans text-xs font-semibold">
                      <span>GitHub App Integration</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-mono text-[11px]">Connected</span>
                    </div>
                    <p className="text-neutral-500 text-[11px] font-sans">
                      Organization: <code className="text-neutral-800 dark:text-neutral-200 font-mono">reposage-org</code>
                    </p>
                    <div className="flex items-center gap-2 text-[11px] text-neutral-400 pt-1">
                      <Lock className="w-3 h-3" />
                      <span>Webhook Secret: ••••••••••••••••••••••••••••</span>
                    </div>
                  </div>

                  <div className="p-3 bg-neutral-50 dark:bg-neutral-800/60 rounded border border-neutral-200 dark:border-neutral-700 space-y-1">
                    <div className="flex items-center justify-between text-neutral-800 dark:text-neutral-200 font-sans text-xs font-semibold">
                      <span>Docker / Container Registry</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-mono text-[11px]">Authenticated</span>
                    </div>
                    <p className="text-neutral-500 text-[11px] font-sans">
                      Target Registry: <code className="text-neutral-800 dark:text-neutral-200 font-mono">ghcr.io/reposage-org</code>
                    </p>
                    <div className="flex items-center gap-2 text-[11px] text-neutral-400 pt-1">
                      <Lock className="w-3 h-3" />
                      <span>Token: ••••••••••••••••••••••••••••</span>
                    </div>
                  </div>

                  <div className="p-3 bg-neutral-50 dark:bg-neutral-800/60 rounded border border-neutral-200 dark:border-neutral-700 space-y-1">
                    <div className="flex items-center justify-between text-neutral-800 dark:text-neutral-200 font-sans text-xs font-semibold">
                      <span>Kubernetes Cluster Context</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-mono text-[11px]">Active</span>
                    </div>
                    <p className="text-neutral-500 text-[11px] font-sans">
                      Context: <code className="text-neutral-800 dark:text-neutral-200 font-mono">gke_us-central1_prod-cluster</code>
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Save Button */}
            <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-medium transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Workspace Policies</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
