import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { Grid } from '@mui/material';
import Alert from '@mui/material/Alert';

import { useServerData } from 'src/hooks/use-data.js';

import { getNodes } from 'src/service/node.js';
import { addTask, updateTask } from 'src/service/task.js';

import VDialog from 'src/components/vcat/VDialog.jsx';
import VSelect from 'src/components/vcat/VSelect.jsx';
import VTextField from 'src/components/vcat/VTextField.jsx';
import VAutoComplete from 'src/components/vcat/VAutoComplete.jsx';
import VFormContainer from 'src/components/vcat/VFormContainer.jsx';

import InterparkLoginTaskForm from './forms/interpark/login.jsx';
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
        form: (form, data) => <InterparkBookingTaskForm form={form} data={data} />,
      },
      {
        name: 'Login',
        value: 'LOGIN',
        key: 'interparkLoginTask',
        form: (form, data) => <InterparkLoginTaskForm form={form} data={data} />,
      },
    ],
  },
];

export function CreateForm({ open, onCancel, onSuccess, data, runView = false }) {
  const [errorMessage, setErrorMessage] = useState();
  const [saving, setSaving] = useState(false);

  const [currentCategory, setCurrentCategory] = useState(data?.category);
  const [currentTask, setCurrentTask] = useState(data?.taskName);
  const nodes = useServerData(getNodes, []);

  const form = useForm({ defaultValues: data });

  const taskArgumentForm = useForm({ defaultValues: data?.argument });

  const onSave = async () => {
    const [mainFormOk, argumentFormOk] = await Promise.all([
      form.trigger(),
      taskArgumentForm.trigger(),
    ]);
    if (!mainFormOk || !argumentFormOk) return;
    const payload = form.getValues();
    payload.argument = taskArgumentForm.getValues();
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
      title={runView ? 'Run Task' : data ? 'Edit Task' : 'New Task'}
      okText={ runView ? 'Run' : 'Save' }
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
          {
            runView && (
              <Grid size={12}>
                <VSelect
                  name="nodeId"
                  label="Node"
                  options={nodes.map((it) => ({
                    value: it.id,
                    label: it.id,
                  }))}
                  required
                />
              </Grid>
            )
          }
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
              name="taskName"
              label="Task"
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
            <VTextField label="Remarks" name="remarks" />
          </Grid>
        </Grid>
      </VFormContainer>
      <VFormContainer form={taskArgumentForm}>
        {currentTask
          ? TaskDefinitions.find((it) => it.category.value === currentCategory)
              .tasks.find((it) => it.value === currentTask)
              .form(taskArgumentForm, data?.argument)
          : undefined}
      </VFormContainer>
    </VDialog>
  );
}
