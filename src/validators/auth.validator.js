import { z } from "zod";

const registerSchema = z.object({
  firstName: z
    .string({
      required_error: "Firstname is required",
      invalid_type_error: "Name must be a string",
    })
    .trim()
    .min(2, { message: "Firstname must be at least 2 characters long" }),
  lastName: z
    .string({
      required_error: "Lastname is required",
      invalid_type_error: "Name must be a string",
    })
    .trim()
    .min(2, { message: "Lastname must be at least 2 characters long" }),
  email: z
    .string({
      required_error: "Email is required",
      invalid_type_error: "Email must be valid",
    })
    .email("Invalid email address")
    .trim(),
  phoneNumber: z
    .string({
      required_error: "Phone number is required",
      invalid_type_error: "Phone number must be valid",
    })
    .trim()
    .refine((val) => /^\d{10}$/.test(val), {
      message: "Phone number must be 10 digit number",
    }),
  password: z
    .string({ required_error: "Password is required" })
    .length(6, { message: "Password must be exactly 6 characters long" }),
  role: z.enum(["user", "admin"]).default("user"),
  "address.street": z
    .string({
      required_error: "Street is required",
      invalid_type_error: "Street must be string",
    })
    .trim()
    .min(2, { message: "Street must be at least 2 characters long" }),
  "address.city": z
    .string({
      required_error: "City is required",
      invalid_type_error: "City must be string",
    })
    .trim()
    .min(2, { message: "City must be at least 2 characters long" }),
  "address.state": z
    .string({
      required_error: "State is required",
      invalid_type_error: "State must be string",
    })
    .trim()
    .min(2, { message: "State must be at least 2 characters long" }),
  "address.postalcode": z
    .string({
      required_error: "Postal code is required",
      invalid_type_error: "Postal code must be number",
    })
    .refine((val) => /^\d{6}$/.test(val), {
      message: "Postal code must be 6 digits number",
    }),
  "address.country": z
    .string({
      required_error: "Country is required",
      invalid_type_error: "Country must be string",
    })
    .trim()
    .min(2, { message: "Country must be at least 2 characters long" }),
});

const loginSchema = z.object({
  email: z
    .string({
      required_error: "Email is required",
      invalid_type_error: "Email must be valid",
    })
    .email("Invalid email address")
    .trim(),
  password: z
    .string({ required_error: "Password is required" })
    .length(6, { message: "Password must be exactly 6 characters long" }),
});

const updateProfileSchema = z.object({
  firstName: z
    .string({
      required_error: "Firstname is required",
      invalid_type_error: "Name must be a string",
    })
    .trim()
    .min(2, { message: "Firstname must be at least 2 characters long" }),
  lastName: z
    .string({
      required_error: "Lastname is required",
      invalid_type_error: "Name must be a string",
    })
    .trim()
    .min(2, { message: "Lastname must be at least 2 characters long" }),
  email: z
    .string({
      required_error: "Email is required",
      invalid_type_error: "Email must be valid",
    })
    .email("Invalid email address")
    .trim(),
  phoneNumber: z
    .string({
      required_error: "Phone number is required",
      invalid_type_error: "Phone number must be valid",
    })
    .trim()
    .refine((val) => /^\d{10}$/.test(val), {
      message: "Phone number must be 10 digit number",
    }),
});

export { registerSchema, loginSchema, updateProfileSchema };
