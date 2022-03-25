import * as yup from "yup";

const updatePasswordFormSchema = yup
	.object({
		currentPassword: yup
			.string()
			.min(6, "Password must be at least 6 characters")
			.max(255)
			.required("Password is required"),
		newPassword: yup
			.string()
			.min(6, "Password must be at least 6 characters")
			.max(255)
			.required("New password is required"),
	})
	.required();

export default updatePasswordFormSchema;
