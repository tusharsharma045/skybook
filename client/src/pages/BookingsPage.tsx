import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { bookingApi } from '@/features/booking/booking.api';
import { BookingResponse } from '@/features/booking/booking.types';
import { formatRupees } from '@/lib/currency';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Ticket,
  Calendar,
  Plane,
  Clock,
  Download,
  XCircle,
  AlertCircle,
  CheckCircle2,
  Users,
  Compass,
} from 'lucide-react';
import { motion } from 'framer-motion';

export const BookingsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'ALL' | 'UPCOMING' | 'PAST' | 'CANCELLED'>('ALL');
  const [cancellingReference, setCancellingReference] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState('');
  const [downloadingRef, setDownloadingRef] = useState<string | null>(null);

  const { data: bookings = [], isLoading, isError } = useQuery({
    queryKey: ['myBookings'],
    queryFn: () => bookingApi.getMyBookings(),
  });

  const cancelMutation = useMutation({
    mutationFn: ({ ref, reason }: { ref: string; reason: string }) =>
      bookingApi.cancelBooking(ref, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myBookings'] });
      setCancellingReference(null);
      setCancelReason('');
    },
  });

  const handleDownloadTicket = async (ref: string) => {
    try {
      setDownloadingRef(ref);
      const blob = await bookingApi.downloadTicketPdf(ref);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `SkyBook_Ticket_${ref}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to download PDF ticket:', err);
    } finally {
      setDownloadingRef(null);
    }
  };

  const filteredBookings = bookings.filter((b) => {
    if (activeTab === 'ALL') return true;
    if (activeTab === 'CANCELLED') return b.status === 'CANCELLED';

    const depDate = new Date(b.segments[0]?.departureTime || b.createdAt);
    const now = new Date();

    if (activeTab === 'UPCOMING') {
      return b.status !== 'CANCELLED' && depDate >= now;
    }
    if (activeTab === 'PAST') {
      return b.status !== 'CANCELLED' && depDate < now;
    }
    return true;
  });

  return (
    <div className="container max-w-6xl mx-auto py-10 px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Page Title & Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight font-['Plus_Jakarta_Sans']">
            My Flight Bookings
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage your airline itineraries, seat assignments, and downloadable boarding passes
          </p>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1 p-1 rounded-2xl bg-muted/60 text-xs font-bold">
          {(
            [
              { id: 'ALL', label: 'All Trips' },
              { id: 'UPCOMING', label: 'Upcoming' },
              { id: 'PAST', label: 'Past Flights' },
              { id: 'CANCELLED', label: 'Cancelled' },
            ] as const
          ).map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                activeTab === t.id
                  ? 'bg-card text-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings List */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="h-44 rounded-3xl bg-card/60 border border-border/80 animate-pulse" />
          ))}
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="p-12 rounded-3xl border border-dashed border-border/80 bg-card/40 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-sky-500/10 text-sky-500 flex items-center justify-center mx-auto">
            <Ticket className="w-7 h-7" />
          </div>
          <h3 className="font-bold text-lg text-foreground">No bookings found in this category</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            Ready to plan your next journey? Search real-time flights with guaranteed GDS seat inventory.
          </p>
          <Link to="/">
            <Button size="sm" className="rounded-xl mt-2">
              <Compass className="w-4 h-4 mr-1.5" />
              Explore Flights
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-5">
          {filteredBookings.map((b) => {
            const seg = b.segments[0];
            const isCancelled = b.status === 'CANCELLED';

            return (
              <motion.div
                key={b.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-6 rounded-3xl glass-panel shadow-sm border transition-all space-y-5 ${
                  isCancelled ? 'border-rose-500/20 bg-card/40 opacity-75' : 'border-border/80'
                }`}
              >
                {/* Header row: PNR & Status */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-border/40">
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground">Booking Reference:</span>
                    <span className="font-mono font-bold text-base text-sky-500">
                      {b.bookingReference}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      • Booked on {new Date(b.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {b.status === 'CONFIRMED' && (
                      <Badge variant="success" className="text-xs">
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                        Confirmed & Issued
                      </Badge>
                    )}
                    {b.status === 'PENDING' && (
                      <Badge variant="warning" className="text-xs">
                        Pending Payment
                      </Badge>
                    )}
                    {b.status === 'CANCELLED' && (
                      <Badge variant="destructive" className="text-xs">
                        Cancelled
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Flight Segment details */}
                {seg && (
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                    <div className="md:col-span-9 space-y-3">
                      <div className="text-xs font-semibold text-muted-foreground">
                        {seg.carrierName} ({seg.flightNumber}) • {seg.aircraft || 'Commercial Jet'} • {seg.cabinClass}
                      </div>

                      <div className="flex items-center justify-between gap-4">
                        <div className="text-left w-28">
                          <span className="text-xs text-muted-foreground block">
                            {new Date(seg.departureTime).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                          </span>
                          <span className="text-2xl font-black text-foreground">
                            {new Date(seg.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          <span className="font-bold text-sm text-sky-500 block">
                            {seg.originAirport} ({seg.originCity})
                          </span>
                        </div>

                        <div className="flex-1 flex flex-col items-center px-4">
                          <span className="text-xs text-muted-foreground font-semibold">
                            {Math.floor(seg.durationMinutes / 60)}h {seg.durationMinutes % 60}m
                          </span>
                          <div className="w-full h-[1px] bg-sky-500/30 my-1 relative">
                            <div className="absolute left-1/2 -top-2 -translate-x-1/2 bg-card p-0.5 text-sky-500">
                              <Plane className="w-3.5 h-3.5" />
                            </div>
                          </div>
                          <span className="text-[10px] text-emerald-500 font-semibold">Direct Flight</span>
                        </div>

                        <div className="text-right w-28">
                          <span className="text-xs text-muted-foreground block">
                            {new Date(seg.arrivalTime).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                          </span>
                          <span className="text-2xl font-black text-foreground">
                            {new Date(seg.arrivalTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          <span className="font-bold text-sm text-sky-500 block">
                            {seg.destinationAirport} ({seg.destinationCity})
                          </span>
                        </div>
                      </div>

                      {/* Passenger list line */}
                      <div className="pt-2 text-xs text-muted-foreground flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-sky-500" />
                        <span>Travelers: {b.passengers.map((p) => `${p.firstName} ${p.lastName} (${p.seatNumber || '14A'})`).join(', ')}</span>
                      </div>
                    </div>

                    {/* Price and Action Buttons */}
                    <div className="md:col-span-3 flex flex-col justify-end gap-2 md:border-l md:border-border/40 md:pl-4">
                      <div className="text-right pb-1">
                        <span className="text-2xl font-black text-foreground">
                          {formatRupees(b.totalAmount)}
                        </span>
                        <span className="text-[10px] text-muted-foreground block -mt-1">
                          Total paid ({b.currency || 'INR'})
                        </span>
                      </div>

                      {b.status === 'CONFIRMED' && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => handleDownloadTicket(b.bookingReference)}
                            disabled={downloadingRef === b.bookingReference}
                            className="rounded-xl flex items-center justify-center gap-1.5 text-xs font-semibold"
                          >
                            <Download className="w-3.5 h-3.5" />
                            {downloadingRef === b.bookingReference ? 'Downloading...' : 'PDF E-Ticket'}
                          </Button>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setCancellingReference(b.bookingReference)}
                            className="rounded-xl text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                          >
                            Cancel Flight
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      {cancellingReference && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl bg-card border border-border p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-2 text-destructive">
              <AlertCircle className="w-5 h-5" />
              <h3 className="font-bold text-base">Cancel Flight Booking?</h3>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">
              Are you sure you wish to cancel booking <strong>{cancellingReference}</strong>? Any applicable refund will be credited back to your original payment card per airline fare rules.
            </p>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground">Reason for cancellation (optional)</label>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Change of plans, schedule conflict, etc."
                className="w-full h-20 p-2.5 rounded-xl border border-input bg-card text-xs focus:ring-2 focus:ring-destructive focus:outline-none resize-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCancellingReference(null)}
              >
                Keep Booking
              </Button>
              <Button
                variant="destructive"
                size="sm"
                disabled={cancelMutation.isPending}
                onClick={() =>
                  cancelMutation.mutate({
                    ref: cancellingReference,
                    reason: cancelReason,
                  })
                }
              >
                {cancelMutation.isPending ? 'Cancelling...' : 'Confirm Cancellation'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
