import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "react-query";
import omit from "lodash/omit";
import { schema, Schema } from "src/utils/rules";
import authApi from "src/api/auth.api";
import { isAxiosUnprocessableEntityError } from "src/utils/utils";
import { ErrorResponse } from "src/types/utils.type";
import { Helmet } from "react-helmet-async";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import styled from "styled-components";

const StyledLink = styled(Link)`
  font-family: "Roboto";
  color: #1e2f8d;
  &:hover,&.active {
    text-decoration: underline;
  }
`;

type FormData = Pick<Schema, "email" | "verified_code_forgot" | "password" | "confirm_password">;
const registerSchema = schema.pick(["email", "verified_code_forgot", "password", "confirm_password"]);

export default function Register() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm<FormData>({
    resolver: yupResolver(registerSchema)
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const resetPasswordMutation = useMutation({
    mutationFn: (body: Omit<FormData, "confirm_password">) => authApi.resetPassword(body)
  });
  const onSubmit = handleSubmit((data) => {
    const body = omit(data, ["confirm_password"]);
    resetPasswordMutation.mutate(body, {
      onSuccess: () => {
        navigate("/");
      },
      onError: (error) => {
        if (isAxiosUnprocessableEntityError<ErrorResponse<Omit<FormData, "confirm_password">>>(error)) {
          const formError = error.response?.data.data;
          if (formError) {
            Object.keys(formError).forEach((key) => {
              setError(key as keyof Omit<FormData, "confirm_password">, {
                message: formError[key as keyof Omit<FormData, "confirm_password">],
                type: "Server"
              });
            });
          }
        }
      }
    });
  });

  return (
    <div className="h-main">
      <Helmet>
        <title>Reset Password | Trust Group</title>
        <meta name="description" content="Reset Password Trust Group" />
      </Helmet>
      <div className="max-w-[60rem] mx-auto">
        <form onSubmit={onSubmit} noValidate>
          <div className="text-26 font-medium mb-6 text-blue text-center">Reset Password</div>
          <TextField
            {...register("email")}
            type="email"
            variant="outlined"
            fullWidth
            size="small"
            margin="normal"
            label="Email"
            error={!!errors.email}
            helperText={errors.email?.message}
          />
          <TextField
            {...register("verified_code_forgot")}
            type="text"
            variant="outlined"
            fullWidth
            margin="normal"
            size="small"
            label="Verification Code"
            error={!!errors.verified_code_forgot}
            helperText={errors.verified_code_forgot?.message}
          />
          <TextField
            {...register("password")}
            type={showPassword ? "text" : "password"}
            variant="outlined"
            fullWidth
            margin="normal"
            size="small"
            label="Password"
            error={!!errors.password}
            helperText={errors.password?.message}
            InputProps={{
              endAdornment: (
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  {showPassword ? <VisibilityOffIcon className="!text-[1.6rem]"/> : <VisibilityIcon className="!text-[1.6rem]"/>}
                </IconButton>
              ),
            }}
          />
          <TextField
            {...register("confirm_password")}
            type={showPassword ? "text" : "password"}
            variant="outlined"
            fullWidth
            margin="normal"
            size="small"
            label="Confirm Password"
            error={!!errors.confirm_password}
            helperText={errors.confirm_password?.message}
            InputProps={{
              endAdornment: (
                <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
                  {showConfirmPassword ? <VisibilityOffIcon className="!text-[1.6rem]"/> : <VisibilityIcon className="!text-[1.6rem]"/>}
                </IconButton>
              ),
            }}
          />
          <div className="mt-8">
            <Button
              type="submit"
              variant="contained"
              color="secondary"
              fullWidth
              size="large"
              disabled={resetPasswordMutation.isLoading}
            >
              {resetPasswordMutation.isLoading ? "Loading..." : "Reset Password"}
            </Button>
          </div>
          <div className="mt-8 flex items-center justify-center">
            <StyledLink className="text-[1.4rem]" to="/login">
              Back to Login?
            </StyledLink>
          </div>
        </form>
      </div>
    </div>
  );
}
