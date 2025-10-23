'use client';

import { X, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import type { QueryHistory } from '@/lib/api';
import { formatDate, truncateQuery } from '@/lib/utils';

interface QueryHistoryPanelProps {
  history: QueryHistory[];
  onQueryClick: (query: string) => void;
  onClose: () => void;
}

export default function QueryHistoryPanel({ history, onQueryClick, onClose }: QueryHistoryPanelProps) {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Query History
        </h2>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded transition-colors"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {history.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No query history yet</p>
          <p className="text-sm mt-1">Your executed queries will appear here</p>
        </div>
      ) : (
        <div className="space-y-3">
          {history.map((item) => (
            <button
              key={item.id}
              onClick={() => onQueryClick(item.query)}
              className="w-full text-left p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200"
            >
              <div className="flex items-start gap-2 mb-2">
                {item.success ? (
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-mono text-sm text-gray-900 break-words">
                    {truncateQuery(item.query, 80)}
                  </p>
                  {item.error_message && (
                    <p className="text-xs text-red-600 mt-1">
                      Error: {item.error_message}
                    </p>
                  )}
                </div>
              </div>
              <div className="text-xs text-gray-500">
                {formatDate(item.executed_at)}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
