import {
  FormHelperText,
  Typography,
  FormControl,
  Input as _Input,
  type InputProps,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { FC } from "react";
import { Controller, FieldError, DeepMap, useFormContext } from "react-hook-form";

const Input = styled(_Input)`
  background-color: white;
  padding: 0.4rem 1.5rem;
  margin-bottom: 0.5rem;
`;

interface IFormInputProps extends InputProps {
  name: string;
  label: string;
}

const FormInput: FC<IFormInputProps> = ({ name, label, ...otherProps }) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const errorMessage: string | FieldError | DeepMap<any, FieldError> =
    errors?.[name]?.message || "";

  return (
    <Controller
      control={control}
      defaultValue=""
      name={name}
      render={({ field }) => (
        <FormControl fullWidth sx={{ mb: 2 }}>
          <Typography
            variant="body2"
            sx={{ color: "#fff", mb: 1, fontWeight: 500 }}
          >
            {label}
          </Typography>
          <Input
            {...field}
            fullWidth
            sx={{ borderRadius: ".5rem" }}
            disableUnderline
            error={!!errorMessage}
            {...otherProps}
          />
          <FormHelperText error={!!errorMessage}>
            {errorMessage}
          </FormHelperText>
        </FormControl>
      )}
    />
  );
};

export default FormInput;
