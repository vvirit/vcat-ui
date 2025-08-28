import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Select from '@mui/material/Select';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import { Grid, DialogTitle, DialogActions, DialogContent } from '@mui/material';

import { useServerData } from 'src/hooks/use-data.js';

import { runTask, getNodes } from 'src/service/node.js';

export default function CreateForm({ open, onCancel, onSuccess }) {
  const [errorMessage, setErrorMessage] = useState();
  const [saving, setSaving] = useState(false);

  const nodes = useServerData(getNodes, []);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    trigger,
  } = useForm();

  const onSubmit = async (formData) => {
    const valid = await trigger();
    if (!valid) return;
    try {
      setSaving(true);
      await runTask(formData);
      onSuccess();
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
        <DialogTitle>Run task</DialogTitle>
        <DialogContent sx={{ overflow: 'visible', px: 3 }}>
          {!!errorMessage && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {errorMessage}
            </Alert>
          )}
          <Grid container spacing={2}>
            <Grid size={6}>
              <FormControl fullWidth sx={{ mb: 2, margin: 0 }} size="small">
                <InputLabel id="type-label">Node</InputLabel>
                <Controller
                  name="nodeId"
                  control={control}
                  render={({ field }) => (
                    <Select labelId="type-label" id="select" label="Node" {...field} fullWidth>
                      {nodes.map((it) => (
                        <MenuItem value={it.id}>{it.id}</MenuItem>
                      ))}
                    </Select>
                  )}
                />
              </FormControl>
            </Grid>
            <Grid size={6}>
              <TextField
                fullWidth
                label="Name"
                {...register('name', { required: 'Name is required' })}
                autoComplete="off"
                error={!!errors.name}
                helperText={errors.name?.message}
                size="small"
              />
            </Grid>
            <Grid size={6}>
              <TextField
                fullWidth
                label="Task name"
                {...register('taskName', { required: 'Task name is required' })}
                autoComplete="off"
                error={!!errors.name}
                helperText={errors.name?.message}
                size="small"
              />
            </Grid>
            <Grid size={6}>
              <TextField
                fullWidth
                label="Remarks"
                {...register('remarks')}
                autoComplete="off"
                error={!!errors.performCode}
                helperText={errors.performCode?.message}
                size="small"
              />
            </Grid>
            <Grid size={12}>
              <TextField
                fullWidth
                label="Argument"
                {...register('argument')}
                autoComplete="off"
                error={!!errors.argument}
                helperText={errors.argument?.message}
                size="small"
                multiline
                rows={20}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={onCancel} disabled={saving}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" loading={saving}>
            Run
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
