import React from 'react';
import { FlightSearchWidget } from '@/features/flights/components/FlightSearchWidget';
import { PopularDestinations } from '@/features/flights/components/PopularDestinations';
import { FlightOffersSection } from '@/features/flights/components/FlightOffersSection';
import { WhyChooseUs } from '@/features/flights/components/WhyChooseUs';
import { ShieldCheck, Headphones, BadgePercent, Plane } from 'lucide-react';
import { motion } from 'framer-motion';

export const HomePage: React.FC = () => {
  return (
    <div className="bg-background">
      {/* ══════════════════════════════════════════════════════
          HERO — full viewport with floating cylindrical navbar
      ══════════════════════════════════════════════════════ */}
      <section
        className="relative w-full min-h-screen lg:h-screen flex flex-col justify-between overflow-hidden -mt-[68px] sm:-mt-[80px]"
      >
        {/* ── Background airplane image & atmospheric lighting ── */}
        <div className="absolute inset-0 z-0">
          <img
            src="/hero-airplane.jpg"
            alt="Airplane soaring above sunset clouds"
            className="w-full h-full object-cover object-[62%_center]"
          />
          {/* Subtle gradient for text readability without washing out the photo */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#061a3a]/70 via-[#061a3a]/25 to-transparent" />
          <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/20 to-transparent" />
        </div>

        {/* ── Main Hero Content (Headline + Flight Search Card) ── */}
        <div className="relative z-10 flex-1 flex flex-col justify-center container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 pb-3">
          <div className="max-w-[580px]">
            {/* Pill Badge */}
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/25 rounded-full px-3.5 py-1 mb-2.5"
            >
              <span className="text-white text-xs font-semibold tracking-wide">✈ Our Wings, Your World</span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.06 }}
              className="text-3xl sm:text-4xl lg:text-[3.25rem] font-extrabold leading-[1.05] tracking-tight text-white mb-1.5"
            >
              Elevate Your<br />
              <span className="text-sky-400">Experience</span>
            </motion.h1>

            {/* Sub-headline */}
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.12 }}
              className="text-white/80 text-xs sm:text-sm mb-3.5"
            >
              Book flights, explore the world, and fly with comfort.
            </motion.p>

            {/* Flight Search Widget Card */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.18 }}
            >
              <FlightSearchWidget />
            </motion.div>
          </div>
        </div>

        {/* ── Bottom Section: Trust Badges (Left) & Dream. Book. Fly. (Right) ── */}
        <div className="relative z-10 w-full container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-5 pt-1">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            
            {/* Left: 100% Secure, 24/7 Support, Best Price */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-white">
              {/* Badge 1 */}
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-sky-400 shrink-0" />
                <div className="flex flex-col">
                  <span className="text-xs font-bold leading-tight">100% Secure</span>
                  <span className="text-[11px] text-white/70 leading-tight">Booking</span>
                </div>
              </div>

              {/* Divider */}
              <div className="h-7 w-[1px] bg-white/20 hidden sm:block" />

              {/* Badge 2 */}
              <div className="flex items-center gap-2.5">
                <Headphones className="w-5 h-5 text-sky-400 shrink-0" />
                <div className="flex flex-col">
                  <span className="text-xs font-bold leading-tight">24/7 Customer</span>
                  <span className="text-[11px] text-white/70 leading-tight">Support</span>
                </div>
              </div>

              {/* Divider */}
              <div className="h-7 w-[1px] bg-white/20 hidden sm:block" />

              {/* Badge 3 */}
              <div className="flex items-center gap-2.5">
                <BadgePercent className="w-5 h-5 text-sky-400 shrink-0" />
                <div className="flex flex-col">
                  <span className="text-xs font-bold leading-tight">Best Price</span>
                  <span className="text-[11px] text-white/70 leading-tight">Guarantee</span>
                </div>
              </div>
            </div>

            {/* Right: Line + Airplane + Dream. Book. Fly. in stylish bold script */}
            <div className="flex items-center gap-3 self-end sm:self-auto">
              {/* Trailing line */}
              <div className="w-12 sm:w-20 lg:w-28 h-[1.5px] bg-white/45 hidden xs:block" />
              
              {/* Airplane icon */}
              <Plane className="w-5 h-5 text-white transform rotate-45 shrink-0 drop-shadow-md" />

              {/* Stylish cursive text with calligraphy swoosh underline */}
              <div className="relative inline-block pb-1">
                <span className="font-script text-3xl sm:text-4xl lg:text-[2.75rem] font-bold text-white tracking-wide drop-shadow-lg select-none whitespace-nowrap">
                  Dream. Book. Fly.
                </span>
                {/* Calligraphic swoosh underline under the words */}
                <svg
                  className="absolute -bottom-1 sm:-bottom-1.5 right-0 w-36 sm:w-48 lg:w-56 h-3 text-white/90"
                  viewBox="0 0 180 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4 3.5C35 2 110 1.5 176 9"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          BELOW-THE-FOLD SECTIONS
      ══════════════════════════════════════════════════════ */}
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14">
        <PopularDestinations />
        <div id="offers">
          <FlightOffersSection />
        </div>
        <WhyChooseUs />
      </div>
    </div>
  );
};
