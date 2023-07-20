import { Box, Container, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { object, string, TypeOf } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import FormInput from "@/components/FormInput";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LoadingButton as _LoadingButton } from "@mui/lab";
import { toast } from "react-toastify";
import { useMutation } from "react-query";
import { signUpUserFn } from "@/api/auth.api";

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
  font-family: "Roboto, sans-serif!important";
  color: #fff;
  margin-left: .5rem;
  &:hover {
    text-decoration: underline;
  }
`;

const registerSchema = object({
  name: string().min(1, "Full name is required").max(100),
  email: string()
    .min(1, "Email address is required")
    .email("Email Address is invalid"),
  role_id: string().min(1, "Role id is required").max(100),
  handphone_number: string().min(1, "Handphone number is required").max(100),
  password: string()
    .min(1, "Password is required")
    .min(6, "Password must be more than 8 characters")
    .max(32, "Password must be less than 32 characters"),
});
export type RegisterInput = TypeOf<typeof registerSchema>;

const RegisterPage = () => {
  const navigate = useNavigate();

  const methods = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  // 👇 Calling the Register Mutation
  const { mutate, isLoading } = useMutation(
    (userData: RegisterInput) => signUpUserFn(userData),
    {
      onSuccess(data) {
        toast.success(data?.message);
        navigate("/login");
      },
      onError(error: any) {
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

  const onSubmitHandler: SubmitHandler<RegisterInput> = (values) => {
    // 👇 Execute the Mutation
    mutate(values);
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
            fontSize: { xs: "2rem", md: "3rem" },
            fontWeight: 600,
            mb: 2,
            letterSpacing: 1,
          }}
        >
          Welcome to Trust Group!
        </Typography>
        <Typography component="h2" sx={{ color: "#000", mb: 2 }}>
          Sign Up To Get Started!
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
            <FormInput name="name" label="Full Name" placeholder="Enter your full name"/>
            <FormInput name="email" label="Email Address" type="email" placeholder="Enter you email"/>
            <FormInput name="role_id" label="Role Id" placeholder="Enter your role id"/>
            <FormInput name="handphone_number" label="Handphone Number" placeholder="Enter your phone"/>
            <FormInput name="password" label="Password" type="password" placeholder="Enter your password"/>
            <Typography sx={{ fontSize: "1.2rem", mb: "1rem", color: "#fff", display: "flex", textAlign: "center" }}>
              Already have an account?{" "}
              <LinkItem to="/login">

                  Login Here

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
              Sign Up
            </LoadingButton>
          </Box>
        </FormProvider>
      </Box>
    </Container>
  );
};

export default RegisterPage;
