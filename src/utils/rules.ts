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

export const pawnTicketSchema = yup.object().shape({
  user_id: yup.string().required("User is required"),
  name: yup.string().required("Name time is required"),
  ticket_no: yup.string().required("Ticket No is required"),
  pawn_type: yup.number().required("Pawn type is required"),
  pawn_amount: yup
    .mixed()
    .test(
      "is-decimal-10-2",
      "Pawn amount must be in the format of DECIMAL(10,2)",
      function (value) {
        if (value === undefined) {
          return true;
        }
        return /^[0-9]{1,7}\.[0-9]{2}$/.test(value.toString());
      }
    )
    .typeError("Pawn amount must be a numeric value"),
  interest_payable: yup
    .mixed()
    .test(
      "is-decimal-10-2",
      "Interest Payable must be in the format of DECIMAL(10,2)",
      function (value) {
        if (!value) {
          return true;
        }
        return /^[0-9]{1,7}\.[0-9]{2}$/.test(value.toString());
      }
    )
    .typeError("Interest Payable must be a numeric value"),
  downloan_amount: yup
    .mixed()
    .test(
      "is-decimal-10-2",
      "Downloan amount must be in the format of DECIMAL(10,2)",
      function (value) {
        if (!value) {
          return true;
        }
        return /^[0-9]{1,7}\.[0-9]{2}$/.test(value.toString());
      }
    )
    .typeError("Downloan amount must be a numeric value"),
  monthly_repayment: yup
    .mixed()
    .test(
      "is-decimal-10-2",
      "Monthly repayment must be in the format of DECIMAL(10,2)",
      function (value) {
        if (!value) {
          return true;
        }
        return /^[0-9]{1,7}\.[0-9]{2}$/.test(value.toString());
      }
    )
    .typeError("Monthly repayment must be a numeric value"),
  already_paid: yup
    .mixed()
    .test(
      "is-decimal-10-2",
      "Already paid must be in the format of DECIMAL(10,2)",
      function (value) {
        if (!value) {
          return true;
        }
        return /^[0-9]{1,7}\.[0-9]{2}$/.test(value.toString());
      }
    )
    .typeError("Already paid must be a numeric value"),
  balance_remaining: yup
    .mixed()
    .test(
      "is-decimal-10-2",
      "Balance remaining must be in the format of DECIMAL(10,2)",
      function (value) {
        if (!value) {
          return true;
        }
        return /^[0-9]{1,7}\.[0-9]{2}$/.test(value.toString());
      }
    )
    .typeError("Balance remaining must be a numeric value"),
  pawn_date: yup.string().required("pawn_date is required"),
});
export const eValuationSchema = yup.object().shape({
  user_id: yup.string().required("User is required"),
  status: yup.number().required("Status is required"),
  name: yup.string().required("Name is required"),
  price: yup
    .mixed()
    .test(
      "is-decimal-10-2",
      "Price amount must be in the format of DECIMAL(10,2)",
      function (value) {
        if (value === undefined) {
          return true;
        }
        return /^[0-9]{1,7}\.[0-9]{2}$/.test(value.toString());
      }
    )
    .typeError("Price amount must be a numeric value"),
  image: yup.string().required("Image is required"),
  date: yup.string().required("Date is required"),
});

export type UserSchema = yup.InferType<typeof userSchema>;
export type Schema = yup.InferType<typeof schema>;
