import React from 'react';
import { useLocation, useMatch } from 'react-router-dom';
import { Activity, AlertCircle, GitBranch, Wifi, WifiOff, Clock, Cpu } from 'lucide-react';
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
  const { statusBar, isNetworkOnline, currentTime } = useStatusBar();
  const { pathname } = useLocation();

  // Detect if we're on a job details page and extract the jobId
  const jobMatch = useMatch('/app/jobs/:jobId');
  const jobId = jobMatch?.params.jobId;
  const { job } = useJob(jobId || '');

  const isJobPage = !!jobId;
  const hasJobData = isJobPage && !!job;

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
        {/* Agent Status */}
        <div className="flex items-center gap-1.5 whitespace-nowrap">
          <Activity className="w-3 h-3" />
          <span>
            AGENT: <strong>{statusBar.agentStatus}</strong>
          </span>
        </div>

        <Sep />

        {/* Network Status */}
        <div className="hidden sm:flex items-center gap-1.5 whitespace-nowrap">
          {isNetworkOnline ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
          <span>
            NET: <strong>{isNetworkOnline ? 'ONLINE' : 'OFFLINE'}</strong>
          </span>
        </div>

        {/* ─── Job Context Info (shown only on job detail pages) ─── */}
        {hasJobData && (
          <>
            <Sep />

            {/* Model */}
            <div className="hidden md:flex items-center gap-1.5 whitespace-nowrap">
              <Cpu className="w-3 h-3" />
              <span>
                MODEL: <strong>{job.selected_model || 'N/A'}</strong>
              </span>
            </div>

            <Sep />

            {/* Created At */}
            <div className="hidden lg:flex items-center gap-1.5 whitespace-nowrap">
              <Clock className="w-3 h-3" />
              <span>
                CREATED: <strong>{formatDate(job.created_at)}</strong>
              </span>
            </div>

            {/* Branches (if conflict analysis) */}
            {job.branches && job.branches.length > 0 && (
              <>
                <Sep />
                <div className="hidden xl:flex items-center gap-1.5 whitespace-nowrap">
                  <GitBranch className="w-3 h-3" />
                  <span>
                    BRANCHES: <strong>{job.branches.join(', ')}</strong>
                  </span>
                </div>
              </>
            )}

            <Sep />

            {/* Job ID */}
            <div className="hidden xl:flex items-center gap-1.5 whitespace-nowrap">
              <span>
                ID: <strong className="font-mono">{job.id.slice(0, 8)}</strong>
              </span>
            </div>
          </>
        )}

        {/* ─── Default info (shown when NOT on a job page) ─── */}
        {!isJobPage && (
          <>
            <div className="h-3 w-px bg-black/25 hidden sm:block" />

            <div className="hidden md:flex items-center gap-1.5 whitespace-nowrap">
              <span>SPEED:</span>
              <strong>{statusBar.speed}</strong>
            </div>

            <div className="h-3 w-px bg-black/25 hidden md:block" />

            <div className="hidden lg:flex items-center gap-1.5 whitespace-nowrap">
              <span>USAGE:</span>
              <strong>{statusBar.tokenUsage}</strong>
            </div>
          </>
        )}
      </div>

      {/* ===== Right Section ===== */}
      <div className="flex items-center gap-3 md:gap-4 whitespace-nowrap">
        <span className="hidden sm:inline">{getPageLabel(pathname)}</span>

        <Sep />

        <span className="hidden md:inline">{currentTime}</span>

        <Sep />

        <div className="flex items-center gap-1">
          <GitBranch className="w-3 h-3" />
          <span>{statusBar.branch}</span>
        </div>

        <Sep />

        <span>{statusBar.encoding}</span>

        <div className="flex items-center gap-1 bg-black text-green-400 px-2 h-6 font-bold">
          <AlertCircle className="w-3 h-3" />
          <span>{statusBar.alerts} ALERTS</span>
        </div>
      </div>
    </footer>
  );
};
