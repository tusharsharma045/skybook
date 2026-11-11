import React, { useState } from 'react';
import { useBookingStore } from '../booking.store';
import { bookingApi } from '../booking.api';
import { formatRupees } from '@/lib/currency';
import { Button } from '@/components/ui/button';
import {
  Plane,
  Clock,
  Luggage,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  Users,
  AlertCircle,
} from 'lucide-react';

export const ReviewStep: React.FC = () => {
  const { draft, setStep, setCreatedBooking } = useBookingStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const flight = draft.flight;
  if (!flight) return null;

  const handleProceedToPayment = async () => {
    try {
      setIsSubmitting(true);
      setError(null);

      const booking = await bookingApi.createBooking({
        offerId: flight.id,
        passengers: draft.passengers,
        contactEmail: draft.contactEmail,
        contactPhone: draft.contactPhone,
        notes: draft.notes,
        savePassengersToProfile: draft.savePassengersToProfile,
      });

      setCreatedBooking(booking);
      setStep(3); // Move to Payment step
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to initiate booking reservation. Please retry.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDuration = (minutes: number) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h}h ${m > 0 ? `${m}m` : ''}`;
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-4 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Flight Itinerary Summary */}
      <div className="p-6 rounded-3xl glass-panel shadow-sm space-y-6 border border-border/80">
        <div className="flex items-center justify-between pb-4 border-b border-border/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white p-1 border border-border/40 flex items-center justify-center shrink-0">
              <img
                src={flight.airline.logoUrl || `https://images.kiwi.com/airlines/64/${flight.airline.code}.png`}
                alt={flight.airline.name}
                className="w-8 h-8 object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.kiwi.com/airlines/64/BA.png';
                }}
              />
            </div>
            <div>
              <h3 className="font-bold text-base">{flight.airline.name}</h3>
              <p className="text-xs text-muted-foreground">{flight.cabinClass.replace('_', ' ')}</p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-2xl font-black text-foreground">
              {formatRupees(flight.totalAmount)}
            </span>
            <span className="text-xs text-muted-foreground block">Guaranteed GDS Fare</span>
          </div>
        </div>

        {/* Slices */}
        {flight.slices.map((slice, idx) => (
          <div key={slice.id} className="p-4 rounded-2xl bg-muted/30 border border-border/60 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-sky-500">
              <span>{idx === 0 ? 'Outbound' : 'Return'}: {slice.origin.city} ({slice.origin.iataCode}) → {slice.destination.city} ({slice.destination.iataCode})</span>
              <span className="text-muted-foreground font-normal lowercase">{formatDuration(slice.durationMinutes)}</span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <div>
                <div className="text-lg font-black">{new Date(slice.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                <div className="font-semibold">{slice.origin.name}</div>
              </div>

              <div className="flex flex-col items-center px-4">
                <span className="text-xs text-muted-foreground">{slice.stopsCount === 0 ? 'Non-stop' : `${slice.stopsCount} stop`}</span>
                <div className="w-24 h-[1px] bg-border my-1" />
                <Plane className="w-3.5 h-3.5 text-sky-500" />
              </div>

              <div className="text-right">
                <div className="text-lg font-black">{new Date(slice.arrivalTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                <div className="font-semibold">{slice.destination.name}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Passengers Summary */}
      <div className="p-6 rounded-3xl glass-panel shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-sky-500" />
          <h3 className="font-bold text-base">Travelers & Seat Assignments</h3>
        </div>

        <div className="divide-y divide-border/40">
          {draft.passengers.map((p, idx) => (
            <div key={idx} className="py-3 flex items-center justify-between text-sm">
              <div>
                <p className="font-semibold">{p.title} {p.firstName} {p.lastName}</p>
                <p className="text-xs text-muted-foreground">Passport: {p.passportNumber ? `•••• ${p.passportNumber.slice(-4)}` : 'Standard'}</p>
              </div>
              <div className="text-right">
                <span className="text-xs font-mono font-bold bg-muted px-2.5 py-1 rounded-lg">
                  Seat: {p.seatNumber || `${12 + idx}A`}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Baggage & Fare Conditions Guarantee */}
      <div className="p-5 rounded-2xl bg-muted/40 border border-border/50 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        <div className="flex items-start gap-2.5">
          <Luggage className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-foreground">Included Baggage Allowance</p>
            <p className="text-muted-foreground">1 personal item + 1 carry-on suitcase (7kg) + 1 checked bag (15kg) per passenger</p>
          </div>
        </div>

        <div className="flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-foreground">24-Hour Cancellation Guarantee</p>
            <p className="text-muted-foreground">Cancel or modify up to 24h prior to flight departure with transparent airline policy rules</p>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => setStep(1)}
          className="rounded-xl flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Passengers
        </Button>

        <Button
          type="button"
          size="lg"
          onClick={handleProceedToPayment}
          disabled={isSubmitting}
          className="rounded-2xl px-8 shadow-lg flex items-center gap-2 font-bold"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Holding Flight Reservation...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              Proceed to Secure Payment
              <ArrowRight className="w-4 h-4" />
            </span>
          )}
        </Button>
      </div>
    </div>
  );
};
