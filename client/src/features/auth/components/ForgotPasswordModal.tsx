import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { forgotPasswordFormSchema, ForgotPasswordFormValues } from '../auth.schemas';
import { authApi } from '../auth.api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, CheckCircle, AlertCircle, X, KeyRound } from 'lucide-react';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successInfo, setSuccessInfo] = useState<{ message: string; previewCode?: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Reset form states
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [resetCompleted, setResetCompleted] = useState(false);
  const [currentEmail, setCurrentEmail] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordFormSchema),
  });

  if (!isOpen) return null;

  const onSendResetCode = async (data: ForgotPasswordFormValues) => {
    try {
      setIsSubmitting(true);
      setError(null);
      setCurrentEmail(data.email);
      const res = await authApi.forgotPassword(data.email);
      setSuccessInfo(res);
      if (res.previewCode) {
        setCode(res.previewCode);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to request reset. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const onConfirmReset = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      setError(null);
      await authApi.resetPassword({
        email: currentEmail,
        code,
        newPassword,
      });
      setResetCompleted(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Password reset failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-md rounded-2xl bg-card border border-border p-6 shadow-2xl space-y-4">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-1">
          <h3 className="text-xl font-bold tracking-tight">Reset Password</h3>
          <p className="text-xs text-muted-foreground">
            Recover your SkyBook account access via security token
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-destructive/10 text-destructive text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {resetCompleted ? (
          <div className="text-center py-6 space-y-3">
            <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto" />
            <p className="text-sm font-semibold">Password Reset Complete</p>
            <p className="text-xs text-muted-foreground">
              You can now sign in to your SkyBook account with your new credentials.
            </p>
            <Button onClick={onClose} className="w-full mt-4">
              Back to Login
            </Button>
          </div>
        ) : !successInfo ? (
          <form onSubmit={handleSubmit(onSendResetCode)} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5" />
                Account Email
              </label>
              <Input
                type="email"
                placeholder="alex@skybook.com"
                {...register('email')}
              />
              {errors.email && (
                <p className="text-xs text-destructive">{errors.email.message}</p>
              )}
            </div>

            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? 'Sending Request...' : 'Send Reset Instructions'}
            </Button>
          </form>
        ) : (
          <form onSubmit={onConfirmReset} className="space-y-3">
            <div className="p-3 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-600 dark:text-sky-400 text-xs">
              Instructions sent. For development demo testing, verification code is auto-filled below.
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">Verification Code</label>
              <Input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="e.g. SKY-8492"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                <KeyRound className="w-3.5 h-3.5" />
                New Secure Password
              </label>
              <Input
                type="password"
                placeholder="Min 8 chars, 1 uppercase, 1 number"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>

            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? 'Updating...' : 'Set New Password'}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};
