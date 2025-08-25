import { useState } from 'react';
import { useForm } from 'react-hook-form';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { Grid, DialogTitle, DialogActions, DialogContent } from '@mui/material';

import {
  addInterparkAccountGroup,
  updateInterparkAccountGroup,
} from 'src/service/interpark-account-group.js';

export default function CreateForm({ open, onCancel, onSuccess, data }) {
  const [errorMessage, setErrorMessage] = useState();
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
    try {
      setSaving(true);
      if (data) {
        formData.id = data.id;
        await updateInterparkAccountGroup(formData);
      } else {
        await addInterparkAccountGroup(formData);
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
          sx: { maxWidth: 1000 },
        },
      }}
    >
      <Box
        component="form"
        sx={{ p: 2, width: '100%', padding: 0 }}
        onSubmit={handleSubmit(onSubmit)}
      >
        <DialogTitle>{data ? 'Edit group' : 'New group'}</DialogTitle>
        <DialogContent sx={{ overflow: 'visible', px: 3 }}>
          {!!errorMessage && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {errorMessage}
            </Alert>
          )}
          <Grid container spacing={2}>
            <Grid size={12}>
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
                label="Condition"
                {...register('condition', { required: 'condition is required' })}
                error={!!errors.condition}
                helperText={errors.condition?.message}
                size="small"
                multiline
                rows={5}
              />
            </Grid>
            <Grid size={12}>
              <Typography variant="body2" gutterBottom>
                Condition usage fields: id, email, password, remarks, verified, disabled
              </Typography>
            </Grid>
            <Grid size={12}>
              <TextField
                fullWidth
                label="Remarks"
                {...register('remarks')}
                error={!!errors.remarks}
                helperText={errors.remarks?.message}
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
