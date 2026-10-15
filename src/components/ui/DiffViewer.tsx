import React, { useState } from 'react';
import { Copy, Check, Columns, AlignJustify } from 'lucide-react';

interface DiffViewerProps {
  oldCode: string;
  newCode: string;
  fileName: string;
}

export const DiffViewer: React.FC<DiffViewerProps> = ({ oldCode, newCode, fileName }) => {
  const [viewMode, setViewMode] = useState<'split' | 'unified'>('unified');
  const [copied, setCopied] = useState(false);

  const oldLines = oldCode.split('\n');
  const newLines = newCode.split('\n');

  const handleCopy = () => {
    navigator.clipboard.writeText(newCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden bg-white dark:bg-neutral-900 text-xs font-mono">
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-neutral-50 dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800 font-sans">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-medium text-neutral-800 dark:text-neutral-200">
            {fileName}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-neutral-200/60 dark:bg-neutral-800 p-0.5 rounded-md text-xs">
            <button
              onClick={() => setViewMode('unified')}
              className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors ${
                viewMode === 'unified'
                  ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 shadow-xs font-medium'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
              }`}
              title="Unified diff view"
            >
              <AlignJustify className="w-3.5 h-3.5" />
              <span>Unified</span>
            </button>
            <button
              onClick={() => setViewMode('split')}
              className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors ${
                viewMode === 'split'
                  ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 shadow-xs font-medium'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
              }`}
              title="Split side-by-side view"
            >
              <Columns className="w-3.5 h-3.5" />
              <span>Split</span>
            </button>
          </div>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-2.5 py-1 text-xs text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white border border-neutral-300 dark:border-neutral-700 rounded-md transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy patch'}</span>
          </button>
        </div>
      </div>

      {/* Code diff container */}
      {viewMode === 'unified' ? (
        <div className="overflow-x-auto text-[12px] leading-5 font-mono">
          <div className="min-w-full divide-y divide-neutral-100 dark:divide-neutral-900">
            {/* Show removed original lines */}
            {oldLines.map((line, idx) => (
              <div key={`old-${idx}`} className="flex bg-rose-50/60 dark:bg-rose-950/20 text-rose-900 dark:text-rose-200">
                <div className="w-12 select-none text-right pr-3 text-rose-400 dark:text-rose-600 shrink-0 border-r border-rose-200/50 dark:border-rose-900/30 tabular-nums py-0.5">
                  {idx + 1}
                </div>
                <div className="w-6 select-none text-center text-rose-500 shrink-0 py-0.5">-</div>
                <div className="px-3 py-0.5 whitespace-pre overflow-x-auto flex-1">{line || ' '}</div>
              </div>
            ))}
            {/* Show added new lines */}
            {newLines.map((line, idx) => (
              <div key={`new-${idx}`} className="flex bg-emerald-50/60 dark:bg-emerald-950/20 text-emerald-900 dark:text-emerald-200">
                <div className="w-12 select-none text-right pr-3 text-emerald-500 dark:text-emerald-600 shrink-0 border-r border-emerald-200/50 dark:border-emerald-900/30 tabular-nums py-0.5">
                  {idx + 1}
                </div>
                <div className="w-6 select-none text-center text-emerald-500 shrink-0 py-0.5">+</div>
                <div className="px-3 py-0.5 whitespace-pre overflow-x-auto flex-1">{line || ' '}</div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Split view */
        <div className="grid grid-cols-2 divide-x divide-neutral-200 dark:divide-neutral-800 text-[12px] leading-5 font-mono overflow-x-auto">
          {/* Left: Original */}
          <div>
            <div className="px-3 py-1 bg-neutral-100 dark:bg-neutral-900 text-neutral-500 text-[11px] font-sans font-medium border-b border-neutral-200 dark:border-neutral-800">
              Original (Before)
            </div>
            <div className="divide-y divide-neutral-100 dark:divide-neutral-900">
              {oldLines.map((line, idx) => (
                <div key={`split-old-${idx}`} className="flex bg-rose-50/40 dark:bg-rose-950/10 text-rose-900 dark:text-rose-200">
                  <div className="w-10 select-none text-right pr-2 text-neutral-400 shrink-0 tabular-nums py-0.5 text-[11px]">
                    {idx + 1}
                  </div>
                  <div className="px-2 py-0.5 whitespace-pre overflow-x-auto flex-1">{line || ' '}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Proposed Patch */}
          <div>
            <div className="px-3 py-1 bg-neutral-100 dark:bg-neutral-900 text-neutral-500 text-[11px] font-sans font-medium border-b border-neutral-200 dark:border-neutral-800">
              Proposed Patch (After)
            </div>
            <div className="divide-y divide-neutral-100 dark:divide-neutral-900">
              {newLines.map((line, idx) => (
                <div key={`split-new-${idx}`} className="flex bg-emerald-50/40 dark:bg-emerald-950/10 text-emerald-900 dark:text-emerald-200">
                  <div className="w-10 select-none text-right pr-2 text-neutral-400 shrink-0 tabular-nums py-0.5 text-[11px]">
                    {idx + 1}
                  </div>
                  <div className="px-2 py-0.5 whitespace-pre overflow-x-auto flex-1">{line || ' '}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
