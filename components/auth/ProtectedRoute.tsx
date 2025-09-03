'use client';

import React from 'react';
import { useAuth } from './AuthProvider';
import { UserRole, hasPermission, canAccessAdminPanel } from '@/lib/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SignInButton } from './SignInButton';
import { Shield, AlertCircle } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
  requiredPermission?: string;
  requireAdminAccess?: boolean;
  fallback?: React.ReactNode;
}

export function ProtectedRoute({
  children,
  requiredRole,
  requiredPermission,
  requireAdminAccess = false,
  fallback,
}: ProtectedRouteProps) {
  const { user, userProfile, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return fallback || (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <Shield className="h-6 w-6 text-blue-600" />
              Authentication Required
            </CardTitle>
            <CardDescription>
              Please sign in to access this area
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <SignInButton />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <AlertCircle className="h-6 w-6 text-yellow-600" />
              Profile Loading
            </CardTitle>
            <CardDescription>
              Setting up your user profile...
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  // Check admin access requirement
  if (requireAdminAccess && !canAccessAdminPanel(userProfile.role)) {
    return fallback || (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <AlertCircle className="h-6 w-6 text-red-600" />
              Access Denied
            </CardTitle>
            <CardDescription>
              You don't have permission to access this area.
              Contact an administrator for access.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  // Check specific role requirement
  if (requiredRole && userProfile.role !== requiredRole) {
    return fallback || (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <AlertCircle className="h-6 w-6 text-red-600" />
              Insufficient Permissions
            </CardTitle>
            <CardDescription>
              This area requires {requiredRole} role access.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  // Check specific permission requirement
  if (requiredPermission && !hasPermission(userProfile.role, requiredPermission)) {
    return fallback || (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <AlertCircle className="h-6 w-6 text-red-600" />
              Permission Required
            </CardTitle>
            <CardDescription>
              You need the '{requiredPermission}' permission to access this feature.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}