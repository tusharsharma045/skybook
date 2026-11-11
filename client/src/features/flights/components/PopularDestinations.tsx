import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { flightsApi } from '../flights.api';
import { formatRupees } from '@/lib/currency';
import { ArrowUpRight, Compass, Sparkles, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

export const PopularDestinations: React.FC = () => {
  const navigate = useNavigate();

  const { data: destinations = [] } = useQuery({
    queryKey: ['popularDestinations'],
    queryFn: () => flightsApi.getPopularDestinations(),
  });

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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {destinations.map((dest, idx) => (
          <motion.div
            key={dest.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: idx * 0.08 }}
            whileHover={{ y: -6, transition: { duration: 0.2 } }}
            onClick={() => handleSelectCity(dest)}
            className="group relative h-80 rounded-3xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all border border-border/40"
          >
            {/* Background Image */}
            <img
              src={dest.image}
              alt={dest.city}
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
                  {dest.flightDuration} from DEL
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
