import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Repository,
  CodeIssue,
  AIPatch,
  TestSuite,
  ContainerImage,
  DeploymentRecord,
  IncidentRecord,
  ActivityLogEntry,
  AppSettings,
  PatchStatus
} from '../types';
import {
  INITIAL_REPOSITORIES,
  INITIAL_ISSUES,
  INITIAL_PATCHES,
  INITIAL_TEST_SUITES,
  INITIAL_CONTAINER_IMAGES,
  INITIAL_DEPLOYMENTS,
  INITIAL_INCIDENTS,
  INITIAL_ACTIVITY_LOGS,
  INITIAL_SETTINGS
} from '../data/demoData';

export interface ToastMessage {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  description?: string;
}

interface AppContextType {
  repositories: Repository[];
  issues: CodeIssue[];
  patches: AIPatch[];
  testSuites: TestSuite[];
  containerImages: ContainerImage[];
  deployments: DeploymentRecord[];
  incidents: IncidentRecord[];
  activityLogs: ActivityLogEntry[];
  settings: AppSettings;
  activeRepoId: string;
  setActiveRepoId: (id: string) => void;
  isAnalyzing: boolean;
  analysisProgress: number;
  toasts: ToastMessage[];
  addToast: (type: ToastMessage['type'], title: string, description?: string) => void;
  removeToast: (id: string) => void;
  theme: 'light' | 'dark';
  setTheme: (t: 'light' | 'dark') => void;
  toggleTheme: () => void;
  // Domain actions
  addRepository: (repoUrl: string, name?: string, lang?: string) => void;
  runAnalysis: (repoId: string, branch?: string) => Promise<void>;
  updatePatchStatus: (patchId: string, status: PatchStatus, comment?: string) => void;
  runTests: (suiteId?: string) => Promise<void>;
  buildContainerImage: (repoName: string, tag: string) => Promise<void>;
  promoteCanary: (deploymentId: string) => void;
  abortCanary: (deploymentId: string) => void;
  triggerRollback: (deploymentId: string, reason: string) => void;
  resolveIncident: (incidentId: string) => void;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [repositories, setRepositories] = useState<Repository[]>(() => {
    const saved = localStorage.getItem('reposage_repositories_v1');
    return saved ? JSON.parse(saved) : INITIAL_REPOSITORIES;
  });

  const [issues, setIssues] = useState<CodeIssue[]>(() => {
    const saved = localStorage.getItem('reposage_issues_v1');
    return saved ? JSON.parse(saved) : INITIAL_ISSUES;
  });

  const [patches, setPatches] = useState<AIPatch[]>(() => {
    const saved = localStorage.getItem('reposage_patches_v1');
    return saved ? JSON.parse(saved) : INITIAL_PATCHES;
  });

  const [testSuites, setTestSuites] = useState<TestSuite[]>(() => {
    const saved = localStorage.getItem('reposage_tests_v1');
    return saved ? JSON.parse(saved) : INITIAL_TEST_SUITES;
  });

  const [containerImages, setContainerImages] = useState<ContainerImage[]>(() => {
    const saved = localStorage.getItem('reposage_containers_v1');
    return saved ? JSON.parse(saved) : INITIAL_CONTAINER_IMAGES;
  });

  const [deployments, setDeployments] = useState<DeploymentRecord[]>(() => {
    const saved = localStorage.getItem('reposage_deployments_v1');
    return saved ? JSON.parse(saved) : INITIAL_DEPLOYMENTS;
  });

  const [incidents, setIncidents] = useState<IncidentRecord[]>(() => {
    const saved = localStorage.getItem('reposage_incidents_v1');
    return saved ? JSON.parse(saved) : INITIAL_INCIDENTS;
  });

  const [activityLogs, setActivityLogs] = useState<ActivityLogEntry[]>(() => {
    const saved = localStorage.getItem('reposage_activity_v1');
    return saved ? JSON.parse(saved) : INITIAL_ACTIVITY_LOGS;
  });

  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('reposage_settings_v1');
    return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
  });

  const [activeRepoId, setActiveRepoId] = useState<string>('repo-checkout');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('reposage_theme');
    return (saved as 'light' | 'dark') || 'light';
  });

  // Apply dark class to document root
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('reposage_theme', theme);
  }, [theme]);

  // Persist state
  useEffect(() => {
    localStorage.setItem('reposage_repositories_v1', JSON.stringify(repositories));
  }, [repositories]);
  useEffect(() => {
    localStorage.setItem('reposage_issues_v1', JSON.stringify(issues));
  }, [issues]);
  useEffect(() => {
    localStorage.setItem('reposage_patches_v1', JSON.stringify(patches));
  }, [patches]);
  useEffect(() => {
    localStorage.setItem('reposage_tests_v1', JSON.stringify(testSuites));
  }, [testSuites]);
  useEffect(() => {
    localStorage.setItem('reposage_containers_v1', JSON.stringify(containerImages));
  }, [containerImages]);
  useEffect(() => {
    localStorage.setItem('reposage_deployments_v1', JSON.stringify(deployments));
  }, [deployments]);
  useEffect(() => {
    localStorage.setItem('reposage_incidents_v1', JSON.stringify(incidents));
  }, [incidents]);
  useEffect(() => {
    localStorage.setItem('reposage_activity_v1', JSON.stringify(activityLogs));
  }, [activityLogs]);
  useEffect(() => {
    localStorage.setItem('reposage_settings_v1', JSON.stringify(settings));
  }, [settings]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const addToast = (type: ToastMessage['type'], title: string, description?: string) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    setToasts((prev) => [...prev, { id, type, title, description }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const addLog = (category: ActivityLogEntry['category'], action: string, target: string, status: ActivityLogEntry['status'], actor = 'Demo Developer', actorType: ActivityLogEntry['actorType'] = 'user', metadata?: Record<string, string | number>) => {
    const entry: ActivityLogEntry = {
      id: `act-${Date.now()}`,
      timestamp: 'Just now',
      category,
      actor,
      actorType,
      action,
      target,
      status,
      metadata
    };
    setActivityLogs((prev) => [entry, ...prev]);
  };

  const addRepository = (repoUrl: string, name?: string, lang?: string) => {
    const cleanUrl = repoUrl.trim();
    const parts = cleanUrl.replace(/^https?:\/\/github\.com\//, '').split('/');
    const repoOwner = parts[0] || 'reposage-org';
    const repoName = name || parts[1] || `repo-${Math.floor(Math.random() * 900 + 100)}`;
    const language = lang || 'TypeScript';

    const newRepo: Repository = {
      id: `repo-${Date.now()}`,
      name: repoName,
      owner: repoOwner,
      url: cleanUrl.startsWith('http') ? cleanUrl : `https://github.com/${cleanUrl}`,
      description: `Imported repository ${repoOwner}/${repoName}`,
      language,
      defaultBranch: 'main',
      latestCommit: {
        hash: Math.random().toString(16).substring(2, 9),
        message: 'Initial repository ingest and webhook configuration',
        author: 'demodev',
        timestamp: 'Just now'
      },
      analysisStatus: 'healthy',
      openIssuesCount: 0,
      lastAnalyzedAt: 'Pending initial scan',
      stars: 1,
      forks: 0
    };

    setRepositories((prev) => [newRepo, ...prev]);
    setActiveRepoId(newRepo.id);
    addLog('repository', 'Connected Repository', `${repoOwner}/${repoName}`, 'success');
    addToast('success', 'Repository Connected', `${repoOwner}/${repoName} was added to your workspace.`);
  };

  const runAnalysis = async (repoId: string, branch = 'main') => {
    setIsAnalyzing(true);
    setAnalysisProgress(10);
    const repo = repositories.find((r) => r.id === repoId) || repositories[0];

    // Update status to analyzing
    setRepositories((prev) =>
      prev.map((r) => (r.id === repoId ? { ...r, analysisStatus: 'analyzing' } : r))
    );

    // Staged progress
    await new Promise((r) => setTimeout(r, 600));
    setAnalysisProgress(35);
    await new Promise((r) => setTimeout(r, 700));
    setAnalysisProgress(70);
    await new Promise((r) => setTimeout(r, 600));
    setAnalysisProgress(100);
    await new Promise((r) => setTimeout(r, 300));

    setIsAnalyzing(false);
    setAnalysisProgress(0);

    const relatedIssues = issues.filter((i) => i.repoId === repoId);
    const count = relatedIssues.length;

    setRepositories((prev) =>
      prev.map((r) =>
        r.id === repoId
          ? {
              ...r,
              analysisStatus: count > 0 ? 'issues_found' : 'healthy',
              openIssuesCount: count,
              lastAnalyzedAt: 'Just now'
            }
          : r
      )
    );

    addLog('analysis', 'Completed Static & AST Code Analysis', `${repo.name}:${branch}`, count > 0 ? 'warning' : 'success', 'RepoSage Agent', 'agent', { issuesFound: count });
    addToast('info', 'Code Analysis Completed', `Scanned ${repo.name} on branch ${branch}. Found ${count} item(s) for review.`);
  };

  const updatePatchStatus = (patchId: string, status: PatchStatus, comment?: string) => {
    const patch = patches.find((p) => p.id === patchId);
    if (!patch) return;

    setPatches((prev) =>
      prev.map((p) =>
        p.id === patchId
          ? {
              ...p,
              status,
              reviewComment: comment || p.reviewComment,
              updatedAt: 'Just now'
            }
          : p
      )
    );

    if (status === 'approved') {
      // Mark linked issue as patched
      setIssues((prev) =>
        prev.map((i) => (i.id === patch.issueId ? { ...i, status: 'patched' } : i))
      );
      addLog('patch', 'Approved AI Patch', `Patch #${patch.id} (${patch.title})`, 'success');
      addToast('success', 'Patch Approved', `AI patch #${patch.id} approved. Local workspace updated.`);
    } else if (status === 'rejected') {
      addLog('patch', 'Rejected AI Patch', `Patch #${patch.id}`, 'warning');
      addToast('warning', 'Patch Rejected', `AI patch #${patch.id} marked as rejected.`);
    } else if (status === 'changes_requested') {
      addLog('patch', 'Requested Changes on Patch', `Patch #${patch.id}`, 'info', 'Demo Developer', 'user', { comment: comment || 'Review comments attached' });
      addToast('info', 'Feedback Recorded', `Review comments saved for patch #${patch.id}.`);
    }
  };

  const runTests = async (suiteId?: string) => {
    setTestSuites((prev) =>
      prev.map((s) => (suiteId ? (s.id === suiteId ? { ...s, status: 'running' } : s) : { ...s, status: 'running' }))
    );

    await new Promise((r) => setTimeout(r, 1400));

    setTestSuites((prev) =>
      prev.map((s) => {
        if (suiteId && s.id !== suiteId) return s;
        return {
          ...s,
          status: s.failedCount > 0 ? 'failed' : 'passed',
          lastRunTimestamp: 'Just now'
        };
      })
    );

    addLog('test', 'Executed Automated Test Suites', suiteId ? `Suite ${suiteId}` : 'All active suites', 'success', 'CI Pipeline', 'system');
    addToast('success', 'Tests Finished', 'Automated test suites executed successfully in container sandbox.');
  };

  const buildContainerImage = async (repoName: string, tag: string) => {
    const newId = `img-${Date.now()}`;
    const newImage: ContainerImage = {
      id: newId,
      name: repoName,
      repository: `reposage-org/${repoName}`,
      tag,
      registry: 'ghcr.io',
      sizeMb: 48.5,
      status: 'building',
      buildDurationSeconds: 0,
      baseImage: 'gcr.io/distroless/static:nonroot',
      createdAt: 'Just now',
      commitHash: Math.random().toString(16).substring(2, 9),
      cveSummary: { critical: 0, high: 0, medium: 0, low: 1 },
      buildLogs: [
        '[1/5] Initializing build harness in isolated microVM...',
        '[2/5] Fetching base image gcr.io/distroless/static:nonroot',
        '[3/5] Running multi-stage compilation'
      ]
    };

    setContainerImages((prev) => [newImage, ...prev]);
    addToast('info', 'Build Triggered', `Building container image ghcr.io/reposage-org/${repoName}:${tag}`);

    await new Promise((r) => setTimeout(r, 2200));

    setContainerImages((prev) =>
      prev.map((img) =>
        img.id === newId
          ? {
              ...img,
              status: 'ready',
              buildDurationSeconds: 38,
              buildLogs: [
                ...img.buildLogs,
                '[4/5] Running vulnerability scan via Trivy engine',
                '[5/5] Container build verified and pushed to ghcr.io'
              ]
            }
          : img
      )
    );

    addLog('image', 'Built Container Image', `ghcr.io/reposage-org/${repoName}:${tag}`, 'success', 'Docker Builder', 'system');
    addToast('success', 'Build Complete', `Image ghcr.io/reposage-org/${repoName}:${tag} is ready for canary deployment.`);
  };

  const promoteCanary = (deploymentId: string) => {
    const dep = deployments.find((d) => d.id === deploymentId);
    if (!dep) return;

    const nextTraffic = dep.canaryTrafficPercent < 50 ? 50 : 100;
    const isPromoted = nextTraffic === 100;

    setDeployments((prev) =>
      prev.map((d) =>
        d.id === deploymentId
          ? {
              ...d,
              canaryTrafficPercent: nextTraffic,
              status: isPromoted ? 'healthy' : 'canary_in_progress',
              updatedAt: 'Just now',
              canarySteps: d.canarySteps.map((s, idx) =>
                idx === d.canarySteps.length - 1 && isPromoted
                  ? { ...s, status: 'completed', timestamp: 'Just now' }
                  : s
              )
            }
          : d
      )
    );

    addLog('deployment', isPromoted ? 'Promoted Canary to 100% Production' : `Stepped Canary Traffic to ${nextTraffic}%`, `${dep.appName} (${dep.version})`, 'success');
    addToast('success', isPromoted ? 'Deployment Promoted' : 'Traffic Increased', `${dep.appName} is now receiving ${nextTraffic}% production traffic.`);
  };

  const abortCanary = (deploymentId: string) => {
    const dep = deployments.find((d) => d.id === deploymentId);
    if (!dep) return;

    setDeployments((prev) =>
      prev.map((d) =>
        d.id === deploymentId
          ? {
              ...d,
              canaryTrafficPercent: 0,
              status: 'rolled_back',
              rollbackReason: 'Canary aborted manually by engineer.',
              updatedAt: 'Just now'
            }
          : d
      )
    );

    addLog('deployment', 'Aborted Canary Release', `${dep.appName} (${dep.version})`, 'warning');
    addToast('warning', 'Canary Aborted', `Canary traffic for ${dep.appName} throttled back to 0%. Previous stable version active.`);
  };

  const triggerRollback = (deploymentId: string, reason: string) => {
    const dep = deployments.find((d) => d.id === deploymentId);
    if (!dep) return;

    setDeployments((prev) =>
      prev.map((d) =>
        d.id === deploymentId
          ? {
              ...d,
              canaryTrafficPercent: 0,
              status: 'rolled_back',
              rollbackReason: reason,
              updatedAt: 'Just now'
            }
          : d
      )
    );

    addLog('deployment', 'Triggered Automated Rollback', `${dep.appName} -> ${dep.previousVersion}`, 'info', 'RepoSage Agent', 'agent', { reason });
    addToast('info', 'Rollback Initiated', `Rolling back ${dep.appName} to ${dep.previousVersion}. Traffic stabilized.`);
  };

  const resolveIncident = (incidentId: string) => {
    setIncidents((prev) =>
      prev.map((inc) =>
        inc.id === incidentId
          ? {
              ...inc,
              status: 'resolved',
              resolvedAt: 'Just now',
              timeline: [
                ...inc.timeline,
                {
                  time: 'Just now',
                  event: 'Incident Resolved',
                  actor: 'user',
                  detail: 'Engineer marked incident as resolved after post-incident verification.'
                }
              ]
            }
          : inc
      )
    );

    addLog('incident', 'Resolved Incident', incidentId, 'success');
    addToast('success', 'Incident Resolved', `Incident ${incidentId} marked as resolved.`);
  };

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings((prev) => ({
      ...prev,
      ...newSettings
    }));
    addToast('success', 'Settings Saved', 'Your configuration changes have been updated.');
  };

  return (
    <AppContext.Provider
      value={{
        repositories,
        issues,
        patches,
        testSuites,
        containerImages,
        deployments,
        incidents,
        activityLogs,
        settings,
        activeRepoId,
        setActiveRepoId,
        isAnalyzing,
        analysisProgress,
        toasts,
        addToast,
        removeToast,
        theme,
        setTheme,
        toggleTheme,
        addRepository,
        runAnalysis,
        updatePatchStatus,
        runTests,
        buildContainerImage,
        promoteCanary,
        abortCanary,
        triggerRollback,
        resolveIncident,
        updateSettings
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return ctx;
};
