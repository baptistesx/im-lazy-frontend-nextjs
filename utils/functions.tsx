import { User } from "@providers/AuthProvider";

export const isAdmin = (user: User | null | undefined) =>
	user?.role === "admin";

export const isPremium = (user: User | null | undefined) =>
	user?.role === "admin" || user?.role === "premium";
