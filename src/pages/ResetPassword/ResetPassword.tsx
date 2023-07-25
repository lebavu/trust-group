import React, { useState, useEffect } from "react";
import { TextField, Button, Box, Typography } from "@mui/material";
import * as yup from "yup";

const schema = yup.object().shape({
  code: yup.string().required("Code is required"),
});

const App: React.FC = () => {
  const [inputCode, setInputCode] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [verifiedCodeForgot, setVerifiedCodeForgot] = useState("");

  useEffect(() => {
    const fetchVerifiedCodeForgot = async () => {
      try {
        const response = await fetch("https://pm55.corsivalab.xyz/trustGroup/public/api/reset-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({}),
        });
        const data = await response.json();
        setVerifiedCodeForgot(data.verified_code_forgot);
        console.log(data);
      } catch (error) {
        console.error("Error fetching verified_code_forgot:", error);
      }
    };

    fetchVerifiedCodeForgot();
  }, []);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputCode(event.target.value);
  };

  const verifyCode = async () => {
    try {
      await schema.validate({ code: inputCode });
      if (inputCode === verifiedCodeForgot) {
        setSuccess(true);
        setError("");
      } else {
        setSuccess(false);
        setError("Verification failed");
      }
    } catch (validationError: any) {
      setError(validationError.errors[0]);
      setSuccess(false);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    verifyCode();
  };

  return (
    <div className="h-main">
      <Box
        className="max-w-[50rem] w-full m-auto rounded bg-slate-50 p-10 shadow-sm"
      >
        <Typography variant="h3" mb={"3rem"} className="text-center">
          Reset Password
        </Typography>
        <form onSubmit={handleSubmit}>
          <Box sx={{ display: "grid", gap: "2rem" }}>
            <TextField
              label="Enter code"
              value={inputCode}
              size="small"
              fullWidth
              onChange={handleInputChange}
              InputProps={{
                style: {
                  backgroundColor: "white",
                },
              }}
            />
            <TextField
              label="Password"
              value=""
              size="small"
              fullWidth
              InputProps={{
                style: {
                  backgroundColor: "white",
                },
              }}
            />
            <TextField
              label="Confirm Password"
              value=""
              size="small"
              fullWidth
              InputProps={{
                style: {
                  backgroundColor: "white",
                },
              }}
            />
            <Button type="submit" variant="contained" className="!mx-auto" color="primary">
              Submit
            </Button>
          </Box>
        </form>
        {success && <p>Verification successful!</p>}
        {error && <p>Error: {error}</p>}
      </Box>
    </div>
  );
};

export default App;
