import { useState } from 'react';

import Button from '@mui/material/Button';

import { paths } from 'src/routes/paths.js';

import { DashboardContent } from 'src/layouts/dashboard/index.js';

import { Iconify } from 'src/components/iconify/index.js';
import DataTable from 'src/components/vcat/VDataTable.jsx';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs/index.js';

import CreateForm from './form.jsx';
import {getPagedProxies} from "../../../../service/proxy.js";

export default function ProxyListPage() {
  const [newProxyDialogOpen, setNewProxyDialogOpen] = useState(false);
  const [listData, setListData] = useState();

  const columns = [
    {
      key: 'id',
      label: 'ID',
      dataIndex: 'id',
      width: 140,
    },
    {
      key: 'name',
      label: 'Name',
      dataIndex: 'name',
      width: 300,
    },
    {
      key: 'type',
      label: 'Type',
      dataIndex: 'type',
      width: 180,
    },
    {
      key: 'host',
      label: 'Host',
      dataIndex: 'host',
      width: 280,
    },
    {
      key: 'port',
      label: 'Port',
      dataIndex: 'port',
    },
  ];

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        links={[
          { name: 'Dashboard', href: paths.dashboard.config.root },
          { name: 'Config', href: paths.dashboard.config.proxyList },
          { name: 'Proxy' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      <DataTable
        title="Proxy"
        actions={
          <Button
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={() => setNewProxyDialogOpen(true)}
          >
            Add proxy
          </Button>
        }
        columns={columns}
        data={listData}
        onFetchData={async (page) => {
          const data = await getPagedProxies(page);
          setListData(data);
        }}
      />
      {
        newProxyDialogOpen && (
          <CreateForm open={newProxyDialogOpen} onCancel={() => setNewProxyDialogOpen(false)} />
        )
      }
    </DashboardContent>
  );
}
