export type ResetPasswordFormData = {
	email: string;
};

export type SignInFormData = {
	email: string;
	password: string;
};

export type SignUpSubmitFormData = {
	name: string;
	email: string;
	password: string;
	passwordConfirmation: string;
};

export type ChangePasswordFormData = {
	currentPassword: string;
	newPassword: string;
};
