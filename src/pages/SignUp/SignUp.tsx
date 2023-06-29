import React, { useState } from "react";
import { TextField, Button, Typography, Container } from "@mui/material";
import axios from "axios";

interface FormProps {
  onSubmit: (data: FormData) => void;
}

interface FormData {
  name: string;
  email: string;
  roleId: string;
  handphoneNumber: string;
  password: string;
}

const SignUpForm: React.FC<FormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    roleId: "",
    handphoneNumber: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/signup", formData);
      // Handle successful sign-up
      console.log("Sign-up successful:", response.data);
      onSubmit(formData);
      setFormData({
        name: "",
        email: "",
        roleId: "",
        handphoneNumber: "",
        password: "",
      });
    } catch (error) {
      // Handle sign-up error
      console.error("Sign-up error:", error);
    }
  };

  return (
    <Container maxWidth='xs'>
      <Typography variant='h2' align='center' gutterBottom>
        SIGN UP
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label='Name'
          variant='outlined'
          type='text'
          name='name'
          value={formData.name}
          onChange={handleChange}
          required
          size='small'
          fullWidth
          margin='normal'
        />
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
          label='Role ID'
          variant='outlined'
          type='text'
          name='roleId'
          value={formData.roleId}
          onChange={handleChange}
          required
          size='small'
          fullWidth
          margin='normal'
        />
        <TextField
          label='Handphone Number'
          variant='outlined'
          type='text'
          name='handphoneNumber'
          value={formData.handphoneNumber}
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
        <Button type='submit' size='large' variant='contained' color='primary' fullWidth sx={{ marginTop: "2rem" }}>
          Sign Up
        </Button>
      </form>
    </Container>
  );
};

export default SignUpForm;
