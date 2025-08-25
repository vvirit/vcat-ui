import { useRef, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import { Grid, DialogTitle, DialogActions, DialogContent } from '@mui/material';

import { addTask, updateTask } from 'src/service/task.js';

import InterparkBookingTaskForm from './forms/interpark/booking.jsx';

const TaskDefinitions = [
  {
    category: {
      label: 'Interpark',
      value: 'INTERPARK',
    },
    tasks: [
      {
        name: 'Booking',
        value: 'BOOKING',
        key: 'interparkBookingTask',
        form: (form) => <InterparkBookingTaskForm form={form} />,
      },
    ],
  },
];

export function CreateForm({ open, onCancel, onSuccess, data }) {
  const [errorMessage, setErrorMessage] = useState();
  const [saving, setSaving] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(data?.category);
  const [currentTask, setCurrentTask] = useState(data?.taskType);

  const {
    register,
    control,
    formState: { errors },
    trigger,
    getValues,
  } = useForm({ defaultValues: data });

  const taskArgumentForm = useForm({defaultValues});

  const onSave = async () => {
    const [mainFormOk, argumentFormOk] = await Promise.all([trigger(), taskArgumentForm.trigger()]);
    if (!mainFormOk || !argumentFormOk) return; // 有错误则中止（错误已在对应组件上显示）
    const payload = getValues();
    const key = TaskDefinitions.find((it) => it.category.value === currentCategory)
      .tasks.find((it) => it.value === currentTask).key
    payload[key] = taskArgumentForm.getValues();
    try {
      setSaving(true);
      if (data) {
        payload.id = data.id;
        await updateTask(payload);
      } else {
        await addTask(payload);
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
          sx: { maxWidth: 1200 },
        },
      }}
    >
      <DialogTitle>{data ? 'Edit task' : 'New task'}</DialogTitle>
      <DialogContent sx={{ overflow: 'visible', px: 3 }}>
        {!!errorMessage && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {errorMessage}
          </Alert>
        )}
        <Box component="form" sx={{ p: 2, width: '100%', padding: 0 }}>
          <Grid container spacing={2}>
            <Grid size={6}>
              <FormControl fullWidth sx={{ mb: 2, margin: 0 }} size="small">
                <InputLabel id="type-label">Category</InputLabel>
                <Controller
                  name="category"
                  control={control}
                  render={({ field }) => (
                    <Select
                      labelId="type-label"
                      id="select"
                      label="Category"
                      {...field}
                      fullWidth
                      onChange={(e) => {
                        const v = e.target.value;
                        setCurrentCategory(v);
                        field.onChange(v);
                      }}
                    >
                      {TaskDefinitions.map((it) => (
                        <MenuItem value={it.category.value}>{it.category.label}</MenuItem>
                      ))}
                    </Select>
                  )}
                />
              </FormControl>
            </Grid>
            <Grid size={6}>
              <FormControl fullWidth sx={{ mb: 2, margin: 0 }} size="small">
                <InputLabel id="type-label">Task</InputLabel>
                <Controller
                  name="taskType"
                  control={control}
                  render={({ field }) => (
                    <Select
                      labelId="type-label"
                      id="select"
                      label="Task"
                      {...field}
                      fullWidth
                      onChange={(e) => {
                        const v = e.target.value;
                        setCurrentTask(v);
                        field.onChange(v);
                      }}
                    >
                      {TaskDefinitions.find(
                        (it) => it.category.value === currentCategory
                      )?.tasks.map((it) => (
                        <MenuItem value={it.value}>{it.name}</MenuItem>
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
                error={!!errors.remarks}
                helperText={errors.remarks?.message}
                size="small"
              />
            </Grid>
          </Grid>
        </Box>
        <Divider sx={{ my: 1 }}>Arguments</Divider>
        {currentTask
          ? TaskDefinitions.find((it) => it.category.value === currentCategory)
              .tasks.find((it) => it.value === currentTask)
              .form(taskArgumentForm)
          : undefined}
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={onCancel} disabled={saving}>
          Cancel
        </Button>
        <Button type="submit" variant="contained" loading={saving} onClick={onSave}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
