import { PaymentResume, User } from "@providers/user";
import api from "./api";

export const signUpWithEmailAndPassword = async (
	name: string,
	email: string,
	password: string,
	cb: (user: User) => void
): Promise<void> => {
	const res = await api.axiosApiCall({
		url: "sign-up",
		method: "post",
		body: {
			name,
			email,
			password,
		},
	});

	cb(res.data.user);
};

export const signInWithEmailAndPassword = async (
	email: string,
	password: string,
	cb: (user: User) => void
): Promise<void> => {
	const res = await api.axiosApiCall({
		url: "sign-in-with-email-and-password",
		method: "post",
		body: {
			email,
			password,
		},
	});

	cb(res.data.user);
};

export const signInWithGoogle = async (
	access_token: string,
	cb: (user: User) => void
): Promise<void> => {
	const res = await api.axiosApiCall({
		url: "sign-in-with-google",
		method: "post",
		body: {
			access_token,
		},
	});

	cb(res.data.user);
};

export const getUser = async (cb: (user: User) => void): Promise<void> => {
	const res = await api.axiosApiCall({
		url: "user",
		method: "get",
	});

	cb(res.data);
};

export const signOut = async (cb: () => void): Promise<void> => {
	await api.axiosApiCall({ url: "sign-out", method: "post" });

	cb();
};

export const resetPassword = async (
	email: string,
	cb: () => void
): Promise<void> => {
	await api.axiosApiCall({
		url: "reset-password",
		method: "post",
		body: {
			email,
		},
	});

	cb();
};

export const getUsers = async (cb: (users: User[]) => void): Promise<void> => {
	const res = await api.axiosApiCall({ url: "users", method: "get" });

	cb(res.data.users);
};

export const deleteUserById = async (
	id: string,
	cb: () => void
): Promise<void> => {
	await api.axiosApiCall({ url: `user/${id}`, method: "delete" });

	cb();
};

export const updateUserById = async (
	data: { id: string; email: string; role: string; name: string },
	cb: () => void
): Promise<void> => {
	await api.axiosApiCall({
		url: `user`,
		method: "put",
		body: {
			id: data.id,
			email: data.email,
			name: data.name,
			role: data.role,
		},
	});

	cb();
};

export const updateUserPasswordById = async (
	data: { id: string; currentPassword: string; newPassword: string },
	cb: () => void
): Promise<void> => {
	await api.axiosApiCall({
		url: `user/${data.id}/password`,
		method: "put",
		body: {
			newPassword: data.newPassword,
			currentPassword: data.currentPassword,
		},
	});

	cb();
};

export const createUser = async (
	data: { email: string; role: string; name: string },
	cb: () => void
): Promise<void> => {
	await api.axiosApiCall({
		url: `user`,
		method: "post",
		body: {
			email: data.email,
			role: data.role,
			name: data.name,
		},
	});

	cb();
};

export const sendVerificationEmail = async (
	email: string,
	cb: () => void
): Promise<void> => {
	await api.axiosApiCall({
		url: `user/send-verification-email`,
		method: "post",
		body: {
			email,
		},
	});

	cb();
};

export const savePayment = async (
	paymentResume: PaymentResume,
	cb: () => void
): Promise<void> => {
	await api.axiosApiCall({
		url: `user/save-payment`,
		method: "post",
		body: {
			paymentResume,
		},
	});

	cb();
};
