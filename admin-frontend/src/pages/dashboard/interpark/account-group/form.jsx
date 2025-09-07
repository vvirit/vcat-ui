import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { Grid } from '@mui/material';
import Alert from '@mui/material/Alert';
import Typography from '@mui/material/Typography';

import {
  addInterparkAccountGroup,
  updateInterparkAccountGroup,
} from 'src/service/interpark-account-group.js';

import VDialog from 'src/components/vcat/VDialog.jsx';
import VTextField from 'src/components/vcat/VTextField.jsx';
import VFormContainer from 'src/components/vcat/VFormContainer.jsx';

export default function CreateForm({ open, onCancel, onSuccess, data }) {
  const [errorMessage, setErrorMessage] = useState();
  const [saving, setSaving] = useState(false);

  const form = useForm({ defaultValues: data });

  const onSave = async () => {
    const valid = await form.trigger();
    if (!valid) return;
    const formData = form.getValues();
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
    <VDialog title={data ? 'Edit Group' : 'New Group'} okText="Save" open={open} onOk={onSave} onCancel={onCancel}>
      <VFormContainer form={form}>
        {!!errorMessage && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {errorMessage}
          </Alert>
        )}
        <Grid container spacing={2}>
          <Grid size={12}>
            <VTextField label="Name" name="name" required />
          </Grid>
          <Grid size={12}>
            <VTextField label="Condition" name="condition" required />
          </Grid>
          <Grid size={12}>
            <Typography variant="body2" gutterBottom>
              Condition usage fields: id, email, password, remarks, verified, disabled
            </Typography>
          </Grid>
          <Grid size={6}>
            <VTextField label="Page Number" name="pageNumber" />
          </Grid>
          <Grid size={6}>
            <VTextField label="Page Size" name="pageSize" />
          </Grid>
          <Grid size={12}>
            <VTextField label="Remarks" name="remarks" />
          </Grid>
        </Grid>
      </VFormContainer>
    </VDialog>
  );
}
