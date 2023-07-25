import { useState } from "react";
import { useFormik } from "formik";
import { Box } from "@mui/material";
import Button from "src/components/Button";
import Input from "@/components/Input";
import axios from "axios";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const ForgotPasswordForm = () => {
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [emailError, setEmailError] = useState("");
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    email: Yup.string().required("Email is required"),
    verificationCode: Yup.string().required("Verification code is required"),
    password: Yup.string()
      .required("Password is required")
      .min(8, "Password must be more than 8 characters")
      .max(32, "Password must be less than 32 characters"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords do not match")
      .required("Please confirm your password"),
  });
  const formik = useFormik({
    initialValues: {
      email: "",
      verificationCode: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        await axios.post(
          "https://pm55.corsivalab.xyz/trustGroup/public/api/reset-password",
          {
            verificationCode: values.verificationCode,
            password: values.password,
          }
        );
        setIsEmailSent(true);
        setEmailError("");
        navigate("/login"); // Redirect to the login page after successful reset
      } catch (error) {
        console.error(error);
        setEmailError("Error resetting password. Please try again later.");
      }
    },
  });

  return (
    <div className="h-main">
      <Helmet>
        <title>Forgot Password | Trust Group</title>
        <meta name="description" content="Reset your password!" />
      </Helmet>
      <Box className="max-w-[60rem] mx-auto">
        <form
          onSubmit={formik.handleSubmit}
          className="rounded bg-slate-50 p-10 shadow-sm"
        >
          <div className="text-26 font-semibold mb-6 text-blue text-center">
            Reset Password
          </div>
          <Input
            name="email"
            id="email"
            type="text"
            className="mt-3"
            value={formik.values.email}
            onChange={formik.handleChange}
            placeholder="Enter verification code"
            autoComplete="off"
            errorMessage={
              formik.touched.email && formik.errors.email
                ? formik.errors.email
                : undefined
            }
          />
          <Input
            name="verificationCode"
            id="verificationCode"
            type="text"
            className="mt-3"
            value={formik.values.verificationCode}
            onChange={formik.handleChange}
            placeholder="Enter verification code"
            autoComplete="off"
            errorMessage={
              formik.touched.verificationCode && formik.errors.verificationCode
                ? formik.errors.verificationCode
                : undefined
            }
          />
          <Input
            name="password"
            id="password"
            type="password"
            className="mt-3"
            value={formik.values.password}
            onChange={formik.handleChange}
            placeholder="Enter password"
            autoComplete="new-password"
            errorMessage={
              formik.touched.password && formik.errors.password
                ? formik.errors.password
                : undefined
            }
          />

          <Input
            name="confirmPassword"
            id="confirmPassword"
            type="password"
            className="mt-3"
            value={formik.values.confirmPassword}
            onChange={formik.handleChange}
            placeholder="Confirm password"
            autoComplete="new-password"
            errorMessage={
              formik.touched.confirmPassword &&
              formik.errors.confirmPassword
                ? formik.errors.confirmPassword
                : undefined
            }
          />

          <Button
            className="flex bg-secondary h-[4rem] h-[4rem] nowrap text-[1.4rem] w-full items-center justify-center py-0 px-6 rounded-[.5rem] text-white hover:bg-red-600"
            type="submit"
            isLoading={formik.isSubmitting}
            disabled={!formik.isValid || formik.isSubmitting}
          >
            Reset Password
          </Button>

          {emailError && <p>{emailError}</p>}
          {isEmailSent && (
            <p>
              Your password has been successfully reset. Please proceed to
              login with your new password.
            </p>
          )}
        </form>
      </Box>
    </div>
  );
};

export default ForgotPasswordForm;
