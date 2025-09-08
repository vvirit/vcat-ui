import { useRef, useState } from 'react';

import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';

import { paths } from 'src/routes/paths.js';

import { DashboardContent } from 'src/layouts/dashboard';
import {
  deleteInterparkAccount,
  getPagedInterparkAccounts,
} from 'src/service/interpark-account.js';

import { Iconify } from 'src/components/iconify/index.js';
import DataTable from 'src/components/vcat/VDataTable.jsx';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { ConfirmDialog } from 'src/components/custom-dialog/index.js';

import CreateForm from './form.jsx';
import ImportForm from './import-form.jsx';

let deleteId = null;

const InterparkAccountList = () => {
  const [data, setData] = useState();
  const [selectedRows, setSelectedRows] = useState([]);
  const [createFormOpen, setCreateFormOpen] = useState(false);
  const [importFormOpen, setImportFormOpen] = useState(false);
  const tableRef = useRef();
  const [editingRow, setEditingRow] = useState(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  const columns = [
    {
      key: 'id',
      label: 'ID',
      dataIndex: 'id',
      width: 60,
    },
    {
      key: 'email',
      label: 'Email',
      dataIndex: 'email',
      width: 220,
    },
    {
      key: 'password',
      label: 'Password',
      dataIndex: 'password',
      width: 220,
    },
    {
      key: 'verified',
      label: 'Verified',
      dataIndex: 'verified',
      width: 100,
      render: (row) => <>{row.verified ? 'YES' : 'NO'}</>,
    },
    {
      key: 'disabled',
      label: 'Disabled',
      dataIndex: 'disabled',
      width: 100,
      render: (row) => <>{row.disabled ? 'YES' : 'NO'}</>,
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
          { name: 'Interpark', href: paths.dashboard.interpark.accountList },
          { name: 'Accounts' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      <DataTable
        ref={tableRef}
        title="Interpark accounts"
        columns={columns}
        data={data}
        enableCheck
        onCheck={setSelectedRows}
        onFetchData={async (pagination) => {
          const performs = await getPagedInterparkAccounts(pagination);
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
              variant="outlined"
              startIcon={<Iconify icon="mdi:import" />}
              onClick={() => {
                setImportFormOpen(true);
              }}
            >
              Import
            </Button>
            <Button
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
              onClick={() => {
                setEditingRow(null);
                setCreateFormOpen(true);
              }}
            >
              Add account
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
      {importFormOpen && (
        <ImportForm
          data={editingRow}
          open={importFormOpen}
          onCancel={() => setImportFormOpen(false)}
          onSuccess={() => {
            setImportFormOpen(false);
            tableRef.current?.reload();
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
              await deleteInterparkAccount(deleteId);
              setConfirmDeleteOpen(false);
              tableRef.current?.reload();
            }}
          >
            Delete
          </Button>
        }
      />
    </DashboardContent>
  );
};

export default InterparkAccountList;
