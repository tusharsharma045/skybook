import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { useBookingStore } from '../booking.store';
import { bookingApi } from '../booking.api';
import { formatRupees } from '@/lib/currency';
import { Button } from '@/components/ui/button';
import {
  CheckCircle2,
  Download,
  Calendar,
  Plane,
  Ticket,
  ArrowRight,
  Luggage,
  ShieldCheck,
} from 'lucide-react';
import { motion } from 'framer-motion';

export const ConfirmationStep: React.FC = () => {
  const { createdBooking, resetBooking } = useBookingStore();
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);

  useEffect(() => {
    // Fire celebratory confetti on mount
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (e) {
      // ignore
    }
  }, []);

  if (!createdBooking) return null;

  const handleDownloadTicket = async () => {
    try {
      setIsDownloadingPdf(true);
      const blob = await bookingApi.downloadTicketPdf(createdBooking.bookingReference);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `SkyBook_Ticket_${createdBooking.bookingReference}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to download ticket PDF:', err);
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  const outboundSegment = createdBooking.segments[0];

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Celebration Header */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, type: 'spring' }}
        className="text-center space-y-3"
      >
        <div className="w-20 h-20 rounded-full bg-emerald-500/10 border-2 border-emerald-500/30 text-emerald-500 flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/20">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <h2 className="text-3xl font-extrabold tracking-tight font-['Plus_Jakarta_Sans']">
          Booking Confirmed & Ticket Issued!
        </h2>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          Your flights have been reserved on the airline GDS. An official boarding confirmation has been dispatched to <strong>{createdBooking.contactEmail}</strong>.
        </p>
      </motion.div>

      {/* Official Boarding Pass Summary Card */}
      <div className="p-6 sm:p-8 rounded-3xl glass-panel shadow-2xl border border-sky-500/30 space-y-6 relative overflow-hidden">
        {/* Top Decorative Sky Accent Line */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-600" />

        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-border/40">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
              Official Booking Reference
            </span>
            <span className="text-3xl font-black font-mono tracking-wider text-sky-500">
              {createdBooking.bookingReference}
            </span>
          </div>

          <div className="text-right">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 inline-flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Electronic Ticket Confirmed
            </span>
            <span className="text-xs text-muted-foreground block mt-1">
              Paid: {formatRupees(createdBooking.totalAmount)}
            </span>
          </div>
        </div>

        {/* Flight Route Details */}
        {outboundSegment && (
          <div className="p-4 rounded-2xl bg-muted/30 border border-border/50 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-sky-500 uppercase tracking-wider">
              <span>{outboundSegment.carrierName} ({outboundSegment.flightNumber})</span>
              <span>{outboundSegment.cabinClass}</span>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs text-muted-foreground">
                  {new Date(outboundSegment.departureTime).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                </span>
                <div className="text-2xl font-black">{new Date(outboundSegment.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                <div className="text-sm font-bold text-foreground">{outboundSegment.originCity} ({outboundSegment.originAirport})</div>
              </div>

              <div className="flex flex-col items-center px-4">
                <Plane className="w-4 h-4 text-sky-500" />
                <div className="w-20 h-[1px] bg-border my-1" />
                <span className="text-[10px] text-muted-foreground">Confirmed</span>
              </div>

              <div className="text-right">
                <span className="text-xs text-muted-foreground">
                  {new Date(outboundSegment.arrivalTime).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                </span>
                <div className="text-2xl font-black">{new Date(outboundSegment.arrivalTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                <div className="text-sm font-bold text-foreground">{outboundSegment.destinationCity} ({outboundSegment.destinationAirport})</div>
              </div>
            </div>
          </div>
        )}

        {/* Passengers Seat Summary */}
        <div className="space-y-2 text-xs">
          <span className="font-bold uppercase tracking-wider text-muted-foreground">Travelers</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {createdBooking.passengers.map((p, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-card border border-border/50 flex items-center justify-between">
                <span className="font-semibold">{p.title} {p.firstName} {p.lastName}</span>
                <span className="font-mono text-sky-500 font-bold">Seat {p.seatNumber || `${12 + idx}A`}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 border-t border-border/40 flex flex-col sm:flex-row gap-3">
          <Button
            size="lg"
            onClick={handleDownloadTicket}
            disabled={isDownloadingPdf}
            className="flex-1 rounded-2xl shadow-lg flex items-center justify-center gap-2 font-bold"
          >
            {isDownloadingPdf ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Generating PDF...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                Download PDF E-Ticket
              </span>
            )}
          </Button>

          <Link to="/bookings" onClick={() => resetBooking()} className="flex-1">
            <Button
              variant="outline"
              size="lg"
              className="w-full rounded-2xl flex items-center justify-center gap-2 font-semibold"
            >
              <Ticket className="w-4 h-4 text-sky-500" />
              Manage in My Bookings
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
