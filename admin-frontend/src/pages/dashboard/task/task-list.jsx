import { useState } from 'react';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { Card, DialogTitle, DialogActions, DialogContent } from '@mui/material';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { Iconify } from '../../../components/iconify/index.js';
import DataTable from '../../../components/data-table/index.jsx';
import InterparkPurchaseTicketForm from './task-forms/interpark/purchase-ticket.jsx';

export default function TaskListPage() {
  const [runTaskModalOpen, setRunTaskModalOpen] = useState(false);

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
      key: 'type',
      label: 'Type',
      dataIndex: 'type',
    },
    {
      key: 'concurrency',
      label: 'Concurrency',
      dataIndex: 'concurrency',
    },
    {
      key: 'createdTime',
      label: 'Created Time',
      dataIndex: 'createdTime',
    },
    {
      key: 'action',
      label: 'Action',
      render: (row) => (
        <IconButton
            color="error"
            aria-label="delete"
            sx={{
              minWidth: 0,
              minHeight: 0,
              padding: 0.5,
              margin: 0,
            }}
          >
            <Iconify icon="solar:trash-bin-trash-bold" />
          </IconButton>
      ),
    },
  ];

  const data = [
    {
      id: 1,
      name: 'txt presale',
      type: 'interpark-normal',
      concurrency: 100,
      createdTime: '2023-05-01 10:00:00',
      status: 'Completed',
    },
    {
      id: 2,
      name: 'txt presale',
      type: 'interpark-normal',
      concurrency: 100,
      createdTime: '2023-05-01 10:00:00',
      status: 'Completed',
    },
    {
      id: 3,
      name: 'txt presale',
      type: 'interpark-normal',
      concurrency: 100,
      createdTime: '2023-05-01 10:00:00',
      status: 'Completed',
    },
    {
      id: 4,
      name: 'txt presale',
      type: 'interpark-normal',
      concurrency: 100,
      createdTime: '2023-05-01 10:00:00',
      status: 'Completed',
    },
  ];

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Tasks"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Task', href: paths.dashboard.task.root },
          { name: 'Tasks' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      <div>
        <Button
          variant="contained"
          sx={{ mb: 2 }}
          startIcon={<PlayArrowIcon />}
          onClick={() => setRunTaskModalOpen(true)}
        >
          New Task
        </Button>
      </div>
      <Card>
        <DataTable columns={columns} data={data}/>
      </Card>
      <Dialog
        fullWidth
        maxWidth={false}
        open={runTaskModalOpen}
        slotProps={{
          paper: {
            sx: { maxWidth: 1000 },
          },
        }}
      >
        <DialogTitle>New Task</DialogTitle>
        <DialogContent sx={{overflow: 'visible', px: 3}}>
          <InterparkPurchaseTicketForm/>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={() => setRunTaskModalOpen(false)}>
            Cancel
          </Button>
          <Button type="submit" variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardContent>
  );
}
