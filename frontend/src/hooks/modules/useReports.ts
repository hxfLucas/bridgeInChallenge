import { useState, useCallback } from 'react';
import { getReports, deleteReport, updateReportStatus } from '../../api/reports.api';
import type { Report, ReportStatus } from '../../api/reports.api';

interface ReportsState {
  reports: Report[];
  isLoading: boolean;
  error: string | null;
}

export const STATUS_LABELS: Record<ReportStatus, string> = {
  new: 'New',
  in_review: 'In Review',
  resolved: 'Resolved',
  rejected: 'Rejected',
};

export const STATUS_COLORS: Record<ReportStatus, 'default' | 'info' | 'warning' | 'success' | 'error'> = {
  new: 'info',
  in_review: 'warning',
  resolved: 'success',
  rejected: 'error',
};

export function useReports() {
  const [state, setState] = useState<ReportsState>({ reports: [], isLoading: false, error: null });

  const fetchReports = useCallback(async () => {
    setState({ reports: [], isLoading: true, error: null });
    try {
      const reports = await getReports();
      setState({ reports, isLoading: false, error: null });
    } catch (err: any) {
      const message = err?.response?.data?.error ?? err?.message ?? 'Failed to load reports';
      setState({ reports: [], isLoading: false, error: message });
    }
  }, []);

  const removeReport = useCallback(async (id: string) => {
    try {
      await deleteReport(id);
      setState((prev) => ({
        ...prev,
        reports: prev.reports.filter((r) => r.id !== id),
      }));
    } catch (err: any) {
      const message = err?.response?.data?.error ?? err?.message ?? 'Failed to delete report';
      setState((prev) => ({ ...prev, error: message }));
    }
  }, []);

  const changeReportStatus = useCallback(async (id: string, status: ReportStatus) => {
    try {
      const updated = await updateReportStatus({ id, status });
      setState((prev) => ({
        ...prev,
        reports: prev.reports.map((r) => (r.id === id ? updated : r)),
      }));
    } catch (err: any) {
      const message = err?.response?.data?.error ?? err?.message ?? 'Failed to update status';
      setState((prev) => ({ ...prev, error: message }));
    }
  }, []);

  return { ...state, fetchReports, removeReport, changeReportStatus };
}
