import { FormProvider } from 'react-hook-form';

import Box from '@mui/material/Box';

const VFormContainer = ({ form, children, onSubmit }) => (
  <FormProvider {...form}>
    <Box component="form" sx={{ p: 2, width: '100%', padding: 0, marginBottom: 1, paddingTop: 1 }}>
      {children}
    </Box>
  </FormProvider>
);

export default VFormContainer;
