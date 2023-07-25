import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import { schema, Schema } from "src/utils/rules";
import { useMutation } from "react-query";
import authApi from "@/api/auth.api";
import { isAxiosUnprocessableEntityError } from "@/utils/utils";
import { ErrorResponse } from "src/types/utils.type";
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

type FormData = Pick<Schema, "email">;
const forgotSchema = schema.pick(["email"]);

export default function Login() {
  const navigate = useNavigate();
  const {
    register,
    setError,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>({
    resolver: yupResolver(forgotSchema)
  });

  const forgotMutation = useMutation(authApi.forgotPassword, {
    onSuccess: async () => {

      navigate("/reset-password");
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
    forgotMutation.mutate(data);
  });
  return (
    <div className="h-main">
      <Helmet>
        <title>Send code | Trust Group</title>
        <meta name='description' content='Login to have access!' />
      </Helmet>
      <div className="max-w-[60rem] mx-auto">
        <form className="rounded bg-slate-50 p-10 shadow-sm" onSubmit={onSubmit} noValidate>
          <div className="text-26 font-semibold mb-6 text-blue text-center">Enter email send code!</div>
          <Input
            name="email"
            register={register}
            type="email"
            className="mt-8"
            errorMessage={errors.email?.message}
            placeholder="Email"
          />
          <div className="mt-3">
            <Button
              type="submit"
              className="flex bg-secondary leading-[4.5rem] h-[4.5rem] nowrap text-[1.4rem] w-full items-center justify-center py-0 px-6 rounded-[.5rem] text-white hover:bg-red-600"
              isLoading={forgotMutation.isLoading}
              disabled={forgotMutation.isLoading}
            >
              Send code
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
