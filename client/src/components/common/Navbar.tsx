import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Logo } from './Logo';
import { ThemeToggle } from './ThemeToggle';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/features/auth/useAuth';
import {
  Compass,
  Briefcase,
  User,
  LogOut,
  ChevronDown,
  PlaneTakeoff,
  Star,
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
    <header className="sticky top-0 z-50 w-full pt-3 sm:pt-4 px-3 sm:px-6 lg:px-8 pointer-events-none">
      <div className="container max-w-7xl mx-auto flex h-14 sm:h-16 items-center justify-between px-4 sm:px-6 lg:px-7 bg-white/90 dark:bg-[#0c1833]/90 backdrop-blur-md rounded-full border border-white/60 dark:border-white/10 shadow-lg shadow-sky-950/10 pointer-events-auto transition-colors duration-200">
        <Logo />

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-semibold">
          <Link
            to="/"
            className={`relative transition-colors flex items-center gap-1.5 py-1 ${
              location.pathname === '/'
                ? 'text-primary font-bold'
                : 'text-muted-foreground hover:text-primary'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Explore Flights</span>
            {location.pathname === '/' && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-primary rounded-full" />
            )}
          </Link>
          <Link
            to="/bookings"
            className={`transition-colors flex items-center gap-1.5 py-1 ${
              location.pathname.startsWith('/bookings')
                ? 'text-primary font-bold'
                : 'text-muted-foreground hover:text-primary'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>My Bookings</span>
          </Link>
          <a
            href="#offers"
            className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5 py-1"
          >
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
            <span>Special Deals</span>
          </a>
        </nav>

        {/* Right Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Indian Currency Pill */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100/80 dark:bg-muted/60 text-xs font-bold text-foreground border border-border/40 shadow-xs">
            <span>🇮🇳</span>
            <span>INR (₹)</span>
            <ChevronDown className="w-3 h-3 text-muted-foreground" />
          </div>

          <ThemeToggle />

          {isAuthenticated && user ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 sm:gap-2.5 p-1 sm:pr-2.5 rounded-full hover:bg-slate-100/60 dark:hover:bg-accent/60 transition-colors focus:outline-none"
                aria-expanded={dropdownOpen}
              >
                <div className="w-8 h-8 rounded-full bg-primary text-white font-bold text-xs flex items-center justify-center shadow-xs shrink-0">
                  {getInitials(user.firstName, user.lastName)}
                </div>
                <div className="hidden sm:flex flex-col text-left">
                  <span className="text-xs font-bold leading-tight text-foreground">
                    {user.firstName} {user.lastName}
                  </span>
                  <span className="text-[10px] text-muted-foreground leading-tight">
                    {user.email}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
              </button>

              {dropdownOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
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
                <Button variant="ghost" size="sm" className="hidden sm:inline-flex text-muted-foreground hover:text-foreground font-semibold rounded-full px-3">
                  Sign In
                </Button>
              </Link>
              <Link to="/register">
                <Button size="sm" className="rounded-full px-4 font-bold shadow-md">
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
