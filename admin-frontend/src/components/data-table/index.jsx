import { useState, useEffect, forwardRef, useImperativeHandle } from 'react';

import Checkbox from '@mui/material/Checkbox';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import RefreshIcon from '@mui/icons-material/Refresh';
import {
  Card,
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  TableContainer,
  TablePagination,
} from '@mui/material';

import { EmptyContent } from '../empty-content/index.js';

const DataTable = forwardRef(
  (
    {
      columns,
      data = {
        content: [],
        totalPages: 0,
      },
      size = 'medium',
      rowId = 'id',
      title = '',
      actions,
      searchForm,
      onFetchData = (pagination) => {},
      enableCheck = false,
      onCheck = (rows) => {},
      cellSx = {},
    },
    ref
  ) => {
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);

    useEffect(() => {
      onFetchData({ page: 0, pageSize: 10 });
    }, []);

    useEffect(() => {
      setSelectedRowKeys([]);
    }, [data]);

    useImperativeHandle(ref, () => ({
      reload: () => onFetchData({ page, pageSize }),
    }));

    const headList = [];
    const itemList = data.content;

    if (enableCheck) {
      headList.push(
        <TableCell key="check" sx={{ width: 60 }}>
          <Checkbox
            color="primary"
            checked={itemList.length !== 0 && selectedRowKeys.length === itemList.length}
            size="small"
            onChange={(e) => {
              const keys = e.target.checked ? itemList.map((row) => row[rowId]) : [];
              setSelectedRowKeys(keys);
              onCheck(itemList.filter((r) => keys.includes(r[rowId])));
            }}
          />
        </TableCell>
      );
    }

    columns.forEach((column) => {
      headList.push(
        <TableCell key={column.key} sx={{ width: column.width || 'auto' }}>
          {column.label}
        </TableCell>
      );
    });

    const createRow = (row) => {
      const rowCells = [];
      if (enableCheck) {
        const rowKey = row[rowId];
        rowCells.push(
          <TableCell key="check" sx={{ width: 60, ...cellSx }}>
            <Checkbox
              color="primary"
              checked={selectedRowKeys.includes(rowKey)}
              onChange={(e) => {
                let keys;
                if (e.target.checked) {
                  keys = selectedRowKeys.includes(rowKey)
                    ? selectedRowKeys.filter((key) => key !== rowKey)
                    : [...selectedRowKeys, rowKey];
                } else {
                  keys = selectedRowKeys.filter((key) => key !== rowKey);
                }
                setSelectedRowKeys(keys);
                onCheck(data.filter((r) => keys.includes(r[rowId])));
              }}
            />
          </TableCell>
        );
      }
      columns.forEach((column) => {
        rowCells.push(
          <TableCell key={column.key} sx={{ width: column.width || 'auto' }}>
            {column.render ? column.render(row) : row[column.dataIndex]}
          </TableCell>
        );
      });
      return <TableRow key={row.id}>{rowCells}</TableRow>;
    };

    const body = itemList.map((row) => createRow(row));

    return (
      <>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 8,
            marginBottom: 16,
          }}
        >
          <Typography variant="h5" sx={{ color: 'text.secondary' }}>
            {title}
          </Typography>
          <div style={{ display: 'flex', gap: 8 }}>
            {actions}
            <IconButton
              variant="contained"
              onClick={() => {
                onFetchData({ page, pageSize });
              }}
            >
              <RefreshIcon />
            </IconButton>
          </div>
        </div>
        <Card>
          {searchForm}
          <TableContainer>
            <Table sx={{ tableLayout: 'fixed', width: '100%' }} size={size}>
              <TableHead>
                <TableRow>{headList}</TableRow>
              </TableHead>
              <TableBody>{body}</TableBody>
            </Table>
            {itemList.length === 0 && (
              <EmptyContent sx={{ width: '100%', marginTop: '60px', marginBottom: '60px' }} />
            )}
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <TablePagination
                component="div"
                rowsPerPageOptions={[10, 20, 50, 100]}
                count={data.totalElements}
                page={page}
                rowsPerPage={pageSize}
                onPageChange={(e, value) => {
                  setPage(value);
                  onFetchData({ page: value, pageSize });
                }}
                onRowsPerPageChange={(e) => {
                  const value = parseInt(e.target.value, 10);
                  setPageSize(value);
                  setPage(0);
                  onFetchData({ page: 0, pageSize: value });
                }}
              />
            </div>
          </TableContainer>
        </Card>
      </>
    );
  }
);

export default DataTable;
