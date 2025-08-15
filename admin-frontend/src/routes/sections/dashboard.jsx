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
const TaskListPage = lazy(() => import('src/pages/dashboard/task/task-list'));
const InterparkPerformListPage = lazy(() => import('src/pages/dashboard/interpark/perform/list'));
const ProxyListPage = lazy(() => import('src/pages/dashboard/config/proxy/list'));

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
        ],
      },
      {
        path: 'config',
        children: [{ path: 'proxy-list', element: <ProxyListPage /> }],
      },
      {
        path: 'interpark',
        children: [{ path: 'perform-list', element: <InterparkPerformListPage /> }],
      },
    ],
  },
];
