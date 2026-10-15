import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <React.Fragment key={index}>
            {index > 0 && <ChevronRight className="w-3.5 h-3.5 text-neutral-400 shrink-0" aria-hidden="true" />}
            {item.path && !isLast ? (
              <Link
                to={item.path}
                className="hover:text-neutral-900 dark:hover:text-neutral-200 transition-colors truncate max-w-[160px]"
              >
                {item.label}
              </Link>
            ) : (
              <span className={isLast ? 'font-medium text-neutral-900 dark:text-neutral-100 truncate max-w-[200px]' : 'truncate max-w-[160px]'}>
                {item.label}
              </span>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
