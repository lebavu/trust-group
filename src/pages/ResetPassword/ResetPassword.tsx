import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "react-query";
// Không có tính năng tree-shaking
// import { omit } from "lodash"

// Import chỉ mỗi function omit
import omit from "lodash/omit";

import { schema, Schema } from "src/utils/rules";
import Input from "src/components/Input";
import authApi from "src/api/auth.api";
import { isAxiosUnprocessableEntityError } from "src/utils/utils";
import { ErrorResponse } from "src/types/utils.type";
import Button from "src/components/Button";
import { Helmet } from "react-helmet-async";

type FormData = Pick<Schema, "email" | "verified_code_forgot" | "password" | "confirm_password">;
const registerSchema = schema.pick(["email", "verified_code_forgot", "password", "confirm_password"]);

export default function Register() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm<FormData>({
    resolver: yupResolver(registerSchema)
  });
  const resetPasswordMutation = useMutation({
    mutationFn: (body: Omit<FormData, "confirm_password">) => authApi.resetPassword(body)
  });
  const onSubmit = handleSubmit((data) => {
    const body = omit(data, ["confirm_password"]);
    resetPasswordMutation.mutate(body, {
      onSuccess: () => {
        navigate("/");
      },
      onError: (error) => {
        if (isAxiosUnprocessableEntityError<ErrorResponse<Omit<FormData, "confirm_password">>>(error)) {
          const formError = error.response?.data.data;
          if (formError) {
            Object.keys(formError).forEach((key) => {
              setError(key as keyof Omit<FormData, "confirm_password">, {
                message: formError[key as keyof Omit<FormData, "confirm_password">],
                type: "Server"
              });
            });
          }
        }
      }
    });
  });

  return (
    <div className="h-main">
      <Helmet>
        <title>Reset Password | Trust Group</title>
        <meta name="description" content="Reset Password Trust Group" />
      </Helmet>
      <div className="max-w-[60rem] mx-auto">
        <form className="rounded bg-slate-50 p-10 shadow-sm" onSubmit={onSubmit} noValidate>
          <div className="text-26 font-semibold mb-6 text-blue text-center">Reset Password</div>
          <Input
            name="email"
            register={register}
            type="email"
            className="mt-8"
            errorMessage={errors.email?.message}
            placeholder="Email"
          />
          <Input
            name="verified_code_forgot"
            register={register}
            type="text"
            className="mt-8"
            errorMessage={errors.verified_code_forgot?.message}
            placeholder="verified_code_forgot"
          />
          <Input
            name="password"
            register={register}
            type="password"
            className="mt-2"
            classNameEye="absolute right-[5px] h-5 w-5 cursor-pointer top-[12px]"
            errorMessage={errors.password?.message}
            placeholder="Password"
            autoComplete="on"
          />

          <Input
            name="confirm_password"
            register={register}
            type="password"
            className="mt-2"
            classNameEye="absolute right-[5px] h-5 w-5 cursor-pointer top-[12px]"
            errorMessage={errors.confirm_password?.message}
            placeholder="Confirm Password"
            autoComplete="on"
          />

          <div className="mt-2">
            <Button
              className="flex bg-secondary h-[4rem] h-[4rem] nowrap text-[1.4rem] w-full items-center justify-center py-0 px-6 rounded-[.5rem] text-white hover:bg-secondary/[.8]"
              isLoading={resetPasswordMutation.isLoading}
              disabled={resetPasswordMutation.isLoading}
            >
              Reset Password
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
