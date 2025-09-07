import { paths } from 'src/routes/paths';

import { CONFIG } from 'src/global-config';

import { SvgColor } from 'src/components/svg-color';

import { Iconify } from '../components/iconify/index.js';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`${CONFIG.assetsDir}/assets/icons/navbar/${name}.svg`} />;

const ICONS = {
  job: icon('ic-job'),
  blog: icon('ic-blog'),
  chat: icon('ic-chat'),
  mail: icon('ic-mail'),
  user: icon('ic-user'),
  file: icon('ic-file'),
  lock: icon('ic-lock'),
  tour: icon('ic-tour'),
  order: icon('ic-order'),
  label: icon('ic-label'),
  blank: icon('ic-blank'),
  kanban: icon('ic-kanban'),
  folder: icon('ic-folder'),
  course: icon('ic-course'),
  params: icon('ic-params'),
  banking: icon('ic-banking'),
  booking: icon('ic-booking'),
  invoice: icon('ic-invoice'),
  product: icon('ic-product'),
  calendar: icon('ic-calendar'),
  disabled: icon('ic-disabled'),
  external: icon('ic-external'),
  subpaths: icon('ic-subpaths'),
  menuItem: icon('ic-menu-item'),
  ecommerce: icon('ic-ecommerce'),
  analytics: icon('ic-analytics'),
  dashboard: icon('ic-dashboard'),
};

// ----------------------------------------------------------------------

export const navData = [
  {
    items: [
      {
        title: 'Task',
        path: paths.dashboard.task.root,
        icon: <Iconify icon="mdi:robot" />,
        children: [
          { title: 'Nodes', path: paths.dashboard.task.nodeList },
          { title: 'Tasks', path: paths.dashboard.task.taskList },
          { title: 'Tasks instance', path: paths.dashboard.task.taskInstanceList },
          { title: 'Queue routers', path: paths.dashboard.task.queueRouterList },
        ],
      },
      {
        title: 'Interpark',
        path: paths.dashboard.interpark.root,
        icon: <Iconify icon="mdi:web"/>,
        children: [
          { title: 'Performs', path: paths.dashboard.interpark.performList },
          { title: 'Orders', path: paths.dashboard.interpark.orderList },
          { title: 'Lock Only Orders', path: paths.dashboard.interpark.preOrderList },
          { title: 'Seat Rotate Pools', path: paths.dashboard.interpark.seatRotatePoolList },
          { title: 'Accounts', path: paths.dashboard.interpark.accountList },
          { title: 'Account groups', path: paths.dashboard.interpark.accountGroupList },
        ],
      },
      {
        title: 'Setting',
        path: paths.dashboard.config.root,
        icon: <Iconify icon="mdi:cog" />,
        children: [
          { title: 'Proxy', path: paths.dashboard.config.proxyList },
          { title: 'System Setting', path: paths.dashboard.config.systemSettingList },
        ],
      },
    ],
  },
];
