import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { Grid } from '@mui/material';
import Alert from '@mui/material/Alert';

import { addTask, updateTask } from 'src/service/task.js';

import VDialog from 'src/components/vcat/VDialog.jsx';
import VTextField from 'src/components/vcat/VTextField.jsx';
import VAutoComplete from 'src/components/vcat/VAutoComplete.jsx';
import VFormContainer from 'src/components/vcat/VFormContainer.jsx';

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

  const form = useForm({ defaultValues: data });

  const taskArgumentForm = useForm();

  const onSave = async () => {
    const [mainFormOk, argumentFormOk] = await Promise.all([
      form.trigger(),
      taskArgumentForm.trigger(),
    ]);
    if (!mainFormOk || !argumentFormOk) return;
    const payload = form.getValues();
    const key = TaskDefinitions.find((it) => it.category.value === currentCategory).tasks.find(
      (it) => it.value === currentTask
    ).key;
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
    <VDialog
      open={open}
      title={data ? 'Edit Task' : 'New Task'}
      okText="Save"
      okButtonProps={{
        disabled: saving,
      }}
      cancelButtonProps={{
        loading: saving,
      }}
      onOk={onSave}
      onCancel={onCancel}
    >
      {!!errorMessage && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMessage}
        </Alert>
      )}
      <VFormContainer form={form}>
        <Grid container spacing={2}>
          <Grid size={6}>
            <VAutoComplete
              name="category"
              label="Category"
              options={TaskDefinitions.map((it) => ({
                value: it.category.value,
                label: it.category.label,
              }))}
              onChange={(value) => {
                setCurrentCategory(value);
              }}
            />
          </Grid>
          <Grid size={6}>
            <VAutoComplete
              name="Task"
              label="taskType"
              options={TaskDefinitions.find(
                (it) => it.category.value === currentCategory
              )?.tasks.map((it) => ({
                value: it.value,
                label: it.name,
              }))}
              onChange={(value) => {
                setCurrentTask(value);
              }}
            />
          </Grid>
          <Grid size={6}>
            <VTextField label="Name" name="name" required />
          </Grid>
          <Grid size={6}>
            <VTextField label="Remarks" name="remarks" required />
          </Grid>
        </Grid>
      </VFormContainer>
      <VFormContainer form={taskArgumentForm}>
        {currentTask
          ? TaskDefinitions.find((it) => it.category.value === currentCategory)
              .tasks.find((it) => it.value === currentTask)
              .form(taskArgumentForm)
          : undefined}
      </VFormContainer>
    </VDialog>
  );
}
