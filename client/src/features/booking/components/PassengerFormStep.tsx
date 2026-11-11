import React, { useState } from 'react';
import { useBookingStore } from '../booking.store';
import { useAuth } from '@/features/auth/useAuth';
import { PassengerData } from '../booking.types';
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
} from 'lucide-react';

export const PassengerFormStep: React.FC = () => {
  const { user } = useAuth();
  const { draft, updateDraft, setPassengers, setStep } = useBookingStore();

  const [contactEmail, setContactEmail] = useState(draft.contactEmail || user?.email || '');
  const [contactPhone, setContactPhone] = useState(draft.contactPhone || user?.phone || '');
  const [saveToProfile, setSaveToProfile] = useState(draft.savePassengersToProfile);
  const [passengersList, setPassengersList] = useState<PassengerData[]>(draft.passengers);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const savedPassengers = user?.savedPassengers || [];

  const handlePassengerChange = (index: number, field: keyof PassengerData, value: any) => {
    const updated = [...passengersList];
    updated[index] = { ...updated[index], [field]: value };
    setPassengersList(updated);
  };

  const handleAutofill = (index: number, saved: any) => {
    const updated = [...passengersList];
    updated[index] = {
      ...updated[index],
      title: saved.title || 'Mr',
      firstName: saved.firstName,
      lastName: saved.lastName,
      dateOfBirth: saved.dateOfBirth ? saved.dateOfBirth.split('T')[0] : '1990-05-15',
      gender: saved.gender || 'MALE',
      nationality: saved.nationality || 'IN',
      passportNumber: saved.passportNumber || '',
      passportExpiry: saved.passportExpiry ? saved.passportExpiry.split('T')[0] : '2032-10-20',
    };
    setPassengersList(updated);
  };

  const validateAndProceed = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    if (!contactEmail || !contactEmail.includes('@')) {
      newErrors['contactEmail'] = 'Valid contact email is required for e-ticket delivery';
    }

    passengersList.forEach((p, idx) => {
      if (!p.firstName.trim()) {
        newErrors[`p_${idx}_firstName`] = 'First name is required';
      }
      if (!p.lastName.trim()) {
        newErrors[`p_${idx}_lastName`] = 'Last name is required';
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    updateDraft({
      contactEmail,
      contactPhone,
      savePassengersToProfile: saveToProfile,
    });
    setPassengers(passengersList);
    setStep(2); // Move to Review
  };

  return (
    <form onSubmit={validateAndProceed} className="space-y-8">
      {/* Contact Information Card */}
      <div className="p-6 rounded-3xl glass-panel shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <Mail className="w-5 h-5 text-sky-500" />
          <h3 className="font-bold text-lg text-foreground">Contact & Ticket Delivery Details</h3>
        </div>
        <p className="text-xs text-muted-foreground">
          Your official boarding pass and booking receipts will be dispatched to this email.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Contact Email
            </label>
            <Input
              type="email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              placeholder="alex@skybook.com"
              required
            />
            {errors['contactEmail'] && (
              <p className="text-xs text-destructive">{errors['contactEmail']}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Mobile Phone
            </label>
            <Input
              type="tel"
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              placeholder="+91 98765 43210"
            />
          </div>
        </div>
      </div>

      {/* Passengers List Cards */}
      <div className="space-y-6">
        {passengersList.map((passenger, idx) => (
          <div
            key={idx}
            className="p-6 rounded-3xl glass-panel shadow-sm space-y-5 border border-border/80"
          >
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-border/40">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-sky-500/10 text-sky-500 flex items-center justify-center font-bold text-xs">
                  {idx + 1}
                </div>
                <h4 className="font-bold text-base text-foreground">
                  Passenger {idx + 1} ({passenger.type})
                </h4>
              </div>

              {/* Quick Autofill Pills from Profile */}
              {savedPassengers.length > 0 && (
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-xs text-muted-foreground font-semibold flex items-center gap-1 mr-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
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

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="sm:col-span-1 space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Title
                </label>
                <select
                  value={passenger.title}
                  onChange={(e) => handlePassengerChange(idx, 'title', e.target.value)}
                  className="w-full h-11 px-3 rounded-xl border border-input bg-card text-sm font-semibold focus:ring-2 focus:ring-sky-500 focus:outline-none"
                >
                  <option value="Mr">Mr.</option>
                  <option value="Ms">Ms.</option>
                  <option value="Mrs">Mrs.</option>
                  <option value="Dr">Dr.</option>
                </select>
              </div>

              <div className="sm:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    First Name (as on passport)
                  </label>
                  <Input
                    value={passenger.firstName}
                    onChange={(e) => handlePassengerChange(idx, 'firstName', e.target.value)}
                    placeholder="Alex"
                    required
                  />
                  {errors[`p_${idx}_firstName`] && (
                    <p className="text-xs text-destructive">{errors[`p_${idx}_firstName`]}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Last Name (as on passport)
                  </label>
                  <Input
                    value={passenger.lastName}
                    onChange={(e) => handlePassengerChange(idx, 'lastName', e.target.value)}
                    placeholder="Morgan"
                    required
                  />
                  {errors[`p_${idx}_lastName`] && (
                    <p className="text-xs text-destructive">{errors[`p_${idx}_lastName`]}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Date of Birth
                </label>
                <Input
                  type="date"
                  value={passenger.dateOfBirth || ''}
                  onChange={(e) => handlePassengerChange(idx, 'dateOfBirth', e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Gender
                </label>
                <select
                  value={passenger.gender}
                  onChange={(e) => handlePassengerChange(idx, 'gender', e.target.value)}
                  className="w-full h-11 px-3 rounded-xl border border-input bg-card text-sm font-semibold focus:ring-2 focus:ring-sky-500 focus:outline-none"
                >
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other / Non-binary</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Nationality
                </label>
                <Input
                  value={passenger.nationality}
                  onChange={(e) => handlePassengerChange(idx, 'nationality', e.target.value)}
                  placeholder="IN"
                />
              </div>
            </div>

            {/* Passport & Seat Preference */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-border/40">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Passport Number
                </label>
                <Input
                  value={passenger.passportNumber || ''}
                  onChange={(e) => handlePassengerChange(idx, 'passportNumber', e.target.value)}
                  placeholder="E98273641"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Passport Expiry
                </label>
                <Input
                  type="date"
                  value={passenger.passportExpiry || ''}
                  onChange={(e) => handlePassengerChange(idx, 'passportExpiry', e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                  <Armchair className="w-3.5 h-3.5 text-sky-500" />
                  Seat Assignment
                </label>
                <Input
                  value={passenger.seatNumber || `${12 + idx}A`}
                  onChange={(e) => handlePassengerChange(idx, 'seatNumber', e.target.value)}
                  placeholder="14A"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Save to Profile Checkbox */}
      <label className="flex items-center gap-3 p-4 rounded-2xl bg-muted/40 border border-border/50 cursor-pointer">
        <input
          type="checkbox"
          checked={saveToProfile}
          onChange={(e) => setSaveToProfile(e.target.checked)}
          className="w-4 h-4 rounded accent-sky-500 cursor-pointer"
        />
        <span className="text-xs font-medium text-foreground">
          Save passenger details to my profile for faster future bookings
        </span>
      </label>

      {/* CTA Next */}
      <div className="flex justify-end pt-4">
        <Button
          type="submit"
          size="lg"
          className="px-8 rounded-2xl text-base font-bold shadow-lg flex items-center gap-2 group"
        >
          <span>Continue to Itinerary Review</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
    </form>
  );
};
