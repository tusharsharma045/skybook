import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { flightsApi } from '@/features/flights/flights.api';
import { FlightOffer, FlightSearchFilters, SearchCriteria } from '@/features/flights/flights.types';
import { FlightCard } from '@/features/flights/components/FlightCard';
import { FlightFiltersSidebar } from '@/features/flights/components/FlightFiltersSidebar';
import { FlightDetailsModal } from '@/features/flights/components/FlightDetailsModal';
import { FlightResultsSkeleton } from '@/features/flights/components/FlightResultsSkeleton';
import { FlightSearchWidget } from '@/features/flights/components/FlightSearchWidget';
import { Button } from '@/components/ui/button';
import {
  SlidersHorizontal,
  ArrowUpDown,
  Plane,
  AlertCircle,
  Sparkles,
  Calendar,
  X,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const FlightResultsPage: React.FC = () => {
  const [searchParams] = useSearchParams();

  // Parse search params
  const origin = searchParams.get('origin') || 'DEL';
  const destination = searchParams.get('destination') || 'BOM';
  const departureDate = searchParams.get('departureDate') || new Date().toISOString().split('T')[0];
  const returnDate = searchParams.get('returnDate') || undefined;
  const tripType = (searchParams.get('tripType') as 'ONE_WAY' | 'ROUND_TRIP') || (returnDate ? 'ROUND_TRIP' : 'ONE_WAY');
  const adults = parseInt(searchParams.get('adults') || '1', 10);
  const children = parseInt(searchParams.get('children') || '0', 10);
  const infants = parseInt(searchParams.get('infants') || '0', 10);
  const cabinClass = (searchParams.get('cabinClass') as any) || 'ECONOMY';

  const criteria: SearchCriteria = useMemo(
    () => ({
      origin,
      destination,
      departureDate,
      returnDate,
      tripType,
      passengers: { adults, children, infants },
      cabinClass,
    }),
    [origin, destination, departureDate, returnDate, tripType, adults, children, infants, cabinClass]
  );

  // Client filter & sort state
  const [filters, setFilters] = useState<FlightSearchFilters>({
    stops: 'all',
    airlines: [],
    sortBy: 'cheapest',
  });

  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [selectedOfferForModal, setSelectedOfferForModal] = useState<FlightOffer | null>(null);
  const [isModifySearchOpen, setIsModifySearchOpen] = useState(false);

  // TanStack Query
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['flightSearch', criteria, filters],
    queryFn: () => flightsApi.searchFlights(criteria, filters),
    staleTime: 1000 * 60 * 3, // 3 minutes cache
  });

  const offers = data?.offers || [];
  const meta = data?.meta || {
    totalFound: 0,
    matchingFilters: 0,
    priceRange: { min: 200, max: 1500 },
    availableAirlines: [],
  };

  const resetFilters = () => {
    setFilters({
      stops: 'all',
      airlines: [],
      minPrice: undefined,
      maxPrice: undefined,
      sortBy: 'cheapest',
    });
  };

  return (
    <div className="container max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-6">
      {/* Search Header Summary & Modify Button */}
      <div className="p-4 sm:p-6 rounded-3xl glass-panel shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-sky-500 uppercase tracking-wider">
            <span>{tripType === 'ROUND_TRIP' ? 'Round Trip' : 'One Way'}</span>
            <span>•</span>
            <span>{adults + children + infants} Passenger{adults + children + infants > 1 ? 's' : ''}</span>
            <span>•</span>
            <span>{cabinClass.replace('_', ' ')}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-['Plus_Jakarta_Sans'] flex items-center gap-2.5">
            <span>{origin}</span>
            <Plane className="w-5 h-5 text-sky-500 transform rotate-90" />
            <span>{destination}</span>
          </h1>

          <p className="text-xs text-muted-foreground flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-sky-500" />
            <span>Depart: {departureDate}</span>
            {returnDate && <span>• Return: {returnDate}</span>}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsModifySearchOpen(!isModifySearchOpen)}
            className="rounded-xl text-xs font-semibold"
          >
            {isModifySearchOpen ? 'Close Search' : 'Modify Flight Search'}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsMobileFiltersOpen(true)}
            className="md:hidden rounded-xl text-xs font-semibold flex items-center gap-1.5"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-sky-500" />
            Filters ({offers.length})
          </Button>
        </div>
      </div>

      {/* Expandable Modify Search Widget */}
      <AnimatePresence>
        {isModifySearchOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <FlightSearchWidget initialValues={criteria} compact />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Results Layout: Sticky Sidebar + Flight Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Desktop Sticky Filters Sidebar */}
        <aside className="hidden md:block md:col-span-4 lg:col-span-3 sticky top-24">
          <FlightFiltersSidebar
            filters={filters}
            onChange={setFilters}
            availableAirlines={meta.availableAirlines || []}
            priceRange={meta.priceRange || { min: 2500, max: 25000 }}
            onReset={resetFilters}
          />
        </aside>

        {/* Results Main Column */}
        <main className="md:col-span-8 lg:col-span-9 space-y-4">
          {/* Sorting Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-2 rounded-2xl bg-card/60 border border-border/60 backdrop-blur-sm text-xs">
            <span className="font-semibold text-muted-foreground px-2">
              Found <strong className="text-foreground">{offers.length}</strong> flight offers
            </span>

            <div className="flex items-center gap-1.5">
              <span className="text-muted-foreground font-medium hidden sm:inline mr-1">Sort by:</span>
              {(
                [
                  { id: 'cheapest', label: 'Cheapest' },
                  { id: 'fastest', label: 'Fastest' },
                  { id: 'best', label: 'Best Match' },
                  { id: 'departure', label: 'Departure' },
                ] as const
              ).map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setFilters((f) => ({ ...f, sortBy: opt.id }))}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                    filters.sortBy === opt.id
                      ? 'bg-sky-500 text-white shadow-xs'
                      : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Results State Handling */}
          {isLoading ? (
            <FlightResultsSkeleton />
          ) : isError ? (
            <div className="p-8 rounded-3xl border border-destructive/20 bg-destructive/5 text-center space-y-3">
              <AlertCircle className="w-10 h-10 text-destructive mx-auto" />
              <h3 className="font-bold text-lg text-foreground">Flight Search Failed</h3>
              <p className="text-xs text-muted-foreground max-w-md mx-auto">
                {(error as any)?.response?.data?.message || 'Unable to retrieve live flight offers. Please verify your selected dates and airports.'}
              </p>
              <Button size="sm" onClick={() => refetch()} className="mt-2">
                Retry Search
              </Button>
            </div>
          ) : offers.length === 0 ? (
            <div className="p-12 rounded-3xl border border-dashed border-border text-center space-y-4 bg-card/40">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto text-muted-foreground">
                <Plane className="w-6 h-6 transform rotate-45" />
              </div>
              <h3 className="font-bold text-lg">No Flights Match Your Filters</h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                Try widening your price limit or changing stop preferences to discover more available airline options.
              </p>
              <Button size="sm" variant="outline" onClick={resetFilters}>
                Clear All Filters
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {offers.map((offer) => (
                <FlightCard
                  key={offer.id}
                  offer={offer}
                  onOpenDetails={(off) => setSelectedOfferForModal(off)}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Flight Details Modal */}
      <FlightDetailsModal
        offer={selectedOfferForModal}
        isOpen={Boolean(selectedOfferForModal)}
        onClose={() => setSelectedOfferForModal(null)}
      />

      {/* Mobile Filters Drawer / Bottom Sheet */}
      {isMobileFiltersOpen && (
        <div className="fixed inset-0 z-50 flex items-end md:hidden bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-h-[85vh] overflow-y-auto rounded-t-3xl bg-card border-t border-border p-6 shadow-2xl space-y-4 animate-in slide-in-from-bottom">
            <div className="flex items-center justify-between pb-3 border-b border-border/50">
              <h3 className="font-bold text-base">Filter Results</h3>
              <button
                onClick={() => setIsMobileFiltersOpen(false)}
                className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <FlightFiltersSidebar
              filters={filters}
              onChange={setFilters}
              availableAirlines={meta.availableAirlines || []}
              priceRange={meta.priceRange || { min: 2500, max: 25000 }}
              onReset={resetFilters}
            />

            <Button
              className="w-full mt-4"
              onClick={() => setIsMobileFiltersOpen(false)}
            >
              Apply Filters
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
