import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { CookieConsentBanner } from '@/components/common/CookieConsentBanner';

export const RootLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-sky-500/20 selection:text-sky-600">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <CookieConsentBanner />
    </div>
  );
};
