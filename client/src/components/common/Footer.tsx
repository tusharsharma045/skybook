import React from 'react';
import { Logo } from './Logo';
import { Shield, Sparkles, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-border/40 bg-card/40 backdrop-blur-md">
      <div className="container max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4 md:col-span-1">
            <Logo />
            <p className="text-sm text-muted-foreground leading-relaxed">
              Precision engineered global flight booking engine with live airline inventory and frictionless checkout.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground mb-4">
              Explore
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-sky-500 transition-colors">Popular Flight Routes</a></li>
              <li><a href="#" className="hover:text-sky-500 transition-colors">Airlines Directory</a></li>
              <li><a href="#" className="hover:text-sky-500 transition-colors">Low Fare Calendar</a></li>
              <li><a href="#" className="hover:text-sky-500 transition-colors">Airport Guides</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground mb-4">
              Support
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-sky-500 transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-sky-500 transition-colors">Baggage Guidelines</a></li>
              <li><a href="#" className="hover:text-sky-500 transition-colors">Cancellation Policies</a></li>
              <li><a href="#" className="hover:text-sky-500 transition-colors">Contact Support</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground mb-4">
              Trust & Security
            </h4>
            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-500" />
                <span>256-bit Bank Grade Encryption</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-sky-500" />
                <span>Verified Real-time Duffel GDS</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between text-xs text-muted-foreground gap-4">
          <p>© {new Date().getFullYear()} SkyBook Aviation Technologies. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Engineered with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for modern travelers
          </p>
        </div>
      </div>
    </footer>
  );
};
