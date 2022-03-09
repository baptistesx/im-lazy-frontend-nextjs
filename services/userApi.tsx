import api from "./api";
import { Fetcher } from "swr";
import { User } from "../hooks/useUser";

export const signUpWithEmailAndPassword = async (
  name: string,
  email: string,
  password: string,
  cb: Function
) => {
  const user = await api
    .axiosApiCall("signUp", "post", {
      name,
      email,
      password,
    })
    .then((res) => res.data.user);

  cb(user);
};

export const signInWithEmailAndPassword = async (
  email: string,
  password: string,
  cb: Function
) => {
  const user = await api
    .axiosApiCall("signInWithEmailAndPassword", "post", {
      email,
      password,
    })
    .then((res) => res.data.user);

  cb(user);
};

export const signInWithGoogle = async (access_token: string, cb: Function) => {
  const user = await api
    .axiosApiCall("signInWithGoogle", "post", {
      access_token,
    })
    .then((res) => res.data.user);

  cb(user);
};

export const getUser: Fetcher<User> = async (url: any) => {
  return await api.axiosApiCall(url, "get").then((res) => res.data);
};

export const signOut = async (cb: Function) => {
  await api.axiosApiCall("signOut", "post", {});

  cb();
};

export const resetPassword = async (email: string, cb: Function) => {
  await api.axiosApiCall("resetPassword", "post", {
    email,
  });

  cb();
};

export const getUsers = async (cb: Function) => {
  const users = await api
    .axiosApiCall("users", "get")
    .then((res) => res.data.users)
    .catch((err) => {});

  cb(users);
};

export const deleteUserById = async (id: string, cb: Function) => {
  await api.axiosApiCall(`user/${id}`, "delete");

  cb();
};

export const toggleAdminRights = async (id: string, cb: Function) => {
  await api.axiosApiCall(`toggleAdminRights`, "put", { id });

  cb();
};

export const updateUserById = async (data: any, cb: Function) => {
  await api.axiosApiCall(`user`, "put", {
    id: data.id,
    email: data.email,
    name: data.name,
    isAdmin: data.isAdmin,
    isPremium: data.isPremium,
  });

  cb();
};

export const createUser = async (data: any, cb: Function) => {
  await api.axiosApiCall(`user`, "post", {
    email: data.email,
    isAdmin: data.isAdmin,
    isPremium: data.isPremium,
    name: data.name,
  });

  cb();
};
