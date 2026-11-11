import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useSearchParams } from 'react-router-dom';
import { loginFormSchema, LoginFormValues } from '../auth.schemas';
import { useAuth } from '../useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Lock, Mail, ArrowRight, UserCheck, Shield } from 'lucide-react';
import { ForgotPasswordModal } from './ForgotPasswordModal';

export const LoginForm: React.FC = () => {
  const [searchParams] = useSearchParams();
  const redirectParam = searchParams.get('redirect');
  const { login, isLoggingIn } = useAuth();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      setErrorMessage(null);
      await login(data);
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || 'Invalid email or password. Please try again.');
    }
  };

  const handleQuickLogin = (email: string, pass: string) => {
    setValue('email', email);
    setValue('password', pass);
    onSubmit({ email, password: pass });
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-2xl border-white/20 dark:border-white/10 glass-panel">
      <CardHeader className="space-y-2 text-center pb-6">
        <CardTitle className="text-2xl font-bold tracking-tight">Welcome Back</CardTitle>
        <CardDescription className="text-sm">
          {redirectParam
            ? 'Sign in to continue with your selected flight booking'
            : 'Access your itineraries, passenger profiles, and live tickets'}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-5">
        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-start gap-2.5">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5" />
              Email Address
            </label>
            <Input
              type="email"
              placeholder="name@example.com"
              {...register('email')}
              className={errors.email ? 'border-destructive' : ''}
              autoComplete="email"
            />
            {errors.email && (
              <p className="text-xs text-destructive mt-1">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5" />
                Password
              </label>
              <button
                type="button"
                onClick={() => setIsForgotModalOpen(true)}
                className="text-xs text-sky-500 hover:text-sky-600 transition-colors font-medium"
              >
                Forgot password?
              </button>
            </div>
            <Input
              type="password"
              placeholder="••••••••"
              {...register('password')}
              className={errors.password ? 'border-destructive' : ''}
              autoComplete="current-password"
            />
            {errors.password && (
              <p className="text-xs text-destructive mt-1">{errors.password.message}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full mt-2 h-11 text-base font-semibold group"
            disabled={isLoggingIn}
          >
            {isLoggingIn ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Authenticating...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                Sign In to SkyBook
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            )}
          </Button>
        </form>

        {/* Quick Demo Traveler Login */}
        <div className="pt-4 border-t border-border/40">
          <p className="text-xs text-center font-medium text-muted-foreground mb-2.5 uppercase tracking-wider">
            Quick Demo Traveler Access
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => handleQuickLogin('alex@skybook.com', 'Password@123')}
            className="w-full text-xs flex items-center justify-center gap-1.5 border-dashed hover:border-sky-500 hover:text-sky-500"
          >
            <UserCheck className="w-3.5 h-3.5 text-sky-500" />
            Sign in as Demo Traveler (Tushar Sharma)
          </Button>
        </div>
      </CardContent>

      <CardFooter className="justify-center border-t border-border/40 py-4 text-sm text-muted-foreground">
        <span>Don't have an account?</span>
        <Link
          to={`/register${redirectParam ? `?redirect=${encodeURIComponent(redirectParam)}` : ''}`}
          className="ml-1.5 font-semibold text-sky-500 hover:text-sky-600 transition-colors"
        >
          Create account
        </Link>
      </CardFooter>

      <ForgotPasswordModal
        isOpen={isForgotModalOpen}
        onClose={() => setIsForgotModalOpen(false)}
      />
    </Card>
  );
};
