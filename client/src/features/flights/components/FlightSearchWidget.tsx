import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AirportAutocomplete } from './AirportAutocomplete';
import { Airport, SearchCriteria } from '../flights.types';
import { DEFAULT_ORIGIN, DEFAULT_DESTINATION } from '@/lib/currency';
import { Button } from '@/components/ui/button';
import {
  ArrowRightLeft,
  Calendar,
  Users,
  Search,
  Check,
  ChevronDown,
  PlaneTakeoff,
  PlaneLanding,
  Clock,
  Tag,
  Ticket,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FlightSearchWidgetProps {
  initialValues?: Partial<SearchCriteria>;
  compact?: boolean;
}

export const FlightSearchWidget: React.FC<FlightSearchWidgetProps> = ({
  initialValues,
  compact = false,
}) => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'book' | 'my-flight' | 'check-in'>('book');
  const [tripType, setTripType] = useState<'ROUND_TRIP' | 'ONE_WAY'>(
    initialValues?.tripType || 'ROUND_TRIP'
  );
  const [origin, setOrigin] = useState<string>(initialValues?.origin || DEFAULT_ORIGIN.iataCode);
  const [originDetails, setOriginDetails] = useState<Airport | null>(
    initialValues?.originDetails || DEFAULT_ORIGIN
  );

  const [destination, setDestination] = useState<string>(
    initialValues?.destination || DEFAULT_DESTINATION.iataCode
  );
  const [destinationDetails, setDestinationDetails] = useState<Airport | null>(
    initialValues?.destinationDetails || DEFAULT_DESTINATION
  );

  const defaultDepDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 5);
    return d.toISOString().split('T')[0];
  };

  const defaultRetDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 12);
    return d.toISOString().split('T')[0];
  };

  const [departureDate, setDepartureDate] = useState<string>(
    initialValues?.departureDate || defaultDepDate()
  );
  const [returnDate, setReturnDate] = useState<string>(
    initialValues?.returnDate || defaultRetDate()
  );

  const [passengers, setPassengers] = useState({
    adults: initialValues?.passengers?.adults || 1,
    children: initialValues?.passengers?.children || 0,
    infants: initialValues?.passengers?.infants || 0,
  });

  const [cabinClass, setCabinClass] = useState<'ECONOMY' | 'PREMIUM_ECONOMY' | 'BUSINESS' | 'FIRST'>(
    initialValues?.cabinClass || 'ECONOMY'
  );

  const [isPassengerDropdownOpen, setIsPassengerDropdownOpen] = useState(false);
  const [isTripTypeDropdownOpen, setIsTripTypeDropdownOpen] = useState(false);
  const [showPromoField, setShowPromoField] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [checkInPnr, setCheckInPnr] = useState('');
  const [checkInLastName, setCheckInLastName] = useState('');

  const totalPassengers = passengers.adults + passengers.children + passengers.infants;

  const handleSwapAirports = () => {
    const tempCode = origin;
    const tempDetails = originDetails;
    setOrigin(destination);
    setOriginDetails(destinationDetails);
    setDestination(tempCode);
    setDestinationDetails(tempDetails);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!origin || !destination) return;

    const params = new URLSearchParams({
      origin,
      destination,
      departureDate,
      tripType,
      adults: passengers.adults.toString(),
      children: passengers.children.toString(),
      infants: passengers.infants.toString(),
      cabinClass,
    });

    if (tripType === 'ROUND_TRIP' && returnDate) {
      params.append('returnDate', returnDate);
    }

    if (promoCode) {
      params.append('promo', promoCode);
    }

    navigate(`/flights?${params.toString()}`);
  };

  const handleCheckInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (checkInPnr) {
      navigate(`/bookings`);
    }
  };

  return (
    <div className={`w-full bg-white dark:bg-card rounded-3xl shadow-2xl border border-border/70 overflow-hidden ${compact ? 'p-4 sm:p-6' : ''}`}>
      {/* Top Navigation Tabs matching the Banner: Book | My Flight | Check-In */}
      <div className="flex items-center border-b border-border/50 bg-slate-50/60 dark:bg-muted/30">
        <button
          type="button"
          onClick={() => setActiveTab('book')}
          className={`px-7 py-3.5 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
            activeTab === 'book'
              ? 'border-primary text-primary bg-white dark:bg-card'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <span>Book</span>
        </button>

        <button
          type="button"
          onClick={() => navigate('/bookings')}
          className="px-7 py-3.5 text-xs font-bold transition-all border-b-2 border-transparent text-muted-foreground hover:text-primary flex items-center gap-1.5"
        >
          <span>My Flight</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('check-in')}
          className={`px-7 py-3.5 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
            activeTab === 'check-in'
              ? 'border-primary text-primary bg-white dark:bg-card'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <span>Check-In</span>
        </button>
      </div>

      {/* Tab 1: Book Flight */}
      {activeTab === 'book' && (
        <div className="p-5 sm:p-7 space-y-4">
          {/* Controls Bar: Trip Type & Passenger Selectors */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Trip Type Selector */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsTripTypeDropdownOpen(!isTripTypeDropdownOpen)}
                className="px-3.5 py-1.5 rounded-full border border-border bg-slate-100/70 dark:bg-muted text-xs font-bold text-foreground hover:bg-slate-200/70 flex items-center gap-1.5 transition-colors"
              >
                <span>{tripType === 'ROUND_TRIP' ? 'Round-trip' : 'One-way'}</span>
                <ChevronDown className="w-3 h-3 text-muted-foreground" />
              </button>

              {isTripTypeDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsTripTypeDropdownOpen(false)}
                  />
                  <div className="absolute left-0 top-full mt-1.5 w-36 rounded-xl bg-card border border-border shadow-xl p-1.5 z-50 animate-in fade-in zoom-in-95">
                    <button
                      type="button"
                      onClick={() => {
                        setTripType('ROUND_TRIP');
                        setIsTripTypeDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-bold ${
                        tripType === 'ROUND_TRIP' ? 'bg-primary text-white' : 'hover:bg-muted text-foreground'
                      }`}
                    >
                      Round-trip
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setTripType('ONE_WAY');
                        setIsTripTypeDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-bold ${
                        tripType === 'ONE_WAY' ? 'bg-primary text-white' : 'hover:bg-muted text-foreground'
                      }`}
                    >
                      One-way
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Passenger & Cabin Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsPassengerDropdownOpen(!isPassengerDropdownOpen)}
                className="px-3.5 py-1.5 rounded-full border border-border bg-slate-100/70 dark:bg-muted text-xs font-bold text-foreground hover:bg-slate-200/70 flex items-center gap-1.5 transition-colors"
              >
                <Users className="w-3.5 h-3.5 text-primary" />
                <span>
                  {totalPassengers} {totalPassengers === 1 ? 'Adult' : 'Travelers'} • {cabinClass === 'ECONOMY' ? 'Economy' : cabinClass.replace('_', ' ')}
                </span>
                <ChevronDown className="w-3 h-3 text-muted-foreground" />
              </button>

              {isPassengerDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsPassengerDropdownOpen(false)}
                  />
                  <div className="absolute left-0 top-full mt-2 w-80 rounded-2xl bg-card border border-border shadow-2xl p-4 z-50 space-y-4 animate-in fade-in zoom-in-95">
                    <div className="space-y-3">
                      <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Select Passengers
                      </span>

                      {/* Adults */}
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-semibold">Adults</p>
                          <p className="text-xs text-muted-foreground">Age 12+</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setPassengers((p) => ({ ...p, adults: Math.max(1, p.adults - 1) }))}
                            className="w-7 h-7 rounded-lg border border-input flex items-center justify-center font-bold hover:bg-muted"
                          >
                            -
                          </button>
                          <span className="w-6 text-center text-sm font-bold">{passengers.adults}</span>
                          <button
                            type="button"
                            onClick={() => setPassengers((p) => ({ ...p, adults: Math.min(9, p.adults + 1) }))}
                            className="w-7 h-7 rounded-lg border border-input flex items-center justify-center font-bold hover:bg-muted"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Children */}
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-semibold">Children</p>
                          <p className="text-xs text-muted-foreground">Age 2 - 11</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setPassengers((p) => ({ ...p, children: Math.max(0, p.children - 1) }))}
                            className="w-7 h-7 rounded-lg border border-input flex items-center justify-center font-bold hover:bg-muted"
                          >
                            -
                          </button>
                          <span className="w-6 text-center text-sm font-bold">{passengers.children}</span>
                          <button
                            type="button"
                            onClick={() => setPassengers((p) => ({ ...p, children: Math.min(9, p.children + 1) }))}
                            className="w-7 h-7 rounded-lg border border-input flex items-center justify-center font-bold hover:bg-muted"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Infants */}
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-semibold">Infants</p>
                          <p className="text-xs text-muted-foreground">Under 2 (on lap)</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setPassengers((p) => ({ ...p, infants: Math.max(0, p.infants - 1) }))}
                            className="w-7 h-7 rounded-lg border border-input flex items-center justify-center font-bold hover:bg-muted"
                          >
                            -
                          </button>
                          <span className="w-6 text-center text-sm font-bold">{passengers.infants}</span>
                          <button
                            type="button"
                            onClick={() => setPassengers((p) => ({ ...p, infants: Math.min(passengers.adults, p.infants + 1) }))}
                            className="w-7 h-7 rounded-lg border border-input flex items-center justify-center font-bold hover:bg-muted"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-border/50 space-y-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Cabin Class
                      </span>
                      <div className="grid grid-cols-2 gap-1.5 text-xs">
                        {(['ECONOMY', 'PREMIUM_ECONOMY', 'BUSINESS', 'FIRST'] as const).map((cls) => (
                          <button
                            key={cls}
                            type="button"
                            onClick={() => setCabinClass(cls)}
                            className={`p-2 rounded-xl text-left font-semibold transition-all ${
                              cabinClass === cls
                                ? 'bg-primary text-white shadow-sm'
                                : 'bg-muted/60 hover:bg-muted text-foreground'
                            }`}
                          >
                            {cls === 'ECONOMY' ? 'Economy' : cls.replace('_', ' ')}
                          </button>
                        ))}
                      </div>
                    </div>

                    <Button
                      size="sm"
                      onClick={() => setIsPassengerDropdownOpen(false)}
                      className="w-full mt-2 font-bold"
                    >
                      Apply Travelers
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Form Inputs Grid */}
          <form onSubmit={handleSearch} className="space-y-4">
            {/* Origin & Destination with Swap */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 relative">
              <div>
                <AirportAutocomplete
                  label="From"
                  placeholder="New Delhi (DEL)"
                  value={origin}
                  selectedAirport={originDetails}
                  onSelect={(airport) => {
                    setOrigin(airport.iataCode);
                    setOriginDetails(airport);
                  }}
                  icon={<PlaneTakeoff className="w-4 h-4 text-primary" />}
                />
              </div>

              {/* Swap Button in center on tablet/desktop */}
              <div className="sm:absolute sm:left-1/2 sm:top-7 sm:-translate-x-1/2 sm:z-10 flex justify-center -my-1 sm:my-0">
                <button
                  type="button"
                  onClick={handleSwapAirports}
                  className="w-8 h-8 rounded-full border border-border bg-white dark:bg-card shadow-sm hover:bg-accent text-muted-foreground hover:text-primary flex items-center justify-center transition-transform active:rotate-180"
                  title="Swap Origin and Destination"
                >
                  <ArrowRightLeft className="w-3.5 h-3.5" />
                </button>
              </div>

              <div>
                <AirportAutocomplete
                  label="To"
                  placeholder="Mumbai (BOM)"
                  value={destination}
                  selectedAirport={destinationDetails}
                  onSelect={(airport) => {
                    setDestination(airport.iataCode);
                    setDestinationDetails(airport);
                  }}
                  icon={<PlaneLanding className="w-4 h-4 text-primary" />}
                />
              </div>
            </div>

            {/* Dates Row */}
            <div className={`grid ${tripType === 'ROUND_TRIP' ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'} gap-3`}>
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
                  Departure Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={departureDate}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setDepartureDate(e.target.value)}
                    className="w-full h-12 px-3.5 rounded-xl border border-input bg-card text-sm font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary shadow-xs"
                    required
                  />
                </div>
              </div>

              {tripType === 'ROUND_TRIP' && (
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
                    Return Date
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={returnDate}
                      min={departureDate || new Date().toISOString().split('T')[0]}
                      onChange={(e) => setReturnDate(e.target.value)}
                      className="w-full h-12 px-3.5 rounded-xl border border-input bg-card text-sm font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary shadow-xs"
                      required
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Promo Code Toggle & Field */}
            <div className="pt-1">
              <button
                type="button"
                onClick={() => setShowPromoField(!showPromoField)}
                className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Do you have a promo code?</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${showPromoField ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {showPromoField && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-2.5 overflow-hidden"
                  >
                    <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <Tag className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <input
                          type="text"
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                          placeholder="e.g. SKYINDIA, DIWALI26"
                          className="w-full h-10 pl-9 pr-3 rounded-xl border border-input bg-card text-xs font-mono font-bold uppercase placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-primary/20"
                        />
                      </div>
                      <span className="text-[11px] text-emerald-600 font-bold">10% OFF</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Primary Action Button: "Show Flights" in Deep Royal Blue */}
            <Button
              type="submit"
              className="w-full h-13 rounded-2xl text-base font-extrabold shadow-lg shadow-primary/25 tracking-wide flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
            >
              <Search className="w-5 h-5" />
              <span>Show Flights</span>
            </Button>
          </form>
        </div>
      )}

      {/* Tab 2: Check-In */}
      {activeTab === 'check-in' && (
        <form onSubmit={handleCheckInSubmit} className="p-6 space-y-4">
          <div className="space-y-1">
            <h4 className="font-bold text-base text-foreground">Web Check-in</h4>
            <p className="text-xs text-muted-foreground">
              Retrieve your boarding pass and select your seats 48 hours to 60 minutes before departure.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-muted-foreground">Booking Reference / PNR</label>
              <input
                type="text"
                value={checkInPnr}
                onChange={(e) => setCheckInPnr(e.target.value.toUpperCase())}
                placeholder="e.g. SKY-68JUZE"
                className="w-full h-12 px-3.5 rounded-xl border border-input bg-card text-sm font-mono font-bold uppercase focus:outline-none focus:ring-2 focus:ring-primary/20"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-muted-foreground">Last Name / Email</label>
              <input
                type="text"
                value={checkInLastName}
                onChange={(e) => setCheckInLastName(e.target.value)}
                placeholder="e.g. Morgan"
                className="w-full h-12 px-3.5 rounded-xl border border-input bg-card text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20"
                required
              />
            </div>
          </div>

          <Button type="submit" className="w-full h-12 rounded-xl text-sm font-bold shadow-md">
            Retrieve Boarding Pass
          </Button>
        </form>
      )}
    </div>
  );
};
