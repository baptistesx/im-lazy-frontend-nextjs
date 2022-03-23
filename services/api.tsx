import axios, { AxiosResponse, Method } from "axios";

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
	}): Promise<AxiosResponse<any, any>> {
		return axios({
			method,
			url: `${process.env.NEXT_PUBLIC_ENDPOINT}/${url}`,
			data: body,
			headers: { "Content-Type": "application/json" },
			withCredentials: true,
		});
	},
};
export default api;
