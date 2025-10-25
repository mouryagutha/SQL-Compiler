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
      <div className="mb-6">
        <h2 className="text-lg font-bold text-gray-900 mb-1 flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-indigo-600 rounded-lg flex items-center justify-center">
            <Table className="w-4 h-4 text-white" />
          </div>
          Database Tables
        </h2>
        <p className="text-xs text-gray-500 ml-10">Click to explore schema</p>
      </div>

      <div className="space-y-2">
        {tables.map((table) => (
          <button
            key={table}
            onClick={() => onTableClick(table)}
            className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center justify-between shadow-sm ${
              selectedTable?.table_name === table
                ? 'bg-gradient-to-r from-primary-50 to-indigo-50 text-primary-700 border-2 border-primary-300 shadow-md scale-105'
                : 'bg-white text-gray-700 hover:bg-gray-50 hover:shadow-md border-2 border-gray-200 hover:border-primary-200'
            }`}
          >
            <span className="font-semibold">{table}</span>
            <ChevronRight className={`w-4 h-4 transition-transform ${selectedTable?.table_name === table ? 'rotate-90' : ''}`} />
          </button>
        ))}
      </div>

      {selectedTable && (
        <div className="mt-6 border-t-2 border-primary-100 pt-6 bg-gradient-to-b from-primary-50/30 to-transparent p-4 rounded-lg">
          <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
            <div className="w-1 h-4 bg-gradient-to-b from-primary-500 to-indigo-600 rounded"></div>
            {selectedTable.table_name} Schema
          </h3>

          <div className="space-y-2 mb-4">
            {selectedTable.columns.map((column) => (
              <div
                key={column.name}
                className="bg-white px-3 py-2 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow text-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-semibold text-gray-900">
                    {column.name}
                  </span>
                  {column.primary_key && (
                    <span className="text-xs bg-gradient-to-r from-primary-500 to-indigo-600 text-white px-2 py-0.5 rounded font-semibold">
                      PK
                    </span>
                  )}
                </div>
                <div className="text-gray-600 text-xs mt-1 font-medium">
                  {column.type}
                  {column.nullable && ' • Nullable'}
                </div>
              </div>
            ))}
          </div>

          <div className="text-xs text-gray-700 bg-gradient-to-r from-blue-50 to-indigo-50 px-3 py-2 rounded-lg border border-blue-200 font-medium">
            <strong className="text-primary-700">Total Rows:</strong> {selectedTable.row_count}
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
