import { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';

export default function DatabaseTestPage() {
  const [testResult, setTestResult] = useState(null);
  const [tablesResult, setTablesResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const testConnection = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/test-db');
      const data = await response.json();
      setTestResult(data);
    } catch (error) {
      setTestResult({ success: false, message: 'Failed to connect', error: error.message });
    }
    setLoading(false);
  };

  const checkTables = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/check-tables');
      const data = await response.json();
      setTablesResult(data);
    } catch (error) {
      setTablesResult({ success: false, message: 'Failed to get tables', error: error.message });
    }
    setLoading(false);
  };

  useEffect(() => {
    testConnection();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Database Connection Test</h1>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            Database Connection Status
            {testResult?.success && <span className="text-green-500">✓</span>}
            {testResult?.success === false && <span className="text-red-500">✗</span>}
          </h2>
          
          {loading && <p className="text-gray-600">Testing connection...</p>}
          
          {testResult && (
            <div className="bg-gray-100 rounded p-4 font-mono text-sm">
              <pre>{JSON.stringify(testResult, null, 2)}</pre>
            </div>
          )}

          <Button 
            onClick={testConnection} 
            className="mt-4 bg-[#00A6CE] hover:bg-[#0090B5] text-white"
            disabled={loading}
          >
            Test Connection Again
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Database Tables</h2>
          
          {tablesResult && (
            <div className="bg-gray-100 rounded p-4 font-mono text-sm mb-4">
              <pre>{JSON.stringify(tablesResult, null, 2)}</pre>
            </div>
          )}

          <Button 
            onClick={checkTables} 
            className="bg-[#00A6CE] hover:bg-[#0090B5] text-white"
            disabled={loading}
          >
            Check Tables
          </Button>
        </div>

        <div className="mt-6 text-center">
          <a href="/" className="text-[#00A6CE] hover:underline">← Back to Homepage</a>
        </div>
      </div>
    </div>
  );
}
