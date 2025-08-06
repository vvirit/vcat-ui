import { useForm, Controller } from 'react-hook-form';

import Box from '@mui/material/Box';
import { Grid } from '@mui/material';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Container from '@mui/material/Container';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';

const InterparkPurchaseTicketForm = () => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log('Form data:', data);
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ p: 2, width: '100%' }}>
      <Grid container spacing={2}>
        <Grid size={6}>
          <FormControl fullWidth sx={{ mb: 2 }} size="small">
            <InputLabel id="type-label">Proxy</InputLabel>
            <Controller
              name="type"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <Select labelId="type-label" id="select" label="Type" {...field} fullWidth>
                  <MenuItem value="A">Local</MenuItem>
                  <MenuItem value="B">Query</MenuItem>
                  <MenuItem value="C">Korea</MenuItem>
                </Select>
              )}
            />
          </FormControl>
        </Grid>
        <Grid size={6}>
          <TextField
            fullWidth
            label="Concurrency"
            {...register('password', { required: 'Password is required' })}
            error={!!errors.password}
            helperText={errors.password?.message}
            size="small"
          />
        </Grid>
        <Grid size={6}>
          <TextField
            fullWidth
            label="Request Interval(ms)"
            {...register('password', { required: 'Password is required' })}
            error={!!errors.password}
            helperText={errors.password?.message}
            size="small"
          />
        </Grid>
        <Grid size={6}>
          <TextField
            fullWidth
            label="Router"
            {...register('password', { required: 'Password is required' })}
            error={!!errors.password}
            helperText={errors.password?.message}
            size="small"
          />
        </Grid>
        <Grid size={6}>
          <TextField
            fullWidth
            label="Perform Code"
            {...register('password', { required: 'Password is required' })}
            error={!!errors.password}
            helperText={errors.password?.message}
            size="small"
          />
        </Grid>
        <Grid size={6}>
          <TextField
            fullWidth
            label="Place Code"
            {...register('password', { required: 'Password is required' })}
            error={!!errors.password}
            helperText={errors.password?.message}
            size="small"
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default InterparkPurchaseTicketForm;
