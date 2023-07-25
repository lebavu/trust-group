import { useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import { schema, Schema } from "src/utils/rules";
import { useMutation } from "react-query";
import authApi from "@/api/auth.api";
import { isAxiosUnprocessableEntityError } from "@/utils/utils";
import { ErrorResponse } from "src/types/utils.type";
import { AppContext } from "@/context/app.context";
import Input from "@/components/Input";
import Button from "src/components/Button";
import { Helmet } from "react-helmet-async";
import styled from "styled-components";

const StyledLink = styled(Link)`
  font-family: "Roboto";
  color: #1e2f8d;
  &:hover,&.active {
    text-decoration: underline;
  }
`;

type FormData = Pick<Schema, "email" | "password">;
const loginSchema = schema.pick(["email", "password"]);

export default function Login() {
  const { setIsAuthenticated, setProfile } = useContext(AppContext);
  const navigate = useNavigate();
  const {
    register,
    setError,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>({
    resolver: yupResolver(loginSchema)
  });

  const loginMutation = useMutation(authApi.login, {
    onSuccess: async () => {
      setIsAuthenticated(true);

      try {
        const userInfo = await authApi.getInfoUser();
        setProfile(userInfo.data.data);
        localStorage.setItem("userInfo", JSON.stringify(userInfo));

      } catch (error) {
        console.error("Error fetching user information:", error);
      }
      navigate("/");
    },
    onError: (error) => {
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
    }
  });

  const onSubmit = handleSubmit((data) => {
    loginMutation.mutate(data);
  });

  useEffect(() => {
    // Check if there is userInfo in localStorage
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
      <div className="max-w-[60rem] mx-auto">
        <form className="rounded bg-slate-50 p-10 shadow-sm" onSubmit={onSubmit} noValidate>
          <div className="text-26 font-semibold mb-6 text-blue text-center">Welcome Back!</div>
          <Input
            name="email"
            register={register}
            type="email"
            className="mt-8"
            errorMessage={errors.email?.message}
            placeholder="Email"
          />
          <Input
            name="password"
            register={register}
            type="password"
            className="mt-3"
            classNameEye="absolute right-[1.5rem] h-5 w-5 cursor-pointer top-[12px]"
            errorMessage={errors.password?.message}
            placeholder="Password"
            autoComplete="on"
          />
          <div className="mt-3">
            <Button
              type="submit"
              className="flex bg-secondary h-[4rem] h-[4rem] nowrap text-[1.4rem] w-full items-center justify-center py-0 px-6 rounded-[.5rem] text-white hover:bg-secondary/[.8]"
              isLoading={loginMutation.isLoading}
              disabled={loginMutation.isLoading}
            >
              Login
            </Button>
          </div>
          <div className="mt-8 flex items-center justify-center">
            <StyledLink className="text-[1.4rem]" to="/forgot-password">
              Forgot Password?
            </StyledLink>
          </div>
        </form>
      </div>
    </div>
  );
}
