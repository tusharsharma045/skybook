import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useBookingStore } from '@/features/booking/booking.store';
import { BookingStepper } from '@/features/booking/components/BookingStepper';
import { PassengerFormStep } from '@/features/booking/components/PassengerFormStep';
import { ReviewStep } from '@/features/booking/components/ReviewStep';
import { PaymentStep } from '@/features/booking/components/PaymentStep';
import { ConfirmationStep } from '@/features/booking/components/ConfirmationStep';
import { Button } from '@/components/ui/button';
import { Plane } from 'lucide-react';

export const BookingPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentStep, draft, setFlight } = useBookingStore();

  useEffect(() => {
    // If a flight was passed in location state (e.g. from flight card selection)
    const incomingFlight = (location.state as any)?.flight || (location.state as any)?.preservedFlight;
    if (incomingFlight) {
      setFlight(incomingFlight);
    }
  }, [location.state, setFlight]);

  // If no flight is selected in draft and not at confirmation step, redirect to flights
  if (!draft.flight && currentStep < 4) {
    return (
      <div className="container max-w-lg mx-auto py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto text-muted-foreground">
          <Plane className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold">No Flight Selected</h2>
        <p className="text-xs text-muted-foreground">
          Please select a flight offer from search results to begin your reservation.
        </p>
        <Button onClick={() => navigate('/flights')}>
          Search Available Flights
        </Button>
      </div>
    );
  }

  return (
    <div className="container max-w-5xl mx-auto py-10 px-4 sm:px-6 lg:px-8 space-y-8">
      {/* 4-Step Progress Indicator */}
      <BookingStepper currentStep={currentStep} />

      {/* Current Step Component */}
      <div>
        {currentStep === 1 && <PassengerFormStep />}
        {currentStep === 2 && <ReviewStep />}
        {currentStep === 3 && <PaymentStep />}
        {currentStep === 4 && <ConfirmationStep />}
      </div>
    </div>
  );
};
