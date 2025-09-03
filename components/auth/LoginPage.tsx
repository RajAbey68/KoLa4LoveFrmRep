'use client';

import { useState } from 'react';
import { MockGoogleLogin } from './MockGoogleLogin';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
// Auth disabled for production pages - login redirects to /admin
// import { useAuth } from './AuthProvider';
import { useLocation } from 'wouter';

export function LoginPage() {
  const [error, setError] = useState<string>('');
  // Auth disabled for production pages - redirect to admin
  const user = null;
  const [, setLocation] = useLocation();

  const handleLoginSuccess = (user: any) => {
    // Clear any URL parameters and redirect cleanly
    window.history.replaceState({}, '', '/admin');
    setLocation('/admin');
  };

  const handleLoginError = (error: Error) => {
    setError('Login failed. Please try again.');
    console.error('Login error:', error);
  };

  // If already logged in, redirect to admin
  if (user) {
    setLocation('/admin');
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-green-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Ko Lake Villa</CardTitle>
          <CardDescription>
            Admin Access - Sign in with your Google account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <MockGoogleLogin
            onSuccess={handleLoginSuccess}
            onError={handleLoginError}
            className="w-full"
          />
          
          <div className="text-center text-sm text-gray-600">
            <p>Ko Lake Villa Team Access</p>
            <p className="text-xs mt-1 text-blue-600">
              Authorized for contact.Kolac@gmail.com and RajAbey68@gmail.com
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}