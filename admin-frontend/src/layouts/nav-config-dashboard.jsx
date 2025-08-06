import { paths } from 'src/routes/paths';

import { CONFIG } from 'src/global-config';

import { Label } from 'src/components/label';
import { SvgColor } from 'src/components/svg-color';

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
  /**
   * Overview
   */
  {
    subheader: 'Overview',
    items: [
    ],
  },
  {
    subheader: 'Task',
    items: [
      {
        title: 'Task',
        path: paths.dashboard.task.root,
        icon: ICONS.user,
        children: [
          { title: 'Nodes', path: paths.dashboard.task.nodeList },
          { title: 'Tasks', path: paths.dashboard.task.taskList },
        ],
      },
    ],
  },
  {
    subheader: 'Data',
    items: [
      {
        title: 'Interpark',
        path: paths.dashboard.interpark.root,
        children: [
          { title: 'Performs', path: paths.dashboard.interpark.performList },
        ],
      },
      {
        title: 'Melon',
        path: 'melon',
        children: [
        ],
      },
      {
        title: 'Yes24',
        path: 'yes24',
        children: [
        ],
      },
    ],
  },
];
