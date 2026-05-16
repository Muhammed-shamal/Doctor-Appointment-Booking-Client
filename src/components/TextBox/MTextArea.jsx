import { TextField, Typography } from '@mui/material';
import { Controller } from 'react-hook-form';

const MTextArea = ({
  name,
  control,
  defaultValue = '',
  fullWidth = true,
  rules,
  description,
  labelType = 'Material',
  readonly = false,
  className,
  sx,
  label,
  size = 'small',
  id,
  variant = 'outlined',
  autoFocus,
  disabled,
  required,
  rows = 4, // default row count
  maxRows, // optional
  inputRef,
  onKeyDown,
  OnPaste,
  onTextChange,
  maxLength,
  minLength,
}) => {
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      rules={rules}
      render={({ field, fieldState }) => (
        <>
          {description && description.align === 'Top' && (
            <Typography style={description.style}>{description.text}</Typography>
          )}

          {labelType === 'Normal' && (
            <label
              htmlFor={id}
              style={{
                display: 'block',
                marginBottom: '0.875rem',
                fontSize: '0.875rem',
              }}
            >
              {label}
            </label>
          )}

          {description && description.align === 'Bottom' && (
            <Typography
              style={description.style}
              className={description?.className ? description.className : undefined}
            >
              {description.text}
            </Typography>
          )}

          <TextField
            {...field}
            id={id}
            required={required}
            autoFocus={autoFocus}
            fullWidth={fullWidth}
            label={labelType === 'Material' ? label : undefined}
            variant={variant}
            size={size}
            multiline
            rows={rows}
            maxRows={maxRows}
            aria-readonly={readonly}
            disabled={disabled}
            inputRef={inputRef}
            className={fieldState.invalid ? 'WSError' : className}
            error={fieldState.invalid}
            value={field.value ?? ''}
            helperText={fieldState.error ? fieldState.error.message : ''}
            sx={{
              '& .MuiInputBase-input': { fontSize: '0.875rem' },
              '& .MuiFormHelperText-root': { fontSize: '0.75rem' },
              '& .MuiInputLabel-root': { fontSize: '0.875rem' },
              ...sx,
            }}
            inputProps={{
              readOnly: readonly,
              maxLength,
              minLength,
            }}
            onKeyDown={onKeyDown}
            onPaste={OnPaste}
            onChange={(e) => {
               const upperValue = e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1);

              if (onTextChange) {
                onTextChange({
                  ...e,
                  target: {
                    ...e.target,
                    value: upperValue,
                  },
                });
              }

              field.onChange(upperValue);
            }}
          />
        </>
      )}
    />
  );
};

export default MTextArea;