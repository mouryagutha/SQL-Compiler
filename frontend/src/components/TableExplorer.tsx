'use client';

import { Table, ChevronRight } from 'lucide-react';
import type { TableInfo } from '@/lib/api';

interface TableExplorerProps {
  tables: string[];
  selectedTable: TableInfo | null;
  onTableClick: (tableName: string) => void;
}

export default function TableExplorer({ tables, selectedTable, onTableClick }: TableExplorerProps) {
  return (
    <div className="p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <Table className="w-5 h-5" />
        Available Tables
      </h2>

      <div className="space-y-2">
        {tables.map((table) => (
          <button
            key={table}
            onClick={() => onTableClick(table)}
            className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center justify-between ${
              selectedTable?.table_name === table
                ? 'bg-primary-50 text-primary-700 border border-primary-200'
                : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-transparent'
            }`}
          >
            <span className="font-medium">{table}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        ))}
      </div>

      {selectedTable && (
        <div className="mt-6 border-t border-gray-200 pt-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">
            {selectedTable.table_name} Schema
          </h3>

          <div className="space-y-2 mb-4">
            {selectedTable.columns.map((column) => (
              <div
                key={column.name}
                className="bg-gray-50 px-3 py-2 rounded text-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-medium text-gray-900">
                    {column.name}
                  </span>
                  {column.primary_key && (
                    <span className="text-xs bg-primary-100 text-primary-700 px-2 py-0.5 rounded">
                      PK
                    </span>
                  )}
                </div>
                <div className="text-gray-600 text-xs mt-1">
                  {column.type}
                  {column.nullable && ' • Nullable'}
                </div>
              </div>
            ))}
          </div>

          <div className="text-xs text-gray-600 bg-gray-50 px-3 py-2 rounded">
            <strong>Total Rows:</strong> {selectedTable.row_count}
          </div>

          {selectedTable.sample_data.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-semibold text-gray-900 mb-2">
                Sample Data (First 5 rows)
              </h4>
              <div className="overflow-x-auto">
                <table className="min-w-full text-xs">
                  <thead>
                    <tr className="bg-gray-100">
                      {selectedTable.columns.map((col) => (
                        <th
                          key={col.name}
                          className="px-2 py-1 text-left font-medium text-gray-700"
                        >
                          {col.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {selectedTable.sample_data.map((row, idx) => (
                      <tr key={idx} className="border-t border-gray-200">
                        {selectedTable.columns.map((col) => (
                          <td
                            key={col.name}
                            className="px-2 py-1 text-gray-600"
                          >
                            {row[col.name] !== null ? String(row[col.name]) : 'NULL'}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
