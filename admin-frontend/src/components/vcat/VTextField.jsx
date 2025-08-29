import { useFormContext } from 'react-hook-form';

import TextField from '@mui/material/TextField';

const VTextField = ({ name, label, required }) => {

  const {
    register,
    formState: { errors },
  } = useFormContext();

  const options = {};
  if (required) {
    options.required = `${label} is required`;
  }
  return (
    <TextField
      fullWidth
      label={label}
      {...register(name, options)}
      error={errors[name]}
      helperText={errors[name]?.message}
      size="small"
      autoComplete="off"
    />
  );
};

export default VTextField;
