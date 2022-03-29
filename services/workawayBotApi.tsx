import { FormBotParams } from "@components/workawayBot/workaway";
import axios, { AxiosResponse, Method } from "axios";

type RequestBody = {
	city?: string;
	params?: FormBotParams;
};

type ApiResponse = {
	filesName?: string[];
	file?: File;
};

const workawayBotApi = {
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
			url: `${process.env.NEXT_PUBLIC_ENDPOINT}/workaway-bot/${url}`,
			data: body,
			headers: { "Content-Type": "application/json" },
			withCredentials: true,
		});
	},
};

export const setCity = async (city: string): Promise<void> => {
	await workawayBotApi.axiosApiCall({
		url: "set-city",
		method: "post",
		body: {
			city,
		},
	});
};

export const clearLogs = async (
	cb: (status: number) => void
): Promise<void> => {
	const res = await workawayBotApi.axiosApiCall({
		url: "clear-logs",
		method: "get",
	});

	cb(res.status);
};

export const getFilesName = async (
	cb: (data: string[]) => void
): Promise<void> => {
	const res = await workawayBotApi.axiosApiCall({
		url: "files-name",
		method: "get",
	});

	if (res.data.filesName !== undefined) {
		cb(res.data.filesName);
	}
};

export const downloadFileByName = async (
	name: string,
	cb: (data: File) => void
): Promise<void> => {
	const res = await workawayBotApi.axiosApiCall({
		url: `file/${name}`,
		method: "get",
	});

	if (res.data.file) {
		cb(res.data.file);
	}
};

export const deleteFileByName = async (
	name: string,
	cb: () => Promise<void>
): Promise<void> => {
	await workawayBotApi.axiosApiCall({ url: `file/${name}`, method: "delete" });

	cb();
};

export const startBot = async (
	data: FormBotParams,
	cb: (status: number) => void
): Promise<void> => {
	const res = await workawayBotApi.axiosApiCall({
		url: "start-bot",
		method: "post",
		body: { ...data },
	});

	cb(res.status);
};

export const stopBot = async (cb: (status: number) => void): Promise<void> => {
	const res = await workawayBotApi.axiosApiCall({
		url: "stop-bot",
		method: "get",
	});

	cb(res.status);
};
