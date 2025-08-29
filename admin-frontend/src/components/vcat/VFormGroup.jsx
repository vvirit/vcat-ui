import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

const VFormGroup = ({ title, children }) => (
    <>
      <Typography
        variant="overline"
        color="text.secondary"
        sx={{ letterSpacing: 1, fontWeight: 700, marginTop: 2, display: 'block' }}
      >
        {title}
      </Typography>
      <Divider sx={{ mb: 2, marginBottom: 2 }} />
      {children}
    </>
  );

export default VFormGroup;
