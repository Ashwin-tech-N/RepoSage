import React from 'react';

interface StatusTextProps {
  status: string;
  variant?: 'healthy' | 'warning' | 'error' | 'info' | 'neutral';
  className?: string;
  prefixDot?: boolean;
}

export const StatusText: React.FC<StatusTextProps> = ({
  status,
  variant,
  className = '',
  prefixDot = true
}) => {
  const norm = status.toLowerCase();

  let autoVariant = variant;
  if (!autoVariant) {
    if (['healthy', 'passed', 'ready', 'approved', 'resolved', 'nominal', 'success', 'completed'].includes(norm)) {
      autoVariant = 'healthy';
    } else if (['analyzing', 'in_review', 'building', 'warning', 'canary_in_progress', 'mitigated', 'investigating', 'changes_requested', 'running', 'issues_found'].includes(norm)) {
      autoVariant = 'warning';
    } else if (['failed', 'critical', 'high', 'error', 'rolled_back', 'failing', 'rejected'].includes(norm)) {
      autoVariant = 'error';
    } else if (['open', 'promoting'].includes(norm)) {
      autoVariant = 'info';
    } else {
      autoVariant = 'neutral';
    }
  }

  const colorStyles = {
    healthy: 'text-emerald-700 dark:text-emerald-400',
    warning: 'text-amber-700 dark:text-amber-400',
    error: 'text-rose-700 dark:text-rose-400',
    info: 'text-blue-700 dark:text-blue-400',
    neutral: 'text-neutral-600 dark:text-neutral-400'
  };

  const dotStyles = {
    healthy: 'bg-emerald-500',
    warning: 'bg-amber-500',
    error: 'bg-rose-500',
    info: 'bg-blue-500',
    neutral: 'bg-neutral-400'
  };

  const label = status.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${colorStyles[autoVariant]} ${className}`}>
      {prefixDot && <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotStyles[autoVariant]}`} aria-hidden="true" />}
      <span>{label}</span>
    </span>
  );
};
