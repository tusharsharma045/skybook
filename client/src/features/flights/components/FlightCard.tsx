import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FlightOffer } from '../flights.types';
import { useAuthStore } from '@/features/auth/auth.store';
import { formatRupees } from '@/lib/currency';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Plane,
  Clock,
  ArrowRight,
  Luggage,
  Info,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { motion } from 'framer-motion';

interface FlightCardProps {
  offer: FlightOffer;
  onOpenDetails: (offer: FlightOffer) => void;
}

export const FlightCard: React.FC<FlightCardProps> = ({
  offer,
  onOpenDetails,
}) => {
  const navigate = useNavigate();
  const { isAuthenticated, setPendingRedirect } = useAuthStore();

  const outboundSlice = offer.slices[0];
  const returnSlice = offer.slices[1];

  const formatTime = (isoString: string) => {
    const d = new Date(isoString);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  const formatDate = (isoString: string) => {
    const d = new Date(isoString);
    return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  const formatDuration = (minutes: number) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h}h ${m > 0 ? `${m}m` : ''}`;
  };

  const handleSelectFlight = () => {
    if (!isAuthenticated) {
      setPendingRedirect('/booking/passengers', offer);
      navigate(`/login?redirect=${encodeURIComponent('/booking/passengers')}`, {
        state: { preservedFlight: offer },
      });
    } else {
      navigate('/booking/passengers', {
        state: { flight: offer },
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      className="rounded-2xl border border-border/80 bg-card/80 hover:bg-card hover:border-sky-500/40 hover:shadow-xl transition-all p-5 backdrop-blur-md space-y-4"
    >
      {/* Card Header: Airline & Badges */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/40 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white p-1 border border-border/40 flex items-center justify-center shrink-0 shadow-xs">
            <img
              src={offer.airline.logoUrl || `https://images.kiwi.com/airlines/64/${offer.airline.code}.png`}
              alt={offer.airline.name}
              className="w-7 h-7 object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://images.kiwi.com/airlines/64/BA.png';
              }}
            />
          </div>
          <div>
            <h4 className="font-bold text-sm text-foreground leading-tight flex items-center gap-1.5">
              {offer.airline.name}
              <span className="text-xs font-mono font-normal text-muted-foreground">
                ({outboundSlice.segments[0].flightNumber})
              </span>
            </h4>
            <span className="text-xs text-muted-foreground">
              {outboundSlice.segments[0].aircraft.name} • {offer.cabinClass.replace('_', ' ')}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {offer.fareConditions.refundable ? (
            <Badge variant="success" className="text-[11px]">
              <CheckCircle2 className="w-3 h-3 mr-1" />
              Refundable
            </Badge>
          ) : (
            <Badge variant="outline" className="text-[11px] text-muted-foreground">
              Non-refundable
            </Badge>
          )}

          <div className="text-right">
            <span className="text-2xl font-black tracking-tight text-foreground">
              {formatRupees(offer.totalAmount)}
            </span>
            <span className="text-[10px] text-muted-foreground block -mt-1">
              total for {offer.passengerCount} traveler{offer.passengerCount > 1 ? 's' : ''}
            </span>
          </div>
        </div>
      </div>

      {/* Outbound Route Line */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        <div className="md:col-span-9 space-y-3">
          {/* Outbound Slice */}
          <div className="flex items-center justify-between gap-4">
            {/* Origin */}
            <div className="text-left w-24 shrink-0">
              <span className="text-xl font-black text-foreground">
                {formatTime(outboundSlice.departureTime)}
              </span>
              <div className="font-bold text-sm text-sky-600 dark:text-sky-400">
                {outboundSlice.origin.iataCode}
              </div>
              <span className="text-xs text-muted-foreground truncate block">
                {outboundSlice.origin.city}
              </span>
            </div>

            {/* Flight Path Graphic */}
            <div className="flex-1 flex flex-col items-center px-2">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-semibold mb-1">
                <Clock className="w-3.5 h-3.5 text-sky-500" />
                <span>{formatDuration(outboundSlice.durationMinutes)}</span>
              </div>

              <div className="w-full relative flex items-center justify-center">
                {/* Horizontal Dashed Route Line */}
                <div className="w-full h-[2px] bg-gradient-to-r from-sky-400/30 via-sky-500 to-sky-400/30 relative">
                  {/* Decorative Airport Dots */}
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-sky-500" />
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-sky-500" />
                </div>

                {/* Flying Plane Icon in center */}
                <div className="absolute bg-card p-1 rounded-full border border-sky-500/40 text-sky-500 shadow-xs">
                  <Plane className="w-3.5 h-3.5 transform rotate-45" />
                </div>
              </div>

              {/* Stops Tag */}
              <div className="mt-1.5">
                {outboundSlice.stopsCount === 0 ? (
                  <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                    Non-stop
                  </span>
                ) : (
                  <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400">
                    {outboundSlice.stopsCount} stop ({outboundSlice.segments[0].destination.code})
                  </span>
                )}
              </div>
            </div>

            {/* Destination */}
            <div className="text-right w-24 shrink-0">
              <span className="text-xl font-black text-foreground">
                {formatTime(outboundSlice.arrivalTime)}
              </span>
              <div className="font-bold text-sm text-sky-600 dark:text-sky-400">
                {outboundSlice.destination.iataCode}
              </div>
              <span className="text-xs text-muted-foreground truncate block">
                {outboundSlice.destination.city}
              </span>
            </div>
          </div>

          {/* Return Slice (if Round Trip) */}
          {returnSlice && (
            <div className="pt-2 border-t border-border/30 flex items-center justify-between gap-4">
              <div className="text-left w-24 shrink-0">
                <span className="text-sm font-bold text-foreground">
                  {formatTime(returnSlice.departureTime)}
                </span>
                <span className="text-xs font-semibold text-muted-foreground block">
                  {returnSlice.origin.iataCode}
                </span>
              </div>

              <div className="flex-1 flex flex-col items-center">
                <span className="text-[11px] text-muted-foreground">
                  Return • {formatDuration(returnSlice.durationMinutes)} • Non-stop
                </span>
                <div className="w-full h-[1px] bg-border my-1" />
              </div>

              <div className="text-right w-24 shrink-0">
                <span className="text-sm font-bold text-foreground">
                  {formatTime(returnSlice.arrivalTime)}
                </span>
                <span className="text-xs font-semibold text-muted-foreground block">
                  {returnSlice.destination.iataCode}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons Column */}
        <div className="md:col-span-3 flex flex-row md:flex-col justify-end gap-2 pt-2 md:pt-0 md:border-l md:border-border/40 md:pl-4">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onOpenDetails(offer)}
            className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1.5"
          >
            <Info className="w-3.5 h-3.5" />
            Flight Details
          </Button>

          <Button
            type="button"
            onClick={handleSelectFlight}
            className="rounded-xl shadow-md group flex items-center justify-center gap-1.5 text-xs font-bold"
          >
            Select Flight
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};
