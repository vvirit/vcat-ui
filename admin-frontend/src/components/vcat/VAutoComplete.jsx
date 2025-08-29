import { Controller, useFormContext } from 'react-hook-form';

import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

const VAutoComplete = ({ name, label, options, required, onChange }) => {
  const {
    control,
  } = useFormContext();

  const rules = {};
  if (required) {
    rules.required = `${label} is required`;
  }

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState }) => (
        <Autocomplete
          value={options?.find(o => o.value === field.value) ?? null}
          options={options}
          size="small"
          onChange={(_, v) => {
            field.onChange(v?.value ?? null);
            onChange?.(v?.value ?? null);
          }}
          getOptionLabel={(o) => o.label}
          isOptionEqualToValue={(a, b) => a.value === b.value}
          renderInput={(params) => (
            <TextField
              {...params}
              label={label}
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
            />
          )}
        />
      )}
    />
  );
};

export default VAutoComplete;
