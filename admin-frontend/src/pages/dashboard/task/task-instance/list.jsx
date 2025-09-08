import { useRef, useState } from 'react';

import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import { Dialog, DialogTitle, DialogContent } from '@mui/material';

import { DashboardContent } from 'src/layouts/dashboard';
import { getPagedTaskInstances } from 'src/service/task-instance.js';
import { deleteInterparkPerform } from 'src/service/interpark-perform.js';

import { Iconify } from 'src/components/iconify/index.js';
import DataTable from 'src/components/vcat/VDataTable.jsx';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { ConfirmDialog } from 'src/components/custom-dialog/index.js';

import CreateForm from './form.jsx';
import TaskView from './task-view/TaskView.jsx';
import { stopTask } from '../../../../service/node.js';

let deleteId = null;

const TaskInstanceList = () => {
  const [data, setData] = useState();
  const [selectedRows, setSelectedRows] = useState([]);
  const [createFormOpen, setCreateFormOpen] = useState(false);
  const tableRef = useRef();
  const [editingRow, setEditingRow] = useState(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [currentTaskInstanceId, setCurrentTaskInstanceId] = useState();
  const [taskInstanceDetailOpen, setTaskInstanceDetailOpen] = useState(false);

  const columns = [
    {
      key: 'id',
      label: 'ID',
      dataIndex: 'id',
      width: 60,
    },
    {
      key: 'nodeId',
      label: 'Node',
      dataIndex: 'nodeId',
      width: 320,
    },
    {
      key: 'name',
      label: 'Name',
      dataIndex: 'name',
      width: 160,
    },
    {
      key: 'taskName',
      label: 'Task name',
      dataIndex: 'taskName',
      width: 180,
    },
    {
      key: 'status',
      label: 'Status',
      dataIndex: 'status',
      width: 180,
      render: (row) => {
        if (row.status === 'RUNNING') {
          return <Chip label={row.status} color="success" size="small" />;
        } else if (row.status === 'FINISHED') {
          return <Chip label={row.status} color="primary" size="small" />;
        } else {
          return <Chip label={row.status} size="small" />;
        }
      },
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
            onClick={() => {
              setCurrentTaskInstanceId(row.id);
              setTaskInstanceDetailOpen(true);
            }}
          >
            <Iconify icon="mingcute:eye-fill" />
          </IconButton>
          <IconButton
            color="error"
            onClick={async () => {
              await stopTask({
                nodeId: row.nodeId,
                instanceId: row.id,
              })
            }}
          >
            <Iconify icon="mingcute:stop-fill" />
          </IconButton>
        </>
      ),
    },
  ];

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        links={[{ name: 'Dashboard' }, { name: 'Task' }, { name: 'Task instances' }]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      <DataTable
        ref={tableRef}
        title="Task instances"
        columns={columns}
        data={data}
        size="small"
        enableCheck
        onCheck={setSelectedRows}
        onFetchData={async (pagination) => {
          const taskInstances = await getPagedTaskInstances(pagination);
          setData(taskInstances);
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
              startIcon={<Iconify icon="mingcute:play-fill" />}
              onClick={() => {
                setEditingRow(null);
                setCreateFormOpen(true);
              }}
            >
              Run task
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
            tableRef.current?.reload();
          }}
        />
      )}
      <ConfirmDialog
        open={confirmDeleteOpen}
        onClose={() => setConfirmDeleteOpen(false)}
        title="Stop task"
        content="Are you sure want to stop task?"
        action={
          <Button
            variant="contained"
            color="error"
            onClick={async () => {
              await deleteInterparkPerform(deleteId);
              setConfirmDeleteOpen(false);
              tableRef.current?.reload();
            }}
          >
            Stop
          </Button>
        }
      />
      {taskInstanceDetailOpen && (
        <Dialog
          fullWidth
          maxWidth={false}
          open={taskInstanceDetailOpen}
          slotProps={{
            paper: {
              sx: { maxWidth: 1400 },
            },
          }}
        >
          <DialogTitle>
            Task instance ({currentTaskInstanceId})
            <IconButton
              aria-label="close"
              onClick={() => setTaskInstanceDetailOpen(false)}
              sx={{ position: 'absolute', right: 8, top: 8 }}
            >
              <Iconify icon="mingcute:close-fill" />
            </IconButton>
          </DialogTitle>
          <DialogContent sx={{ overflow: 'visible', px: 3, marginBottom: 3 }}>
            <TaskView id={currentTaskInstanceId} />
          </DialogContent>
        </Dialog>
      )}
    </DashboardContent>
  );
};

export default TaskInstanceList;
