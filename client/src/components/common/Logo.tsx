import React from 'react';
import { Link } from 'react-router-dom';
import { Plane } from 'lucide-react';

interface LogoProps {
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ className = '' }) => {
  return (
    <Link to="/" className={`flex items-center gap-2.5 group ${className}`}>
      <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-md shadow-primary/25 group-hover:scale-105 transition-all duration-300">
        <Plane className="w-5 h-5 transform -rotate-45 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
      </div>
      <div className="flex flex-col">
        <span className="font-extrabold text-xl tracking-tight text-foreground flex items-center font-['Plus_Jakarta_Sans']">
          Sky<span className="text-primary">Book</span>
        </span>
        <span className="text-[9px] tracking-widest uppercase font-bold text-muted-foreground -mt-1">
          Aviation First
        </span>
      </div>
    </Link>
  );
};
