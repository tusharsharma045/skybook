import React from 'react';
import { ShieldCheck, Zap, RefreshCw, BadgePercent, Award, Headphones } from 'lucide-react';
import { motion } from 'framer-motion';

export const WhyChooseUs: React.FC = () => {
  const perks = [
    {
      icon: <Zap className="w-6 h-6 text-sky-500" />,
      title: 'Real-time GDS Direct Fares',
      description: 'Zero stale pricing. Live seat inventory connected directly with major carriers and global distribution systems.',
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-emerald-500" />,
      title: 'Encrypted Biometric Checkouts',
      description: 'Bank-grade security with hashed JWT session rotation and saved frequent flyer passports ready in one click.',
    },
    {
      icon: <RefreshCw className="w-6 h-6 text-blue-500" />,
      title: 'Frictionless Ticket Changes',
      description: 'Transparent fare rules with automated self-service date changes and instant cancellation handling.',
    },
    {
      icon: <BadgePercent className="w-6 h-6 text-amber-500" />,
      title: 'No Hidden Service Fees',
      description: 'The price you see is the exact final price at checkout with taxes and mandatory airport surcharges accounted for.',
    },
    {
      icon: <Award className="w-6 h-6 text-indigo-500" />,
      title: 'Standardized E-Tickets',
      description: 'Download IATA-compliant PDF boarding passes instantly with verifiable QR codes and PNR locator references.',
    },
    {
      icon: <Headphones className="w-6 h-6 text-rose-500" />,
      title: '24/7 Aviation Specialist Care',
      description: 'Round-the-clock priority flight support for schedule changes, weather delays, and baggage assistance.',
    },
  ];

  return (
    <section className="py-16 border-t border-border/40">
      <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
        <span className="text-xs font-bold text-sky-500 uppercase tracking-wider">
          Aviation Grade Excellence
        </span>
        <h2 className="text-3xl font-extrabold tracking-tight text-foreground font-['Plus_Jakarta_Sans']">
          Why Discerning Travelers Choose SkyBook
        </h2>
        <p className="text-sm text-muted-foreground">
          Built for seamless flight discoveries, instant bookings, and total peace of mind in the skies.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {perks.map((perk, i) => (
          <motion.div
            key={perk.title}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
            className="p-6 rounded-3xl border border-border/70 bg-card/60 backdrop-blur-md hover:border-sky-500/30 transition-all space-y-3"
          >
            <div className="w-12 h-12 rounded-2xl bg-muted/80 flex items-center justify-center">
              {perk.icon}
            </div>
            <h3 className="font-bold text-base text-foreground">
              {perk.title}
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {perk.description}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
