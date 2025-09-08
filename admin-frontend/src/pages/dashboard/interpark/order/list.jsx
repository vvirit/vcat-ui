import { useRef, useState } from 'react';

import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';

import { DashboardContent } from 'src/layouts/dashboard';
import { getPagedInterparkOrders } from 'src/service/interpark-order.js';
import { deleteInterparkPerform } from 'src/service/interpark-perform.js';

import { Iconify } from 'src/components/iconify/index.js';
import DataTable from 'src/components/vcat/VDataTable.jsx';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { ConfirmDialog } from 'src/components/custom-dialog/index.js';

import CreateForm from './form.jsx';
import PayDialog from './pay-dialog.jsx';

let deleteId = null;

const InterparkOrderList = () => {
  const [data, setData] = useState();
  const [selectedRows, setSelectedRows] = useState([]);
  const [createFormOpen, setCreateFormOpen] = useState(false);
  const tableRef = useRef();
  const [editingRow, setEditingRow] = useState(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [currentDetailId, setCurrentDetailId] = useState(null);
  const [detailViewOpen, setDetailViewOpen] = useState(false);

  const columns = [
    {
      key: 'id',
      label: 'ID',
      dataIndex: 'id',
      width: 70,
    },
    {
      key: 'productName',
      label: 'Perform',
      dataIndex: 'productName',
      width: 120,
    },
    {
      key: 'email',
      label: 'Email',
      dataIndex: 'email',
      width: 280,
    },
    {
      key: 'playDate',
      label: 'Date',
      dataIndex: 'playDate',
      width: 100,
    },
    {
      key: 'seat',
      label: 'Seat',
      render: (row) =>
        `${row.seatGradeName}-${row.blockCode}-${row.floor}-${row.rowNo}-${row.seatNo}`,
      width: 200,
    },
    {
      key: 'bookingUserName',
      label: 'Name',
      dataIndex: 'bookingUserName',
      width: 160,
    },
    {
      key: 'bookingUserBirthDay',
      label: 'Birthday',
      dataIndex: 'bookingUserBirthDay',
      width: 100,
    },
    {
      key: 'createdAt',
      label: 'Created At',
      dataIndex: 'createdAt',
      width: 180,
    },
    {
      key: 'orderStatus',
      label: 'Status',
      dataIndex: 'orderStatus',
    },
    {
      key: 'actions',
      label: 'Actions',
      width: 120,
      render: (row) => (
        <>
          <IconButton
            onClick={() => {
              setCurrentDetailId(row.id);
              setDetailViewOpen(true);
            }}
          >
            <Iconify icon="mdi:currency-usd-circle" />
          </IconButton>
        </>
      ),
    },
  ];

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        links={[{ name: 'Dashboard' }, { name: 'Interpark' }, { name: 'Orders' }]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      <DataTable
        ref={tableRef}
        title="Interpark Orders"
        columns={columns}
        data={data}
        onCheck={setSelectedRows}
        size="small"
        onFetchData={async (pagination) => {
          const orders = await getPagedInterparkOrders(pagination);
          setData(orders);
        }}
        actions={
          <>
            {selectedRows.length !== 0 && (
              <Button variant="outlined" color="error">
                Delete
              </Button>
            )}
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
              await deleteInterparkPerform(deleteId);
              setConfirmDeleteOpen(false);
              tableRef.current?.reload();
            }}
          >
            Delete
          </Button>
        }
      />
      {detailViewOpen && (
        <PayDialog
          orderId={currentDetailId}
          onCancel={() => setDetailViewOpen(false)}
          onFinish={() => {
            setDetailViewOpen(false);
            tableRef.current?.reload();
          }}
        />
      )}
    </DashboardContent>
  );
};

export default InterparkOrderList;
