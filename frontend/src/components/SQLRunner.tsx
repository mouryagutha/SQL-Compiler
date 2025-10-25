'use client';

import { useState, useEffect } from 'react';
import { queryAPI, tableAPI, handleAPIError, type QueryHistory, type TableInfo } from '@/lib/api';
import { firebaseAuth } from '@/lib/firebase';
import { Play, LogOut, Database, Clock, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import TableExplorer from './TableExplorer';
import QueryHistoryPanel from './QueryHistoryPanel';
import ResultsTable from './ResultsTable';

interface SQLRunnerProps {
  onLogout: () => void;
}

export default function SQLRunner({ onLogout }: SQLRunnerProps) {
  const [query, setQuery] = useState('SELECT * FROM Customers;');
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [tables, setTables] = useState<string[]>([]);
  const [selectedTable, setSelectedTable] = useState<TableInfo | null>(null);
  const [queryHistory, setQueryHistory] = useState<QueryHistory[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [queryBoxHeight, setQueryBoxHeight] = useState(128); // 128px = h-32
  const username = localStorage.getItem('username') || 'User';

  // Load tables on mount
  useEffect(() => {
    loadTables();
    // Query history is now stored locally
    loadLocalQueryHistory();
  }, []);

  const loadTables = async () => {
    // Hardcoded table list since we're not using backend auth
    setTables(['Customers', 'Orders', 'Shippings']);
  };

  const loadLocalQueryHistory = () => {
    try {
      const stored = localStorage.getItem('queryHistory');
      if (stored) {
        setQueryHistory(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading query history:', error);
    }
  };

  const saveQueryToHistory = (query: string, success: boolean, error?: string) => {
    const newQuery: QueryHistory = {
      id: Date.now(),
      query,
      executed_at: new Date().toISOString(),
      success,
      error_message: error
    };
    
    const updated = [newQuery, ...queryHistory].slice(0, 20); // Keep last 20
    setQueryHistory(updated);
    localStorage.setItem('queryHistory', JSON.stringify(updated));
  };

  const handleTableClick = async (tableName: string) => {
    // Mock table info since we're not using backend
    const mockTableInfo: Record<string, TableInfo> = {
      'Customers': {
        table_name: 'Customers',
        columns: [
          { name: 'customer_id', type: 'INTEGER', nullable: false, primary_key: true },
          { name: 'first_name', type: 'VARCHAR(100)', nullable: true, primary_key: false },
          { name: 'last_name', type: 'VARCHAR(100)', nullable: true, primary_key: false },
          { name: 'age', type: 'INTEGER', nullable: true, primary_key: false },
          { name: 'country', type: 'VARCHAR(100)', nullable: true, primary_key: false }
        ],
        sample_data: [
          { customer_id: 1, first_name: 'John', last_name: 'Doe', age: 30, country: 'USA' },
          { customer_id: 2, first_name: 'Robert', last_name: 'Luna', age: 22, country: 'USA' },
          { customer_id: 3, first_name: 'David', last_name: 'Robinson', age: 25, country: 'UK' },
          { customer_id: 4, first_name: 'John', last_name: 'Reinhardt', age: 22, country: 'UK' },
          { customer_id: 5, first_name: 'Betty', last_name: 'Doe', age: 28, country: 'UAE' }
        ],
        row_count: 5
      },
      'Orders': {
        table_name: 'Orders',
        columns: [
          { name: 'order_id', type: 'INTEGER', nullable: false, primary_key: true },
          { name: 'item', type: 'VARCHAR(100)', nullable: true, primary_key: false },
          { name: 'amount', type: 'INTEGER', nullable: true, primary_key: false },
          { name: 'customer_id', type: 'INTEGER', nullable: true, primary_key: false }
        ],
        sample_data: [
          { order_id: 1, item: 'Keyboard', amount: 400, customer_id: 4 },
          { order_id: 2, item: 'Mouse', amount: 300, customer_id: 4 },
          { order_id: 3, item: 'Monitor', amount: 12000, customer_id: 3 },
          { order_id: 4, item: 'Keyboard', amount: 400, customer_id: 1 },
          { order_id: 5, item: 'Mousepad', amount: 250, customer_id: 2 }
        ],
        row_count: 5
      },
      'Shippings': {
        table_name: 'Shippings',
        columns: [
          { name: 'shipping_id', type: 'INTEGER', nullable: false, primary_key: true },
          { name: 'status', type: 'VARCHAR(100)', nullable: true, primary_key: false },
          { name: 'customer', type: 'INTEGER', nullable: true, primary_key: false }
        ],
        sample_data: [
          { shipping_id: 1, status: 'Pending', customer: 2 },
          { shipping_id: 2, status: 'Pending', customer: 4 },
          { shipping_id: 3, status: 'Delivered', customer: 3 },
          { shipping_id: 4, status: 'Pending', customer: 5 },
          { shipping_id: 5, status: 'Delivered', customer: 1 }
        ],
        row_count: 5
      }
    };
    
    setSelectedTable(mockTableInfo[tableName] || null);
  };

  const handleRunQuery = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setResults(null);

    try {
      const response = await queryAPI.execute(query);
      setResults(response);
      // Save to local history
      saveQueryToHistory(query, response.success, response.error);
    } catch (error) {
      const errorMsg = handleAPIError(error);
      setResults({
        success: false,
        error: errorMsg,
      });
      // Save failed query to history
      saveQueryToHistory(query, false, errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleHistoryClick = (historyQuery: string) => {
    setQuery(historyQuery);
    setShowHistory(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 flex flex-col">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 shadow-sm px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-md">
              <Database className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-primary-700 bg-clip-text text-transparent">SQL Runner</h1>
              <p className="text-sm text-gray-600">Welcome, <span className="font-semibold text-primary-600">{username}</span></p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Clock className="w-4 h-4" />
              History
            </button>
            <button
              onClick={async () => {
                await firebaseAuth.logout();
                localStorage.removeItem('firebaseUser');
                localStorage.removeItem('username');
                onLogout();
              }}
              className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar - Table Explorer */}
        <aside className="w-96 bg-gradient-to-b from-white to-gray-50 border-r border-gray-200 shadow-lg overflow-y-auto">
          <TableExplorer
            tables={tables}
            selectedTable={selectedTable}
            onTableClick={handleTableClick}
          />
        </aside>

        {/* Main Area */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Query Editor */}
          <div className="bg-white/90 backdrop-blur-sm border-b border-gray-200 p-6 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700">
                SQL Query
              </label>
              <button
                onClick={handleRunQuery}
                disabled={loading || !query.trim()}
                className="flex items-center gap-2 px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Running...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    Run Query
                  </>
                )}
              </button>
            </div>
            <div className="relative">
              <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                style={{ height: `${queryBoxHeight}px` }}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg font-mono text-sm text-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-primary-400 outline-none resize-y bg-white shadow-sm"
                placeholder="Enter your SQL query here..."
                spellCheck={false}
              />
              <div className="absolute bottom-2 right-2 text-xs text-gray-400 pointer-events-none flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
                Drag to resize
              </div>
            </div>
          </div>

          {/* Results Area */}
          <div className="flex-1 overflow-auto p-6 bg-gradient-to-br from-gray-50/50 to-blue-50/30">
            {loading && (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <Loader2 className="w-12 h-12 text-primary-600 animate-spin mx-auto mb-4" />
                  <p className="text-gray-600 font-medium">Executing query...</p>
                </div>
              </div>
            )}

            {!loading && results && (
              <div>
                {results.success ? (
                  <div>
                    <div className="mb-4 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle className="w-5 h-5" />
                        <span className="font-medium">
                          Query executed successfully
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">
                        {results.row_count} rows • {results.execution_time}s
                      </div>
                    </div>
                    <ResultsTable data={results.data} columns={results.columns} />
                  </div>
                ) : (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-medium text-red-900 mb-1">
                          Query Error
                        </h3>
                        <p className="text-red-700 text-sm font-mono">
                          {results.error}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {!loading && !results && (
              <div className="flex items-center justify-center h-64">
                <div className="text-center text-gray-500">
                  <Database className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium mb-2">No results yet</p>
                  <p className="text-sm">
                    Write a SQL query and click &quot;Run Query&quot; to see results.
                  </p>
                </div>
              </div>
            )}
          </div>
        </main>

        {/* Query History Sidebar */}
        {showHistory && (
          <aside className="w-96 bg-white border-l border-gray-200 overflow-y-auto">
            <QueryHistoryPanel
              history={queryHistory}
              onQueryClick={handleHistoryClick}
              onClose={() => setShowHistory(false)}
            />
          </aside>
        )}
      </div>
    </div>
  );
}
