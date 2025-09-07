import { Grid } from '@mui/material';
import Typography from '@mui/material/Typography';

const VDescriptions = ({ items }) => (
    <Grid container spacing={2}>
      {
        items.map((item) => (
          <Grid size={item.span || 4} key={item.key}>
            <Typography component="span" variant="body1" color="text.secondary" sx={{ mr: 1 }}>
              {item.label}:
            </Typography>
            <Typography component="span" variant="body1" color="text">
              {item.children}
            </Typography>
          </Grid>
        ))
      }
    </Grid>
  );

export default VDescriptions;
