import { useRef, useState } from 'react';

import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';

import { paths } from 'src/routes/paths.js';

import { DashboardContent } from 'src/layouts/dashboard';
import {
  deleteInterparkAccountGroup,
  getPagedInterparkAccountGroups,
} from 'src/service/interpark-account-group.js';

import { Iconify } from 'src/components/iconify/index.js';
import DataTable from 'src/components/vcat/VDataTable.jsx';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { ConfirmDialog } from 'src/components/custom-dialog/index.js';

import CreateForm from './form.jsx';

let deleteId = null;

const InterparkAccountGroupList = () => {
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
      key: 'name',
      label: 'Name',
      dataIndex: 'name',
      width: 180,
    },
    {
      key: 'condition',
      label: 'Condition',
      dataIndex: 'condition',
      width: 400,
    },
    {
      key: 'pageNumber',
      label: 'Page Number',
      dataIndex: 'pageNumber',
      width: 126,
    },
    {
      key: 'pageSize',
      label: 'Page Size',
      dataIndex: 'pageSize',
      width: 100,
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
          { name: 'Interpark', href: paths.dashboard.interpark.accountGroupList },
          { name: 'Account groups' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      <DataTable
        ref={tableRef}
        title="Interpark account groups"
        columns={columns}
        data={data}
        enableCheck
        onCheck={setSelectedRows}
        onFetchData={async (pagination) => {
          const performs = await getPagedInterparkAccountGroups(pagination);
          setData(performs);
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
              Add group
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
          <Button variant="contained" color="error" onClick={async () => {
            await deleteInterparkAccountGroup(deleteId);
            setConfirmDeleteOpen(false);
            tableRef.current?.reload();
          }}>
            Delete
          </Button>
        }
      />
    </DashboardContent>
  );
};

export default InterparkAccountGroupList;
