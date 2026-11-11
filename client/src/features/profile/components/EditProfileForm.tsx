import React, { useState } from 'react';
import { useAuth } from '@/features/auth/useAuth';
import { useAuthStore } from '@/features/auth/auth.store';
import { profileApi } from '../profile.api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { User, Phone, Mail, CheckCircle2, AlertCircle } from 'lucide-react';

export const EditProfileForm: React.FC = () => {
  const { user } = useAuth();
  const { setUser } = useAuthStore();

  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      setError(null);
      setMessage(null);

      const updated = await profileApi.updateProfile({
        firstName,
        lastName,
        phone,
      });

      setUser(updated);
      setMessage('Profile details updated successfully');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 rounded-3xl glass-panel shadow-sm space-y-5 border border-border/70">
      <div className="flex items-center gap-2 pb-3 border-b border-border/40">
        <User className="w-5 h-5 text-sky-500" />
        <h3 className="font-bold text-base">Personal Information</h3>
      </div>

      {message && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {error && (
        <div className="p-3.5 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            First Name
          </label>
          <Input
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Last Name
          </label>
          <Input
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Account Email (Fixed)
          </label>
          <Input
            value={user?.email || ''}
            disabled
            className="bg-muted cursor-not-allowed text-muted-foreground"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Phone Number
          </label>
          <Input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+1 555-0199"
          />
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <Button
          type="submit"
          disabled={isSaving}
          className="rounded-xl px-6 font-semibold"
        >
          {isSaving ? 'Saving Changes...' : 'Save Changes'}
        </Button>
      </div>
    </form>
  );
};
