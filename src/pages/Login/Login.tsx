import React, { useState } from "react";
import {
  OutlinedInput,
  InputLabel,
  InputAdornment,
  FormControl,
  TextField,
  Button,
  Typography,
  Container,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import axios from "axios";
import styles from "./index.module.scss";
import classNames from "classnames/bind";
const cx = classNames.bind(styles);

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
      const response = await axios.post("http://localhost:8888/trustGroup/public/api/login", formData);
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

  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };
  return (
    <Container maxWidth='xs' className={cx("login-section")}>
      <div className={cx("bg-image")}>
        <img src='/src/assets/login-4.jpg' alt='bg' />
      </div>
      <div className={cx("form-wrap")}>
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
          <FormControl variant='outlined' size='small' fullWidth margin='normal'>
            <InputLabel htmlFor='outlined-adornment-password'>Password</InputLabel>
            <OutlinedInput
              id='outlined-adornment-password'
              type={showPassword ? "text" : "password"}
              // value={formData.password}
              endAdornment={
                <InputAdornment position='end'>
                  <IconButton
                    aria-label='toggle password visibility'
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge='end'
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label='Password'
            />
          </FormControl>
          <Button type='submit' sx={{ marginTop: "2rem" }} variant='contained' size='large' color='primary' fullWidth>
            LogIn
          </Button>
        </form>
      </div>
    </Container>
  );
};

export default LoginForm;
