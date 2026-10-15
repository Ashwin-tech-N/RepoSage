import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  GitFork,
  Search,
  Plus,
  Play,
  ExternalLink,
  GitCommit,
  GitBranch,
  Star,
  Clock,
  X,
  CheckCircle2,
  AlertCircle,
  FileCode,
  ShieldCheck
} from 'lucide-react';
import { StatusText } from '../components/ui/StatusText';
import { Repository } from '../types';

export const RepositoriesPage: React.FC = () => {
  const {
    repositories,
    addRepository,
    runAnalysis,
    isAnalyzing,
    analysisProgress
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('All');
  const [connectModalOpen, setConnectModalOpen] = useState(false);
  const [repoUrlInput, setRepoUrlInput] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('main');
  const [detectedLang, setDetectedLang] = useState('TypeScript');
  const [selectedRepoDetails, setSelectedRepoDetails] = useState<Repository | null>(null);

  const languages = ['All', 'Go', 'TypeScript', 'Python', 'Rust'];

  const filteredRepos = repositories.filter((repo) => {
    const matchesSearch =
      repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      repo.owner.toLowerCase().includes(searchQuery.toLowerCase()) ||
      repo.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLang = selectedLanguage === 'All' || repo.language === selectedLanguage;
    return matchesSearch && matchesLang;
  });

  const handleConnectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!repoUrlInput.trim()) return;
    addRepository(repoUrlInput, undefined, detectedLang);
    setRepoUrlInput('');
    setConnectModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white">
            Repositories
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Manage connected GitHub repositories, configure webhooks, and trigger continuous AST code audits.
          </p>
        </div>

        <button
          onClick={() => setConnectModalOpen(true)}
          className="px-3.5 py-1.5 text-xs font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors flex items-center gap-1.5 self-start sm:self-auto shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Connect Repository</span>
        </button>
      </div>

      {/* Simulation Notice */}
      <div className="p-3 bg-neutral-100/70 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-xs text-neutral-600 dark:text-neutral-400 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
          <span>
            <strong>Simulation Sandbox:</strong> Repositories are managed in-browser. Triggering scans analyzes synthetic AST graphs without requiring private GitHub tokens.
          </span>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter repositories by name or description..."
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
          />
          <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-2 pointer-events-none" />
        </div>

        {/* Language Filter */}
        <div className="flex items-center gap-1 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {languages.map((lang) => (
            <button
              key={lang}
              onClick={() => setSelectedLanguage(lang)}
              className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors whitespace-nowrap shrink-0 ${
                selectedLanguage === lang
                  ? 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 shadow-xs'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800'
              }`}
            >
              {lang}
            </button>
          ))}
        </div>
      </div>

      {/* Repositories Table */}
      <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-900 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800 text-neutral-500 font-medium">
              <tr>
                <th className="py-2.5 px-4 font-medium">Repository</th>
                <th className="py-2.5 px-4 font-medium">Language</th>
                <th className="py-2.5 px-4 font-medium">Branch / Commit</th>
                <th className="py-2.5 px-4 font-medium">Analysis Status</th>
                <th className="py-2.5 px-4 font-medium">Last Scan</th>
                <th className="py-2.5 px-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {filteredRepos.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-neutral-400">
                    No repositories match your filter query.
                  </td>
                </tr>
              ) : (
                filteredRepos.map((repo) => (
                  <tr
                    key={repo.id}
                    className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40 transition-colors"
                  >
                    <td className="py-3 px-4 font-medium">
                      <div className="flex flex-col">
                        <button
                          onClick={() => setSelectedRepoDetails(repo)}
                          className="text-left font-medium text-neutral-900 dark:text-neutral-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        >
                          {repo.owner}/{repo.name}
                        </button>
                        <span className="text-[11px] text-neutral-500 line-clamp-1 max-w-sm mt-0.5">
                          {repo.description}
                        </span>
                      </div>
                    </td>

                    <td className="py-3 px-4 text-neutral-600 dark:text-neutral-300 font-mono text-[11px]">
                      {repo.language}
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5 text-neutral-600 dark:text-neutral-400">
                        <GitBranch className="w-3 h-3 text-neutral-400" />
                        <span className="font-mono text-[11px]">{repo.defaultBranch}</span>
                        <span>·</span>
                        <span className="font-mono text-[11px] text-neutral-400">
                          {repo.latestCommit.hash}
                        </span>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <StatusText status={repo.analysisStatus} />
                    </td>

                    <td className="py-3 px-4 text-neutral-500 font-mono text-[11px]">
                      {repo.lastAnalyzedAt}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => runAnalysis(repo.id)}
                          disabled={isAnalyzing}
                          className="px-2.5 py-1 text-xs border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded font-medium text-neutral-700 dark:text-neutral-300 transition-colors flex items-center gap-1 disabled:opacity-50"
                          title="Start AST code analysis"
                        >
                          <Play className="w-3 h-3 text-neutral-500" />
                          <span>Analyze</span>
                        </button>
                        <button
                          onClick={() => setSelectedRepoDetails(repo)}
                          className="px-2 py-1 text-xs text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200"
                        >
                          Details
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Connect Repository Modal */}
      {connectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-xl overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-neutral-200 dark:border-neutral-800">
              <div className="flex items-center gap-2">
                <GitFork className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                  Connect GitHub Repository
                </h3>
              </div>
              <button
                onClick={() => setConnectModalOpen(false)}
                className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleConnectSubmit} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  GitHub Repository URL
                </label>
                <input
                  type="text"
                  value={repoUrlInput}
                  onChange={(e) => {
                    setRepoUrlInput(e.target.value);
                    if (e.target.value.includes('go')) setDetectedLang('Go');
                    else if (e.target.value.includes('py')) setDetectedLang('Python');
                    else if (e.target.value.includes('rs') || e.target.value.includes('rust')) setDetectedLang('Rust');
                    else setDetectedLang('TypeScript');
                  }}
                  placeholder="https://github.com/organization/repo-name"
                  className="w-full px-3 py-2 text-xs rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:ring-1 focus:ring-blue-500 font-mono"
                  required
                />
                <p className="mt-1 text-[11px] text-neutral-400">
                  Public or private repository. Webhooks will be configured for push events.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Default Branch
                  </label>
                  <select
                    value={selectedBranch}
                    onChange={(e) => setSelectedBranch(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-hidden font-mono"
                  >
                    <option value="main">main</option>
                    <option value="master">master</option>
                    <option value="staging">staging</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Primary Language
                  </label>
                  <select
                    value={detectedLang}
                    onChange={(e) => setDetectedLang(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-hidden"
                  >
                    <option value="TypeScript">TypeScript</option>
                    <option value="Go">Go</option>
                    <option value="Python">Python</option>
                    <option value="Rust">Rust</option>
                  </select>
                </div>
              </div>

              <div className="p-3 bg-neutral-50 dark:bg-neutral-800/60 rounded border border-neutral-200 dark:border-neutral-700 space-y-1">
                <span className="font-semibold text-neutral-800 dark:text-neutral-200 block">
                  Automated Pipeline Registration:
                </span>
                <p className="text-neutral-500 text-[11px] leading-relaxed">
                  RepoSage will register an AST parser and CI trigger on branch <code className="font-mono text-neutral-800 dark:text-neutral-200">{selectedBranch}</code>.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-100 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => setConnectModalOpen(false)}
                  className="px-3 py-1.5 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                  Connect & Ingest
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Repository Detail Drawer / Modal */}
      {selectedRepoDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="w-full max-w-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-xl overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-neutral-200 dark:border-neutral-800">
              <div>
                <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                  {selectedRepoDetails.owner}/{selectedRepoDetails.name}
                </h3>
                <span className="text-xs text-neutral-500 font-mono">
                  Branch: {selectedRepoDetails.defaultBranch}
                </span>
              </div>
              <button
                onClick={() => setSelectedRepoDetails(null)}
                className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed">
                {selectedRepoDetails.description}
              </p>

              <div className="grid grid-cols-2 gap-3 text-xs bg-neutral-50 dark:bg-neutral-950 p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 font-mono">
                <div>
                  <span className="text-neutral-400 block text-[10px]">LATEST COMMIT</span>
                  <span className="text-neutral-800 dark:text-neutral-200 font-medium">
                    {selectedRepoDetails.latestCommit.hash}
                  </span>
                </div>
                <div>
                  <span className="text-neutral-400 block text-[10px]">COMMITTED BY</span>
                  <span className="text-neutral-800 dark:text-neutral-200 font-medium">
                    {selectedRepoDetails.latestCommit.author}
                  </span>
                </div>
                <div>
                  <span className="text-neutral-400 block text-[10px]">LANGUAGE</span>
                  <span className="text-neutral-800 dark:text-neutral-200 font-medium">
                    {selectedRepoDetails.language}
                  </span>
                </div>
                <div>
                  <span className="text-neutral-400 block text-[10px]">ANALYSIS STATUS</span>
                  <StatusText status={selectedRepoDetails.analysisStatus} />
                </div>
              </div>

              <div>
                <span className="font-semibold text-neutral-900 dark:text-neutral-100 block mb-1.5">
                  Recent Commit Message
                </span>
                <p className="p-2.5 bg-neutral-100 dark:bg-neutral-800/80 rounded font-mono text-[11px] text-neutral-700 dark:text-neutral-300">
                  {selectedRepoDetails.latestCommit.message}
                </p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-neutral-200 dark:border-neutral-800">
                <a
                  href={selectedRepoDetails.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-medium"
                >
                  <span>Open on GitHub</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <button
                  onClick={() => {
                    const repoId = selectedRepoDetails.id;
                    setSelectedRepoDetails(null);
                    runAnalysis(repoId);
                  }}
                  className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium transition-colors"
                >
                  Run AST Analysis Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
