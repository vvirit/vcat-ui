import { Outlet } from 'react-router';
import { lazy, Suspense } from 'react';

import { CONFIG } from 'src/global-config';
import { DashboardLayout } from 'src/layouts/dashboard';

import { LoadingScreen } from 'src/components/loading-screen';

import { AuthGuard } from 'src/auth/guard';

import { usePathname } from '../hooks';

// ----------------------------------------------------------------------

const IndexPage = lazy(() => import('src/pages/dashboard/one'));
const PageTwo = lazy(() => import('src/pages/dashboard/two'));
const PageThree = lazy(() => import('src/pages/dashboard/three'));
const PageFour = lazy(() => import('src/pages/dashboard/four'));
const PageFive = lazy(() => import('src/pages/dashboard/five'));
const PageSix = lazy(() => import('src/pages/dashboard/six'));
const NodeListPage = lazy(() => import('src/pages/dashboard/task/node/list.jsx'));
const TaskListPage = lazy(() => import('src/pages/dashboard/task/tasks/list.jsx'));
const InterparkPerformListPage = lazy(() => import('src/pages/dashboard/interpark/perform/list'));
const InterparkSeatRotatePoolListPage = lazy(() => import('src/pages/dashboard/interpark/seat-rotate-pool/list'));
const InterparkPreOrderListPage = lazy(() => import('src/pages/dashboard/interpark/pre-order/list'));
const InterparkOrderListPage = lazy(() => import('src/pages/dashboard/interpark/order/list'));
const InterparkAccountListPage = lazy(() => import('src/pages/dashboard/interpark/account/list.jsx'));
const InterparkAccountGroupListPage = lazy(() => import('src/pages/dashboard/interpark/account-group/list.jsx'));
const ProxyListPage = lazy(() => import('src/pages/dashboard/config/proxy/list'));
const QueueRouterListPage = lazy(() => import('src/pages/dashboard/task/queue-routers/list.jsx'));

// ----------------------------------------------------------------------

function SuspenseOutlet() {
  const pathname = usePathname();
  return (
    <Suspense key={pathname} fallback={<LoadingScreen />}>
      <Outlet />
    </Suspense>
  );
}

const dashboardLayout = () => (
  <DashboardLayout>
    <SuspenseOutlet />
  </DashboardLayout>
);

export const dashboardRoutes = [
  {
    path: 'dashboard',
    element: CONFIG.auth.skip ? dashboardLayout() : <AuthGuard>{dashboardLayout()}</AuthGuard>,
    children: [
      { element: <IndexPage />, index: true },
      { path: 'two', element: <PageTwo /> },
      { path: 'three', element: <PageThree /> },
      {
        path: 'group',
        children: [
          { element: <PageFour />, index: true },
          { path: 'five', element: <PageFive /> },
          { path: 'six', element: <PageSix /> },
        ],
      },
      {
        path: 'task',
        children: [
          { path: 'node-list', element: <NodeListPage /> },
          { path: 'task-list', element: <TaskListPage /> },
          { path: 'queue-router-list', element: <QueueRouterListPage /> },
        ],
      },
      {
        path: 'config',
        children: [{ path: 'proxy-list', element: <ProxyListPage /> }],
      },
      {
        path: 'interpark',
        children: [
          { path: 'perform-list', element: <InterparkPerformListPage /> },
          { path: 'order-list', element: <InterparkOrderListPage /> },
          { path: 'pre-order-list', element: <InterparkPreOrderListPage /> },
          { path: 'seat-rotate-pool-list', element: <InterparkSeatRotatePoolListPage /> },
          { path: 'account-list', element: <InterparkAccountListPage /> },
          { path: 'account-group-list', element: <InterparkAccountGroupListPage /> },
        ],
      },
    ],
  },
];
