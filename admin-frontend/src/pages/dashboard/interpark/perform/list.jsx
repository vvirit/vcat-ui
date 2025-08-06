import { useState } from 'react';

import Button from '@mui/material/Button';

import { paths } from 'src/routes/paths.js';

import { DashboardContent } from 'src/layouts/dashboard';

import DataTable from 'src/components/data-table';
import { Iconify } from 'src/components/iconify/index.js';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

const InterparkPerformList = () => {
  const [data, setData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);

  const columns = [
    {
      key: 'id',
      label: 'ID',
      dataIndex: 'id',
      width: 140,
    },
    {
      key: 'code',
      label: 'Code',
      dataIndex: 'code',
      width: 200,
    },
    {
      key: 'placeCode',
      label: 'Place code',
      dataIndex: 'placeCode',
      width: 200,
    },
    {
      key: 'blocksCount',
      label: 'Blocks count',
      dataIndex: 'blocksCount',
    },
  ];

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        links={[
          { name: 'Dashboard', href: paths.dashboard.interpark.root },
          { name: 'Interpark', href: paths.dashboard.interpark.performList },
          { name: 'Performs' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      <DataTable
        title="Interpark performs"
        columns={columns}
        data={data}
        enableCheck
        onCheck={setSelectedRows}
        onFetchData={(pagination) => {
          setData([
            {
              id: pagination.page,
              code: pagination.rowsPerPage,
              placeCode: 'A01',
              blocksCount: 1,
            },
          ]);
        }}
        actions={
          <>
            {
              selectedRows.length !== 0 && (
                <Button variant="outlined" color="error">
                  Delete
                </Button>
              )
            }
            <Button variant="contained" startIcon={<Iconify icon="mingcute:add-line" />}>
              Add perform
            </Button>
          </>
        }
      />
    </DashboardContent>
  );
};

export default InterparkPerformList;
