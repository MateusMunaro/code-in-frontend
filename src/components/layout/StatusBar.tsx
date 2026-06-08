import React from 'react';
import { useLocation, useMatch } from 'react-router-dom';
import { GitBranch, Wifi, WifiOff, Clock, Cpu } from 'lucide-react';
import { useStatusBar, useTheme } from '@shared/contexts';
import { useJob } from '@config/hooks';
import { formatDate } from '@shared/lib/utils';

const routeTitles: Record<string, string> = {
  '/app': 'DASHBOARD',
  '/app/new': 'NOVA ANALISE',
  '/app/settings': 'SETTINGS',
};

function getPageLabel(pathname: string): string {
  if (pathname.startsWith('/app/jobs/')) {
    return 'JOB DETAILS';
  }
  return routeTitles[pathname] || 'APP';
}

// ─── Separator ──────────────────────────────────────────────────────────────
const Sep: React.FC = () => <div className="h-3 w-px bg-black/25" />;

export const StatusBar: React.FC = () => {
  const { colors } = useTheme();
  const { isNetworkOnline, currentTime } = useStatusBar();
  const { pathname } = useLocation();

  // Detect if we're on a job details page and extract the jobId
  const jobMatch = useMatch('/app/jobs/:jobId');
  const jobId = jobMatch?.params.jobId;
  const { job } = useJob(jobId || '');

  if (!jobId || !job) return null;

  return (
    <footer
      className="h-8 shrink-0 border-t px-3 text-[10px] font-display uppercase tracking-wide flex items-center justify-between gap-3"
      style={{
        backgroundColor: colors.brand.primary,
        borderColor: colors.brand.primaryHover,
        color: '#020202',
      }}
    >
      {/* ===== Left Section ===== */}
      <div className="min-w-0 flex items-center gap-3 md:gap-4 overflow-hidden">
        {/* Network Status */}
        <div className="flex items-center gap-1.5 whitespace-nowrap">
          {isNetworkOnline ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
          <span>NET: <strong>{isNetworkOnline ? 'ONLINE' : 'OFFLINE'}</strong></span>
        </div>

        <Sep />

        {/* Model */}
        <div className="hidden md:flex items-center gap-1.5 whitespace-nowrap">
          <Cpu className="w-3 h-3" />
          <span>MODEL: <strong>{job.selected_model}</strong></span>
        </div>

        <Sep />

        {/* Created At */}
        <div className="hidden lg:flex items-center gap-1.5 whitespace-nowrap">
          <Clock className="w-3 h-3" />
          <span>CREATED: <strong>{formatDate(job.created_at)}</strong></span>
        </div>

        {/* Branches (conflict analysis only) */}
        {job.branches && job.branches.length > 0 && (
          <>
            <Sep />
            <div className="hidden xl:flex items-center gap-1.5 whitespace-nowrap">
              <GitBranch className="w-3 h-3" />
              <span>BRANCHES: <strong>{job.branches.join(', ')}</strong></span>
            </div>
          </>
        )}

        <Sep />

        {/* Job ID */}
        <div className="hidden xl:flex items-center gap-1.5 whitespace-nowrap">
          <span>ID: <strong className="font-mono">{job.id.slice(0, 8)}</strong></span>
        </div>
      </div>

      {/* ===== Right Section ===== */}
      <div className="flex items-center gap-3 md:gap-4 whitespace-nowrap">
        <span className="hidden sm:inline">{getPageLabel(pathname)}</span>
        <Sep />
        <span>{currentTime}</span>
      </div>
    </footer>
  );
};
