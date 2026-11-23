import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { flightsApi } from '../flights.api';
import { formatRupees } from '@/lib/currency';
import { ArrowUpRight, Compass, Sparkles, Clock } from 'lucide-react';

const FALLBACK_DESTINATIONS = [
  {
    id: 'pop_1',
    city: 'Goa',
    country: 'India',
    airportCode: 'GOI',
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80',
    startingPrice: 3499,
    tag: 'Beaches & Holidays',
    flightDuration: '1h 15m from BOM',
  },
  {
    id: 'pop_2',
    city: 'Mumbai',
    country: 'India',
    airportCode: 'BOM',
    image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=800&q=80',
    startingPrice: 4199,
    tag: 'City of Dreams',
    flightDuration: '2h 10m from DEL',
  },
  {
    id: 'pop_3',
    city: 'New Delhi',
    country: 'India',
    airportCode: 'DEL',
    image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=800&q=80',
    startingPrice: 3899,
    tag: 'Capital Hub',
    flightDuration: '2h 30m from BLR',
  },
  {
    id: 'pop_4',
    city: 'Bengaluru',
    country: 'India',
    airportCode: 'BLR',
    image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=800&q=80',
    startingPrice: 3999,
    tag: 'Silicon Valley',
    flightDuration: '1h 45m from BOM',
  },
  {
    id: 'pop_5',
    city: 'Srinagar',
    country: 'India',
    airportCode: 'SXR',
    image: 'https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&w=800&q=80',
    startingPrice: 4899,
    tag: 'Dal Lake Shikaras',
    flightDuration: '1h 25m from DEL',
  },
  {
    id: 'pop_6',
    city: 'Dubai',
    country: 'United Arab Emirates',
    airportCode: 'DXB',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80',
    startingPrice: 18999,
    tag: 'International Hotspot',
    flightDuration: '3h 45m from DEL',
  },
];

export const PopularDestinations: React.FC = () => {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const [cardWidth, setCardWidth] = useState<number>(380);

  const { data: rawDestinations = [] } = useQuery({
    queryKey: ['popularDestinations'],
    queryFn: () => flightsApi.getPopularDestinations(),
  });

  const destinations = rawDestinations.length > 0 ? rawDestinations : FALLBACK_DESTINATIONS;

  useEffect(() => {
    if (!containerRef.current) return;
    const calculateWidth = () => {
      if (!containerRef.current) return;
      const width = containerRef.current.offsetWidth;
      const gap = 24; // 1.5rem = 24px
      // Exactly 3 cards visible at a time on desktop (width >= 1024), 2 on tablet, 1 on mobile
      const visibleCount = width >= 1024 ? 3 : width >= 640 ? 2 : 1;
      const calculated = Math.floor((width - (visibleCount - 1) * gap) / visibleCount);
      setCardWidth(calculated);
    };

    calculateWidth();
    const observer = new ResizeObserver(calculateWidth);
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const handleSelectCity = (dest: any) => {
    const depDate = new Date();
    depDate.setDate(depDate.getDate() + 10);
    const retDate = new Date();
    retDate.setDate(retDate.getDate() + 17);

    const params = new URLSearchParams({
      origin: 'DEL',
      destination: dest.airportCode,
      departureDate: depDate.toISOString().split('T')[0],
      returnDate: retDate.toISOString().split('T')[0],
      tripType: 'ROUND_TRIP',
      adults: '1',
      children: '0',
      infants: '0',
      cabinClass: 'ECONOMY',
    });

    navigate(`/flights?${params.toString()}`);
  };

  const renderCard = (dest: any, key: string) => (
    <div
      key={key}
      style={{ width: `${cardWidth}px` }}
      onClick={() => handleSelectCity(dest)}
      className="group relative h-80 rounded-3xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all border border-border/40 shrink-0 select-none"
    >
      {/* Background Image */}
      <img
        src={dest.image}
        alt={dest.city}
        onError={(e) => {
          if (dest.airportCode === 'SXR') {
            e.currentTarget.src = '/srinagar-dal-lake.jpg';
          }
        }}
        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />

      {/* Top Badges */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/20 backdrop-blur-md text-white border border-white/20 shadow-sm flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-300" />
          {dest.tag}
        </span>

        <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center group-hover:bg-sky-500 transition-colors">
          <ArrowUpRight className="w-4 h-4" />
        </div>
      </div>

      {/* Bottom Content */}
      <div className="absolute bottom-4 left-4 right-4 text-white space-y-1">
        <div className="flex items-baseline justify-between">
          <h3 className="text-2xl font-bold font-['Plus_Jakarta_Sans']">
            {dest.city}
          </h3>
          <span className="text-lg font-black text-sky-300">
            From {formatRupees(dest.startingPrice)}
          </span>
        </div>

        <div className="flex items-center justify-between text-xs text-zinc-300">
          <span>{dest.country} ({dest.airportCode})</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-sky-400" />
            {dest.flightDuration?.includes('from') ? dest.flightDuration : `${dest.flightDuration} from DEL`}
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <section className="py-16">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-500 uppercase tracking-wider mb-2">
            <Compass className="w-4 h-4" />
            Curated Global Routes
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground font-['Plus_Jakarta_Sans']">
            Trending Destinations This Season
          </h2>
        </div>
        <p className="text-sm text-muted-foreground max-w-md">
          Explore top global destinations with live guaranteed GDS fares and non-stop flight paths.
        </p>
      </div>

      {/* Infinite Single-Line Carousel (Exactly 3 cards visible at a time) */}
      <div className="relative w-full overflow-hidden group py-2" ref={containerRef}>
        {/* Soft edge gradient masks */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-background to-transparent z-10" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-background to-transparent z-10" />

        {/* Continuous Slow Linear Marquee Track */}
        <div className="flex">
          {/* First loop track */}
          <div className="flex gap-6 shrink-0 animate-marquee-linear pr-6">
            {destinations.map((dest, idx) => renderCard(dest, `track1-${dest.id || idx}`))}
          </div>

          {/* Duplicate track for seamless infinite continuity */}
          <div className="flex gap-6 shrink-0 animate-marquee-linear pr-6" aria-hidden="true">
            {destinations.map((dest, idx) => renderCard(dest, `track2-${dest.id || idx}`))}
          </div>
        </div>
      </div>
    </section>
  );
};
