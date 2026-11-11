import React from 'react';

export const FlightResultsSkeleton: React.FC = () => {
  return (
    <div className="space-y-4">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="rounded-2xl border border-border/80 bg-card/60 p-5 backdrop-blur-md space-y-4 animate-pulse"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-border/40">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-muted" />
              <div className="space-y-1.5">
                <div className="h-4 w-32 bg-muted rounded-md" />
                <div className="h-3 w-20 bg-muted/70 rounded-md" />
              </div>
            </div>
            <div className="h-7 w-24 bg-muted rounded-md" />
          </div>

          {/* Route Line */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            <div className="md:col-span-9 flex items-center justify-between gap-4">
              <div className="space-y-1 w-24">
                <div className="h-6 w-16 bg-muted rounded-md" />
                <div className="h-4 w-10 bg-muted rounded-md" />
              </div>

              <div className="flex-1 px-4 space-y-2 flex flex-col items-center">
                <div className="h-3 w-16 bg-muted rounded-md" />
                <div className="w-full h-1 bg-muted/60 rounded-full" />
                <div className="h-3 w-12 bg-muted rounded-md" />
              </div>

              <div className="space-y-1 w-24 text-right">
                <div className="h-6 w-16 bg-muted rounded-md ml-auto" />
                <div className="h-4 w-10 bg-muted rounded-md ml-auto" />
              </div>
            </div>

            <div className="md:col-span-3 flex md:flex-col justify-end gap-2">
              <div className="h-9 w-28 bg-muted rounded-xl" />
              <div className="h-9 w-28 bg-muted rounded-xl" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
