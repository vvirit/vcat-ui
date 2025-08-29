import { useState } from 'react';

import { paths } from 'src/routes/paths.js';

import { getNodes } from 'src/service/node.js';
import { DashboardContent } from 'src/layouts/dashboard/index.js';

import DataTable from 'src/components/vcat/VDataTable.jsx';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs/index.js';

const NodeListPage = () => {
  const [data, setData] = useState([]);

  const columns = [
    {
      key: 'id',
      label: 'ID',
      dataIndex: 'id',
      width: 340,
    },
    {
      key: 'version',
      label: 'Version',
      dataIndex: 'version',
      width: 140,
    },
    {
      key: 'onlineTime',
      label: 'Online time',
      dataIndex: 'onlineTime',
    },
  ];

  return (
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
          list: data,
        }}
        onFetchData={async () => {
          const response = await getNodes();
          setData(response);
        }}
        enableCheck
        enablePage={false}
      />
    </DashboardContent>
  );
};

export default NodeListPage;
