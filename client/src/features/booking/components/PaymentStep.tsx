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
  ArrowLeft,
  Smartphone,
  QrCode,
  Info,
} from 'lucide-react';

export const PaymentStep: React.FC = () => {
  const { draft, createdBooking, setStep, setCreatedBooking } = useBookingStore();

  const [paymentMode, setPaymentMode] = useState<'UPI' | 'CARD'>('UPI');

  // UPI State
  const [upiUtr, setUpiUtr] = useState('');
  const [isUpiProcessing, setIsUpiProcessing] = useState(false);

  // Card State
  const [cardholderName, setCardholderName] = useState(
    draft.passengers[0]
      ? `${draft.passengers[0].firstName} ${draft.passengers[0].lastName}`.trim()
      : ''
  );
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const bookingId = createdBooking?.id;

  // Build UPI deep link (works with Paytm, GPay, PhonePe, etc.)
  const flightAmount = parseFloat(draft.flight?.totalAmount || '0').toFixed(2);
  const bookingRef = createdBooking?.bookingReference || 'SKYBOOK';
  const upiLink = `upi://pay?pa=9953499271@fam&pn=SkyBook+Flights&am=${flightAmount}&cu=INR&tn=Flight+Booking+${bookingRef}`;
  const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&color=0ea5e9&bgcolor=ffffff&data=${encodeURIComponent(upiLink)}`;

  // Format Card Number as 4-4-4-4
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 16);
    const formatted = raw.replace(/(\d{4})(?=\d)/g, '$1 ');
    setCardNumber(formatted);
  };

  // Format Expiry Date as MM/YY
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (raw.length >= 3) {
      raw = `${raw.slice(0, 2)}/${raw.slice(2)}`;
    }
    setExpiryDate(raw);
  };

  // Format UTR as digits only (12 digits)
  const handleUtrChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 12);
    setUpiUtr(raw);
    if (error) setError(null);
  };

  // UPI Payment Verification
  const handleUpiConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingId) {
      setError('Booking session expired. Please return to step 1.');
      return;
    }

    const cleanUtr = upiUtr.trim();
    if (!cleanUtr) {
      setError('Payment verification required: Please scan the QR code with Paytm/UPI, complete payment of ' + formatRupees(draft.flight?.totalAmount || '0') + ', and enter the 12-digit UPI Reference / UTR Number.');
      return;
    }

    if (cleanUtr.length !== 12 || !/^\d{12}$/.test(cleanUtr)) {
      setError('Invalid UPI UTR Number: Please enter the exact 12-digit transaction reference number from your Paytm payment receipt (e.g. 432109876543).');
      return;
    }

    try {
      setIsUpiProcessing(true);
      setError(null);
      const res = await bookingApi.processPayment({
        bookingId,
        paymentMethod: `UPI (Ref: ${cleanUtr})`,
        cardholderName: `${draft.passengers[0]?.firstName || ''} ${draft.passengers[0]?.lastName || ''}`.trim() || 'Traveler',
        cardNumber: cleanUtr,
        expiryDate: '00/00',
        cvv: '000',
      });
      setCreatedBooking(res.booking);
      setStep(4);
    } catch (err: any) {
      setError(err.response?.data?.message || 'UPI verification failed. Please verify your transaction details.');
    } finally {
      setIsUpiProcessing(false);
    }
  };

  // Card Payment Verification
  const handleProcessCardPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingId) {
      setError('Booking session expired. Please return to step 1.');
      return;
    }

    const cleanCard = cardNumber.replace(/\s+/g, '');
    if (cleanCard.length < 15 || cleanCard.length > 16) {
      setError('Please enter a valid 16-digit debit or credit card number.');
      return;
    }

    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiryDate.trim())) {
      setError('Please enter a valid card expiry date in MM/YY format (e.g. 08/28).');
      return;
    }

    if (cvv.trim().length < 3) {
      setError('Please enter a valid 3-digit CVV/CVC code.');
      return;
    }

    if (!cardholderName.trim()) {
      setError('Please enter the name on your card.');
      return;
    }

    try {
      setIsProcessing(true);
      setError(null);

      const res = await bookingApi.processPayment({
        bookingId,
        paymentMethod: 'CARD',
        cardholderName,
        cardNumber: cleanCard,
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

      {/* Main Payment Container */}
      <div className="p-6 sm:p-8 rounded-3xl glass-panel shadow-2xl border border-border/80 space-y-6">
        {/* Header Summary */}
        <div className="flex items-center justify-between pb-4 border-b border-border/40">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-sky-500/10 text-sky-500 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-foreground">Secure Payment Gateway</h3>
              <p className="text-xs text-muted-foreground">Booking Ref: <strong>{createdBooking?.bookingReference}</strong></p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs text-muted-foreground block">Payable Amount</span>
            <span className="text-2xl font-black text-sky-500">
              {formatRupees(draft.flight?.totalAmount || '0')}
            </span>
          </div>
        </div>

        {/* Payment Method Selector Tabs */}
        <div className="grid grid-cols-2 gap-3 p-1.5 rounded-2xl bg-muted/60 border border-border/60">
          <button
            type="button"
            onClick={() => { setPaymentMode('UPI'); setError(null); }}
            className={`py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
              paymentMode === 'UPI'
                ? 'bg-card text-foreground shadow-sm border border-border'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Smartphone className="w-4 h-4 text-emerald-500" />
            <span>UPI / Paytm QR</span>
            <span className="text-[10px] uppercase font-black bg-emerald-500/10 text-emerald-500 px-1.5 py-0.5 rounded-md">
              Instant
            </span>
          </button>

          <button
            type="button"
            onClick={() => { setPaymentMode('CARD'); setError(null); }}
            className={`py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
              paymentMode === 'CARD'
                ? 'bg-card text-foreground shadow-sm border border-border'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <CreditCard className="w-4 h-4 text-sky-500" />
            <span>Debit / Credit Card</span>
          </button>
        </div>

        {/* ── MODE 1: UPI / PAYTM QR PAYMENT ── */}
        {paymentMode === 'UPI' && (
          <form onSubmit={handleUpiConfirm} className="space-y-6">
            <div className="flex flex-col items-center gap-4 text-center">
              {/* QR Code */}
              <div className="p-3.5 bg-white rounded-3xl shadow-xl border border-sky-100">
                <img
                  src={qrApiUrl}
                  alt="Paytm UPI QR Code"
                  width={210}
                  height={210}
                  className="rounded-2xl block"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src =
                      'https://api.qrserver.com/v1/create-qr-code/?size=210x210&data=upi://pay?pa=9953499271@fam';
                  }}
                />
              </div>

              {/* Amount Display */}
              <div>
                <p className="text-xs text-muted-foreground font-medium">Scan to pay exact amount</p>
                <p className="text-3xl font-black text-emerald-500 tracking-tight">
                  {formatRupees(draft.flight?.totalAmount || '0')}
                </p>
              </div>

              {/* UPI ID Badge */}
              <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-muted/60 border border-border/80 text-xs">
                <span className="text-muted-foreground">UPI ID:</span>
                <strong className="font-mono text-foreground text-sm select-all">9953499271@fam</strong>
              </div>

              {/* Direct App Link for mobile */}
              <a
                href={upiLink}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-600 dark:text-sky-400 font-semibold text-xs hover:bg-sky-500/20 transition-colors"
              >
                <Smartphone className="w-3.5 h-3.5" />
                Open Paytm / PhonePe / GPay
              </a>
            </div>

            {/* MANDATORY UPI UTR INPUT */}
            <div className="p-4 rounded-2xl bg-muted/40 border border-border/80 space-y-3">
              <div className="flex items-start gap-2 text-xs text-muted-foreground">
                <Info className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />
                <p>
                  After completing the payment on Paytm or your UPI app, enter the <strong>12-digit UPI Ref ID / UTR Number</strong> from your payment receipt below to verify and issue your ticket.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center justify-between">
                  <span>12-Digit UPI Ref / UTR Number <span className="text-destructive">*</span></span>
                  <span className="text-[11px] font-mono text-muted-foreground font-normal">{upiUtr.length}/12</span>
                </label>
                <Input
                  type="text"
                  maxLength={12}
                  value={upiUtr}
                  onChange={handleUtrChange}
                  placeholder="e.g. 432109876543"
                  className="font-mono text-base tracking-widest text-center h-12 rounded-xl"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              size="lg"
              disabled={isUpiProcessing || upiUtr.length !== 12}
              className="w-full h-12 rounded-2xl text-base font-bold bg-emerald-500 hover:bg-emerald-600 shadow-xl shadow-emerald-500/25 disabled:opacity-50"
            >
              {isUpiProcessing ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Verifying Payment &amp; Issuing Ticket...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Verify UPI Payment &amp; Issue Ticket
                </span>
              )}
            </Button>
          </form>
        )}

        {/* ── MODE 2: CARD PAYMENT ── */}
        {paymentMode === 'CARD' && (
          <form onSubmit={handleProcessCardPayment} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Cardholder Name <span className="text-destructive">*</span>
              </label>
              <Input
                value={cardholderName}
                onChange={(e) => setCardholderName(e.target.value)}
                placeholder="Full name on card"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Card Number <span className="text-destructive">*</span>
              </label>
              <Input
                value={cardNumber}
                onChange={handleCardNumberChange}
                placeholder="0000 0000 0000 0000"
                maxLength={19}
                className="font-mono"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Expiry Date <span className="text-destructive">*</span>
                </label>
                <Input
                  value={expiryDate}
                  onChange={handleExpiryChange}
                  placeholder="MM/YY"
                  maxLength={5}
                  className="font-mono text-center"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  CVV / CVC <span className="text-destructive">*</span>
                </label>
                <Input
                  type="password"
                  maxLength={4}
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                  placeholder="•••"
                  className="font-mono text-center"
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
              disabled={isProcessing || cardNumber.replace(/\s+/g, '').length < 15 || cvv.length < 3 || expiryDate.length < 5}
              className="w-full h-12 rounded-2xl text-base font-bold shadow-xl shadow-sky-500/25 mt-4 disabled:opacity-50"
            >
              {isProcessing ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Verifying Card &amp; Issuing Ticket...
                </span>
              ) : (
                <span>Pay {formatRupees(draft.flight?.totalAmount || '0')} &amp; Issue E-Ticket</span>
              )}
            </Button>
          </form>
        )}
      </div>

      {/* Navigation */}
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
