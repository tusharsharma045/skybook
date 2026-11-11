import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Tag, Sparkles, ArrowRight, Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const FlightOffersSection: React.FC = () => {
  const navigate = useNavigate();

  const deals = [
    {
      id: 'deal_1',
      title: 'Metro Express Special',
      route: 'New Delhi (DEL) → Mumbai (BOM)',
      carrier: 'IndiGo / Air India',
      discount: 'FLAT ₹800 OFF',
      code: 'FLYINDIA',
      validUntil: 'Daily non-stop flights',
      origin: 'DEL',
      destination: 'BOM',
      price: '₹3,899',
    },
    {
      id: 'deal_2',
      title: 'Goa Coastal Weekend Getaway',
      route: 'Mumbai (BOM) → Goa (GOI)',
      carrier: 'Akasa Air / Vistara',
      discount: 'BEACH ESCAPE 20% OFF',
      code: 'GOAWEEKEND',
      validUntil: 'Valid this week',
      origin: 'BOM',
      destination: 'GOI',
      price: '₹3,299',
    },
    {
      id: 'deal_3',
      title: 'Silicon Valley Corridor',
      route: 'Bengaluru (BLR) → Delhi (DEL)',
      carrier: 'Air India / IndiGo',
      discount: 'Complimentary Hot Meal',
      code: 'BLRDEL',
      validUntil: 'Morning & evening departures',
      origin: 'BLR',
      destination: 'DEL',
      price: '₹4,750',
    },
    {
      id: 'deal_4',
      title: 'International Gulf Gateway',
      route: 'New Delhi (DEL) → Dubai (DXB)',
      carrier: 'Emirates / Air India',
      discount: 'Extra 5kg Baggage Allowance',
      code: 'DXB2026',
      validUntil: 'Limited promo seats',
      origin: 'DEL',
      destination: 'DXB',
      price: '₹18,499',
    },
  ];

  const handleBookDeal = (deal: any) => {
    const depDate = new Date();
    depDate.setDate(depDate.getDate() + 14);

    const params = new URLSearchParams({
      origin: deal.origin,
      destination: deal.destination,
      departureDate: depDate.toISOString().split('T')[0],
      tripType: 'ONE_WAY',
      adults: '1',
      children: '0',
      infants: '0',
      cabinClass: 'ECONOMY',
    });

    navigate(`/flights?${params.toString()}`);
  };

  return (
    <section className="py-12">
      <div className="flex items-center gap-2 mb-6">
        <Flame className="w-5 h-5 text-rose-500 animate-pulse" />
        <h3 className="text-xl font-bold font-['Plus_Jakarta_Sans']">
          Exclusive Airline Offers & Flash Deals
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {deals.map((deal) => (
          <div
            key={deal.id}
            className="p-6 rounded-3xl border border-sky-500/20 bg-gradient-to-br from-sky-500/5 via-card to-blue-500/5 backdrop-blur-md relative overflow-hidden flex flex-col justify-between space-y-4"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-sky-600 dark:text-sky-400 bg-sky-500/10 px-2.5 py-0.5 rounded-full">
                  <Tag className="w-3 h-3" />
                  {deal.discount}
                </span>
                <h4 className="font-extrabold text-lg text-foreground pt-1">
                  {deal.title}
                </h4>
                <p className="text-xs text-muted-foreground font-semibold">
                  {deal.route} • {deal.carrier}
                </p>
              </div>

              <div className="text-right">
                <span className="text-xs text-muted-foreground block">From</span>
                <span className="text-2xl font-black text-sky-500">{deal.price}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-border/40">
              <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-1 rounded-lg">
                Promo: <strong className="text-foreground">{deal.code}</strong>
              </span>

              <Button
                size="sm"
                onClick={() => handleBookDeal(deal)}
                className="rounded-xl flex items-center gap-1.5 text-xs font-bold"
              >
                Search This Offer
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
