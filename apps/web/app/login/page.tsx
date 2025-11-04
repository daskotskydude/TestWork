'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { signIn, profile } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signIn(email, password);
      
      // Wait a moment for profile to load
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // The auth context will trigger a re-render with profile data
      // Redirect happens in useEffect below
    } catch (err: any) {
      setError(err.message || 'Failed to sign in');
      setLoading(false);
    }
  };

  // Redirect after successful login based on role
  useEffect(() => {
    if (profile) {
      if (profile.role === 'buyer') {
        router.push('/buyer/dashboard');
      } else if (profile.role === 'supplier') {
        router.push('/supplier/dashboard');
      } else {
        router.push('/');
      }
      router.refresh();
    }
  }, [profile, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-gray-600">Sign in to your ProcureLink account</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-red-800 font-medium">Sign in failed</p>
                  <p className="text-sm text-red-600 mt-1">{error}</p>
                </div>
              </div>
            )}

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                className="mt-1"
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Don't have an account?</span>
              </div>
            </div>
            
            <div className="mt-6 grid grid-cols-2 gap-3">
              <Link href="/buyer-register">
                <Button variant="outline" className="w-full">
                  Register as Buyer
                </Button>
              </Link>
              <Link href="/supplier-register">
                <Button variant="outline" className="w-full">
                  Register as Supplier
                </Button>
              </Link>
            </div>
          </div>

          {/* Test Accounts Helper */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500 mb-3 font-medium">Test Accounts:</p>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between bg-blue-50 p-2 rounded">
                <span className="text-blue-900">
                  <strong>Buyer:</strong> buyer@test.dev
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setEmail('buyer@test.dev');
                    setPassword('TestBuyer123!');
                  }}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Use
                </button>
              </div>
              <div className="flex items-center justify-between bg-green-50 p-2 rounded">
                <span className="text-green-900">
                  <strong>Supplier:</strong> supplier@test.dev
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setEmail('supplier@test.dev');
                    setPassword('TestSupplier123!');
                  }}
                  className="text-green-600 hover:text-green-700 font-medium"
                >
                  Use
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
