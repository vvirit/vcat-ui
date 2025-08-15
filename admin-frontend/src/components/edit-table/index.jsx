import { useState, useImperativeHandle, forwardRef } from 'react';

import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import { Table, TableRow, TableBody, TableCell, TableHead, TableContainer } from '@mui/material';

const EditTable = forwardRef(({ columns, initialData, sx }, ref) => {

  const [data, setData] = useState(initialData || [{}]);
  const [menuRowIndex, setMenuRowIndex] = useState();
  const [menuOpen, setMenuOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const headList = [];

  const handleChange = (index, key, value) => {
    setData((prev) => {
      const newData = [...prev];
      newData[index] = { ...newData[index], [key]: value };
      return newData;
    });
  };

  useImperativeHandle(ref, () => ({
    getData: () => data,
    resetData: (newData) => {
      setData(newData);
    },
  }));

  headList.push(
    <TableCell key="index" sx={{ width: '40px' }}>
      &nbsp;
    </TableCell>
  );

  columns.forEach((column) => {
    headList.push(
      <TableCell key={column.key} sx={{ width: column.width || 'auto' }}>
        {column.label}
      </TableCell>
    );
  });

  const createRow = (row, index) => {
    const rowCells = [];
    rowCells.push(
      <TableCell
        key="check"
        sx={{
          padding: 0,
          paddingTop: '4px',
          paddingBlock: '4px',
          textAlign: 'center',
          userSelect: 'none',
          ':hover': {
            cursor: 'pointer',
          },
        }}
        onClick={(e) => {
          setMenuOpen(true);
          setAnchorEl(e.currentTarget);
          setMenuRowIndex(index);
        }}
      >
        {index + 1}
      </TableCell>
    );
    columns.forEach((column) => {
      rowCells.push(
        <TableCell
          key={column.key}
          sx={{
            width: column.width || 'auto',
            paddingTop: '4px',
            paddingBlock: '4px',
          }}
        >
          {column.render ? (
            column.render(row)
          ) : (
            <TextField
              variant="standard"
              fullWidth
              value={row[column.dataIndex] || ''}
              InputProps={{
                disableUnderline: true,
              }}
              sx={{
                '& .MuiOutlinedInput-notchedOutline': {
                  border: 'none',
                },
                '& .MuiInputBase-root': {
                  border: 'none',
                  borderRadius: 0, // 可选：去圆角
                },
              }}
              onChange={(e) => handleChange(index, column.dataIndex, e.target.value)}
            />
          )}
        </TableCell>
      );
    });
    return <TableRow key={index}>{rowCells}</TableRow>;
  };

  const body = data.map((row, index) => createRow(row, index));

  return (
    <TableContainer sx={{ maxHeight: 400, overflowY: 'auto' }}>
      <Table
        sx={{
          tableLayout: 'fixed',
          width: '100%',
          ...sx,
        }}
        stickyHeader
        size="small"
      >
        <TableHead>
          <TableRow>{headList}</TableRow>
        </TableHead>
        <TableBody>{body}</TableBody>
      </Table>
      <Menu anchorEl={anchorEl} open={menuOpen} onClose={() => setMenuOpen(false)}>
        <MenuItem
          onClick={() => {
            setData((prevRows) => {
              const updated = [...prevRows];
              updated.splice(menuRowIndex, 0, {});
              return updated;
            });
            setMenuOpen(false);
          }}
        >
          Insert Above
        </MenuItem>
        <MenuItem
          onClick={() => {
            setData((prevRows) => {
              const updated = [...prevRows];
              updated.splice(menuRowIndex + 1, 0, {});
              return updated;
            });
            setMenuOpen(false);
          }}
        >
          Insert Below
        </MenuItem>
        <MenuItem onClick={() => {}}>Move Up</MenuItem>
        <MenuItem onClick={() => {}}>Move Down</MenuItem>
        <MenuItem onClick={() => {}}>Duplicate</MenuItem>
        <MenuItem onClick={() => {}} sx={{ color: 'error.main' }}>
          Delete
        </MenuItem>
      </Menu>
    </TableContainer>
  );
});

export default EditTable;
