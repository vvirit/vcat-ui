import { useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Select from '@mui/material/Select';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import { DialogActions, DialogContent, DialogTitle, Grid } from '@mui/material';

import { addProxy } from 'src/service/proxy.js';

import EditTable from 'src/components/vcat/VEditTable.jsx';

import { Iconify } from '../../../../components/iconify/index.js';

export default function CreateForm({ open, onCancel }) {

  const [type, setType] = useState('STANDARD');
  const [errorMessage, setErrorMessage] = useState();
  const tableRef = useRef();
  const [importing, setImporting] = useState(false);
  const [importValue, setImportValue] = useState('');
  const [saving, setSaving] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    trigger,
  } = useForm();

  const columns = [
    {
      key: 'host',
      label: 'Host',
      dataIndex: 'host',
      width: 180,
    },
    {
      key: 'port',
      label: 'Port',
      dataIndex: 'port',
      width: 140,
    },
    {
      key: 'username',
      label: 'Username',
      dataIndex: 'username',
      width: 260,
    },
    {
      key: 'password',
      label: 'Password',
      dataIndex: 'password',
    },
  ];
  const data = [];

  const handleImportData = () => {
    const rows = importValue
      .split('\n')
      .map((it) => it.trim())
      .filter((it) => it)
      .map((it) => {
        const items = it.split(':');
        return {
          host: items[0],
          port: items[1],
          username: items[2] || '',
          password: items[3] || '',
        };
      });
    console.log(rows);
    tableRef.current.resetData(rows);
  };

  const onSubmit = async (formData) => {
    // 可选：手动触发表单验证
    const valid = await trigger();
    if (!valid) return;
    let payload = {
      ...formData,
      type,
    };
    if (type === 'POOL') {
      payload.proxies = tableRef.current?.getData() || [];
    }
    try {
      setSaving(true);
      await addProxy(payload);
      onCancel();
    } catch (e) {
      setErrorMessage(e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog
      fullWidth
      maxWidth={false}
      open={open}
      slotProps={{
        paper: {
          sx: { maxWidth: 1000 },
        },
      }}
    >
      <Box
        component="form"
        sx={{ p: 2, width: '100%', padding: 0 }}
        onSubmit={handleSubmit(onSubmit)}
      >
        <DialogTitle>New Proxy</DialogTitle>
        <DialogContent sx={{ overflow: 'visible', px: 3 }}>
          {!!errorMessage && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {errorMessage}
            </Alert>
          )}
          <Grid container spacing={2}>
            <Grid size={6}>
              <TextField
                fullWidth
                label="Name"
                {...register('name', { required: 'Name is required' })}
                error={!!errors.name}
                helperText={errors.name?.message}
                size="small"
              />
            </Grid>
            <Grid size={6}>
              <FormControl fullWidth sx={{ mb: 2, margin: 0 }} size="small">
                <InputLabel id="type-label">Type</InputLabel>
                <Controller
                  name="type"
                  control={control}
                  render={({ field }) => (
                    <Select
                      labelId="type-label"
                      id="select"
                      label="Type"
                      {...field}
                      value={type}
                      fullWidth
                      onChange={(e) => {
                        setType(e.target.value);
                      }}
                    >
                      <MenuItem value="STANDARD">Standard</MenuItem>
                      <MenuItem value="POOL">Pool</MenuItem>
                    </Select>
                  )}
                />
              </FormControl>
            </Grid>
            {type === 'STANDARD' && (
              <>
                <Grid size={6}>
                  <TextField
                    fullWidth
                    label="Host"
                    {...register('host', { required: 'Host is required' })}
                    error={!!errors.host}
                    helperText={errors.host?.message}
                    size="small"
                  />
                </Grid>
                <Grid size={6}>
                  <TextField
                    fullWidth
                    label="Port"
                    {...register('port', { required: 'Port is required' })}
                    error={!!errors.port}
                    helperText={errors.port?.message}
                    size="small"
                  />
                </Grid>
                <Grid size={6}>
                  <TextField
                    fullWidth
                    label="Username"
                    {...register('username')}
                    error={!!errors.username}
                    helperText={errors.username?.message}
                    size="small"
                  />
                </Grid>
                <Grid size={6}>
                  <TextField
                    fullWidth
                    label="Password"
                    {...register('password')}
                    error={!!errors.password}
                    helperText={errors.password?.message}
                    size="small"
                  />
                </Grid>
              </>
            )}
          </Grid>
          {type === 'POOL' && (
            <>
              <div
                style={{
                  marginTop: '8px',
                  marginBottom: '8px',
                  display: 'flex',
                  justifyContent: 'end',
                  gap: 8,
                }}
              >
                {importing && (
                  <>
                    <Button
                      type="button"
                      variant="outlined"
                      onClick={() => {
                        setImporting(false);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="button"
                      variant="outlined"
                      onClick={() => {
                        setImporting(false);
                        handleImportData();
                      }}
                    >
                      Save
                    </Button>
                  </>
                )}
                {!importing && (
                  <Button
                    type="button"
                    variant="outlined"
                    startIcon={<Iconify icon="mingcute:file-import-line" />}
                    onClick={() => {
                      setImporting(true);
                    }}
                    disabled={importing}
                  >
                    Import
                  </Button>
                )}
              </div>
              <EditTable
                ref={tableRef}
                columns={columns}
                sx={{ display: importing ? 'none' : 'auto' }}
              />
              {importing && (
                <TextField
                  fullWidth
                  multiline
                  rows={12}
                  value={importValue}
                  onChange={(e) => {
                    setImportValue(e.target.value);
                  }}
                />
              )}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={onCancel} disabled={saving}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={importing} loading={saving}>
            Save
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
