import { User } from "@providers/user";
import axios, { AxiosResponse, Method } from "axios";

type AuthBody = {
	name?: string;
	email?: string;
	password?: string;
	access_token?: string;
};

type AuthResponse = {
	user: User;
};

const authApi = {
	// All api requests are made thanks to this function
	async axiosApiCall({
		url,
		method,
		body = {},
	}: {
		url: string;
		method: Method;
		body?: AuthBody;
	}): Promise<AxiosResponse<AuthResponse>> {
		return axios({
			method,
			url: `${process.env.NEXT_PUBLIC_ENDPOINT}/auth/${url}`,
			data: body,
			headers: { "Content-Type": "application/json" },
			withCredentials: true,
		});
	},
};

export const signUpWithEmailAndPassword = async (
	name: string,
	email: string,
	password: string,
	cb: (user: User) => void
): Promise<void> => {
	const res = await authApi.axiosApiCall({
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
	const res = await authApi.axiosApiCall({
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
	const res = await authApi.axiosApiCall({
		url: "sign-in-with-google",
		method: "post",
		body: {
			access_token,
		},
	});

	cb(res.data.user);
};

export const getUser = async (cb: (user: User) => void): Promise<void> => {
	const res = await authApi.axiosApiCall({
		url: "user",
		method: "get",
	});

	cb(res.data.user);
};

export const signOut = async (cb: () => void): Promise<void> => {
	await authApi.axiosApiCall({ url: "sign-out", method: "post" });

	cb();
};
