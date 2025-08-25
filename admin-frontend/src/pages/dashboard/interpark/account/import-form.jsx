import { useState } from 'react';
import { useForm } from 'react-hook-form';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { DialogTitle, DialogActions, DialogContent } from '@mui/material';

export default function ImportForm({ open, onCancel, onSuccess, data }) {
  const [errorMessage, setErrorMessage] = useState();
  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    trigger,
  } = useForm({ defaultValues: data });

  const onSubmit = async () => {
    const valid = await trigger();
    if (!valid) return;
    try {
      setSaving(true);
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
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
        <DialogTitle>Import Accounts</DialogTitle>
        <DialogContent sx={{ overflow: 'visible', px: 3 }}>
          {!!errorMessage && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {errorMessage}
            </Alert>
          )}
          <p>Only support csv file</p>
          <p>eg: xxxx@gmail.com,xxxxxxx</p>
          <Button variant="outlined" component="label">
            选择文件
            <input
              hidden
              type="file"
              onChange={(e) => {
                const f = e.target.files?.[0] || null;
                setFile(f);
              }}
              accept=".csv"
            />
          </Button>
          <Typography variant="body2" sx={{ ml: 2 }}>
            {file ? file.name : '未选择文件'}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" variant="contained">
            Upload
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
