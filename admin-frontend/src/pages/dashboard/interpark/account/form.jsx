import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import { Grid, DialogTitle, DialogActions, DialogContent } from '@mui/material';

import {
  addInterparkAccount,
  updateInterparkAccount,
} from 'src/service/interpark-account.js';

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
        await updateInterparkAccount(formData);
      } else {
        await addInterparkAccount(formData);
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
          sx: { maxWidth: 680 },
        },
      }}
    >
      <Box
        component="form"
        sx={{ p: 2, width: '100%', padding: 0 }}
        onSubmit={handleSubmit(onSubmit)}
      >
        <DialogTitle>{data ? 'Edit account' : 'New account'}</DialogTitle>
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
                label="Email"
                {...register('email', { required: 'Email is required' })}
                error={!!errors.email}
                helperText={errors.email?.message}
                size="small"
              />
            </Grid>
            <Grid size={6}>
              <TextField
                fullWidth
                label="Password"
                {...register('password', { required: 'password is required' })}
                error={!!errors.password}
                helperText={errors.password?.message}
                size="small"
              />
            </Grid>
            <Grid size={6}>
              <TextField
                fullWidth
                label="Remarks"
                {...register('remarks')}
                error={!!errors.remarks}
                helperText={errors.remarks?.message}
                size="small"
              />
            </Grid>
            <Grid size={3}>
              <Controller
                name="verified"
                control={control}
                defaultValue
                render={({ field }) => (
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                      />
                    }
                    label="Verified"
                  />
                )}
              />
            </Grid>
            <Grid size={3}>
              <Controller
                name="disabled"
                control={control}
                defaultValue={false}
                render={({ field }) => (
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                      />
                    }
                    label="Disabled"
                  />
                )}
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
