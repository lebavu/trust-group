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
    email: Yup.string().email("Invalid email address").required("Email is required"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        await axios.post(
          "https://pm55.corsivalab.xyz/trustGroup/public/api/forgot-password",
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
        className="max-w-[60rem] mx-auto"
      >
        <form onSubmit={formik.handleSubmit} className="rounded bg-slate-50 p-10 shadow-sm">
          <div className="text-26 font-semibold mb-6 text-blue text-center">Enter email send code</div>
          <Input
            name="password"
            id="email"
            type="email"
            className="mt-3"
            value={formik.values.email}
            onChange={formik.handleChange}
            classNameEye="absolute right-[1.5rem] h-5 w-5 cursor-pointer top-[12px]"
            errorMessage={formik.touched.email && formik.errors.email ? formik.errors.email : undefined}
            placeholder="Enter email"
            autoComplete="on"
          />
          <Button className="flex bg-secondary h-[4rem] h-[4rem] nowrap text-[1.4rem] w-full items-center justify-center py-0 px-6 rounded-[.5rem] text-white hover:bg-red-600" type="submit" isLoading={formik.isSubmitting} disabled={!formik.isValid || formik.isSubmitting}>
            Send Code
          </Button>
          {emailError && <p>{emailError}</p>}
          {isEmailSent && <p>Verification code has been sent to your email.</p>}
        </form>
      </Box>
    </div>
  );
};

export default ForgotPasswordForm;
