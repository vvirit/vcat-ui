import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { Grid } from '@mui/material';
import Alert from '@mui/material/Alert';

import { addWebHook, updateWebHook } from 'src/service/web-hook.js';

import VDialog from 'src/components/vcat/VDialog.jsx';
import VSelect from 'src/components/vcat/VSelect.jsx';
import VTextField from 'src/components/vcat/VTextField.jsx';
import VFormContainer from 'src/components/vcat/VFormContainer.jsx';

export default function CreateForm({ open, onCancel, onSuccess, data }) {
  const [errorMessage, setErrorMessage] = useState();
  const [saving, setSaving] = useState(false);

  const form = useForm({ defaultValues: data });

  const onSubmit = async () => {
    const valid = await form.trigger();
    if (!valid) return;
    try {
      setSaving(true);
      const formData = form.getValues();
      if (data) {
        await updateWebHook({
          id: data.id,
          ...formData,
        });
      } else {
        await addWebHook(formData);
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
      title={data ? 'Edit Webhook' : 'Add Webhook'}
      okText="Save"
      open={open}
      onCancel={onCancel}
      onOk={onSubmit}
    >
      {!!errorMessage && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMessage}
        </Alert>
      )}
      <VFormContainer form={form} >
        <Grid container spacing={2}>
          <Grid size={6}>
            <VTextField name="name" label="Name" required />
          </Grid>
          <Grid size={6}>
            <VSelect name="type" label="Type" options={[
              {
                label: 'NOTICE',
                value: 'NOTICE',
              }
            ]} />
          </Grid>
          <Grid size={6}>
            <VTextField name="url" label="Url" required />
          </Grid>
          <Grid size={6}>
            <VSelect name="method" label="Method" options={[
              {
                label: 'GET',
                value: 'GET',
              },
              {
                label: 'POST',
                value: 'POST',
              },
              {
                label: 'PUT',
                value: 'PUT',
              }
            ]} />
          </Grid>
          <Grid size={12}>
            <VTextField name="body" label="Body" multiline rows={8}/>
          </Grid>
        </Grid>
      </VFormContainer>
    </VDialog>
  );
}
