import React, { useState, useRef } from 'react';
import { useBookingStore } from '../booking.store';
import { useAuth } from '@/features/auth/useAuth';
import { PassengerData } from '../booking.types';
import { formatRupees } from '@/lib/currency';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  User,
  Mail,
  Phone,
  Calendar,
  Sparkles,
  ArrowRight,
  Shield,
  CreditCard,
  Armchair,
  Plane,
  Clock,
  Luggage,
  AlertCircle,
  FileText,
  CheckCircle2,
  HelpCircle,
  Utensils,
  HeartHandshake,
  IdCard,
} from 'lucide-react';

const COUNTRY_CODES = [
  { code: '+91', country: 'India (IN)' },
  { code: '+1', country: 'US / Canada (+1)' },
  { code: '+44', country: 'United Kingdom (+44)' },
  { code: '+971', country: 'UAE (+971)' },
  { code: '+65', country: 'Singapore (+65)' },
  { code: '+61', country: 'Australia (+61)' },
  { code: '+49', country: 'Germany (+49)' },
  { code: '+33', country: 'France (+33)' },
];

const NATIONALITIES = [
  { code: 'IN', name: 'India (Indian)' },
  { code: 'US', name: 'United States (American)' },
  { code: 'GB', name: 'United Kingdom (British)' },
  { code: 'AE', name: 'United Arab Emirates (Emirati)' },
  { code: 'CA', name: 'Canada (Canadian)' },
  { code: 'AU', name: 'Australia (Australian)' },
  { code: 'SG', name: 'Singapore (Singaporean)' },
  { code: 'DE', name: 'Germany (German)' },
  { code: 'FR', name: 'France (French)' },
];

export const PassengerFormStep: React.FC = () => {
  const { user } = useAuth();
  const { draft, updateDraft, setPassengers, setStep } = useBookingStore();

  const [contactEmail, setContactEmail] = useState(
    draft.contactEmail || user?.email || ''
  );
  const [countryCode, setCountryCode] = useState('+91');
  const [contactPhone, setContactPhone] = useState(
    draft.contactPhone ? draft.contactPhone.replace(/^\+\d+\s*/, '') : user?.phone || ''
  );
  const [saveToProfile, setSaveToProfile] = useState(draft.savePassengersToProfile);
  const [passengersList, setPassengersList] = useState<PassengerData[]>(draft.passengers);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const errorRef = useRef<HTMLDivElement>(null);

  const savedPassengers = user?.savedPassengers || [];
  const flight = draft.flight;

  const handlePassengerChange = (index: number, field: keyof PassengerData, value: any) => {
    const updated = [...passengersList];
    updated[index] = { ...updated[index], [field]: value };
    setPassengersList(updated);

    // Clear specific field error as user types
    if (errors[`p_${index}_${field}`]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[`p_${index}_${field}`];
        return copy;
      });
    }
  };

  const handleAutofill = (index: number, saved: any) => {
    const updated = [...passengersList];
    updated[index] = {
      ...updated[index],
      title: saved.title || 'Mr',
      firstName: saved.firstName || '',
      lastName: saved.lastName || '',
      dateOfBirth: saved.dateOfBirth ? saved.dateOfBirth.split('T')[0] : '',
      gender: saved.gender || 'MALE',
      nationality: saved.nationality || 'IN',
      documentType: 'Passport',
      passportNumber: saved.passportNumber || '',
      passportExpiry: saved.passportExpiry ? saved.passportExpiry.split('T')[0] : '',
    };
    setPassengersList(updated);
  };

  const validateAndProceed = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    // Validate Contact Email
    if (!contactEmail.trim() || !contactEmail.includes('@') || !contactEmail.includes('.')) {
      newErrors['contactEmail'] = 'A valid contact email is required for e-ticket delivery';
    }

    // Validate Contact Phone
    if (!contactPhone.trim() || contactPhone.replace(/\D/g, '').length < 8) {
      newErrors['contactPhone'] = 'A valid 10-digit mobile phone is required for flight alerts';
    }

    // Validate Passengers
    passengersList.forEach((p, idx) => {
      const pNum = idx + 1;

      if (!p.title) {
        newErrors[`p_${idx}_title`] = `Passenger ${pNum}: Title is required`;
      }
      if (!p.firstName.trim() || p.firstName.trim().length < 2) {
        newErrors[`p_${idx}_firstName`] = `Passenger ${pNum}: First name as on ID is required (min 2 characters)`;
      }
      if (!p.lastName.trim() || p.lastName.trim().length < 2) {
        newErrors[`p_${idx}_lastName`] = `Passenger ${pNum}: Last name / surname as on ID is required`;
      }
      if (!p.dateOfBirth) {
        newErrors[`p_${idx}_dateOfBirth`] = `Passenger ${pNum}: Date of birth is required for airline manifest`;
      } else {
        const dob = new Date(p.dateOfBirth);
        const today = new Date();
        if (dob >= today) {
          newErrors[`p_${idx}_dateOfBirth`] = `Passenger ${pNum}: Date of birth must be in the past`;
        }
      }
      if (!p.gender) {
        newErrors[`p_${idx}_gender`] = `Passenger ${pNum}: Gender is required`;
      }
      if (!p.nationality) {
        newErrors[`p_${idx}_nationality`] = `Passenger ${pNum}: Nationality is required`;
      }

      // ID / Passport Number
      if (!p.passportNumber || p.passportNumber.trim().length < 4) {
        newErrors[`p_${idx}_passportNumber`] = `Passenger ${pNum}: Government ID / Passport number is mandatory for airport entry`;
      }

      // If passport, require expiry
      if (p.documentType === 'Passport' && !p.passportExpiry) {
        newErrors[`p_${idx}_passportExpiry`] = `Passenger ${pNum}: Passport expiry date is required`;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      // Scroll to error
      errorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setErrors({});
    const fullPhone = `${countryCode} ${contactPhone.trim()}`;
    updateDraft({
      contactEmail: contactEmail.trim(),
      contactPhone: fullPhone,
      savePassengersToProfile: saveToProfile,
    });
    setPassengers(passengersList);
    setStep(2); // Move to Review
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Extract flight segment details for the preview card
  const outboundSlice = flight?.slices?.[0];
  const originAirport = outboundSlice?.origin;
  const destinationAirport = outboundSlice?.destination;
  const departureDateStr = outboundSlice?.departureTime
    ? new Date(outboundSlice.departureTime).toLocaleDateString('en-IN', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : '';
  const departureTimeStr = outboundSlice?.departureTime
    ? new Date(outboundSlice.departureTime).toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      })
    : '';
  const arrivalTimeStr = outboundSlice?.arrivalTime
    ? new Date(outboundSlice.arrivalTime).toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      })
    : '';

  return (
    <form onSubmit={validateAndProceed} className="space-y-8">
      
      {/* ── 1. Flight Itinerary & Fare Summary Card ── */}
      {flight && (
        <div className="rounded-3xl bg-card border border-border/80 p-5 sm:p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-border/60">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 p-1.5 border border-border/80 flex items-center justify-center shrink-0 shadow-sm">
                <img
                  src={flight.airline.logoUrl || `https://images.kiwi.com/airlines/64/${flight.airline.code}.png`}
                  alt={flight.airline.name}
                  className="w-7 h-7 object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.kiwi.com/airlines/64/6E.png';
                  }}
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-base text-foreground">{flight.airline.name}</h3>
                  <span className="text-xs px-2 py-0.5 rounded-md bg-muted text-muted-foreground font-mono font-bold">
                    {flight.airline.code}-{outboundSlice?.segments?.[0]?.flightNumber || '801'}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {flight.cabinClass.replace('_', ' ')} • {departureDateStr}
                </p>
              </div>
            </div>

            {/* Guaranteed Total Fare */}
            <div className="text-right">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block">
                Total Guaranteed Fare
              </span>
              <span className="text-xl sm:text-2xl font-black text-primary">
                {formatRupees(flight.totalAmount)}
              </span>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 block font-semibold">
                ✓ Inclusive of All Taxes & Airport Fees
              </span>
            </div>
          </div>

          {/* Route & Timing Strip */}
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 items-center gap-4 text-xs">
            {/* Origin */}
            <div className="space-y-0.5">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Departure</span>
              <div className="text-base font-extrabold text-foreground">{departureTimeStr}</div>
              <div className="font-bold text-sky-600 dark:text-sky-400">{originAirport?.iataCode}</div>
              <div className="text-muted-foreground text-[11px] truncate">{originAirport?.city || 'Origin'}</div>
            </div>

            {/* Flight Duration & Stops */}
            <div className="text-center space-y-1">
              <div className="text-[11px] text-muted-foreground font-semibold flex items-center justify-center gap-1">
                <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                <span>
                  {outboundSlice?.durationMinutes
                    ? `${Math.floor(outboundSlice.durationMinutes / 60)}h ${outboundSlice.durationMinutes % 60}m`
                    : '2h 15m'}
                </span>
              </div>
              <div className="relative flex items-center justify-center">
                <div className="w-full h-0.5 bg-border relative">
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-primary" />
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-primary" />
                </div>
                <Plane className="w-3.5 h-3.5 text-primary absolute -top-1.5 bg-card px-0.5" />
              </div>
              <span className="inline-block text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                Direct / Non-stop
              </span>
            </div>

            {/* Destination */}
            <div className="text-right sm:text-right space-y-0.5">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Arrival</span>
              <div className="text-base font-extrabold text-foreground">{arrivalTimeStr}</div>
              <div className="font-bold text-sky-600 dark:text-sky-400">{destinationAirport?.iataCode}</div>
              <div className="text-muted-foreground text-[11px] truncate">{destinationAirport?.city || 'Destination'}</div>
            </div>
          </div>

          {/* Included Baggage Strip */}
          <div className="mt-4 pt-3 border-t border-border/50 flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 font-medium">
                <Luggage className="w-3.5 h-3.5 text-sky-500" />
                Cabin: <strong>7 kg</strong> included
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5 font-medium">
                <Luggage className="w-3.5 h-3.5 text-emerald-500" />
                Check-in: <strong>15 kg</strong> included
              </span>
            </div>
            <span className="text-[11px] text-muted-foreground">
              Pass-through GDS Electronic Ticket
            </span>
          </div>
        </div>
      )}

      {/* ── 2. Civil Aviation Mandatory Notice Banner ── */}
      <div className="rounded-2xl bg-amber-500/10 border border-amber-500/30 p-4 sm:p-5 flex items-start gap-3.5">
        <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
        <div className="text-xs sm:text-sm text-foreground space-y-1 leading-relaxed">
          <p className="font-bold text-amber-600 dark:text-amber-400">
            Aviation Regulatory Requirement:
          </p>
          <p className="text-muted-foreground text-xs leading-normal">
            Passenger details must match your official government-issued photo ID (Aadhaar Card, Passport, Voter ID) <strong>exactly</strong>. Fields marked with <span className="text-red-500 font-bold">*</span> are required by the airline to generate your valid PNR and confirmed boarding pass.
          </p>
        </div>
      </div>

      {/* Error Alert Box if any validation fails */}
      {Object.keys(errors).length > 0 && (
        <div
          ref={errorRef}
          className="p-4 rounded-2xl bg-destructive/10 border border-destructive/30 text-destructive text-xs sm:text-sm space-y-1.5 animate-pulse"
        >
          <div className="font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>Please complete all {Object.keys(errors).length} required field(s) marked in red:</span>
          </div>
          <ul className="list-disc pl-5 space-y-0.5 text-xs">
            {Object.values(errors).slice(0, 4).map((err, i) => (
              <li key={i}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      {/* ── 3. Contact & E-Ticket Delivery Details Card ── */}
      <div className="p-6 rounded-3xl bg-card border border-border/80 shadow-sm space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-sky-500" />
            <h3 className="font-bold text-lg text-foreground">Contact & Ticket Delivery Details</h3>
          </div>
          <span className="text-[11px] font-semibold text-muted-foreground bg-muted px-2.5 py-1 rounded-full">
            All fields required for PNR issuance
          </span>
        </div>
        <p className="text-xs text-muted-foreground">
          Your confirmed E-ticket PDF, booking reference (PNR), and real-time gate change alerts will be dispatched here.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          {/* Contact Email */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1">
              <span>Contact Email</span>
              <span className="text-red-500 font-bold">*</span>
            </label>
            <Input
              type="email"
              value={contactEmail}
              onChange={(e) => {
                setContactEmail(e.target.value);
                if (errors['contactEmail']) {
                  setErrors((prev) => {
                    const copy = { ...prev };
                    delete copy['contactEmail'];
                    return copy;
                  });
                }
              }}
              placeholder="e.g. yourname@example.com"
              className={errors['contactEmail'] ? 'border-destructive focus-visible:ring-destructive' : ''}
              required
            />
            {errors['contactEmail'] ? (
              <p className="text-xs text-destructive font-medium">{errors['contactEmail']}</p>
            ) : (
              <p className="text-[11px] text-muted-foreground">Boarding pass PDF will be sent here</p>
            )}
          </div>

          {/* Mobile Phone with Country Code */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1">
              <span>Mobile Phone</span>
              <span className="text-red-500 font-bold">*</span>
            </label>
            <div className="flex gap-2">
              <select
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                className="w-32 h-10 px-2 rounded-xl border border-input bg-card text-xs font-semibold focus:ring-2 focus:ring-sky-500 focus:outline-none shrink-0"
              >
                {COUNTRY_CODES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.code} {c.country.split(' ')[0]}
                  </option>
                ))}
              </select>
              <Input
                type="tel"
                value={contactPhone}
                onChange={(e) => {
                  setContactPhone(e.target.value);
                  if (errors['contactPhone']) {
                    setErrors((prev) => {
                      const copy = { ...prev };
                      delete copy['contactPhone'];
                      return copy;
                    });
                  }
                }}
                placeholder="9876543210"
                className={`flex-1 ${errors['contactPhone'] ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                required
              />
            </div>
            {errors['contactPhone'] ? (
              <p className="text-xs text-destructive font-medium">{errors['contactPhone']}</p>
            ) : (
              <p className="text-[11px] text-muted-foreground">SMS flight delay and gate alerts will be sent here</p>
            )}
          </div>
        </div>
      </div>

      {/* ── 4. Passengers Information Cards ── */}
      <div className="space-y-6">
        {passengersList.map((passenger, idx) => (
          <div
            key={idx}
            className="p-6 rounded-3xl bg-card border border-border/80 shadow-sm space-y-6"
          >
            {/* Passenger Header & Autofill */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-border/50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                  {idx + 1}
                </div>
                <div>
                  <h4 className="font-bold text-base text-foreground">
                    Passenger {idx + 1} ({passenger.type})
                  </h4>
                  <span className="text-[11px] text-muted-foreground">
                    Primary Traveler • Government ID Mandatory
                  </span>
                </div>
              </div>

              {/* Quick Autofill Pills if available */}
              {savedPassengers.length > 0 && (
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-xs text-muted-foreground font-semibold flex items-center gap-1 mr-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    Quick Fill:
                  </span>
                  {savedPassengers.map((saved) => (
                    <button
                      key={saved.id}
                      type="button"
                      onClick={() => handleAutofill(idx, saved)}
                      className="px-2.5 py-1 rounded-full text-xs font-semibold bg-sky-500/10 text-sky-600 dark:text-sky-400 hover:bg-sky-500 hover:text-white transition-all border border-sky-500/20"
                    >
                      {saved.firstName} {saved.lastName}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Row 1: Title, First Name, Last Name */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
              {/* Title */}
              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1">
                  <span>Title</span>
                  <span className="text-red-500 font-bold">*</span>
                </label>
                <select
                  value={passenger.title || 'Mr'}
                  onChange={(e) => handlePassengerChange(idx, 'title', e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-input bg-card text-sm font-semibold focus:ring-2 focus:ring-sky-500 focus:outline-none"
                >
                  <option value="Mr">Mr.</option>
                  <option value="Ms">Ms.</option>
                  <option value="Mrs">Mrs.</option>
                  <option value="Dr">Dr.</option>
                </select>
              </div>

              {/* First Name */}
              <div className="sm:col-span-5 space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1">
                  <span>First Name (as on Govt ID)</span>
                  <span className="text-red-500 font-bold">*</span>
                </label>
                <Input
                  value={passenger.firstName}
                  onChange={(e) => handlePassengerChange(idx, 'firstName', e.target.value)}
                  placeholder="e.g. Tushar"
                  className={errors[`p_${idx}_firstName`] ? 'border-destructive focus-visible:ring-destructive' : ''}
                  required
                />
                {errors[`p_${idx}_firstName`] && (
                  <p className="text-xs text-destructive font-medium">{errors[`p_${idx}_firstName`]}</p>
                )}
              </div>

              {/* Last Name */}
              <div className="sm:col-span-5 space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1">
                  <span>Last Name / Surname</span>
                  <span className="text-red-500 font-bold">*</span>
                </label>
                <Input
                  value={passenger.lastName}
                  onChange={(e) => handlePassengerChange(idx, 'lastName', e.target.value)}
                  placeholder="e.g. Sharma"
                  className={errors[`p_${idx}_lastName`] ? 'border-destructive focus-visible:ring-destructive' : ''}
                  required
                />
                {errors[`p_${idx}_lastName`] && (
                  <p className="text-xs text-destructive font-medium">{errors[`p_${idx}_lastName`]}</p>
                )}
              </div>
            </div>

            {/* Row 2: Date of Birth, Gender, Nationality */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Date of Birth */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1">
                  <span>Date of Birth</span>
                  <span className="text-red-500 font-bold">*</span>
                </label>
                <Input
                  type="date"
                  value={passenger.dateOfBirth || ''}
                  onChange={(e) => handlePassengerChange(idx, 'dateOfBirth', e.target.value)}
                  className={errors[`p_${idx}_dateOfBirth`] ? 'border-destructive focus-visible:ring-destructive' : ''}
                  required
                />
                {errors[`p_${idx}_dateOfBirth`] ? (
                  <p className="text-xs text-destructive font-medium">{errors[`p_${idx}_dateOfBirth`]}</p>
                ) : (
                  <p className="text-[11px] text-muted-foreground">Required for adult / child ticket fare</p>
                )}
              </div>

              {/* Gender */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1">
                  <span>Gender</span>
                  <span className="text-red-500 font-bold">*</span>
                </label>
                <select
                  value={passenger.gender || 'MALE'}
                  onChange={(e) => handlePassengerChange(idx, 'gender', e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-input bg-card text-sm font-semibold focus:ring-2 focus:ring-sky-500 focus:outline-none"
                >
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other / Non-binary</option>
                </select>
              </div>

              {/* Nationality */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1">
                  <span>Nationality</span>
                  <span className="text-red-500 font-bold">*</span>
                </label>
                <select
                  value={passenger.nationality || 'IN'}
                  onChange={(e) => handlePassengerChange(idx, 'nationality', e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-input bg-card text-sm font-semibold focus:ring-2 focus:ring-sky-500 focus:outline-none"
                >
                  {NATIONALITIES.map((n) => (
                    <option key={n.code} value={n.code}>
                      {n.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Row 3: Travel Document Type & ID / Passport Number */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-border/50">
              {/* Document Type */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1">
                  <IdCard className="w-3.5 h-3.5 text-sky-500" />
                  <span>ID Document Type</span>
                  <span className="text-red-500 font-bold">*</span>
                </label>
                <select
                  value={passenger.documentType || 'Aadhaar Card'}
                  onChange={(e) => handlePassengerChange(idx, 'documentType', e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-input bg-card text-sm font-semibold focus:ring-2 focus:ring-sky-500 focus:outline-none"
                >
                  <option value="Aadhaar Card">Aadhaar Card (Domestic)</option>
                  <option value="Passport">Passport (Int'l / Domestic)</option>
                  <option value="Voter ID Card">Voter ID Card</option>
                  <option value="Driving License">Driving License</option>
                </select>
              </div>

              {/* Document / Passport Number */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1">
                  <span>Document / ID Number</span>
                  <span className="text-red-500 font-bold">*</span>
                </label>
                <Input
                  value={passenger.passportNumber || ''}
                  onChange={(e) => handlePassengerChange(idx, 'passportNumber', e.target.value)}
                  placeholder={
                    passenger.documentType === 'Passport'
                      ? 'e.g. Z1234567'
                      : passenger.documentType === 'Voter ID Card'
                      ? 'e.g. ABC1234567'
                      : 'e.g. 5432 1098 7654'
                  }
                  className={errors[`p_${idx}_passportNumber`] ? 'border-destructive focus-visible:ring-destructive' : ''}
                  required
                />
                {errors[`p_${idx}_passportNumber`] ? (
                  <p className="text-xs text-destructive font-medium">{errors[`p_${idx}_passportNumber`]}</p>
                ) : (
                  <p className="text-[11px] text-muted-foreground">Required for CISF & airline gate verification</p>
                )}
              </div>

              {/* Expiry Date (Required for Passport) */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1">
                  <span>Document Expiry</span>
                  {passenger.documentType === 'Passport' && (
                    <span className="text-red-500 font-bold">*</span>
                  )}
                </label>
                <Input
                  type="date"
                  value={passenger.passportExpiry || ''}
                  onChange={(e) => handlePassengerChange(idx, 'passportExpiry', e.target.value)}
                  className={errors[`p_${idx}_passportExpiry`] ? 'border-destructive focus-visible:ring-destructive' : ''}
                />
                {errors[`p_${idx}_passportExpiry`] ? (
                  <p className="text-xs text-destructive font-medium">{errors[`p_${idx}_passportExpiry`]}</p>
                ) : (
                  <p className="text-[11px] text-muted-foreground">Mandatory if travelling on a Passport</p>
                )}
              </div>
            </div>

            {/* Row 4: Travel Preferences (Meal, Special Assistance, Seat) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-border/50">
              {/* Meal Preference */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                  <Utensils className="w-3.5 h-3.5 text-amber-500" />
                  <span>Meal Preference</span>
                </label>
                <select
                  value={passenger.mealPreference || 'Vegetarian Hindu Meal'}
                  onChange={(e) => handlePassengerChange(idx, 'mealPreference', e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-input bg-card text-xs font-semibold focus:ring-2 focus:ring-sky-500 focus:outline-none"
                >
                  <option value="Vegetarian Hindu Meal">Vegetarian Hindu Meal</option>
                  <option value="Jain Vegetarian Meal">Jain Meal (No Onion/Garlic)</option>
                  <option value="Non-Vegetarian Meal">Non-Vegetarian Meal</option>
                  <option value="Vegan Meal">Vegan Meal</option>
                  <option value="No Meal Required">No In-Flight Meal</option>
                </select>
              </div>

              {/* Special Assistance */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                  <HeartHandshake className="w-3.5 h-3.5 text-rose-500" />
                  <span>Special Assistance</span>
                </label>
                <select
                  value={passenger.specialAssistance || 'None'}
                  onChange={(e) => handlePassengerChange(idx, 'specialAssistance', e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-input bg-card text-xs font-semibold focus:ring-2 focus:ring-sky-500 focus:outline-none"
                >
                  <option value="None">No Assistance Needed</option>
                  <option value="Wheelchair (Ramp)">Wheelchair Assistance (Ramp)</option>
                  <option value="Wheelchair (Steps)">Wheelchair Assistance (Steps)</option>
                  <option value="Senior Citizen Support">Senior Citizen Support</option>
                </select>
              </div>

              {/* Seat Assignment */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                  <Armchair className="w-3.5 h-3.5 text-sky-500" />
                  <span>Seat Allocation</span>
                </label>
                <div className="h-10 px-3 rounded-xl border border-input bg-muted/40 text-xs font-semibold text-muted-foreground flex items-center justify-between">
                  <span>Auto-allocated free at check-in</span>
                  <span className="font-bold text-sky-600 dark:text-sky-400">FREE</span>
                </div>
              </div>
            </div>

          </div>
        ))}
      </div>

      {/* ── 5. Save to Profile Checkbox ── */}
      <label className="flex items-center gap-3 p-4 rounded-2xl bg-card border border-border/60 cursor-pointer shadow-sm">
        <input
          type="checkbox"
          checked={saveToProfile}
          onChange={(e) => setSaveToProfile(e.target.checked)}
          className="w-4 h-4 rounded accent-sky-500 cursor-pointer"
        />
        <span className="text-xs font-medium text-foreground">
          Save these passenger details to my profile for 1-click faster checkout on future flights
        </span>
      </label>

      {/* ── 6. Continue to Next Step CTA ── */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
        <div className="text-xs text-muted-foreground flex items-center gap-1.5">
          <Shield className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>256-Bit Encrypted Aviation Manifest Transmission</span>
        </div>

        <Button
          type="submit"
          size="lg"
          className="w-full sm:w-auto px-8 py-3 rounded-2xl text-sm sm:text-base font-bold shadow-lg shadow-sky-600/20 flex items-center justify-center gap-2 group"
        >
          <span>Continue to Itinerary & Baggage Review</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>

    </form>
  );
};
