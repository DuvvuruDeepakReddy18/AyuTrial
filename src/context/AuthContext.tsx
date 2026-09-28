'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { UserProfile, UserRole } from '@/types';
import { ctmsStore } from '@/lib/store';
import { checkPermission, RolePermissions } from '@/lib/auth';

interface AuthContextType {
  user: UserProfile;
  role: UserRole;
  isDemoMode: boolean;
  switchRole: (role: UserRole) => void;
  setUser: (user: UserProfile) => void;
  hasPermission: (permission: keyof RolePermissions) => boolean;
  resetDemoData: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<UserProfile>(ctmsStore.getState().currentUser);
  const [isDemoMode] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = ctmsStore.subscribe(() => {
      const state = ctmsStore.getState();
      setUserState(state.currentUser);
    });
    return () => unsubscribe();
  }, []);

  const switchRole = (role: UserRole) => {
    ctmsStore.setCurrentUserByRole(role);
  };

  const setUser = (newUser: UserProfile) => {
    ctmsStore.setCurrentUser(newUser);
  };

  const hasPermission = (permission: keyof RolePermissions) => {
    return checkPermission(user, permission);
  };

  const resetDemoData = () => {
    ctmsStore.resetToDefaultDemo();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user.role,
        isDemoMode,
        switchRole,
        setUser,
        hasPermission,
        resetDemoData
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
