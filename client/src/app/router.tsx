import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { RootLayout } from './RootLayout';
import { HomePage } from '@/pages/HomePage';
import { FlightResultsPage } from '@/pages/FlightResultsPage';
import { LoginPage } from '@/pages/LoginPage';
import { RegisterPage } from '@/pages/RegisterPage';
import { BookingsPage } from '@/pages/BookingsPage';
import { ProfilePage } from '@/pages/ProfilePage';
import { BookingPage } from '@/pages/BookingPage';
import { LegalPage } from '@/pages/LegalPage';
import { ProtectedRoute } from '@/features/auth/components/ProtectedRoute';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'flights',
        element: <FlightResultsPage />,
      },
      {
        path: 'booking/*',
        element: (
          <ProtectedRoute>
            <BookingPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'login',
        element: <LoginPage />,
      },
      {
        path: 'register',
        element: <RegisterPage />,
      },
      {
        path: 'bookings',
        element: (
          <ProtectedRoute>
            <BookingsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'profile',
        element: (
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'terms',
        element: <LegalPage />,
      },
      {
        path: 'privacy',
        element: <LegalPage />,
      },
      {
        path: 'cookies',
        element: <LegalPage />,
      },
      {
        path: 'legal',
        element: <LegalPage />,
      },
    ],
  },
]);
