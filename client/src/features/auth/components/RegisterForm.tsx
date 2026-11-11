import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useSearchParams } from 'react-router-dom';
import { registerFormSchema, RegisterFormValues } from '../auth.schemas';
import { useAuth } from '../useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Lock, Mail, User, Phone, ArrowRight } from 'lucide-react';

export const RegisterForm: React.FC = () => {
  const [searchParams] = useSearchParams();
  const redirectParam = searchParams.get('redirect');
  const { register: registerUser, isRegistering } = useAuth();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      setErrorMessage(null);
      await registerUser(data);
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || 'Registration failed. Please check your details.');
    }
  };

  return (
    <Card className="w-full max-w-lg mx-auto shadow-2xl border-white/20 dark:border-white/10 glass-panel">
      <CardHeader className="space-y-2 text-center pb-6">
        <CardTitle className="text-2xl font-bold tracking-tight">Create your SkyBook Account</CardTitle>
        <CardDescription className="text-sm">
          Join thousands of travelers enjoying direct GDS fares, instant checkouts, and priority booking
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" />
                First Name
              </label>
              <Input
                placeholder="Alex"
                {...register('firstName')}
                className={errors.firstName ? 'border-destructive' : ''}
              />
              {errors.firstName && (
                <p className="text-xs text-destructive">{errors.firstName.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" />
                Last Name
              </label>
              <Input
                placeholder="Morgan"
                {...register('lastName')}
                className={errors.lastName ? 'border-destructive' : ''}
              />
              {errors.lastName && (
                <p className="text-xs text-destructive">{errors.lastName.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5" />
              Email Address
            </label>
            <Input
              type="email"
              placeholder="alex@skybook.com"
              {...register('email')}
              className={errors.email ? 'border-destructive' : ''}
            />
            {errors.email && (
              <p className="text-xs text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5" />
              Phone Number (Optional)
            </label>
            <Input
              type="tel"
              placeholder="+1 555-0199"
              {...register('phone')}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5" />
                Password
              </label>
              <Input
                type="password"
                placeholder="••••••••"
                {...register('password')}
                className={errors.password ? 'border-destructive' : ''}
              />
              {errors.password && (
                <p className="text-xs text-destructive">{errors.password.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5" />
                Confirm Password
              </label>
              <Input
                type="password"
                placeholder="••••••••"
                {...register('confirmPassword')}
                className={errors.confirmPassword ? 'border-destructive' : ''}
              />
              {errors.confirmPassword && (
                <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>
              )}
            </div>
          </div>

          <Button
            type="submit"
            className="w-full mt-3 h-11 text-base font-semibold group"
            disabled={isRegistering}
          >
            {isRegistering ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Creating SkyBook Account...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                Create Account & Continue
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            )}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="justify-center border-t border-border/40 py-4 text-sm text-muted-foreground">
        <span>Already have an account?</span>
        <Link
          to={`/login${redirectParam ? `?redirect=${encodeURIComponent(redirectParam)}` : ''}`}
          className="ml-1.5 font-semibold text-sky-500 hover:text-sky-600 transition-colors"
        >
          Sign in
        </Link>
      </CardFooter>
    </Card>
  );
};
