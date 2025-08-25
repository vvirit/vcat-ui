import { useState } from 'react';
import { Controller } from 'react-hook-form';

import Box from '@mui/material/Box';
import { Grid } from '@mui/material';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Autocomplete from '@mui/material/Autocomplete';

import { useServerData } from 'src/hooks/use-data.js';

import { getAllProxies } from 'src/service/proxy.js';
import { getAllPerforms } from 'src/service/interpark-perform.js';
import { getQueueRoutersByType } from 'src/service/queue-router.js';
import { getAllInterparkSeatRotatePools } from 'src/service/interpark-seat-rotate-pool.js';

const fetchRouters = async () => await getQueueRoutersByType('INTERPARK')

const InterparkBookingTaskForm = (
  {
    form,
    data,
  }
) => {
  const proxies = useServerData(getAllProxies, []);
  const performs = useServerData(getAllPerforms, []);
  const rotatePools = useServerData(getAllInterparkSeatRotatePools, []);
  const routers = useServerData(fetchRouters, []);
  const [currentPerformId, setCurrentPerformId] = useState();

  const {
    register,
    control,
    formState: { errors },
  } = form;

  return (
    <Box
      component="form"
      sx={{ p: 2, width: '100%', padding: 0 }}
    >
      <Grid container spacing={2}>
        <Grid size={6}>
          <FormControl fullWidth sx={{ mb: 2, margin: 0 }} size="small">
            <InputLabel id="type-label">Proxy</InputLabel>
            <Controller
              name="proxyId"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <Select labelId="type-label" id="select" label="Type" {...field} fullWidth>
                  {
                    proxies.map((it) => (
                      <MenuItem value={it.id}>{it.name}</MenuItem>
                    ))
                  }
                </Select>
              )}
            />
          </FormControl>
        </Grid>
        <Grid size={6}>
          <Controller
            name="performId"
            control={control}
            render={({ field, fieldState }) => (
              <Autocomplete
                options={performs.map((p) => ({
                  id: p.id,
                  label: p.name,
                }))}
                size="small"
                onChange={(_, v) => {
                  field.onChange(v?.id ?? null);
                  setCurrentPerformId(v?.id ?? null);
                }}
                getOptionLabel={(o) => o.label}
                isOptionEqualToValue={(a, b) => a.id === b.id} // 避免比较失败
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Perform"
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                  />
                )}
              />
            )}
          />
        </Grid>
        <Grid size={6}>
          <Controller
            name="routerId"
            control={control}
            render={({ field, fieldState }) => (
              <Autocomplete
                options={routers.map((p) => ({
                  id: p.id,
                  label: p.name,
                }))}
                size="small"
                onChange={(_, v) => {
                  field.onChange(v?.id ?? null);
                }}
                getOptionLabel={(o) => o.label}
                isOptionEqualToValue={(a, b) => a.id === b.id} // 避免比较失败
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Router"
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                  />
                )}
              />
            )}
          />
        </Grid>
        <Grid size={6}>
          <TextField
            fullWidth
            label="Concurrency"
            {...register('concurrency', { required: 'Concurrency is required' })}
            error={!!errors.concurrency}
            helperText={errors.concurrency?.message}
            size="small"
          />
        </Grid>
        <Grid size={6}>
          <TextField
            fullWidth
            label="Request Interval(ms)"
            {...register('requestInterval', { required: 'RequestInterval is required' })}
            error={!!errors.requestInterval}
            helperText={errors.requestInterval?.message}
            size="small"
          />
        </Grid>
        <Grid size={6}>
          <Controller
            name="rotatePoolId"
            control={control}
            render={({ field, fieldState }) => (
              <Autocomplete
                options={rotatePools
                  .filter((p) => p.performId === currentPerformId)
                  .map((p) => ({
                    id: p.id,
                    label: p.name,
                  }))}
                size="small"
                onChange={(_, v) => {
                  field.onChange(v?.id ?? null);
                }}
                getOptionLabel={(o) => o.label}
                isOptionEqualToValue={(a, b) => a.id === b.id} // 避免比较失败
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Seat rotate pool"
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                  />
                )}
              />
            )}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default InterparkBookingTaskForm;
