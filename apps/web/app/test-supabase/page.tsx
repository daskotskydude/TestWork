'use client';

import { useEffect, useState } from 'react';
import { useSupabase } from '@/../../packages/lib/useSupabase';

export default function TestSupabasePage() {
  const supabase = useSupabase();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function testConnection() {
      try {
        // Test 1: Fetch profiles
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('*');
        
        if (profilesError) throw profilesError;

        // Test 2: Fetch RFQs
        const { data: rfqs, error: rfqsError } = await supabase
          .from('rfqs')
          .select('*');
        
        if (rfqsError) throw rfqsError;

        // Test 3: Fetch products
        const { data: products, error: productsError } = await supabase
          .from('products')
          .select('*');
        
        if (productsError) throw productsError;

        setData({
          profiles,
          rfqs,
          products
        });
        setLoading(false);
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
      }
    }

    testConnection();
  }, [supabase]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Testing Supabase connection...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-lg">
          <h2 className="text-red-800 font-bold text-xl mb-2">Connection Error</h2>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-green-600 mb-2">
            ✅ Supabase Connection Successful!
          </h1>
          <p className="text-gray-600">
            Your database is properly configured and accessible.
          </p>
        </div>

        {/* Profiles */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-bold mb-4 text-gray-800">
            👥 Profiles ({data?.profiles?.length || 0})
          </h2>
          <div className="space-y-3">
            {data?.profiles?.map((profile: any) => (
              <div key={profile.id} className="border border-gray-200 rounded p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className={`inline-block px-2 py-1 rounded text-xs font-medium mr-2 ${
                      profile.role === 'buyer' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {profile.role}
                    </span>
                    <span className="font-semibold">{profile.org_name}</span>
                  </div>
                  <span className="text-sm text-gray-500">{profile.email}</span>
                </div>
                {profile.description && (
                  <p className="text-sm text-gray-600 mt-2">{profile.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* RFQs */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-bold mb-4 text-gray-800">
            📋 RFQs ({data?.rfqs?.length || 0})
          </h2>
          <div className="space-y-3">
            {data?.rfqs?.map((rfq: any) => (
              <div key={rfq.id} className="border border-gray-200 rounded p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{rfq.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{rfq.description}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                        {rfq.category}
                      </span>
                      <span className="text-xs text-gray-500">
                        Budget: ${rfq.budget_min} - ${rfq.budget_max}
                      </span>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    rfq.status === 'open' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {rfq.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Products */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4 text-gray-800">
            🛒 Products ({data?.products?.length || 0})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data?.products?.map((product: any) => (
              <div key={product.id} className="border border-gray-200 rounded p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">{product.name}</h3>
                  <span className="text-lg font-bold text-green-600">
                    ${product.price}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mb-2">{product.sku}</p>
                <p className="text-sm text-gray-600 mb-3">{product.description}</p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span className="bg-gray-100 px-2 py-1 rounded">{product.category}</span>
                  <span>Stock: {product.stock} {product.unit}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Raw Data (for debugging) */}
        <details className="mt-6 bg-gray-900 text-gray-100 rounded-lg p-4">
          <summary className="cursor-pointer font-mono text-sm">
            View Raw JSON Data
          </summary>
          <pre className="mt-4 text-xs overflow-auto">
            {JSON.stringify(data, null, 2)}
          </pre>
        </details>
      </div>
    </div>
  );
}
