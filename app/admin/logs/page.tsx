"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Terminal, Trash2, X, ChevronDown, ChevronUp,
  AlertOctagon, AlertTriangle, Info, Copy, CheckCircle2, 
  RotateCw, Loader2, Filter, Skull
} from 'lucide-react';

const API = process.env.NEXT_PUBLIC_API_URL;
const authH = () => ({
  'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
  'Accept': 'application/json',
  'Content-Type': 'application/json',
});

interface LogEntry {
  date: string;
  env: string;
  level: 'ERROR' | 'WARNING' | 'INFO' | string;
  message: string;
  stack_trace: string[];
}

export default function AdminLogsPage() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [clearing, setClearing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeLevel, setActiveLevel] = useState<'ALL' | 'ERROR' | 'WARNING' | 'INFO'>('ALL');
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [showClearModal, setShowClearModal] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' | 'info' } | null>(null);

  const showToast = (msg: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchLogs = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const res = await fetch(`${API}/api/admin/logs`, { headers: authH() });
      const data = await res.json();
      if (data.success) {
        setLogs(data.logs || []);
        if (silent) {
          showToast('Logs refreshed!', 'success');
        }
      } else {
        showToast(data.message || 'Failed to fetch logs', 'error');
      }
    } catch (err: any) {
      console.error(err);
      showToast('Connection to api server failed.', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const handleClearLogs = async () => {
    setClearing(true);
    try {
      const res = await fetch(`${API}/api/admin/logs/clear`, {
        method: 'DELETE',
        headers: authH(),
      });
      const data = await res.json();
      if (data.success) {
        setLogs([]);
        setExpandedIndex(null);
        showToast('System logs flushed successfully!', 'success');
      } else {
        showToast(data.message || 'Failed to clear logs', 'error');
      }
    } catch (err) {
      showToast('Failed to connect to backend server.', 'error');
    } finally {
      setClearing(false);
      setShowClearModal(false);
    }
  };

  const copyLogToClipboard = (log: LogEntry, e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid toggling expansion
    const text = `[${log.date}] ${log.env}.${log.level}: ${log.message}\n\nStack Trace:\n${log.stack_trace.join('\n')}`;
    navigator.clipboard.writeText(text);
    showToast('Log copied to clipboard!', 'info');
  };

  // Filter logs locally based on search term and active tab
  const filteredLogs = logs.filter(log => {
    const matchesLevel = activeLevel === 'ALL' || log.level === activeLevel;
    const matchesSearch = !searchTerm || 
      log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.level.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.date.includes(searchTerm);
    return matchesLevel && matchesSearch;
  });

  const getLevelStyles = (level: string) => {
    switch (level) {
      case 'ERROR':
        return {
          bg: 'bg-rose-500/10 border-rose-500/20 text-rose-400',
          icon: <AlertOctagon className="w-4 h-4" />,
          glow: 'shadow-[0_0_15px_rgba(244,63,94,0.15)] border-rose-500/30'
        };
      case 'WARNING':
        return {
          bg: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
          icon: <AlertTriangle className="w-4 h-4" />,
          glow: 'shadow-[0_0_15px_rgba(245,158,11,0.15)] border-amber-500/30'
        };
      default:
        return {
          bg: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
          icon: <Info className="w-4 h-4" />,
          glow: 'shadow-[0_0_15px_rgba(59,130,246,0.15)] border-blue-500/30'
        };
    }
  };

  const errorCount = logs.filter(l => l.level === 'ERROR').length;
  const warningCount = logs.filter(l => l.level === 'WARNING').length;

  return (
    <div className="min-h-screen bg-slate-950 font-sora text-slate-100 p-6 md:p-8 flex flex-col gap-6">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className={`fixed bottom-6 right-6 z-[9999] px-6 py-4 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] backdrop-blur-xl border flex items-center gap-3 font-semibold text-[14px] ${
              toast.type === 'success' ? 'bg-slate-900 border-emerald-500/30 text-emerald-400' :
              toast.type === 'error' ? 'bg-slate-900 border-rose-500/30 text-rose-400' :
              'bg-slate-900 border-blue-500/30 text-blue-400'
            }`}
          >
            <CheckCircle2 className="w-5 h-5" />
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-slate-900/40 border border-slate-800/80 rounded-[2rem] p-6 backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Terminal className="w-6 h-6 text-indigo-400" />
            <h1 className="text-2xl md:text-3xl font-black font-playfair tracking-tight">System Logs</h1>
          </div>
          <p className="text-[13px] text-slate-400 font-medium">
            Daily logs and active production issues fetched directly from <code className="text-indigo-300 font-mono text-[12px] bg-slate-950 px-2 py-0.5 rounded-md">laravel.log</code>
          </p>
        </div>

        <div className="flex items-center gap-3 self-end md:self-center">
          <button
            onClick={() => fetchLogs(true)}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-[13px] font-bold transition-all disabled:opacity-50"
            title="Refresh Logs"
          >
            <RotateCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>

          {logs.length > 0 && (
            <button
              onClick={() => setShowClearModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 hover:border-rose-500/30 rounded-xl text-[13px] font-bold text-rose-400 transition-all"
            >
              <Trash2 className="w-4 h-4" />
              Flush Logs
            </button>
          )}
        </div>
      </div>

      {/* Health Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-slate-900/30 border border-slate-800/60 rounded-[1.5rem] p-5 flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-2xl flex items-center justify-center shrink-0">
            <Terminal className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-bold font-mono text-slate-100">{logs.length}</div>
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">Total Entries</div>
          </div>
        </div>

        <div className={`bg-slate-900/30 border border-slate-800/60 rounded-[1.5rem] p-5 flex items-center gap-4 transition-all ${errorCount > 0 ? 'border-rose-500/20 bg-rose-500/[0.01]' : ''}`}>
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${errorCount > 0 ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30 shadow-[0_0_15px_rgba(244,63,94,0.15)]' : 'bg-slate-800 text-slate-500 border border-slate-700'}`}>
            <Skull className="w-5 h-5" />
          </div>
          <div>
            <div className={`text-xl font-bold font-mono ${errorCount > 0 ? 'text-rose-400' : 'text-slate-400'}`}>{errorCount}</div>
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">Fatal Errors</div>
          </div>
        </div>

        <div className={`bg-slate-900/30 border border-slate-800/60 rounded-[1.5rem] p-5 flex items-center gap-4 transition-all ${warningCount > 0 ? 'border-amber-500/20 bg-amber-500/[0.01]' : ''}`}>
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${warningCount > 0 ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.15)]' : 'bg-slate-800 text-slate-500 border border-slate-700'}`}>
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <div className={`text-xl font-bold font-mono ${warningCount > 0 ? 'text-amber-400' : 'text-slate-400'}`}>{warningCount}</div>
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">Active Warnings</div>
          </div>
        </div>
      </div>

      {/* Main Console Box */}
      <div className="bg-slate-900/20 border border-slate-800/60 rounded-[2rem] p-6 flex flex-col gap-6 backdrop-blur-md flex-1">
        
        {/* Filter Toolbar */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          <div className="flex items-center p-1 bg-slate-950 border border-slate-800 rounded-2xl w-full lg:w-auto overflow-x-auto no-scrollbar">
            {(['ALL', 'ERROR', 'WARNING', 'INFO'] as const).map(lvl => (
              <button
                key={lvl}
                onClick={() => { setActiveLevel(lvl); setExpandedIndex(null); }}
                className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-[12px] font-bold capitalize transition-all whitespace-nowrap ${
                  activeLevel === lvl 
                    ? 'bg-slate-900 border border-slate-850 text-indigo-400 font-extrabold shadow-sm' 
                    : 'text-slate-500 hover:text-slate-300 hover:bg-slate-900/50 border border-transparent'
                }`}
              >
                {lvl === 'ERROR' && <AlertOctagon className="w-3.5 h-3.5" />}
                {lvl === 'WARNING' && <AlertTriangle className="w-3.5 h-3.5" />}
                {lvl === 'INFO' && <Info className="w-3.5 h-3.5" />}
                {lvl === 'ALL' && <Filter className="w-3.5 h-3.5" />}
                {lvl === 'ALL' ? 'All Entries' : lvl.toLowerCase()}
              </button>
            ))}
          </div>

          <div className="flex items-center px-4 py-2.5 bg-slate-950 border border-slate-800 shadow-sm rounded-2xl w-full lg:w-[320px]">
            <Search className="w-4 h-4 text-slate-500 mr-2.5 shrink-0" />
            <input
              type="text"
              placeholder="Search logs by message..."
              value={searchTerm}
              onChange={e => { setSearchTerm(e.target.value); setExpandedIndex(null); }}
              className="w-full bg-transparent border-none outline-none text-[13px] font-medium text-slate-300 placeholder-slate-500"
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm('')} className="text-slate-500 hover:text-slate-350">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Loading skeletons */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-16 bg-slate-900/30 border border-slate-850 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center text-center border border-slate-800/80 border-dashed rounded-[2rem]">
            <div className="w-16 h-16 bg-slate-900 border border-slate-850 rounded-2xl flex items-center justify-center text-slate-500 mb-4">
              <CheckCircle2 className="w-8 h-8 text-emerald-500/80" />
            </div>
            <h3 className="text-lg font-bold text-slate-200 mb-1 font-playfair">Console is Clear</h3>
            <p className="text-[13px] text-slate-500">No active production issues detected matching this level.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
            {filteredLogs.map((log, index) => {
              const styles = getLevelStyles(log.level);
              const isExpanded = expandedIndex === index;
              return (
                <div 
                  key={index}
                  className={`bg-slate-950 border rounded-2xl overflow-hidden shrink-0 transition-all duration-300 ${
                    isExpanded ? styles.glow : 'border-slate-900 hover:border-slate-800/80'
                  }`}
                >
                  {/* Log Header Row */}
                  <div 
                    onClick={() => setExpandedIndex(isExpanded ? null : index)}
                    className="p-4 flex items-center justify-between gap-4 cursor-pointer select-none"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border ${styles.bg}`}>
                        {styles.icon}
                      </div>
                      <div className="min-w-0">
                        <span className="text-[10px] font-mono text-slate-500 block mb-0.5">{log.date}</span>
                        <h4 className={`text-[13px] font-semibold text-slate-200 break-all ${isExpanded ? 'whitespace-normal' : 'line-clamp-1'}`} title={log.message}>
                          {log.message}
                        </h4>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <button
                        onClick={(e) => copyLogToClipboard(log, e)}
                        className="w-8 h-8 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-850 flex items-center justify-center text-slate-400 hover:text-slate-200 transition-all"
                        title="Copy Log"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <div className="text-slate-500">
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </div>
                  </div>

                  {/* Expanded Stack Trace Details */}
                  {isExpanded && (
                    <div className="border-t border-slate-900 bg-slate-950 p-5 font-mono text-[10px] leading-relaxed text-slate-400 overflow-x-auto max-h-[300px] custom-scrollbar border-dashed">
                      {log.stack_trace.length === 0 ? (
                        <div className="text-slate-600 italic">No stack trace details captured.</div>
                      ) : (
                        log.stack_trace.map((line, i) => (
                          <div key={i} className={`whitespace-pre py-0.5 ${
                            line.toLowerCase().includes('controller') || line.toLowerCase().includes('models')
                              ? 'text-indigo-400 font-semibold' 
                              : 'text-slate-500'
                          }`}>
                            {line}
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Warning Clear Modal */}
      <AnimatePresence>
        {showClearModal && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-[400px] bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center shadow-[0_20px_50px_rgba(0,0,0,0.3)] relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-rose-500 animate-pulse" />
              <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto mb-5 shadow-[0_0_20px_rgba(244,63,94,0.15)]">
                <Trash2 className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Flush Production Logs?</h3>
              <p className="text-slate-400 text-[13px] leading-relaxed mb-6">
                Are you sure you want to empty the production <code className="text-rose-300 font-mono">laravel.log</code> file? All historical errors and warning entries will be deleted permanently.
              </p>
              <div className="flex gap-4">
                <button 
                  onClick={() => setShowClearModal(false)}
                  className="flex-1 py-3 px-4 rounded-xl border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors text-[13px] font-bold"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleClearLogs}
                  disabled={clearing}
                  className="flex-1 py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold transition-colors shadow-lg shadow-rose-500/20 text-[13px] flex items-center justify-center gap-1.5"
                >
                  {clearing ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Yes, Flush'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
