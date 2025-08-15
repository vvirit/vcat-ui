import { paths } from 'src/routes/paths.js';

import { DashboardContent } from 'src/layouts/dashboard/index.js';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs/index.js';

import DataTable from '../../../../components/data-table/index.jsx';

export default function NodeListPage() {
  const columns = [
    {
      key: 'name',
      label: 'Name',
      dataIndex: 'name',
      width: 200,
    },
    {
      key: 'ip',
      label: 'IP',
      dataIndex: 'ip',
      width: 200,
    },
    {
      key: 'version',
      label: 'Client version',
      dataIndex: 'version',
      width: 140,
    },
    {
      key: 'license',
      label: 'License',
      dataIndex: 'licence',
      width: 280,
    },
    {
      key: 'State',
      label: 'State',
      dataIndex: 'state',
      width: 120,
      render: () => <>123</>,
    },
    {
      key: 'onlineTime',
      label: 'Online time',
      dataIndex: 'onlineTime',
      render: () => <>123</>,
    },
  ];

  const data = [
    {
      id: 1,
      name: 'local',
      ip: '192.168.0.1',
      licence: 'xxxx-xxxx-xxxx-xxxx',
      version: '1.0.0',
    },
    {
      id: 1,
      name: 'local',
      ip: '192.168.0.1',
      licence: 'xxxx-xxxx-xxxx-xxxx',
      version: '1.0.0',
    },
  ];

  return (
    <>
      <DashboardContent>
        <CustomBreadcrumbs
          heading="Nodes"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Node', href: paths.dashboard.task.root },
            { name: 'Nodes' },
          ]}
          sx={{ mb: { xs: 3, md: 5 } }}
        />
        <DataTable
          columns={columns}
          data={{
            content: data,
            totalElements: 300,
          }}
          enableCheck
          size="small"
        />
      </DashboardContent>
    </>
  );
}
