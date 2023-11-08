import * as yup from "yup";

const signUpFormSchema = yup
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
		password: yup
			.string()
			.min(6, "Password must be at least 6 characters")
			.max(255)
			.required("Password is required"),
		passwordConfirmation: yup
			.string()
			.oneOf([yup.ref("password"), null], "Password must match")
			.required("Password confirmation is required"),
	})
	.required();

export default signUpFormSchema;
