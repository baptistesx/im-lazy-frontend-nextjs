import {
	getUser,
	getUserSWR,
	signInWithEmailAndPassword,
	signInWithGoogle,
	signOut,
	signUpWithEmailAndPassword,
} from "@services/userApi";
import { useRouter } from "next/router";
import {
	createContext,
	ReactNode,
	useCallback,
	useContext,
	useEffect,
	useState,
} from "react";
import useSWR from "swr";
import { useSnackbars } from "./SnackbarProvider";

export type Role = "admin" | "premium" | "classic";
export type User = {
	id: string;
	name: string;
	email: string;
	role: Role;
	isEmailVerified: boolean;
	lastLogin: Date;
};

type AuthStatus = "loading" | "connected" | "not-connected" | "error";

type AuthValue = {
	user: User | null | undefined;
	status: AuthStatus;
	logout: () => void;
	login: (email: string, password: string, cb: Function) => void;
	register: (
		name: string,
		email: string,
		password: string,
		cb: Function
	) => void;
	loginWithGoogle: (token: string, cb: Function) => void;
	fetchCurrentUser: () => void;
	isAdmin: (user: User | undefined | null) => boolean;
	isPremium: (user: User | undefined | null) => boolean;
};

const AuthContext = createContext<AuthValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const fetcher = (url: RequestInfo) => getUserSWR();

	const { data: userSWR, mutate, error } = useSWR("user", fetcher);
	const [user, setUser] = useState<User | null | undefined>(null);
	const [status, setStatus] = useState<AuthStatus>("loading");

	const snackbarsService = useSnackbars();

	const router = useRouter();

	const fetchCurrentUser = useCallback(() => {
		getUser((user: User) => {
			setUser(user);
			setStatus("connected");
		}).catch(() => {
			setStatus("not-connected");

			// TODO: there is probably a better way to get NotSignedInRoutes
			if (
				router.route !== "/" &&
				router.route !== "/auth/sign-in" &&
				router.route !== "/auth/sign-up" &&
				router.route !== "/auth/reset-password"
			) {
				snackbarsService?.addAlert({
					message: "An error occurred while fetching user.",
					severity: "error",
				});
			}
		});
	}, [router.route, snackbarsService]);

	useEffect(() => {
		setStatus("loading");
		fetchCurrentUser();
		setUser(userSWR);
	}, [userSWR]);

	const logout = async () => {
		await signOut(() => {
			setUser(null);
			setStatus("not-connected");
			router.push("/");
		}).catch((err: Error) => {
			setStatus("not-connected");
			snackbarsService?.addAlert({
				message: "An error occurred while signing out",
				severity: "error",
			});
		});
	};

	const login = async (email: string, password: string, cb: Function) => {
		setStatus("loading");

		await signInWithEmailAndPassword(email, password, (user: User) => {
			cb();
			setUser(user);
			setStatus("connected");
			snackbarsService?.addAlert({
				message: !user.lastLogin ? "Welcome to ImLazy app !" : "Welcome back !",
				severity: "success",
			});

			router.push("/dashboard");
		}).catch((err: Error) => {
			cb();

			setUser(null);
			setStatus("not-connected");
			//TODO: add internet connection checker and customize message error
			snackbarsService?.addAlert({
				message:
					"Check your internet connection or email/password might be invalid",
				severity: "error",
			});
		});
	};

	const loginWithGoogle = async (token: string, cb: Function) => {
		setStatus("loading");
		await signInWithGoogle(token, (user: User) => {
			cb();
			setUser(user);
			setStatus("connected");

			snackbarsService?.addAlert({
				message: !user.lastLogin ? "Welcome to ImLazy app !" : "Welcome back !",
				severity: "success",
			});

			router.replace("/dashboard");
		}).catch((err: Error) => {
			cb();
			setUser(null);
			setStatus("not-connected");
			snackbarsService?.addAlert({
				message: "An error occurred while signing in with Google",
				severity: "error",
			});
		});
	};

	const register = async (
		name: string,
		email: string,
		password: string,
		cb: Function
	) => {
		setStatus("loading");

		await signUpWithEmailAndPassword(name, email, password, (user: User) => {
			cb();
			setUser(user);
			setStatus("connected");
			snackbarsService?.addAlert({
				message: "Welcome to ImLazy app !",
				severity: "success",
			});

			router.replace("/dashboard");
		}).catch((err: Error) => {
			cb();

			setUser(null);
			setStatus("not-connected");

			snackbarsService?.addAlert({
				message:
					"An error occurred while signing up. This email might be used already",
				severity: "error",
			});
		});
	};

	const isAdmin = (user: User | null | undefined): boolean =>
		user?.role === "admin";

	const isPremium = (user: User | null | undefined): boolean =>
		user?.role === "admin" || user?.role === "premium";

	return (
		<AuthContext.Provider
			value={{
				user,
				status,
				logout,
				login,
				loginWithGoogle,
				register,
				fetchCurrentUser,
				isAdmin,
				isPremium,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => useContext(AuthContext);
