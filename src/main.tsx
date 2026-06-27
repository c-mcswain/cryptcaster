import '@/lib/errorReporter';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { enableMapSet } from 'immer';

import { ErrorBoundary } from '@/components/ErrorBoundary';
import { RouteErrorBoundary } from '@/components/RouteErrorBoundary';
import { ProtectedRoute } from '@/components/ProtectedRoute';

import { HomePage } from '@/pages/HomePage';
import { AddStoryPage } from '@/pages/AddStoryPage';
import { TeleprompterPage } from '@/pages/TeleprompterPage';
import { SubmissionPage } from '@/pages/SubmissionPage';
import { LoginPage } from '@/pages/LoginPage';
import { ZineAdminPage } from '@/pages/ZineAdminPage';
import { CryptDashboardPage } from '@/pages/CryptDashboardPage';

import '@/index.css';

enableMapSet();

const queryClient = new QueryClient();

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <HomePage />,
      errorElement: <RouteErrorBoundary />,
    },
    {
      path: '/login',
      element: <LoginPage />,
      errorElement: <RouteErrorBoundary />,
    },
    {
      path: '/crypt',
      element: (
        <ProtectedRoute>
          <CryptDashboardPage />
        </ProtectedRoute>
      ),
      errorElement: <RouteErrorBoundary />,
    },
    {
      path: '/zine-admin',
      element: (
        <ProtectedRoute>
          <ZineAdminPage />
        </ProtectedRoute>
      ),
      errorElement: <RouteErrorBoundary />,
    },
    {
      path: '/add',
      element: (
        <ProtectedRoute>
          <AddStoryPage />
        </ProtectedRoute>
      ),
      errorElement: <RouteErrorBoundary />,
    },
    {
      path: '/read/:id',
      element: <TeleprompterPage />,
      errorElement: <RouteErrorBoundary />,
    },
    {
      path: '/submit',
      element: <SubmissionPage />,
      errorElement: <RouteErrorBoundary />,
    },
  ],
  {
    basename: '/cryptcaster',
  }
);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </ErrorBoundary>
  </StrictMode>
);
