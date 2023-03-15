import * as yup from "yup";

const infoFormSchema = yup
	.object({
		developmentMode: yup.bool(),
		headless: yup.bool(),
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
		city: yup.string().required("City name is required (or first letters)"),
		detectionRadius: yup.number().required("Detection radius is required"),
		minimumAge: yup
			.number()
			.min(15, "Minimum age must be at least 15")
			.max(79, "Maximum age must be under 79")
			.required("Minimum age range required"),
		maximumAge: yup
			.number()
			.min(16, "Minimum age must be at least 16")
			.max(80, "Maximum age must be under 80")
			.moreThan(yup.ref("minimumAge"), "Maximum should be over minimum")
			.required("Maximum age range required"),
		messageSubject: yup
			.string()
			.min(5, "Message subject must be at least 5 characters")
			.max(50)
			.required("Message subject is required"),
		frenchMessage: yup
			.string()
			.min(5, "Message must be at least 5 characters")
			.max(300)
			.required("French message is required"),
		englishMessage: yup
			.string()
			.min(5, "Message must be at least 5 characters")
			.max(300)
			.required("English message is required"),
	})
	.required();

export default infoFormSchema;
