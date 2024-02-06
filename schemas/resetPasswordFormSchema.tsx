import * as yup from "yup";

const resetPasswordFormSchema = yup
	.object({
		email: yup
			.string()
			.email("Must be a valid email")
			.max(255)
			.required("Email is required"),
	})
	.required();

export default resetPasswordFormSchema;
