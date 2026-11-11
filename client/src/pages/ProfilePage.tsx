import React, { useState } from 'react';
import { useAuth } from '@/features/auth/useAuth';
import { EditProfileForm } from '@/features/profile/components/EditProfileForm';
import { SavedPassengersManager } from '@/features/profile/components/SavedPassengersManager';
import { ChangePasswordForm } from '@/features/profile/components/ChangePasswordForm';
import { User, Shield, Users, Lock } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'details' | 'passengers' | 'security'>('details');

  return (
    <div className="container max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Header Profile Badge */}
      <div className="p-6 rounded-3xl glass-panel shadow-sm flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-sky-500 to-blue-600 flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-sky-500/25 shrink-0">
            {user?.firstName?.[0]}{user?.lastName?.[0]}
          </div>
          <div>
            <h1 className="text-2xl font-bold font-['Plus_Jakarta_Sans']">
              {user?.firstName} {user?.lastName}
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              <span>{user?.email}</span>
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 p-1 rounded-2xl bg-muted/60 text-xs font-bold">
          <button
            onClick={() => setActiveTab('details')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              activeTab === 'details' ? 'bg-card text-foreground shadow-xs' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Personal Info
          </button>
          <button
            onClick={() => setActiveTab('passengers')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              activeTab === 'passengers' ? 'bg-card text-foreground shadow-xs' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Frequent Travelers
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              activeTab === 'security' ? 'bg-card text-foreground shadow-xs' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Security
          </button>
        </div>
      </div>

      {/* Tab Panels */}
      <div>
        {activeTab === 'details' && <EditProfileForm />}
        {activeTab === 'passengers' && <SavedPassengersManager />}
        {activeTab === 'security' && <ChangePasswordForm />}
      </div>
    </div>
  );
};
