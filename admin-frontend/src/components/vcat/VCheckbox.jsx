import { Controller, useFormContext } from 'react-hook-form';

import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';


const VCheckbox = ({ name, label, onChange }) => {

  const {
    control,
  } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <FormControlLabel
          control={
            <Checkbox
              checked={field.value}
              onChange={(e) => {
                field.onChange(e.target.checked);
                onChange?.(e.target.checked);
              }}
            />
          }
          label={label}
        />
      )}
    />
  );
};

export default VCheckbox;
