import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import { DialogTitle, DialogActions, DialogContent } from '@mui/material';

import { Iconify } from '../iconify/index.js';

const VDialog = ({
  title,
  okText,
  okButtonProps,
  cancelText,
  cancelButtonProps,
  onOk,
  onCancel,
  children,
  open,
  maxWidth,
  maxHeight,
}) => (
  <Dialog
    fullWidth
    maxWidth={false}
    open={open}
    slotProps={{
      paper: {
        sx: { maxWidth: maxWidth || 960 },
      },
    }}
  >
    <DialogTitle>
      {title}
      <IconButton
        aria-label="close"
        onClick={onCancel}
        sx={{ position: 'absolute', right: 20, top: 20 }}
      >
        <Iconify icon="mingcute:close-fill" />
      </IconButton>
    </DialogTitle>
    <DialogContent sx={{ overflow: 'auto', maxHeight: maxHeight || 600 }}>{children}</DialogContent>
    <DialogActions>
      <Button variant="outlined" onClick={onCancel} {...cancelButtonProps}>
        {cancelText || 'Cancel'}
      </Button>
      <Button type="submit" variant="contained" onClick={onOk} {...okButtonProps}>
        {okText || 'Confirm'}
      </Button>
    </DialogActions>
  </Dialog>
);

export default VDialog;
