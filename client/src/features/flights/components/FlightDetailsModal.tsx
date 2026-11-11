import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FlightOffer } from '../flights.types';
import { useAuthStore } from '@/features/auth/auth.store';
import { formatRupees } from '@/lib/currency';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  X,
  Plane,
  Clock,
  Luggage,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  Info,
  CheckCircle2,
} from 'lucide-react';

interface FlightDetailsModalProps {
  offer: FlightOffer | null;
  isOpen: boolean;
  onClose: () => void;
}

export const FlightDetailsModal: React.FC<FlightDetailsModalProps> = ({
  offer,
  isOpen,
  onClose,
}) => {
  const navigate = useNavigate();
  const { isAuthenticated, setPendingRedirect } = useAuthStore();

  if (!isOpen || !offer) return null;

  const formatDateTime = (isoString: string) => {
    const d = new Date(isoString);
    return {
      date: d.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' }),
      time: d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
    };
  };

  const formatDuration = (minutes: number) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h}h ${m > 0 ? `${m}m` : ''}`;
  };

  const handleBookNow = () => {
    onClose();
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-card border border-border shadow-2xl p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-border/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white p-1 border border-border/40 flex items-center justify-center shrink-0">
              <img
                src={offer.airline.logoUrl || `https://images.kiwi.com/airlines/64/${offer.airline.code}.png`}
                alt={offer.airline.name}
                className="w-8 h-8 object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.kiwi.com/airlines/64/BA.png';
                }}
              />
            </div>
            <div>
              <h3 className="font-bold text-lg text-foreground leading-tight">
                {offer.airline.name}
              </h3>
              <p className="text-xs text-muted-foreground">
                {offer.cabinClass.replace('_', ' ')} • Offer ID: {offer.id.slice(0, 16)}...
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Slices & Segments */}
        <div className="space-y-6">
          {offer.slices.map((slice, sIdx) => (
            <div key={slice.id} className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-sky-500 flex items-center gap-1.5">
                  <Plane className="w-3.5 h-3.5" />
                  {sIdx === 0 ? 'Outbound Journey' : 'Return Journey'} ({slice.origin.iataCode} → {slice.destination.iataCode})
                </span>
                <span className="text-xs text-muted-foreground font-semibold">
                  Total Journey: {formatDuration(slice.durationMinutes)}
                </span>
              </div>

              {/* Segments Loop */}
              <div className="space-y-4">
                {slice.segments.map((seg, segIdx) => {
                  const dep = formatDateTime(seg.departureTime);
                  const arr = formatDateTime(seg.arrivalTime);

                  return (
                    <div key={seg.id} className="space-y-3">
                      {/* Layover banner if this is segment 2+ */}
                      {segIdx > 0 && slice.segments[segIdx - 1].layoverMinutes && (
                        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs flex items-center justify-between">
                          <span className="flex items-center gap-1.5 font-semibold">
                            <Clock className="w-3.5 h-3.5" />
                            Layover in {seg.origin.city} ({seg.origin.code})
                          </span>
                          <span className="font-bold">
                            {formatDuration(slice.segments[segIdx - 1].layoverMinutes!)}
                          </span>
                        </div>
                      )}

                      {/* Flight Segment Box */}
                      <div className="p-4 rounded-2xl border border-border/70 bg-muted/30 space-y-3">
                        <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground border-b border-border/40 pb-2">
                          <span>Flight {seg.flightNumber} • {seg.aircraft.name}</span>
                          <span>Duration: {formatDuration(seg.durationMinutes)}</span>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <span className="text-xs text-muted-foreground">{dep.date}</span>
                            <div className="text-xl font-black">{dep.time}</div>
                            <div className="font-bold text-sm text-foreground">{seg.origin.city} ({seg.origin.code})</div>
                            <div className="text-xs text-muted-foreground">{seg.origin.name} {seg.origin.terminal ? `• Terminal ${seg.origin.terminal}` : ''}</div>
                          </div>

                          <div className="text-right">
                            <span className="text-xs text-muted-foreground">{arr.date}</span>
                            <div className="text-xl font-black">{arr.time}</div>
                            <div className="font-bold text-sm text-foreground">{seg.destination.city} ({seg.destination.code})</div>
                            <div className="text-xs text-muted-foreground">{seg.destination.name} {seg.destination.terminal ? `• Terminal ${seg.destination.terminal}` : ''}</div>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-border/40 flex items-center justify-between text-xs text-muted-foreground">
                          <span className="flex items-center gap-1.5">
                            <Luggage className="w-3.5 h-3.5 text-sky-500" />
                            Checked: {seg.baggage.checked} | Cabin: {seg.baggage.cabin}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Fare Rules & Baggage summary */}
        <div className="p-4 rounded-2xl bg-muted/40 border border-border/50 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="space-y-1">
            <span className="font-bold text-foreground flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              Fare Conditions
            </span>
            <p className="text-muted-foreground">
              {offer.fareConditions.refundable
                ? `Refundable prior to departure (${formatRupees(offer.fareConditions.penaltyFee || 1500)} processing fee)`
                : 'Non-refundable basic ticket'}
            </p>
            <p className="text-muted-foreground">
              Flight date change allowed subject to airline fare difference
            </p>
          </div>

          <div className="space-y-1">
            <span className="font-bold text-foreground flex items-center gap-1">
              <Luggage className="w-4 h-4 text-sky-500" />
              Baggage Guarantee
            </span>
            <p className="text-muted-foreground">
              1 free personal item + 1 carry-on suitcase (7kg)
            </p>
            <p className="text-muted-foreground">
              Standard 15kg checked baggage included in total fare
            </p>
          </div>
        </div>

        {/* Price Breakdown & CTA Footer */}
        <div className="pt-4 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="text-xs text-muted-foreground">
              Base: {formatRupees(offer.baseAmount)} + Taxes: {formatRupees(offer.taxAmount)}
            </div>
            <div className="text-2xl font-black text-foreground">
              {formatRupees(offer.totalAmount)}
            </div>
          </div>

          <Button
            size="lg"
            onClick={handleBookNow}
            className="w-full sm:w-auto px-8 rounded-2xl shadow-lg flex items-center gap-2 text-base font-bold"
          >
            Select & Continue to Booking
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
