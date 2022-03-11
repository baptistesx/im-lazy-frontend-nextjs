import axios, { Method } from "axios";
import { ENDPOINT } from "../utils/constants";

const api = {
  // All api requests are made thanks to this function
  async axiosApiCall(url: string, method: Method, body = {}, cookies: "") {
    return axios({
      method,
      url: `${ENDPOINT}${url}`,
      data: body,
      headers: { "Content-Type": "application/json", Cookie: cookies },
      withCredentials: true,
    });
  },
};
export default api;
