import { useState } from "react";
import { useFormik } from "formik";
import { Box, Button, TextField, CircularProgress } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { Helmet } from "react-helmet-async";
import http from "@/utils/http";
import styled from "styled-components";

const StyledLink = styled(Link)`
  font-family: "Roboto";
  color: #1e2f8d;
  &:hover,&.active {
    text-decoration: underline;
  }
`;

const ForgotPasswordForm = () => {
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [emailError, setEmailError] = useState("");
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email address").required("Email is required"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        await http.post(
          "forgot-password",
          { email: values.email }
        );
        setIsEmailSent(true);
        setEmailError("");
        navigate("/reset-password");
      } catch (error) {
        console.error(error);
      }
    },
  });

  return (
    <div className="h-main">
      <Helmet>
        <title>Forgot Password | Trust Group</title>
        <meta name='description' content='Login to have access!' />
      </Helmet>
      <Box
        className="max-w-[50rem] mx-auto"
      >
        <form onSubmit={formik.handleSubmit}>
          <div className="text-26 font-medium mb-6 text-blue text-center">Enter email send code</div>
          {/* Replace Input with TextField */}
          <TextField
            name="email"
            id="email"
            type="email"
            className="mt-3"
            value={formik.values.email}
            onChange={formik.handleChange}
            placeholder="Enter email"
            autoComplete="on"
            size="small"
            variant="outlined"
            fullWidth
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
          />
          <Button className="!mt-8" variant="contained" color="secondary" fullWidth size="large" type="submit" disabled={!formik.isValid || formik.isSubmitting}>
            {formik.isSubmitting ? ( // Show loading indicator when submitting
              <CircularProgress size={18} color="inherit" />
            ) : (
              "Send Code"
            )}
          </Button>
          <div className="mt-8 flex items-center justify-center">
            <StyledLink className="text-[1.4rem]" to="/login">
              Back to Login?
            </StyledLink>
          </div>
          {emailError && <p>{emailError}</p>}
          {isEmailSent && <p>Verification code has been sent to your email.</p>}
        </form>
      </Box>
    </div>
  );
};

export default ForgotPasswordForm;
