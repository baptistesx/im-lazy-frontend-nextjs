import { PaymentResume, User } from "@providers/user";
import axios, { Method, AxiosResponse } from "axios";

type RequestBody = {
	id?: string;
	name?: string;
	email?: string;
	newPassword?: string;
	currentPassword?: string;
	role?: string;
	paymentResume?: PaymentResume;
};

type ApiResponse = {
	users?: User[];
};

const userApi = {
	// All api requests are made thanks to this function
	async axiosApiCall({
		url,
		method,
		body = {},
	}: {
		url: string;
		method: Method;
		body?: RequestBody;
	}): Promise<AxiosResponse<ApiResponse>> {
		return axios({
			method,
			url: `${process.env.NEXT_PUBLIC_ENDPOINT}/user/${url}`,
			data: body,
			headers: { "Content-Type": "application/json" },
			withCredentials: true,
		});
	},
};

export const resetPassword = async (
	email: string,
	cb: () => void
): Promise<void> => {
	await userApi.axiosApiCall({
		url: "reset-password",
		method: "post",
		body: {
			email,
		},
	});

	cb();
};

export const getUsers = async (cb: (users: User[]) => void): Promise<void> => {
	const res = await userApi.axiosApiCall({ url: "users", method: "get" });

	if (res.data.users !== undefined) {
		cb(res.data.users);
	}
};

export const deleteUserById = async (
	id: string,
	cb: () => void
): Promise<void> => {
	await userApi.axiosApiCall({ url: `${id}`, method: "delete" });

	cb();
};

export const updateUserById = async (
	data: { id: string; email: string; role: string; name: string },
	cb: () => void
): Promise<void> => {
	await userApi.axiosApiCall({
		url: ``,
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
	await userApi.axiosApiCall({
		url: `${data.id}/password`,
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
	await userApi.axiosApiCall({
		url: ``,
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
	await userApi.axiosApiCall({
		url: `send-verification-email`,
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
	await userApi.axiosApiCall({
		url: `save-payment`,
		method: "post",
		body: {
			paymentResume,
		},
	});

	cb();
};
