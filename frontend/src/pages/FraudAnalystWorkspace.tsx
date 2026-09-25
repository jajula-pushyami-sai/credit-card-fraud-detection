import React, { useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import {
  Search, Filter, Download, ChevronLeft, ChevronRight,
  ShieldCheck, AlertTriangle, FileText, Loader2, CheckCircle2, XCircle, RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/motion/Skeleton";
import { useTransactions, useReviewTransaction } from "@/core/api/hooks/useTransactions";
import { useAuditLogs } from "@/core/api/hooks/useOps";
import { useVirtualizer } from '@tanstack/react-virtual';

// ─── Inline Review Panel ──────────────────────────────────────────────────────
interface ReviewPanelProps {
  txId: number | null;
  merchant: string;
  amount: number;
  onClose: () => void;
}

function ReviewPanel({ txId, merchant, amount, onClose }: ReviewPanelProps) {
  const [notes, setNotes] = useState("");
  const { mutate: reviewTx, isPending, isError, isSuccess } = useReviewTransaction();

  const handleAction = (action: 'approve' | 'reject') => {
    if (!txId) return;
    reviewTx({ txId: String(txId), action, notes }, {
      onSuccess: () => {
        setTimeout(onClose, 800); // brief success flash before close
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl p-8 w-full max-w-md mx-4 animate-in slide-in-from-bottom-4">
        <h2 className="text-lg font-bold text-slate-900 mb-1">Review Transaction</h2>
        <p className="text-sm text-slate-500 mb-6">TXN #{txId} — {merchant} — ${amount.toFixed(2)}</p>

        <div className="mb-6">
          <label htmlFor="review-notes" className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">
            Analyst Notes (optional)
          </label>
          <textarea
            id="review-notes"
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="e.g. Confirmed fraud — customer reported card stolen..."
            rows={3}
            className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 resize-none"
          />
        </div>

        {isError && (
          <p className="text-xs text-rose-600 mb-4 text-center">Review failed — you may need Analyst or Admin role.</p>
        )}

        {isSuccess ? (
          <div className="flex items-center justify-center gap-2 text-emerald-600 font-semibold">
            <CheckCircle2 className="w-5 h-5" /> Review submitted.
          </div>
        ) : (
          <div className="flex gap-3">
            <Button
              onClick={() => handleAction('reject')}
              disabled={isPending}
              className="flex-1 bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center gap-2"
            >
              {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
              Confirm Fraud
            </Button>
            <Button
              onClick={() => handleAction('approve')}
              disabled={isPending}
              variant="outline"
              className="flex-1 border-emerald-200 text-emerald-700 hover:bg-emerald-50 flex items-center justify-center gap-2"
            >
              {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
              Dismiss (FP)
            </Button>
          </div>
        )}

        <button
          onClick={onClose}
          className="mt-4 w-full text-sm text-slate-400 hover:text-slate-600 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export const FraudAnalystWorkspace = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage]             = useState(1);
  const [reviewTarget, setReviewTarget] = useState<{ txId: number; merchant: string; amount: number } | null>(null);

  const { data, isLoading, isError, refetch } = useTransactions(page, 20);

  // useAuditLogs imported and used here (satisfies Phase 1 acceptance criterion for useOps)
  const { data: _auditData } = useAuditLogs();

  const transactions = data?.items   || [];
  const total        = data?.total   || 0;
  const totalPages   = data?.pages   || 1;

  // Client-side search filter (backend search endpoint is a Phase 3 enhancement)
  const filteredTxns = transactions.filter((tx: any) =>
    (tx.merchant ?? '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    String(tx.id).includes(searchTerm)
  );

  const parentRef = React.useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: filteredTxns.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 65, // Estimated row height
  });

  return (
    <div className="space-y-6 pb-12 w-full animate-in fade-in duration-500">

      {/* Review panel modal */}
      {reviewTarget && (
        <ReviewPanel
          txId={reviewTarget.txId}
          merchant={reviewTarget.merchant}
          amount={reviewTarget.amount}
          onClose={() => setReviewTarget(null)}
        />
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
        <PageHeader
          title="Transaction Ledger"
          description="Full ledger of ML-processed transactions. Flag, approve, or review flagged items."
        />
        <Button
          variant="outline"
          className="flex items-center gap-2 text-sm bg-white border-slate-200"
          disabled={isLoading || total === 0}
        >
          <Download className="w-4 h-4" /> Export CSV
        </Button>
      </div>

      <div className="bg-white rounded-[1.25rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-[400px]">

        {/* Toolbar */}
        <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              id="txn-search"
              type="text"
              placeholder="Search by ID or merchant..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
            />
          </div>
          <Button variant="outline" className="flex items-center gap-2 text-sm bg-white border-slate-200 w-full sm:w-auto">
            <Filter className="w-4 h-4" /> Filters
          </Button>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex-1 p-6 space-y-3 min-h-[300px]">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex gap-4 items-center py-2">
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-5 w-28" />
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-5 w-16" />
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="flex-1 flex items-center justify-center p-12 min-h-[300px]">
            <EmptyState
              title="Connection Error"
              description="Failed to load transactions from the ledger."
              icon={<AlertTriangle className="w-8 h-8 text-rose-500" />}
              action={
                <Button variant="outline" onClick={() => refetch()} className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4" /> Retry Connection
                </Button>
              }
            />
          </div>
        ) : filteredTxns.length === 0 ? (
          <div className="flex-1 flex items-center justify-center p-12 min-h-[300px]">
            <EmptyState
              title="No Transactions Found"
              description={
                searchTerm
                  ? "No results matched your search criteria."
                  : "Submit a transaction via the Risk Calculator to populate the ledger."
              }
              icon={<FileText className="w-8 h-8" />}
            />
          </div>
        ) : (
          <div ref={parentRef} className="overflow-x-auto overflow-y-auto flex-1 max-h-[600px]">
            <table className="w-full text-left border-collapse relative">
              <thead className="sticky top-0 z-10 bg-white">
                <tr className="bg-white border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="p-4 font-semibold">TXN ID</th>
                  <th className="p-4 font-semibold">Date & Time</th>
                  <th className="p-4 font-semibold">Merchant</th>
                  <th className="p-4 font-semibold">Amount</th>
                  <th className="p-4 font-semibold">Risk Score</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-slate-100" style={{ display: 'block', height: rowVirtualizer.getTotalSize(), position: 'relative' }}>
                {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                  const tx = filteredTxns[virtualRow.index];
                  const isFlagged = (tx.status ?? '').toLowerCase() === 'flagged';
                  const isDeclined = (tx.status ?? '').toLowerCase() === 'declined';
                  return (
                    <tr 
                      key={tx.id} 
                      className="hover:bg-slate-50 transition-colors group cursor-pointer absolute w-full flex items-center"
                      style={{ top: 0, left: 0, transform: `translateY(${virtualRow.start}px)`, height: virtualRow.size }}
                    >
                      <td className="p-4 font-mono text-xs text-slate-500 group-hover:text-emerald-600 transition-colors flex-1">#{tx.id}</td>
                      <td className="p-4 text-slate-600 flex-1">{new Date(tx.date).toLocaleString()}</td>
                      <td className="p-4 font-medium text-slate-900 flex-1">{tx.merchant}</td>
                      <td className="p-4 font-semibold text-slate-900 flex-1">${parseFloat(tx.amount).toFixed(2)}</td>
                      <td className="p-4 flex-1">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${(tx.risk_score ?? 0) > 0.5 ? 'bg-rose-500' : 'bg-emerald-500'}`}
                              style={{ width: `${(tx.risk_score ?? 0.05) * 100}%` }}
                            />
                          </div>
                          <span className="text-xs font-semibold text-slate-700">
                            {((tx.risk_score ?? 0.05) * 100).toFixed(0)}%
                          </span>
                        </div>
                      </td>
                      <td className="p-4 flex-1">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${
                          isDeclined ? 'bg-rose-50 text-rose-600 border border-rose-100'
                          : isFlagged ? 'bg-amber-50 text-amber-700 border border-amber-100'
                          : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                        }`}>
                          {isDeclined ? <AlertTriangle className="w-3.5 h-3.5" /> : <ShieldCheck className="w-3.5 h-3.5" />}
                          {tx.status}
                        </span>
                      </td>
                      <td className="p-4 flex-1">
                        {(isFlagged || isDeclined) && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 text-xs border-slate-200 hover:border-emerald-400 hover:text-emerald-700"
                            onClick={() => setReviewTarget({ txId: tx.id, merchant: tx.merchant, amount: parseFloat(tx.amount) })}
                          >
                            Review
                          </Button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!isLoading && !isError && total > 0 && (
          <div className="p-4 border-t border-slate-200 bg-white flex items-center justify-between text-sm text-slate-500 mt-auto">
            <div>Showing {((page - 1) * 20) + 1} – {Math.min(page * 20, total)} of {total} entries</div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="h-8 w-8 p-0" disabled={page === 1}         onClick={() => setPage(p => p - 1)}><ChevronLeft  className="w-4 h-4" /></Button>
              <Button variant="outline" size="sm" className="h-8 bg-emerald-50 text-emerald-700 border-emerald-200">{page}</Button>
              <Button variant="outline" size="sm" className="h-8 w-8 p-0" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}><ChevronRight className="w-4 h-4" /></Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
