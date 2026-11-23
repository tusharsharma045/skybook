import React from 'react';
import { Link } from 'react-router-dom';
import { Plane } from 'lucide-react';

interface LogoProps {
  className?: string;
  forceLightMode?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = '', forceLightMode = false }) => {
  return (
    <Link to="/" className={`flex items-center gap-2.5 group ${className}`}>
      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-md shadow-primary/25 group-hover:scale-105 transition-all duration-300">
        <Plane className="w-4 h-4 sm:w-5 sm:h-5 transform -rotate-45 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
      </div>
      <div className="flex flex-col">
        <span className={`font-extrabold text-lg sm:text-xl tracking-tight flex items-center font-['Plus_Jakarta_Sans'] leading-none ${forceLightMode ? 'text-white' : 'text-foreground'}`}>
          Sky<span className={forceLightMode ? 'text-sky-400' : 'text-primary'}>Book</span>
        </span>
        <span className={`text-[8px] sm:text-[9px] tracking-wider uppercase font-extrabold mt-0.5 ${forceLightMode ? 'text-slate-400' : 'text-muted-foreground'}`}>
          FLY MORE. PAY LESS.
        </span>
      </div>
    </Link>
  );
};
