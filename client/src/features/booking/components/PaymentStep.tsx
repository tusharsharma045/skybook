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
  Smartphone,
  QrCode,
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
  const [isUpiProcessing, setIsUpiProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const bookingId = createdBooking?.id;

  // Build UPI deep link (works with Paytm, GPay, PhonePe, etc.)
  const flightAmount = parseFloat(draft.flight?.totalAmount || '0').toFixed(2);
  const bookingRef = createdBooking?.bookingReference || 'SKYBOOK';
  const upiLink = `upi://pay?pa=9953499271@fam&pn=SkyBook+Flights&am=${flightAmount}&cu=INR&tn=Flight+Booking+${bookingRef}`;
  const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&color=0ea5e9&bgcolor=ffffff&data=${encodeURIComponent(upiLink)}`;

  const handleFillTestCard = () => {
    setCardNumber('4242 4242 4242 4242');
    setExpiryDate('12/28');
    setCvv('123');
  };

  const handleUpiConfirm = async () => {
    if (!bookingId) {
      setError('Booking session expired. Please return to step 1.');
      return;
    }
    try {
      setIsUpiProcessing(true);
      setError(null);
      const res = await bookingApi.processPayment({
        bookingId,
        paymentMethod: 'UPI',
        cardholderName: `${draft.passengers[0]?.firstName || ''} ${draft.passengers[0]?.lastName || ''}`.trim(),
        cardNumber: '0000000000000000',
        expiryDate: '00/00',
        cvv: '000',
      });
      setCreatedBooking(res.booking);
      setStep(4);
    } catch (err: any) {
      setError(err.response?.data?.message || 'UPI confirmation failed. Please try again.');
    } finally {
      setIsUpiProcessing(false);
    }
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
              <span>Pay {formatRupees(draft.flight?.totalAmount || '0')} & Issue E-Ticket</span>
            )}
          </Button>
        </form>
      </div>

      {/* ── UPI / QR Payment ── */}
      <div className="p-6 sm:p-8 rounded-3xl glass-panel shadow-2xl border border-border/80 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3 pb-4 border-b border-border/40">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
            <QrCode className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-foreground">Pay via UPI / QR Code</h3>
            <p className="text-xs text-muted-foreground">
              Works with Paytm, Google Pay, PhonePe &amp; all UPI apps
            </p>
          </div>
        </div>

        {/* OR divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-border/50" />
          <span className="text-xs font-bold tracking-widest text-muted-foreground uppercase">OR</span>
          <div className="flex-1 h-px bg-border/50" />
        </div>

        {/* QR + Details */}
        <div className="flex flex-col items-center gap-4">
          {/* QR Code */}
          <div className="p-3 bg-white rounded-2xl shadow-lg">
            <img
              src={qrApiUrl}
              alt="UPI QR Code"
              width={220}
              height={220}
              className="rounded-xl block"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src =
                  'https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=upi://pay?pa=9953499271@fam';
              }}
            />
          </div>

          {/* Amount */}
          <div className="text-center">
            <p className="text-xs text-muted-foreground mb-0.5">Pay exactly</p>
            <p className="text-3xl font-black text-emerald-500">{formatRupees(draft.flight?.totalAmount || '0')}</p>
          </div>

          {/* UPI ID Badge */}
          <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-muted/60 border border-border/60">
            <Smartphone className="w-4 h-4 text-sky-500 shrink-0" />
            <span className="text-sm font-semibold tracking-tight text-foreground select-all">
              9953499271@fam
            </span>
          </div>

          <p className="text-xs text-muted-foreground text-center max-w-xs">
            Scan the QR with any UPI app. The amount is pre-filled. After paying, tap the button below to confirm your ticket.
          </p>

          {/* Paytm deep-link direct button (mobile) */}
          <a
            href={upiLink}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-sky-500/10 border border-sky-500/30 text-sky-600 dark:text-sky-400 font-semibold text-sm hover:bg-sky-500/20 transition-colors"
          >
            <Smartphone className="w-4 h-4" />
            Open in Paytm / UPI App
          </a>
        </div>

        {/* Confirm after payment */}
        <div className="pt-2 border-t border-border/40 space-y-3">
          <p className="text-xs text-muted-foreground text-center">
            Once you have completed the UPI payment, tap below to issue your e-ticket.
          </p>
          <Button
            type="button"
            size="lg"
            onClick={handleUpiConfirm}
            disabled={isUpiProcessing}
            className="w-full h-12 rounded-2xl text-base font-bold bg-emerald-500 hover:bg-emerald-600 shadow-xl shadow-emerald-500/25"
          >
            {isUpiProcessing ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Verifying &amp; Issuing Ticket...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                I've Paid via UPI — Issue My Ticket
              </span>
            )}
          </Button>
        </div>
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
