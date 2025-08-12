import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CheckCircle, XCircle, Database, Table, Shield } from 'lucide-react';

interface DatabaseStatus {
  connected: boolean;
  tables: string[];
  error?: string;
}

interface TableInfo {
  name: string;
  exists: boolean;
  rowCount?: number;
}

export const DatabaseTest: React.FC = () => {
  const [status, setStatus] = useState<DatabaseStatus>({ connected: false, tables: [] });
  const [tableInfo, setTableInfo] = useState<TableInfo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [testResults, setTestResults] = useState<{ [key: string]: boolean }>({});

  // Test database connection
  const testConnection = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.from('tpco_main').select('*').limit(1);
      
      if (error) {
        setStatus({ connected: false, tables: [], error: error.message });
      } else {
        setStatus({ connected: true, tables: [] });
      }
    } catch (err) {
      setStatus({ connected: false, tables: [], error: err instanceof Error ? err.message : 'Unknown error' });
    } finally {
      setIsLoading(false);
    }
  };

  // Get database schema information
  const getSchemaInfo = async () => {
    setIsLoading(true);
    try {
      // Test various tables from your migration
      const tables = [
        'user_roles', 'news_articles', 'services', 'technologies', 
        'partners', 'team_members', 'portfolio_items', 'resources', 
        'impact_stats', 'milestones', 'site_settings'
      ];

      const tableResults: TableInfo[] = [];

      for (const tableName of tables) {
        try {
          const { data, error } = await supabase
            .from(tableName)
            .select('*')
            .limit(1);

          if (error) {
            tableResults.push({ name: tableName, exists: false });
          } else {
            // Try to get row count
            const { count } = await supabase
              .from(tableName)
              .select('*', { count: 'exact', head: true });
            
            tableResults.push({ 
              name: tableName, 
              exists: true, 
              rowCount: count || 0 
            });
          }
        } catch {
          tableResults.push({ name: tableName, exists: false });
        }
      }

      setTableInfo(tableResults);
    } catch (err) {
      console.error('Error getting schema info:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Test basic CRUD operations
  const testCRUDOperations = async () => {
    setIsLoading(true);
    const results: { [key: string]: boolean } = {};

    try {
      // Test INSERT
      const { data: insertData, error: insertError } = await supabase
        .from('site_settings')
        .insert([
          { key: 'test_key', value: { test: 'value' } }
        ])
        .select();

      results.insert = !insertError;

      if (insertData && insertData.length > 0) {
        const testId = insertData[0].key;

        // Test SELECT
        const { data: selectData, error: selectError } = await supabase
          .from('site_settings')
          .select('*')
          .eq('key', testId);

        results.select = !selectError && selectData && selectData.length > 0;

        // Test UPDATE
        const { error: updateError } = await supabase
          .from('site_settings')
          .update({ value: { test: 'updated_value' } })
          .eq('key', testId);

        results.update = !updateError;

        // Test DELETE
        const { error: deleteError } = await supabase
          .from('site_settings')
          .delete()
          .eq('key', testId);

        results.delete = !deleteError;
      }
    } catch (err) {
      results.error = false;
    }

    setTestResults(results);
    setIsLoading(false);
  };

  useEffect(() => {
    testConnection();
  }, []);

  return (
    <div className="space-y-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Supabase Database Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Connection Status */}
          <div className="flex items-center gap-2">
            <Badge variant={status.connected ? "default" : "destructive"}>
              {status.connected ? "Connected" : "Disconnected"}
            </Badge>
            {status.error && (
              <span className="text-sm text-red-600">{status.error}</span>
            )}
          </div>

          {/* Test Buttons */}
          <div className="flex gap-2">
            <Button 
              onClick={testConnection} 
              disabled={isLoading}
              variant="outline"
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Test Connection"}
            </Button>
            <Button 
              onClick={getSchemaInfo} 
              disabled={isLoading}
              variant="outline"
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Check Schema"}
            </Button>
            <Button 
              onClick={testCRUDOperations} 
              disabled={isLoading}
              variant="outline"
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Test CRUD"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Schema Information */}
      {tableInfo.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Table className="h-5 w-5" />
              Database Schema
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tableInfo.map((table) => (
                <div key={table.name} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">{table.name}</div>
                    {table.exists && (
                      <div className="text-sm text-gray-500">
                        {table.rowCount} rows
                      </div>
                    )}
                  </div>
                  {table.exists ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* CRUD Test Results */}
      {Object.keys(testResults).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              CRUD Operations Test
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(testResults).map(([operation, success]) => (
                <div key={operation} className="text-center">
                  <div className="text-sm font-medium capitalize">{operation}</div>
                  {success ? (
                    <CheckCircle className="h-5 w-5 text-green-500 mx-auto mt-1" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500 mx-auto mt-1" />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Configuration Info */}
      <Card>
        <CardHeader>
          <CardTitle>Configuration Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div>
            <strong>Project ID:</strong> zgtkndradfrykyiaqwro
          </div>
          <div>
            <strong>URL:</strong> https://zgtkndradfrykyiaqwro.supabase.co
          </div>
          <div>
            <strong>Database:</strong> PostgreSQL
          </div>
          <div>
            <strong>RLS:</strong> Enabled
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      {!status.connected && (
        <Alert>
          <AlertDescription>
            <strong>Database Connection Issue Detected</strong>
            <br />
            • Check if your Supabase project is active
            <br />
            • Verify the API keys are correct
            <br />
            • Ensure your IP is not blocked
            <br />
            • Check Supabase dashboard for any service issues
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};
