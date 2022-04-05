import { FormBotParams } from "@components/workawayBot/InfoForm";
import axios, { AxiosResponse, Method } from "axios";

type MemberProfile = {
	name: string;
	age: number;
	profileHref: string;
	from: string;
	idForMessage: string;
	messageSent: boolean;
};

export type WorkawayFile = {
	id: number;
	name: string;
	createdAt: Date;
	updatedAt: Date;
	content?: { members: MemberProfile[] } | FormBotParams;
};

type RequestBody = {
	city?: string;
	params?: FormBotParams;
};

type ApiResponse = {
	files?: WorkawayFile[];
	file?: WorkawayFile;
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

export const getFilesInfo = async (
	cb: (data: WorkawayFile[]) => void
): Promise<void> => {
	const res = await workawayBotApi.axiosApiCall({
		url: "files-info",
		method: "get",
	});

	if (res.data.files !== undefined) {
		cb(res.data.files);
	}
};

export const downloadFileById = async (
	id: number,
	cb: (data: WorkawayFile) => void
): Promise<void> => {
	const res = await workawayBotApi.axiosApiCall({
		url: `file/${id}`,
		method: "get",
	});
	if (res.data.file) {
		console.log("calling cb");
		cb(res.data.file);
	}
};

export const deleteFileById = async (
	id: number,
	cb: () => Promise<void>
): Promise<void> => {
	await workawayBotApi.axiosApiCall({ url: `file/${id}`, method: "delete" });

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
