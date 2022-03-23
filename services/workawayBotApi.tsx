import api from "./api";

export const setCity = async (city: string): Promise<void> => {
	await api.axiosApiCall({
		url: "set-city",
		method: "post",
		body: {
			city,
		},
	});
};

export const clearLogs = async (
	cb: (res: { status: number }) => void
): Promise<void> => {
	const res = await api.axiosApiCall({ url: "clear-logs", method: "get" });

	cb(res);
};

export const getFilesName = async (cb: (data: any) => void): Promise<void> => {
	const res = await api.axiosApiCall({ url: "files-name", method: "get" });

	cb(res.data);
};

export const downloadFileByName = async (
	name: string,
	cb: (data: any) => void
): Promise<void> => {
	const res = await api.axiosApiCall({ url: `file/${name}`, method: "get" });

	cb(res.data);
};

export const deleteFileByName = async (
	name: string,
	cb: () => Promise<void>
): Promise<void> => {
	await api.axiosApiCall({ url: `file/${name}`, method: "delete" });

	cb();
};

export const startBot = async (
	data: any,
	cb: (res: any) => void
): Promise<void> => {
	const res = await api.axiosApiCall({
		url: "start-bot",
		method: "post",
		body: { ...data },
	});

	cb(res);
};

export const stopBot = async (cb: (res: any) => void): Promise<void> => {
	const res = await api.axiosApiCall({ url: "stop-bot", method: "get" });

	cb(res);
};
