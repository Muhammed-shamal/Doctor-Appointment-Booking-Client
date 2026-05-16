import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { Controller } from 'react-hook-form';
import { Box, FormControl, FormHelperText, InputLabel } from '@mui/material';

const MPhoneInput = ({
  name,
  control,
  label,
  rules,
  defaultCountry = 'AE',
  fullWidth = true,
  ...rest
}) => {
  return (
    <Controller
      name={name}
      control={control}
      rules={{
        required: 'Phone number is required',
        validate: (value) => {
          if (!value) return 'Phone number is required';
          return isValidPhoneNumber(value)
            ? true
            : 'Enter a valid phone number';
        },
        ...rules,
      }}
      render={({ field, fieldState }) => (
        <FormControl
          fullWidth={fullWidth}
          error={!!fieldState.error}
          variant="outlined"
          sx={{ mt: 1 }}
        >
          {label && (
            <InputLabel shrink htmlFor={`phone-input-${name}`}>
              {label}
            </InputLabel>
          )}

          <Box
            sx={{
              '& .PhoneInput': {
                display: 'flex',
                alignItems: 'center',
                border: '1px solid',
                borderColor: fieldState.error ? 'error.main' : 'grey.400',
                borderRadius: 1,
                padding: '8.5px 14px',
                fontSize: '16px',
                transition: 'border-color 0.2s',
              },
              '& .PhoneInput input': {
                flex: 1,
                border: 'none',
                outline: 'none',
                fontSize: 'inherit',
                fontFamily: 'inherit',
                background: 'transparent',
              },
              '& .PhoneInputCountry': {
                marginRight: 1,
              },
              '& .PhoneInputCountrySelect': {
                fontSize: 'inherit',
              },
              '&:hover .PhoneInput': {
                borderColor: fieldState.error ? 'error.main' : 'primary.main',
              },
            }}
          >
            <PhoneInput
              id={`phone-input-${name}`}
              international
              defaultCountry={defaultCountry}
              value={field.value}
              onChange={field.onChange}
              {...rest}
            />
          </Box>

          {fieldState.error && (
            <FormHelperText>{fieldState.error.message}</FormHelperText>
          )}
        </FormControl>
      )}
    />
  );
};

export default MPhoneInput;