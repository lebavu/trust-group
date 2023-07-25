import type { RegisterOptions, UseFormGetValues } from "react-hook-form";
import * as yup from "yup";

type Rules = { [key in "email" | "password" | "confirm_password"]?: RegisterOptions };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getRules = (getValues?: UseFormGetValues<any>): Rules => ({
  email: {
    required: {
      value: true,
      message: "Email is required"
    },
    pattern: {
      value: /^\S+@\S+\.\S+$/,
      message: "Invalid email"
    },
    maxLength: {
      value: 160,
      message: "Length from 5 - 160 characters"
    },
    minLength: {
      value: 5,
      message: "Length from 5 - 160 characters"
    }
  },
  password: {
    required: {
      value: true,
      message: "Password là bắt buộc"
    },
    maxLength: {
      value: 160,
      message: "Length from 6 - 160 characters"
    },
    minLength: {
      value: 6,
      message: "Length from 6 - 160 characters"
    }
  },
  confirm_password: {
    required: {
      value: true,
      message: "Re-entering password is required"
    },
    maxLength: {
      value: 160,
      message: "Length from 6 - 160 characters"
    },
    minLength: {
      value: 6,
      message: "Length from 6 - 160 characters"
    },
    validate:
      typeof getValues === "function"
        ? (value) => value === getValues("password") || "Re-enter password does not match"
        : undefined
  }
});

const handleConfirmPasswordYup = (refString: string) => {
  return yup
    .string()
    .required("Re-entering password is required")
    .min(6, "Length from 6 - 160 characters")
    .max(160, "Length from 6 - 160 characters")
    .oneOf([yup.ref(refString)], "Re-enter password does not match");
};

export const schema = yup.object({
  verified_code_forgot: yup
    .string()
    .required("Email is required")
    .min(5, "Length from 6 - 160 characters")
    .max(160, "Length from 6 - 160 characters"),
  email: yup
    .string()
    .required("Email is required")
    .email("Invalid email")
    .min(5, "Length from 5 - 160 characters")
    .max(160, "Length from 5 - 160 characters"),
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Length from 6 - 160 characters")
    .max(160, "Length from 6 - 160 characters"),
  confirm_password: handleConfirmPasswordYup("password")
});

export const userSchema = yup.object({
  name: yup.string().max(160, "Maximum length is 160 characters"),
  phone: yup.string().max(20, "Maximum length is 20 characters"),
  address: yup.string().max(160, "Maximum length is 160 characters"),
  avatar: yup.string().max(1000, "Maximum length is 1000 characters"),
  date_of_birth: yup.date().max(new Date(), "Please choose a date in the past"),
  password: schema.fields["password"] as yup.StringSchema<string | undefined, yup.AnyObject, undefined, "">,
  new_password: schema.fields["password"] as yup.StringSchema<string | undefined, yup.AnyObject, undefined, "">,
  confirm_password: handleConfirmPasswordYup("new_password") as yup.StringSchema<
  string | undefined,
  yup.AnyObject,
  undefined,
  ""
  >
});

export type UserSchema = yup.InferType<typeof userSchema>;

export type Schema = yup.InferType<typeof schema>;
