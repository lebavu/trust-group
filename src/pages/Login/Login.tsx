import { Box, Container, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { object, string, TypeOf } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import FormInput from "@/components/FormInput";
import { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LoadingButton as _LoadingButton } from "@mui/lab";
import { toast } from "react-toastify";
import { useMutation, useQuery } from "react-query";
import { getMeFn, loginUserFn } from "@/api/auth.api";
import { useStateContext } from "@/context";

const LoadingButton = styled(_LoadingButton)`
  padding: 0.8rem 0;
  background-color: #1e2f8d;
  color: #fff;
  font-weight: 500;
  text-transform: none;
  &:hover {
    background-color: #1e2f8d;
  }
`;

const LinkItem = styled(Link)`
  text-decoration: none;
  color: #fff;
  margin-left: .5rem;
  &:hover {
    text-decoration: underline;
  }
`;

const loginSchema = object({
  email: string()
    .min(1, "Email address is required")
    .email("Email Address is invalid"),
  password: string()
    .min(1, "Password is required")
    .min(6, "Password must be more than 8 characters")
    .max(32, "Password must be less than 32 characters"),
});

export type LoginInput = TypeOf<typeof loginSchema>;

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const from = ((location.state as any)?.from.pathname as string) || "/";

  const methods = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });
  const stateContext = useStateContext();
  // API Get Current Logged-in user
  const query = useQuery(["authUser"], getMeFn, {
    enabled: false,
    select: (data) => data.data.user,
    retry: 1,
    onSuccess: (data) => {
      stateContext.dispatch({ type: "SET_USER", payload: data });
    },
  });
  const { mutate: loginUser, isLoading } = useMutation(
    (userData: LoginInput) => loginUserFn(userData),
    {
      onSuccess: () => {
        query.refetch();
        console.log(query);
        toast.success("You successfully logged in");
        navigate(from);
      },
      onError: (error: any) => {
        if (Array.isArray((error as any).response.data.error)) {
          (error as any).response.data.error.forEach((el: any) =>
            toast.error(el.message, {
              position: "top-right",
            })
          );
        } else {
          toast.error((error as any).response.data.message, {
            position: "top-right",
          });
        }
      },
    }
  );

  const {
    reset,
    handleSubmit,
    formState: { isSubmitSuccessful },
  } = methods;

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSubmitSuccessful]);

  const onSubmitHandler: SubmitHandler<LoginInput> = (values) => {
    // 👇 Executing the loginUser Mutation
    loginUser(values);
  };

  return (
    <Container
      maxWidth={false}
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#fff",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <Typography
          textAlign="center"
          component="h1"
          sx={{
            color: "#1e2f8d",
            fontWeight: 600,
            fontSize: { xs: "2rem", md: "3rem" },
            mb: 2,
            letterSpacing: 1,
          }}
        >
          Welcome Back!
        </Typography>
        <Typography
          variant="body1"
          component="h2"
          sx={{ color: "#000", mb: 2 }}
        >
          Login to have access!
        </Typography>

        <FormProvider {...methods}>
          <Box
            component="form"
            onSubmit={handleSubmit(onSubmitHandler)}
            noValidate
            autoComplete="off"
            maxWidth="50rem"
            width="100%"
            sx={{
              background: "linear-gradient(190deg, rgba(30,47,141,1) 0%, rgba(91,180,96,1) 96%)",
              px: { xs: "1rem", sm: "2rem" },
              py: "3rem",
              borderRadius: 2,
            }}
          >
            <FormInput name="email" label="Email Address" type="email" placeholder="Enter your email"/>
            <FormInput name="password" label="Password" type="password" placeholder="Enter your password"/>

            <Typography
              sx={{ fontSize: "1.2rem", mb: "1rem", color: "#fff", display: "flex", textAlign: "center", justifyContent: "flex-end" }}
            >
              <LinkItem to="/forgot-password">
                Forgot Password?
              </LinkItem>
            </Typography>

            <LoadingButton
              variant="contained"
              sx={{ mt: 1 }}
              fullWidth
              disableElevation
              type="submit"
              loading={isLoading}
            >
              Login
            </LoadingButton>

            <Typography sx={{ fontSize: "1.2rem", mt: "1rem", color: "#fff", display: "flex", textAlign: "center",justifyContent: "center" }}>
              Need an account?
              <LinkItem to="/sign-up">
                Sign Up Here
              </LinkItem>
            </Typography>
          </Box>
        </FormProvider>
      </Box>
    </Container>
  );
};

export default LoginPage;
