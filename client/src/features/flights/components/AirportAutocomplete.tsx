import React, { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { flightsApi } from '../flights.api';
import { Airport } from '../flights.types';
import { Plane, Search, MapPin, X } from 'lucide-react';

interface AirportAutocompleteProps {
  label?: string;
  placeholder?: string;
  value: string; // IATA code
  selectedAirport?: Airport | null;
  onSelect: (airport: Airport) => void;
  icon?: React.ReactNode;
  className?: string;
}

export const AirportAutocomplete: React.FC<AirportAutocompleteProps> = ({
  label,
  placeholder = 'Select airport or city',
  value,
  selectedAirport,
  onSelect,
  icon,
  className = '',
}) => {
  const [query, setQuery] = useState(
    selectedAirport ? `${selectedAirport.city} (${selectedAirport.iataCode})` : value || ''
  );
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedAirport) {
      setQuery(`${selectedAirport.city} (${selectedAirport.iataCode})`);
    } else if (!value) {
      setQuery('');
    }
  }, [selectedAirport, value]);

  const { data: airports = [], isFetching } = useQuery({
    queryKey: ['airports', query],
    queryFn: () => flightsApi.searchAirports(query),
    enabled: isOpen,
    staleTime: 1000 * 60 * 10,
  });

  // Close dropdown when clicked outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (airport: Airport) => {
    setQuery(`${airport.city} (${airport.iataCode})`);
    onSelect(airport);
    setIsOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setQuery('');
    setIsOpen(true);
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {label && (
        <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
          {label}
        </label>
      )}

      <div className="relative flex items-center">
        <div className="absolute left-3.5 text-primary pointer-events-none">
          {icon || <Plane className="w-4 h-4 text-primary" />}
        </div>

        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="w-full h-12 pl-10 pr-9 rounded-xl border border-input bg-card text-sm font-semibold text-foreground placeholder:text-muted-foreground/70 placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary transition-all shadow-xs"
        />

        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 text-muted-foreground hover:text-foreground p-0.5 rounded-full hover:bg-muted"
            title="Clear selection"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Autocomplete Dropdown List */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-2 rounded-2xl bg-card border border-border shadow-2xl z-50 max-h-72 overflow-y-auto p-1.5 animate-in fade-in slide-in-from-top-2">
          {isFetching ? (
            <div className="py-4 text-center text-xs text-muted-foreground flex items-center justify-center gap-2">
              <span className="w-3 h-3 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
              Searching airports...
            </div>
          ) : airports.length > 0 ? (
            airports.map((airport) => (
              <button
                key={airport.iataCode}
                type="button"
                onClick={() => handleSelect(airport)}
                className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-primary/10 hover:text-primary transition-colors text-left group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground group-hover:bg-primary group-hover:text-white transition-colors">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-sm leading-tight text-foreground group-hover:text-primary">
                      {airport.city}, {airport.country}
                    </div>
                    <div className="text-[11px] text-muted-foreground truncate max-w-[210px]">
                      {airport.name}
                    </div>
                  </div>
                </div>

                <span className="px-2 py-0.5 rounded-md bg-muted text-xs font-mono font-bold text-foreground group-hover:bg-primary/20 group-hover:text-primary">
                  {airport.iataCode}
                </span>
              </button>
            ))
          ) : (
            <div className="py-4 text-center text-xs text-muted-foreground">
              No matching airports found for "{query}"
            </div>
          )}
        </div>
      )}
    </div>
  );
};
