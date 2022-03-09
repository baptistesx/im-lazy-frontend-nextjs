import * as yup from "yup";

const editUserFormSchema = yup
  .object({
    name: yup
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(255)
      .required("Name is required"),
    email: yup
      .string()
      .email("Must be a valid email")
      .max(255)
      .required("Email is required"),
    isAdmin: yup.bool(),
    isPremium: yup.bool(),
  })
  .required();

export default editUserFormSchema;
