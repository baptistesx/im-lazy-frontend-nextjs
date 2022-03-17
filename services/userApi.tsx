import api from "./api";

export const signUpWithEmailAndPassword = async (
  name: string,
  email: string,
  password: string,
  cb: Function
) => {
  const user = await api
    .axiosApiCall({
      url: "signUp",
      method: "post",
      body: {
        name,
        email,
        password,
      },
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
    .axiosApiCall({
      url: "signInWithEmailAndPassword",
      method: "post",
      body: {
        email,
        password,
      },
    })
    .then((res) => res.data.user);

  cb(user);
};

export const signInWithGoogle = async (access_token: string, cb: Function) => {
  const user = await api
    .axiosApiCall({
      url: "signInWithGoogle",
      method: "post",
      body: {
        access_token,
      },
    })
    .then((res) => res.data.user);

  cb(user);
};

export const getUser = async (cb: Function) => {
  await api
    .axiosApiCall({
      url: "user",
      method: "get",
    })
    .then((res) => {
      cb(res.data);
    });
};

export const signOut = async (cb: Function) => {
  await api.axiosApiCall({ url: "signOut", method: "post" });
  console.log("well logged out");
  cb();
};

export const resetPassword = async (email: string, cb: Function) => {
  await api.axiosApiCall({
    url: "resetPassword",
    method: "post",
    body: {
      email,
    },
  });

  cb();
};

export const getUsers = async (cb: Function) => {
  const users = await api
    .axiosApiCall({ url: "users", method: "get" })
    .then((res) => res.data.users)
    .catch((err) => {});

  cb(users);
};

export const deleteUserById = async (id: string, cb: Function) => {
  await api.axiosApiCall({ url: `user/${id}`, method: "delete" });

  cb();
};

export const updateUserById = async (data: any, cb: Function) => {
  await api.axiosApiCall({
    url: `user`,
    method: "put",
    body: {
      id: data.id,
      email: data.email,
      name: data.name,
      role: data.role,
    },
  });

  cb();
};

export const createUser = async (data: any, cb: Function) => {
  await api.axiosApiCall({
    url: `user`,
    method: "post",
    body: {
      email: data.email,
      role: data.role,
      name: data.name,
    },
  });

  cb();
};
