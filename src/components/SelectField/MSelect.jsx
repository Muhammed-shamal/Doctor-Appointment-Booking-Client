import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Box,
  Chip,
  FormHelperText,
} from "@mui/material";
import { Controller } from "react-hook-form";

const MSelectField = ({
  name,
  control,
  label,
  options = [],
  loading = false,
  multiple = false,
  placeholder,
  defaultValue = multiple ? [] : "",
  disabled = false,
  rules = {},
  selectedColor = "#888",
  getOptionLabel = (opt) => opt.label ?? opt.name ?? opt.value,
  getOptionValue = (opt) => opt.value ?? opt._id ?? opt.name,
}) => {

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      rules={rules}
      render={({ field, fieldState: { error } }) => (
        <FormControl
          fullWidth
          size="small"
          margin="dense"
          error={!!error}
          disabled={disabled}
        >
          {label && <InputLabel>{label}</InputLabel>}

          <Select
            {...field}
            multiple={multiple}
            label={label}
            displayEmpty
            value={
              multiple
                ? Array.isArray(field.value)
                  ? field.value
                  : field.value
                    ? [field.value]
                    : []
                : field.value || ""
            }
            renderValue={(selected) => {
              const values = Array.isArray(selected) ? selected : [];
              if (multiple && values.length > 0) {
                return (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {values.map((val) => (
                      <Chip
                        key={val}
                        label={
                          getOptionLabel(
                            options.find((opt) => getOptionValue(opt) === val) || { name: val }
                          )
                        }
                        size="small"
                      />
                    ))}
                  </Box>
                );
              }
              if (!multiple && selected) {
                const opt = options.find((opt) => getOptionValue(opt) === selected);
                return opt ? getOptionLabel(opt) : selected;
              }
              return <span style={{ color: selectedColor }}>{placeholder}</span>;
            }}
          >
            {loading ? (
              <MenuItem disabled>
                <Box display="flex" alignItems="center" gap={1}>
                  <CircularProgress size={20} />
                  Loading...
                </Box>
              </MenuItem>
            ) : options.length === 0 ? (
              <MenuItem disabled>No options found</MenuItem>
            ) : (
              options.map((opt) => (
                <MenuItem key={getOptionValue(opt)} value={getOptionValue(opt)}>
                  {getOptionLabel(opt)}
                </MenuItem>
              ))
            )}
          </Select>

          {error && <FormHelperText>{error.message}</FormHelperText>}
        </FormControl>
      )}
    />
  );
};

export default MSelectField;