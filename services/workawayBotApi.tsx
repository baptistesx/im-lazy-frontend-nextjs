import api from "./api";

export const setCity = async (city: string) => {
	await api.axiosApiCall({
		url: "set-city",
		method: "post",
		body: {
			city,
		},
	});
};

export const clearLogs = async (cb: Function) => {
	const res = await api.axiosApiCall({ url: "clear-logs", method: "get" });

	cb(res);
};

export const getFilesName = async (cb: Function) => {
	const res = await api.axiosApiCall({ url: "files-name", method: "get" });

	cb(res.data);
};

export const downloadFileByName = async (name: string, cb: Function) => {
	const res = await api.axiosApiCall({ url: `file/${name}`, method: "get" });

	cb(res.data);
};

export const deleteFileByName = async (name: string, cb: Function) => {
	const res = await api.axiosApiCall({ url: `file/${name}`, method: "delete" });

	cb(res.data);
};

export const startBot = async (data: any, cb: Function) => {
	const res = await api.axiosApiCall({
		url: "start-bot",
		method: "post",
		body: { ...data },
	});

	cb(res);
};

export const stopBot = async (cb: Function) => {
	const res = await api.axiosApiCall({ url: "stop-bot", method: "get" });

	cb(res);
};
