import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import { schema, Schema } from "src/utils/rules";
import { useMutation } from "react-query";
import authApi from "@/api/auth.api";
import { toast } from "react-toastify";
import { isAxiosUnprocessableEntityError } from "@/utils/utils";
import { ErrorResponse } from "src/types/utils.type";
import { AppContext } from "@/context/app.context";
import { TextField, Button, Checkbox, FormControlLabel } from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { Helmet } from "react-helmet-async";
import "./Login.sass";

type FormData = Pick<Schema, "email" | "password">;
const loginSchema = schema.pick(["email", "password"]);

export default function Login() {
  const { setIsAuthenticated, setProfile } = useContext(AppContext);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const {
    register,
    setError,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FormData>({
    resolver: yupResolver(loginSchema),
  });
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event:any) => {
    event.preventDefault();
  };

  const loginMutation = useMutation(authApi.login, {
    onSuccess: async () => {
      setIsAuthenticated(true);
      try {
        const userInfo = await authApi.getInfoUser();
        setProfile(userInfo.data.data);
        localStorage.setItem("userInfo", JSON.stringify(userInfo));
        toast.success("Login successful!");
      } catch (error) {
        console.error("Error fetching user information:", error);
        toast.error("Invalid Email or Password!");
      }
      navigate("/");
    },
    onError: (error) => {
      console.log(error);
      toast.error("Invalid Email or Password!");
      if (isAxiosUnprocessableEntityError<ErrorResponse<FormData>>(error)) {
        const formError = error.response?.data.data;
        if (formError) {
          Object.keys(formError).forEach((key) => {
            setError(key as keyof FormData, {
              message: formError[key as keyof FormData],
              type: "Server",
            });
          });
        }
      }
    },
  });

  const onSubmit = handleSubmit((data) => {
    loginMutation.mutate(data);
    if (rememberMe) {
      localStorage.setItem("rememberedEmail", data.email);
      localStorage.setItem("rememberedPassword", data.password);
    } else {
      localStorage.removeItem("rememberedEmail");
      localStorage.removeItem("rememberedPassword");
    }
  });
  useEffect(() => {
    const rememberedEmail = localStorage.getItem("rememberedEmail");
    const rememberedPassword = localStorage.getItem("rememberedPassword");
    if (rememberedEmail && rememberedPassword) {
      setValue("email", rememberedEmail);
      setValue("password", rememberedPassword);
      setRememberMe(true);
    }
  }, [setValue]);

  useEffect(() => {
    const storedUserInfo = localStorage.getItem("userInfo");
    if (storedUserInfo) {
      try {
        const parsedUserInfo = JSON.parse(storedUserInfo);
        setProfile(parsedUserInfo);
      } catch (error) {
        console.error("Error parsing user information from localStorage:", error);
      }
    }
  }, [setProfile]);

  return (
    <div className="h-main">
      <Helmet>
        <title>Login | Trust Group</title>
        <meta name='description' content='Login to have access!' />
      </Helmet>
      <div className="max-w-[50rem] mx-auto">
        <form onSubmit={onSubmit} noValidate>
          <div className="text-26 font-medium mb-6 text-blue text-center">Welcome Back!</div>
          <TextField
            // name="email"
            {...register("email")}
            type="email"
            fullWidth
            variant="outlined"
            size="small"
            label="Email"
            error={!!errors.email}
            helperText={errors.email?.message}
            className="mt-8"
          />
          <TextField
            {...register("password")}
            type={showPassword ? "text" : "password"}
            fullWidth
            variant="outlined"
            size="small"
            label="Password"
            error={!!errors.password}
            helperText={errors.password?.message}
            className="!mt-12"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={togglePasswordVisibility}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword ? <Visibility className="!text-[1.6rem]" /> : <VisibilityOff className="!text-[1.6rem]" />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <FormControlLabel
            control={
              <Checkbox
                id="remember-me"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
              />
            }
            label="Remember Me"
            className="remember-me-label mt-3"
          />
          <div className="!mt-8">
            <Button
              type="submit"
              variant="contained"
              color="secondary"
              fullWidth
              size="large"
              disabled={loginMutation.isLoading}
            >
              {loginMutation.isLoading ? "Logging in..." : "Login"}
            </Button>
          </div>
          <div className="mt-8 flex items-center justify-center">
            <Link className="text-[1.4rem] account-link" to="/forgot-password">
              Forgot Password?
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
