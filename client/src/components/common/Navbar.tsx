import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Logo } from './Logo';
import { ThemeToggle } from './ThemeToggle';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/features/auth/useAuth';
import {
  Compass,
  Ticket,
  User,
  LogOut,
  ChevronDown,
  PlaneTakeoff,
  Sparkles,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const { user, isAuthenticated, logout, isLoggingOut } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const getInitials = (firstName?: string, lastName?: string) => {
    if (!firstName && !lastName) return 'U';
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 glass-nav transition-colors duration-200">
      <div className="container max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo />

        <nav className="hidden md:flex items-center gap-7 text-sm font-semibold">
          <Link
            to="/"
            className={`transition-colors hover:text-primary flex items-center gap-1.5 ${
              location.pathname === '/' ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            <Compass className="w-4 h-4" />
            Explore Flights
          </Link>
          <Link
            to="/bookings"
            className={`transition-colors hover:text-primary flex items-center gap-1.5 ${
              location.pathname.startsWith('/bookings') ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            <Ticket className="w-4 h-4" />
            My Bookings
          </Link>
          <a
            href="#offers"
            className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            Special Deals
          </a>
        </nav>

        <div className="flex items-center gap-3">
          {/* Indian Currency Pill */}
          <div className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-full bg-muted/60 text-xs font-bold text-foreground border border-border/50">
            <span>🇮🇳</span>
            <span>INR (₹)</span>
          </div>

          <ThemeToggle />

          {isAuthenticated && user ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2.5 p-1.5 rounded-full hover:bg-accent/80 transition-colors focus:outline-none"
                aria-expanded={dropdownOpen}
              >
                <div className="w-8 h-8 rounded-full bg-primary text-white font-bold text-xs flex items-center justify-center shadow-sm">
                  {getInitials(user.firstName, user.lastName)}
                </div>
                <div className="hidden sm:flex flex-col text-left">
                  <span className="text-xs font-bold leading-none">{user.firstName} {user.lastName}</span>
                  <span className="text-[10px] text-muted-foreground">{user.email}</span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
              </button>

              {dropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-card border border-border shadow-xl p-1.5 z-50 text-sm animate-in fade-in zoom-in-95">
                    <div className="px-3 py-2 border-b border-border/50 mb-1">
                      <p className="font-semibold text-xs truncate">{user.firstName} {user.lastName}</p>
                      <p className="text-[11px] text-muted-foreground truncate">{user.email}</p>
                    </div>

                    <Link
                      to="/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                    >
                      <User className="w-4 h-4 text-primary" />
                      Traveler Profile
                    </Link>

                    <Link
                      to="/bookings"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                    >
                      <PlaneTakeoff className="w-4 h-4 text-primary" />
                      My Bookings & Tickets
                    </Link>

                    <div className="my-1 border-t border-border/50" />

                    <button
                      onClick={async () => {
                        setDropdownOpen(false);
                        await logout();
                      }}
                      disabled={isLoggingOut}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-destructive hover:bg-destructive/10 transition-colors text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm" className="hidden sm:inline-flex text-muted-foreground hover:text-foreground font-semibold">
                  Sign In
                </Button>
              </Link>

              <Link to="/register">
                <Button size="sm" className="rounded-xl px-4 font-bold shadow-md">
                  Book Now
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
