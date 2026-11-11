import React, { useState } from 'react';
import { useBookingStore } from '../booking.store';
import { bookingApi } from '../booking.api';
import { formatRupees } from '@/lib/currency';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  CreditCard,
  Lock,
  ShieldCheck,
  CheckCircle,
  AlertCircle,
  Sparkles,
  ArrowLeft,
} from 'lucide-react';

export const PaymentStep: React.FC = () => {
  const { draft, createdBooking, setStep, setCreatedBooking } = useBookingStore();

  const [cardholderName, setCardholderName] = useState(
    draft.passengers[0] ? `${draft.passengers[0].firstName} ${draft.passengers[0].lastName}` : 'Tushar Sharma'
  );
  const [cardNumber, setCardNumber] = useState('4242 4242 4242 4242');
  const [expiryDate, setExpiryDate] = useState('12/28');
  const [cvv, setCvv] = useState('123');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const bookingId = createdBooking?.id;

  const handleFillTestCard = () => {
    setCardNumber('4242 4242 4242 4242');
    setExpiryDate('12/28');
    setCvv('123');
  };

  const handleProcessPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingId) {
      setError('Booking session expired. Please return to step 1.');
      return;
    }

    try {
      setIsProcessing(true);
      setError(null);

      const res = await bookingApi.processPayment({
        bookingId,
        paymentMethod: 'CARD',
        cardholderName,
        cardNumber: cardNumber.replace(/\s+/g, ''),
        expiryDate,
        cvv,
      });

      // Update confirmed booking & move to Step 4 (Confirmation)
      setCreatedBooking(res.booking);
      setStep(4);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Payment processing failed. Please verify your card details.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {error && (
        <div className="p-4 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Payment Card Container */}
      <div className="p-6 sm:p-8 rounded-3xl glass-panel shadow-2xl border border-border/80 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-border/40">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-sky-500/10 text-sky-500 flex items-center justify-center">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-foreground">Secure Payment Checkout</h3>
              <p className="text-xs text-muted-foreground">Booking Ref: <strong>{createdBooking?.bookingReference}</strong></p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs text-muted-foreground block">Total Amount</span>
            <span className="text-2xl font-black text-sky-500">
              {formatRupees(draft.flight?.totalAmount || '0')}
            </span>
          </div>
        </div>

        {/* 1-Click Test Card Autofill */}
        <div className="flex items-center justify-between p-3 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-xs">
          <span className="font-semibold text-sky-600 dark:text-sky-400 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-400" />
            Testing Mode Active (Stripe Test Sandbox)
          </span>
          <button
            type="button"
            onClick={handleFillTestCard}
            className="px-3 py-1 rounded-xl bg-sky-500 text-white font-bold hover:bg-sky-600 transition-colors shadow-xs"
          >
            Autofill Test Card
          </button>
        </div>

        {/* Payment Form */}
        <form onSubmit={handleProcessPayment} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Cardholder Name
            </label>
            <Input
              value={cardholderName}
              onChange={(e) => setCardholderName(e.target.value)}
              placeholder="Tushar Sharma"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Card Number
            </label>
            <div className="relative">
              <Input
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                placeholder="4242 4242 4242 4242"
                required
              />
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <span className="text-[10px] font-bold bg-muted px-1.5 py-0.5 rounded text-foreground font-mono">
                  VISA
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Expiry Date
              </label>
              <Input
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                placeholder="MM/YY"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                CVV / CVC
              </label>
              <Input
                type="password"
                maxLength={4}
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
                placeholder="123"
                required
              />
            </div>
          </div>

          {/* Security Guarantee Badges */}
          <div className="pt-2 flex items-center justify-between text-xs text-muted-foreground border-t border-border/40">
            <span className="flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-emerald-500" />
              256-bit SSL Bank Grade Encryption
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-sky-500" />
              PCI-DSS Level 1 Certified
            </span>
          </div>

          <Button
            type="submit"
            size="lg"
            disabled={isProcessing}
            className="w-full h-12 rounded-2xl text-base font-bold shadow-xl shadow-sky-500/25 mt-4"
          >
            {isProcessing ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Tokenizing & Confirming Ticket...
              </span>
            ) : (
              <span>Pay ${parseFloat(draft.flight?.totalAmount || '0').toLocaleString()} & Issue E-Ticket</span>
            )}
          </Button>
        </form>
      </div>

      <div className="flex justify-start">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setStep(2)}
          className="text-muted-foreground hover:text-foreground flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          Review Itinerary
        </Button>
      </div>
    </div>
  );
};
