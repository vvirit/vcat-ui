import { Card } from '@mui/material';
import Button from '@mui/material/Button';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import DataTable from '../../../components/data-table/index.jsx';

export default function NodeListPage() {

  const columns = [
    {
      key: 'id',
      label: 'ID',
      dataIndex: 'id',
    },
    {
      key: 'name',
      label: 'Name',
      dataIndex: 'name',
    },
    {
      key: 'description',
      label: 'IP',
      dataIndex: 'ip',
    }
  ];

  const data = [
    {
      id: 1,
      name: 'local',
      ip: '192.168.0.1',
    }
  ]

  return (
    <>
      <DashboardContent>
        <CustomBreadcrumbs
          heading="List"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Node', href: paths.dashboard.task.root },
            { name: 'List' },
          ]}
          sx={{ mb: { xs: 3, md: 5 } }}
        />
        <div>
          <Button variant="contained" sx={{ mb: 2 }}>
            Add
          </Button>
        </div>
        <Card>
          <DataTable columns={columns} data={data}/>
        </Card>
      </DashboardContent>
    </>
  );
}
