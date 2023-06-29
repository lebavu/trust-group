import React, { useState } from "react";
import { TextField, Button, Typography, Container } from "@mui/material";
import axios from "axios";

interface FormProps {
  onSubmit: (data: FormData) => void;
}

interface FormData {
  email: string;
  password: string;
}

const LoginForm: React.FC<FormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/signin", formData);
      // Handle successful sign-in
      console.log("Sign-in successful:", response.data);
      onSubmit(formData);
      setFormData({
        email: "",
        password: "",
      });
    } catch (error) {
      // Handle sign-in error
      console.error("Sign-in error:", error);
    }
  };

  return (
    <Container maxWidth='xs'>
      <Typography variant='h2' align='center' gutterBottom>
        LOGIN
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label='Email'
          variant='outlined'
          type='email'
          name='email'
          value={formData.email}
          onChange={handleChange}
          required
          size='small'
          fullWidth
          margin='normal'
        />
        <TextField
          label='Password'
          variant='outlined'
          type='password'
          name='password'
          value={formData.password}
          onChange={handleChange}
          required
          size='small'
          fullWidth
          margin='normal'
        />
        <Button type='submit' sx={{ marginTop: "2rem" }} variant='contained' color='primary' fullWidth>
          Sign In
        </Button>
      </form>
    </Container>
  );
};

export default LoginForm;
