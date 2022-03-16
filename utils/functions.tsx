import { User } from "../providers/AuthProvider";

export function capitalizeFirstLetter(string: string | undefined) {
  if (string === undefined) {
    return "";
  }

  return string.charAt(0).toUpperCase() + string.slice(1);
}

export const isAdmin = (user: User | null | undefined) =>
  user?.role === "admin";

export const isPremium = (user: User | null | undefined) =>
  user?.role === "admin" || user?.role === "premium";
