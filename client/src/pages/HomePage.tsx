import React from 'react';
import { FlightSearchWidget } from '@/features/flights/components/FlightSearchWidget';
import { PopularDestinations } from '@/features/flights/components/PopularDestinations';
import { FlightOffersSection } from '@/features/flights/components/FlightOffersSection';
import { WhyChooseUs } from '@/features/flights/components/WhyChooseUs';
import { ChevronDown, Star, Award, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

export const HomePage: React.FC = () => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-[#eaf1f8] via-[#f4f7fb] to-background dark:from-[#081226] dark:via-[#0c1833] dark:to-background">
      {/* Aviation Ambient Sky Glow Background */}
      <div className="absolute top-0 right-0 w-[800px] h-[600px] bg-gradient-to-bl from-sky-400/20 via-blue-600/10 to-transparent blur-[140px] -z-10 pointer-events-none" />
      <div className="absolute top-1/4 left-0 w-[600px] h-[500px] bg-gradient-to-tr from-amber-400/10 via-sky-300/10 to-transparent blur-[120px] -z-10 pointer-events-none" />

      {/* Main Hero Container */}
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-14">
        {/* Exact Hero Section Matching Design */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Column: Headline & Flight Search Widget */}
          <div className="lg:col-span-7 xl:col-span-7 space-y-6 z-10 flex flex-col justify-between">
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-1"
            >
              <span className="text-sm sm:text-base font-semibold tracking-wide text-[#1c4982] dark:text-sky-300 italic font-serif">
                Our Wings, Your World
              </span>
              <h1 className="text-5xl sm:text-6xl xl:text-7xl font-extrabold uppercase font-display text-[#09326e] dark:text-white tracking-tight leading-[0.95] drop-shadow-xs">
                ELEVATE YOUR<br />EXPERIENCE
              </h1>
            </motion.div>

            {/* Floating Search Widget */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
            >
              <FlightSearchWidget />
            </motion.div>
          </div>

          {/* Right Column: Hero Airplane Visual */}
          <div className="lg:col-span-5 xl:col-span-5 relative w-full flex flex-col justify-end pt-4 lg:pt-14">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative w-full h-full min-h-[420px] lg:min-h-[460px] flex flex-col"
            >
              {/* Organic Curved Container for Airplane Graphic */}
              <div className="relative flex-1 w-full rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white/60 dark:border-white/10 group bg-slate-900/40">
                <img
                  src="/hero-airplane.png"
                  alt="Aviation jetliner banking through sunset clouds"
                  className="absolute inset-0 w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-1000 ease-out"
                />
                {/* Subtle soft gradient bottom edge */}
                <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/60 via-black/20 to-transparent pointer-events-none" />
                <div className="absolute bottom-5 left-5 right-5 text-white text-xs font-medium flex items-center justify-between pointer-events-none">
                  <span className="bg-black/40 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20 shadow-sm">
                    ✈ Premium Long-Haul Fleet
                  </span>
                  <span className="bg-black/40 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20 shadow-sm">
                    Non-stop Connectivity
                  </span>
                </div>
              </div>

              {/* Decorative Floating Accent Glow */}
              <div className="absolute -inset-4 bg-gradient-to-r from-sky-400/20 to-blue-600/20 rounded-[3rem] blur-xl -z-10" />
            </motion.div>
          </div>
        </div>

        {/* Global Rating & Safety Badge (7 Stars) */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="mt-10 pt-6 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left"
        >
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
            <div className="flex items-center text-amber-400 gap-0.5">
              {[...Array(7)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400 drop-shadow-xs" />
              ))}
            </div>
            <span className="text-xs sm:text-sm font-semibold text-foreground">
              Awarded highest ranking for safety and service by global rating agencies
            </span>
          </div>

          <a
            href="#offers"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-600 dark:text-sky-400 hover:text-sky-700 transition-colors cursor-pointer group"
          >
            <span>Scroll down to see our best offers</span>
            <ChevronDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
          </a>
        </motion.div>

        {/* Popular Destinations (Indian & Global hubs) */}
        <PopularDestinations />

        {/* Exclusive Airline Offers & Flash Deals */}
        <div id="offers">
          <FlightOffersSection />
        </div>

        {/* Why Choose Us */}
        <WhyChooseUs />
      </div>
    </div>
  );
};
