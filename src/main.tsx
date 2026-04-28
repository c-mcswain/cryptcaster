import '@/lib/errorReporter';
import { enableMapSet } from "immer";
enableMapSet();
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { RouteErrorBoundary } from '@/components/RouteErrorBoundary';
import '@/index.css'
import { HomePage } from '@/pages/HomePage'
import { AddStoryPage } from '@/pages/AddStoryPage'
import { TeleprompterPage } from '@/pages/TeleprompterPage'
import { SubmissionPage } from '@/pages/SubmissionPage'
import { LoginPage } from '@/pages/LoginPage'
import { ZineAdminPage } from '@/pages/ZineAdminPage'
import { CryptDashboardPage } from '@/pages/CryptDashboardPage'
import { ProtectedRoute } from '@/components/ProtectedRoute'
const queryClient = new QueryClient();
const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/login",
    element: <LoginPage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/crypt",
    element: <ProtectedRoute><CryptDashboardPage /></ProtectedRoute>,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/zine-admin",
    element: <ProtectedRoute><ZineAdminPage /></ProtectedRoute>,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/add",
    element: <ProtectedRoute><AddStoryPage /></ProtectedRoute>,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/read/:id",
    element: <ProtectedRoute><TeleprompterPage /></ProtectedRoute>,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/submit",
    element: <SubmissionPage />,
    errorElement: <RouteErrorBoundary />,
  },
]);
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>,
)