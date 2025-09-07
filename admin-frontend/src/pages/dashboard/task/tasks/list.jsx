import { useRef, useState } from 'react';

import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';

import { DashboardContent } from 'src/layouts/dashboard';
import { deleteTask, getPageTasks, getTask } from 'src/service/task.js';

import { Iconify } from 'src/components/iconify/index.js';
import DataTable from 'src/components/vcat/VDataTable.jsx';
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
  const [runView, setRunView] = useState(false);

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
      key: 'taskName',
      label: 'Task',
      dataIndex: 'taskName',
      width: 140,
    },
    {
      key: 'name',
      label: 'Name',
      dataIndex: 'name',
      width: 180,
    },
    {
      key: 'remarks',
      label: 'Remarks',
      dataIndex: 'remarks',
    },
    {
      key: 'actions',
      label: 'Actions',
      width: 150,
      render: (row) => (
        <>
          <IconButton
            color="default"
            onClick={async () => {
              const detailData = await getTask(row.id);
              setEditingRow(detailData);
              setRunView(true);
              setCreateFormOpen(true);
            }}
          >
            <Iconify icon="solar:play-bold" />
          </IconButton>
          <IconButton
            color="default"
            onClick={async () => {
              const detailData = await getTask(row.id);
              setRunView(false);
              setEditingRow(detailData);
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
        links={[{ name: 'Dashboard' }, { name: 'Task' }, { name: 'Tasks' }]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      <DataTable
        ref={tableRef}
        title="Tasks"
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
                setRunView(false);
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
          runView={runView}
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
