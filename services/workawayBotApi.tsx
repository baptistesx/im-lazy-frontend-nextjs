import api from "./api";

export const setCity = async (city: string) => {
  await api.axiosApiCall("/setCity", "post", {
    city,
  });
};

export const clearLogs = async (cb: Function) => {
  await api.axiosApiCall("/clearLogs", "get").then((res) => {
    cb(res);
  });
};

export const getFilesName = async (cb: Function) => {
  await api.axiosApiCall("/filesName", "get").then((res) => {
    cb(res.data);
  });
};

export const downloadFileByName = async (name: string, cb: Function) => {
  await api.axiosApiCall(`/file/${name}`, "get").then((res) => {
    cb(res.data);
  });
};

export const deleteFileByName = async (name: string, cb: Function) => {
  await api.axiosApiCall(`/file/${name}`, "delete").then((res) => {
    cb(res.data);
  });
};

export const startBot = async (data: any, cb: Function) => {
  await api.axiosApiCall("/startBot", "post", { ...data }).then((res) => {
    cb(res);
  });
};

export const stopBot = async (cb: Function) => {
  await api.axiosApiCall("/stopBot", "get").then((res) => {
    cb(res);
  });
};
