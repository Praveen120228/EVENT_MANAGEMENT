'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

interface TableInfo {
  column_name: string;
  data_type: string;
  is_nullable: string;
  column_default: string | null;
  character_maximum_length: number | null;
}

interface PolicyInfo {
  schemaname: string;
  tablename: string;
  policyname: string;
  permissive: string;
  roles: string[];
  cmd: string;
  qual: string;
  with_check: string | null;
}

export default function DBAnalyzer() {
  const [tableInfo, setTableInfo] = useState<TableInfo[]>([]);
  const [policies, setPolicies] = useState<PolicyInfo[]>([]);
  const [sampleData, setSampleData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClientComponentClient();

  useEffect(() => {
    async function analyzeDatabase() {
      try {
        // Get guests table structure
        const { data: tableData, error: tableError } = await supabase.rpc('exec_sql', {
          sql: `
            SELECT 
              column_name,
              data_type,
              is_nullable,
              column_default,
              character_maximum_length
            FROM information_schema.columns
            WHERE table_name = 'guests'
            ORDER BY ordinal_position;
          `
        });

        if (tableError) {
          throw new Error(`Table structure error: ${tableError.message}`);
        }

        setTableInfo(tableData);

        // Get RLS policies
        const { data: policyData, error: policyError } = await supabase.rpc('exec_sql', {
          sql: `
            SELECT
              schemaname,
              tablename,
              policyname,
              permissive,
              roles,
              cmd,
              qual,
              with_check
            FROM pg_policies
            WHERE tablename = 'guests';
          `
        });

        if (policyError) {
          throw new Error(`Policy error: ${policyError.message}`);
        }

        setPolicies(policyData);

        // Get sample guest data
        const { data: sampleData, error: sampleError } = await supabase
          .from('guests')
          .select('*')
          .limit(5);

        if (sampleError) {
          throw new Error(`Sample data error: ${sampleError.message}`);
        }

        setSampleData(sampleData);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
        setLoading(false);
      }
    }

    analyzeDatabase();
  }, []);

  if (loading) {
    return <div>Loading database analysis...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Database Analysis</h1>
      
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Guests Table Structure</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border">
            <thead>
              <tr>
                <th className="px-4 py-2 border">Column Name</th>
                <th className="px-4 py-2 border">Data Type</th>
                <th className="px-4 py-2 border">Nullable</th>
                <th className="px-4 py-2 border">Default</th>
                <th className="px-4 py-2 border">Max Length</th>
              </tr>
            </thead>
            <tbody>
              {tableInfo.map((column, index) => (
                <tr key={index}>
                  <td className="px-4 py-2 border">{column.column_name}</td>
                  <td className="px-4 py-2 border">{column.data_type}</td>
                  <td className="px-4 py-2 border">{column.is_nullable}</td>
                  <td className="px-4 py-2 border">{column.column_default}</td>
                  <td className="px-4 py-2 border">{column.character_maximum_length}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">RLS Policies</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border">
            <thead>
              <tr>
                <th className="px-4 py-2 border">Policy Name</th>
                <th className="px-4 py-2 border">Permissive</th>
                <th className="px-4 py-2 border">Roles</th>
                <th className="px-4 py-2 border">Command</th>
                <th className="px-4 py-2 border">Qualification</th>
              </tr>
            </thead>
            <tbody>
              {policies.map((policy, index) => (
                <tr key={index}>
                  <td className="px-4 py-2 border">{policy.policyname}</td>
                  <td className="px-4 py-2 border">{policy.permissive}</td>
                  <td className="px-4 py-2 border">{policy.roles.join(', ')}</td>
                  <td className="px-4 py-2 border">{policy.cmd}</td>
                  <td className="px-4 py-2 border">{policy.qual}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">Sample Guest Data</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border">
            <thead>
              <tr>
                {sampleData[0] && Object.keys(sampleData[0]).map((key) => (
                  <th key={key} className="px-4 py-2 border">{key}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sampleData.map((guest, index) => (
                <tr key={index}>
                  {Object.values(guest).map((value, i) => (
                    <td key={i} className="px-4 py-2 border">{String(value)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
} 