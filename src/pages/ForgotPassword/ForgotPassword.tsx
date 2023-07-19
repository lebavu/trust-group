import React, { useState } from "react";
import { useFormik } from "formik";
import { Button, TextField, Typography, Box } from "@mui/material";
import axios from "axios";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";

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
        navigate("/verified-code-forgot");
      } catch (error) {
        console.error(error);
      }
    },
  });

  return (
    <div className="h-screen w-full flex flex-wrap overflow-y-auto py-[10rem] px-[1.5rem]">
      <Box
        className="max-w-[50rem] w-full m-auto"
        sx={{
          background: "linear-gradient(190deg, rgba(30,47,141,1) 0%, rgba(91,180,96,1) 96%)",
          px: { xs: "1rem", sm: "2rem" },
          py: "3rem",
          borderRadius: 2,
        }}
      >
        <Typography variant="h3" mb={"3rem"} className="text-center !text-white">
          Enter email send code
        </Typography>
        <form onSubmit={formik.handleSubmit} className="w-full flex gap-[1rem] items-start">
          <TextField
            id="email"
            name="email"
            label="Email"
            type="email"
            size="small"
            className="flex-1 w-full"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
            sx={{
              "input":{
                background: "#fff",
                borderRadius: ".6rem"
              }
            }}
          />
          <Button className="!mt-[.2rem] !capitalize" variant="contained" color="primary" type="submit" disabled={!formik.isValid || formik.isSubmitting}>
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
