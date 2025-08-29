import { useRef, useState } from 'react';
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

import { addInterparkPerform, updateInterparkPerform } from 'src/service/interpark-perform.js';

import TabPanel from 'src/components/tab-panel/index.jsx';
import EditTable from 'src/components/vcat/VEditTable.jsx';

export default function CreateForm({ open, onCancel, onSuccess, data }) {
  const [errorMessage, setErrorMessage] = useState();
  const roundsTableRef = useRef();
  const blocksTableRef = useRef();
  const [saving, setSaving] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    trigger,
  } = useForm({ defaultValues: data });

  const roundsColumns = [
    {
      key: 'date',
      label: 'Date',
      dataIndex: 'date',
      width: 180,
    },
    {
      key: 'time',
      label: 'Time',
      dataIndex: 'time',
      width: 140,
    },
    {
      key: 'sequence',
      label: 'Sequence',
      dataIndex: 'sequence',
    },
  ];

  const blocksColumns = [
    {
      key: 'name',
      label: 'Name',
      dataIndex: 'name',
      width: 180,
    },
    {
      key: 'code',
      label: 'Code',
      dataIndex: 'code',
    },
  ];

  const onSubmit = async (formData) => {
    const valid = await trigger();
    if (!valid) return;
    let payload = {
      ...formData,
      rounds: roundsTableRef.current?.getData() || [],
      blocks: blocksTableRef.current?.getData() || [],
    };
    try {
      setSaving(true);
      if (data) {
        payload.id = data.id;
        await updateInterparkPerform(payload);
      } else {
        await addInterparkPerform(payload);
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
        <DialogTitle>{data ? 'Edit perform' : 'New perform'}</DialogTitle>
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
              <TextField
                fullWidth
                label="Code"
                {...register('performCode', { required: 'code is required' })}
                error={!!errors.performCode}
                helperText={errors.performCode?.message}
                size="small"
              />
            </Grid>
            <Grid size={6}>
              <TextField
                fullWidth
                label="Place code"
                {...register('placeCode', { required: 'place code is required' })}
                error={!!errors.placeCode}
                helperText={errors.placeCode?.message}
                size="small"
              />
            </Grid>
            <Grid size={6}>
              <FormControl fullWidth sx={{ mb: 2, margin: 0 }} size="small">
                <InputLabel id="type-label">Tmg code</InputLabel>
                <Controller
                  name="tmgCode"
                  control={control}
                  render={({ field }) => (
                    <Select labelId="type-label" id="select" label="Tmg code" {...field} fullWidth>
                      <MenuItem value="D2006">D2006</MenuItem>
                      <MenuItem value="D2003">D2003</MenuItem>
                    </Select>
                  )}
                />
              </FormControl>
            </Grid>
          </Grid>
          <TabPanel
            items={[
              {
                key: 'rounds',
                label: 'Rounds',
                children: (
                  <EditTable
                    ref={roundsTableRef}
                    columns={roundsColumns}
                    initialData={data?.rounds}
                  />
                ),
              },
              {
                key: 'blocks',
                label: 'Blocks',
                children: (
                  <EditTable
                    ref={blocksTableRef}
                    columns={blocksColumns}
                    initialData={data?.blocks}
                  />
                ),
              },
            ]}
          />
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
