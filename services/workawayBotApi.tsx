import api from "./api";

export const setCity = async (city: string) => {
  await api.axiosApiCall({
    url: "setCity",
    method: "post",
    body: {
      city,
    },
  });
};

export const clearLogs = async (cb: Function) => {
  await api.axiosApiCall({ url: "clearLogs", method: "get" }).then((res) => {
    cb(res);
  });
};

export const getFilesName = async (cb: Function) => {
  await api.axiosApiCall({ url: "filesName", method: "get" }).then((res) => {
    cb(res.data);
  });
};

export const downloadFileByName = async (name: string, cb: Function) => {
  await api.axiosApiCall({ url: `file/${name}`, method: "get" }).then((res) => {
    cb(res.data);
  });
};

export const deleteFileByName = async (name: string, cb: Function) => {
  await api
    .axiosApiCall({ url: `file/${name}`, method: "delete" })
    .then((res) => {
      cb(res.data);
    });
};

export const startBot = async (data: any, cb: Function) => {
  await api
    .axiosApiCall({ url: "startBot", method: "post", body: { ...data } })
    .then((res) => {
      cb(res);
    });
};

export const stopBot = async (cb: Function) => {
  await api.axiosApiCall({ url: "stopBot", method: "get" }).then((res) => {
    cb(res);
  });
};
