import { useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import { DialogActions, DialogContent, DialogTitle, Grid } from '@mui/material';

import { addQueueRouter, updateQueueRouter } from '../../../../service/queue-router.js';

export default function CreateForm({ open, onCancel, onSuccess, data }) {
  const [errorMessage, setErrorMessage] = useState();
  const itemsTableRef = useRef();
  const [saving, setSaving] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    trigger,
  } = useForm({ defaultValues: data });

  const onSubmit = async (formData) => {
    const valid = await trigger();
    if (!valid) return;
    let payload = {
      ...formData,
      items: itemsTableRef.current?.getData() || [],
    };
    try {
      setSaving(true);
      if (data) {
        payload.id = data.id;
        await updateQueueRouter(payload);
      } else {
        await addQueueRouter(payload);
      }
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
          sx: { maxWidth: 600 },
        },
      }}
    >
      <Box
        component="form"
        sx={{ p: 2, width: '100%', padding: 0 }}
        onSubmit={handleSubmit(onSubmit)}
      >
        <DialogTitle>{data ? 'Edit queue router' : 'New queue router'}</DialogTitle>
        <DialogContent sx={{ overflow: 'visible', px: 3 }}>
          {!!errorMessage && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {errorMessage}
            </Alert>
          )}
          <Grid container spacing={2}>
            <Grid size={6}>
              <FormControl fullWidth sx={{ mb: 2, margin: 0 }} size="small">
                <InputLabel id="type-label">Type</InputLabel>
                <Controller
                  name="type"
                  control={control}
                  render={({ field }) => (
                    <Select labelId="type-label" id="select" label="Type" {...field} fullWidth>
                      <MenuItem value="INTERPARK">Interpark</MenuItem>
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
                error={!!errors.name}
                helperText={errors.name?.message}
                size="small"
              />
            </Grid>
            <Grid size={12}>
              <TextField
                fullWidth
                label="Key"
                {...register('key', { required: 'Key is required' })}
                error={!!errors.name}
                helperText={errors.name?.message}
                size="small"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={onCancel} disabled={saving}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" loading={saving}>
            Save
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
