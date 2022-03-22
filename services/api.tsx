import { ENDPOINT } from "@utils/constants";
import axios, { Method } from "axios";

const api = {
	// All api requests are made thanks to this function
	async axiosApiCall({
		url,
		method,
		body = {},
	}: {
		url: string;
		method: Method;
		body?: any;
	}) {
		return axios({
			method,
			url: `${ENDPOINT}/${url}`,
			data: body,
			headers: { "Content-Type": "application/json" },
			withCredentials: true,
		});
	},
};
export default api;
