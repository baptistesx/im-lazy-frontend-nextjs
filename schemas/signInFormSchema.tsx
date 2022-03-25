import * as yup from "yup";

const signInFormSchema = yup
	.object({
		email: yup
			.string()
			.email("Must be a valid email")
			.max(255)
			.required("Email is required"),
		password: yup
			.string()
			.min(6, "Password must be at least 6 characters")
			.max(255)
			.required("Password is required"),
	})
	.required();

export default signInFormSchema;
