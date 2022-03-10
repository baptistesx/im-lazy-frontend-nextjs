import useSWR, { Fetcher } from "swr";

import { getUser } from "../services/userApi";

export interface User {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  isPremium: boolean;
  isEmailVerified: boolean;
}

export default function useUser() {
  const fetcher = (url: RequestInfo) => getUser(url);

  const { data, mutate, error } = useSWR("user", fetcher);

  const loading = !data && !error;
  const loggedIn = !error && data;

  return {
    loading,
    loggedIn,
    user: data,
    error,
    mutate,
  };
}
