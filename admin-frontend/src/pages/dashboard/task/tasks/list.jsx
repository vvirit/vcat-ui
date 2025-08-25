import { useRef, useState } from 'react';

import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';

import { paths } from 'src/routes/paths.js';

import { DashboardContent } from 'src/layouts/dashboard';
import { deleteTask, getPageTasks } from 'src/service/task.js';

import DataTable from 'src/components/data-table';
import { Iconify } from 'src/components/iconify/index.js';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { ConfirmDialog } from 'src/components/custom-dialog/index.js';

import { CreateForm } from './form.jsx';

let deleteId = null;

const InterparkPerformList = () => {
  const [data, setData] = useState();
  const [selectedRows, setSelectedRows] = useState([]);
  const [createFormOpen, setCreateFormOpen] = useState(false);
  const tableRef = useRef();
  const [editingRow, setEditingRow] = useState(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  const columns = [
    {
      key: 'id',
      label: 'ID',
      dataIndex: 'id',
      width: 80,
    },
    {
      key: 'category',
      label: 'Category',
      dataIndex: 'category',
      width: 140,
    },
    {
      key: 'task',
      label: 'Task',
      dataIndex: 'taskType',
      width: 140,
    },
    {
      key: 'remarks',
      label: 'Remarks',
      dataIndex: 'remarks',
    },
    {
      key: 'actions',
      label: 'Actions',
      width: 120,
      render: (row) => (
        <>
          <IconButton
            color="default"
            onClick={() => {
              setEditingRow(row);
              setCreateFormOpen(true);
            }}
          >
            <Iconify icon="solar:pen-bold" />
          </IconButton>
          <IconButton
            color="error"
            onClick={() => {
              deleteId = row.id;
              setConfirmDeleteOpen(true);
            }}
          >
            <Iconify icon="solar:trash-bin-trash-bold" />
          </IconButton>
        </>
      ),
    },
  ];

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        links={[
          { name: 'Dashboard', href: paths.dashboard.interpark.root },
          { name: 'Interpark', href: paths.dashboard.interpark.performList },
          { name: 'Seat rotate pools' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      <DataTable
        ref={tableRef}
        title="Interpark tasks"
        columns={columns}
        data={data}
        enableCheck
        onCheck={setSelectedRows}
        onFetchData={async (pagination) => {
          const pools = await getPageTasks(pagination);
          setData(pools);
        }}
        actions={
          <>
            {selectedRows.length !== 0 && (
              <Button variant="outlined" color="error">
                Delete
              </Button>
            )}
            <Button
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
              onClick={() => {
                setEditingRow(null);
                setCreateFormOpen(true);
              }}
            >
              Add task
            </Button>
          </>
        }
      />
      {createFormOpen && (
        <CreateForm
          data={editingRow}
          open={createFormOpen}
          onCancel={() => setCreateFormOpen(false)}
          onSuccess={() => {
            setCreateFormOpen(false);
            tableRef.current.reload();
          }}
        />
      )}
      <ConfirmDialog
        open={confirmDeleteOpen}
        onClose={() => setConfirmDeleteOpen(false)}
        title="Delete"
        content="Are you sure want to delete?"
        action={
          <Button
            variant="contained"
            color="error"
            onClick={async () => {
              await deleteTask(deleteId);
              setConfirmDeleteOpen(false);
              tableRef.current.reload();
            }}
          >
            Delete
          </Button>
        }
      />
    </DashboardContent>
  );
};

export default InterparkPerformList;
