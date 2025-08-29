import { Controller, useFormContext } from 'react-hook-form';

import { Select } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';

const VSelect = ({ name, label, required, options, onChange }) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      defaultValue=""
      rules={required ? { required: `${label} is required` } : undefined}
      render={({ field, fieldState: { error } }) => (
        <FormControl
          fullWidth
          size="small"
          error={!!error}
        >
          <InputLabel id={`${name}-label`}>{label}</InputLabel>
          <Select
            labelId={`${name}-label`}
            id={name}
            label={label}
            value={field.value ?? ""}   // 确保受控
            onChange={(e) => {
              const v = e.target.value;
              field.onChange(v);        // 更新 RHF
              onChange?.(v);            // 触发外部回调
            }}
            onBlur={field.onBlur}
          >
            {options.map((it) => (
              <MenuItem key={it.value} value={it.value}>
                {it.label}
              </MenuItem>
            ))}
          </Select>
          <FormHelperText>{error?.message}</FormHelperText>
        </FormControl>
      )}
    />
  );
};


export default VSelect;
