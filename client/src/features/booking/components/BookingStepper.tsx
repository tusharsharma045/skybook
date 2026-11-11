import React from 'react';
import { Users, FileText, CreditCard, CheckCircle2 } from 'lucide-react';

interface BookingStepperProps {
  currentStep: number;
}

export const BookingStepper: React.FC<BookingStepperProps> = ({ currentStep }) => {
  const steps = [
    { step: 1, label: 'Passengers', icon: Users },
    { step: 2, label: 'Review & Baggage', icon: FileText },
    { step: 3, label: 'Payment', icon: CreditCard },
    { step: 4, label: 'E-Ticket Confirmation', icon: CheckCircle2 },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto mb-8 px-2">
      <div className="flex items-center justify-between relative">
        {/* Connecting Progress Track Line */}
        <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-1 bg-muted -z-0">
          <div
            className="h-full bg-gradient-to-r from-sky-500 to-blue-600 transition-all duration-500"
            style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
          />
        </div>

        {steps.map((s) => {
          const Icon = s.icon;
          const isDone = currentStep > s.step;
          const isCurrent = currentStep === s.step;

          return (
            <div key={s.step} className="flex flex-col items-center relative z-10">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 shadow-md ${
                  isDone
                    ? 'bg-emerald-500 text-white shadow-emerald-500/25'
                    : isCurrent
                    ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white ring-4 ring-sky-500/20 shadow-sky-500/30 scale-110'
                    : 'bg-card border-2 border-border text-muted-foreground'
                }`}
              >
                {isDone ? <CheckCircle2 className="w-5 h-5" /> : <Icon className="w-4 h-4" />}
              </div>

              <span
                className={`mt-2 text-xs font-bold tracking-tight transition-colors hidden sm:block ${
                  isCurrent
                    ? 'text-foreground'
                    : isDone
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-muted-foreground'
                }`}
              >
                {s.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
