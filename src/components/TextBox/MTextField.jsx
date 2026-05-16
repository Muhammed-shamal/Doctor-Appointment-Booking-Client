import React from 'react';
import { InputAdornment, TextField } from '@mui/material';
import { Controller } from 'react-hook-form'
import { TextType } from './types';
import { IMaskInput } from 'react-imask'
import { NumericFormat } from 'react-number-format';


const TextMaskCustom = React.forwardRef(
    function TextMaskCustom(props, ref) {
        const { onChange, mask, ...other } = props;
        return (
            <IMaskInput
                {...other}
                mask={mask}
                inputRef={ref}
                onAccept={(value) => onChange({ target: { name: props.name, value } })}
                overwrite
            />
        );
    }
);

const NumericFormatCustom = React.forwardRef(
    function NumericFormatCustom(props, ref) {
        const { onChange, formatProps, ...other } = props;
        return (
            <NumericFormat
                {...formatProps}
                {...other}
                getInputRef={ref}
                onValueChange={(values) => {
                    onChange({
                        target: {
                            name: props.name,
                            value: values.value,
                        },
                    });
                }}
            />
        );
    }
);

const MTextField = ({
    name, control, defaultValue, fullWidth = true, isCapital = true,
    rules, description, labelType = 'Material', readonly = false,
    className, onKeyDown, sx, startSuffix, suffix, mask, currency, required,
    label, size = 'small', id, variant = "outlined", autoFocus, disabled,
    inputRef, OnPaste, onTextChange, type = TextType.Text, maxLength, minLength }) => {
    return (
        <Controller
            name={name}
            control={control}
            // defaultValue={defaultValue}
            rules={rules}
            render={({ field, fieldState }) => (
                <>
                    {description && description.align === "Top" && (
                        <Typography style={description.style}>{description.text}</Typography>
                    )}
                    {labelType === 'Normal' && (
                        <label style={{ display: 'block', marginBottom: '0.875rem', fontSize: '0.875rem' }} htmlFor={id}>
                            {label}
                        </label>
                    )}
                    {description && description.align === "Bottom" && (
                        <Typography style={description.style} className={description?.className ? description?.className : undefined}>
                            {description.text}
                        </Typography>
                    )}
                    <TextField
                        size={size}
                        id={id}
                        aria-readonly={readonly}
                        required={required}
                        autoFocus={autoFocus}
                        fullWidth={fullWidth}
                        {...field}
                        className={fieldState.invalid ? 'WSError' : className}
                        label={labelType === 'Material' ? label : undefined}
                        variant={variant}
                        disabled={disabled}
                        style={{ backgroundColor: disabled ? 'gray' : undefined }}
                        onKeyDown={onKeyDown ? onKeyDown : undefined}
                        type={type !== TextType.Currency ? type : 'text'} // Ensure proper type
                        error={fieldState.invalid}
                        value={field.value}
                        onPaste={OnPaste}
                        inputRef={inputRef}
                        sx={{
                            '& .MuiInputBase-input': {
                                fontSize: '0.875rem', // Reduce the font size
                            },
                            '& .MuiFormHelperText-root': {
                                fontSize: '0.75rem', // Reduce the font size of the error message
                            },
                            '& .MuiInputLabel-root': {
                                fontSize: '0.875rem', // Reduce the font size of the label

                            },
                            ...sx
                        }}
                        helperText={fieldState.error ? fieldState.error.message : ''}
                        slotProps={{
                            htmlInput: {
                                min: 0,
                                maxLength,
                                minLength,
                                inputMode: type === TextType.Currency || type === TextType.Number ? 'decimal' : 'text',
                                readOnly: readonly,
                                ...(mask ? { mask } : {}), // Add mask if provided
                            },
                            input: {
                                startAdornment: startSuffix ? <InputAdornment position="end" className="suffixAdornment">{startSuffix}</InputAdornment> : type === TextType.Currency && currency ? <InputAdornment position="start">{currency}</InputAdornment> : null,
                                endAdornment: suffix ? <InputAdornment position="end" className="suffixAdornment">{suffix}</InputAdornment> : null,
                                inputComponent: mask ? TextMaskCustom : type === TextType.Currency ? NumericFormatCustom : undefined, // Choose the right component
                            }
                        }}
                        onChange={(e) => {
                            const upperValue = isCapital ? e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1) : e.target.value;

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
    )
}

export default MTextField