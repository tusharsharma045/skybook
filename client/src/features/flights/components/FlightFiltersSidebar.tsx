import React from 'react';
import { FlightSearchFilters } from '../flights.types';
import { formatRupees } from '@/lib/currency';
import { Button } from '@/components/ui/button';
import { Filter, RotateCcw, SlidersHorizontal, Check } from 'lucide-react';

interface FlightFiltersSidebarProps {
  filters: FlightSearchFilters;
  onChange: (filters: FlightSearchFilters) => void;
  availableAirlines: Array<{ code: string; name: string }>;
  priceRange: { min: number; max: number };
  onReset: () => void;
  className?: string;
}

export const FlightFiltersSidebar: React.FC<FlightFiltersSidebarProps> = ({
  filters,
  onChange,
  availableAirlines,
  priceRange,
  onReset,
  className = '',
}) => {
  const handleStopsChange = (stops: 'all' | 'direct' | '1stop') => {
    onChange({ ...filters, stops });
  };

  const handleAirlineToggle = (code: string) => {
    const exists = filters.airlines.includes(code);
    const next = exists
      ? filters.airlines.filter((c) => c !== code)
      : [...filters.airlines, code];
    onChange({ ...filters, airlines: next });
  };

  const handleMaxPriceChange = (val: number) => {
    onChange({ ...filters, maxPrice: val });
  };

  return (
    <div className={`p-5 rounded-2xl border border-border/80 bg-card/60 backdrop-blur-md space-y-6 shadow-sm ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-border/40">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-sky-500" />
          <h3 className="font-bold text-sm">Filters</h3>
        </div>
        <button
          onClick={onReset}
          className="text-xs text-muted-foreground hover:text-sky-500 flex items-center gap-1 transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          Reset
        </button>
      </div>

      {/* Stops Filter */}
      <div className="space-y-3">
        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Stops
        </label>
        <div className="space-y-1.5 text-xs">
          {[
            { id: 'all', label: 'All Flights' },
            { id: 'direct', label: 'Direct Only' },
            { id: '1stop', label: '1 Stop or Direct' },
          ].map((item) => (
            <label
              key={item.id}
              className={`flex items-center justify-between p-2 rounded-xl border cursor-pointer transition-colors ${
                filters.stops === item.id
                  ? 'border-sky-500 bg-sky-500/10 text-sky-600 dark:text-sky-400 font-bold'
                  : 'border-transparent hover:bg-muted/60 text-muted-foreground'
              }`}
            >
              <span>{item.label}</span>
              <input
                type="radio"
                name="stops"
                checked={filters.stops === item.id}
                onChange={() => handleStopsChange(item.id as any)}
                className="hidden"
              />
              {filters.stops === item.id && <Check className="w-3.5 h-3.5 text-sky-500" />}
            </label>
          ))}
        </div>
      </div>

      {/* Max Price Slider */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Max Price
          </label>
          <span className="text-xs font-bold text-foreground">
            {formatRupees(filters.maxPrice || priceRange.max)}
          </span>
        </div>
        <input
          type="range"
          min={priceRange.min}
          max={priceRange.max || 25000}
          step={200}
          value={filters.maxPrice || priceRange.max}
          onChange={(e) => handleMaxPriceChange(Number(e.target.value))}
          className="w-full accent-sky-500 cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
          <span>{formatRupees(priceRange.min)}</span>
          <span>{formatRupees(priceRange.max)}</span>
        </div>
      </div>

      {/* Airlines Filter */}
      {availableAirlines.length > 0 && (
        <div className="space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Airlines
          </label>
          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
            {availableAirlines.map((airline) => {
              const isChecked =
                filters.airlines.length === 0 || filters.airlines.includes(airline.code);
              return (
                <label
                  key={airline.code}
                  className="flex items-center justify-between p-2 rounded-xl hover:bg-muted/50 cursor-pointer text-xs"
                >
                  <span className="truncate">{airline.name}</span>
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleAirlineToggle(airline.code)}
                    className="rounded accent-sky-500 w-4 h-4 cursor-pointer"
                  />
                </label>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
