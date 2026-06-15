import { createBrowserRouter, Navigate } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'
import { RequireAuth } from '@/features/auth/RequireAuth'
import { LoginPage } from '@/features/auth/LoginPage'
import { VmsPage } from '@/modules/vms/VmsPage'
import { PatrolPage } from '@/modules/patrol/PatrolPage'
import { HrPage } from '@/modules/hr/HrPage'
import { ShiftPage } from '@/modules/shift-attendance/ShiftPage'
import { TrainingPage } from '@/modules/training/TrainingPage'
import { StockPage } from '@/modules/stock/StockPage'
import { BillingPage } from '@/modules/billing/BillingPage'
import { PayrollPage } from '@/modules/payroll/PayrollPage'

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: (
      <RequireAuth>
        <AppShell />
      </RequireAuth>
    ),
    children: [
      { index: true, element: <Navigate to="/vms" replace /> },
      { path: 'vms', element: <VmsPage /> },
      { path: 'patrol', element: <PatrolPage /> },
      { path: 'hr', element: <HrPage /> },
      { path: 'shift', element: <ShiftPage /> },
      { path: 'training', element: <TrainingPage /> },
      { path: 'stock', element: <StockPage /> },
      { path: 'billing', element: <BillingPage /> },
      { path: 'payroll', element: <PayrollPage /> },
    ],
  },
])
