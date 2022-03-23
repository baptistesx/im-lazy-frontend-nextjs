import {
	getUser,
	signInWithEmailAndPassword,
	signInWithGoogle,
	signOut,
	signUpWithEmailAndPassword,
} from "@services/userApi";
import { useRouter } from "next/router";
import {
	Context,
	createContext,
	ReactElement,
	useCallback,
	useContext,
	useEffect,
	useState,
} from "react";
import { useSnackbars } from "./SnackbarProvider";
import { AuthValue, User, AuthStatus } from "./user";

const AuthContext: Context<AuthValue | undefined> = createContext<
	AuthValue | undefined
>(undefined);

export const AuthProvider = ({
	children,
}: {
	children: ReactElement;
}): ReactElement => {
	const [user, setUser] = useState<User | undefined>(undefined);
	const [status, setStatus] = useState<AuthStatus>("loading");

	const snackbarsService = useSnackbars();

	const router = useRouter();

	const fetchCurrentUser = useCallback(() => {
		setStatus("loading");

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
		fetchCurrentUser();
	}, [fetchCurrentUser]);

	const logout = async (): Promise<void> => {
		await signOut(() => {
			setUser(undefined);
			setStatus("not-connected");
			router.push("/");
		}).catch(() => {
			setStatus("not-connected");
			snackbarsService?.addAlert({
				message: "An error occurred while signing out",
				severity: "error",
			});
		});
	};

	const login = async (
		email: string,
		password: string,
		cb: () => void
	): Promise<void> => {
		setStatus("loading");

		await signInWithEmailAndPassword(email, password, (user: User) => {
			cb();
			setUser(user);
			setStatus("connected");
			snackbarsService?.addAlert({
				message:
					user.lastLogin === undefined
						? "Welcome to ImLazy app !"
						: "Welcome back !",
				severity: "success",
			});

			router.push("/dashboard");
		}).catch(() => {
			cb();

			setUser(undefined);
			setStatus("not-connected");
			//TODO: add internet connection checker and customize message error
			snackbarsService?.addAlert({
				message:
					"Check your internet connection or email/password might be invalid",
				severity: "error",
			});
		});
	};

	const loginWithGoogle = async (
		token: string,
		cb: () => void
	): Promise<void> => {
		setStatus("loading");
		await signInWithGoogle(token, (user: User) => {
			cb();
			setUser(user);
			setStatus("connected");

			snackbarsService?.addAlert({
				message:
					user.lastLogin === undefined
						? "Welcome to ImLazy app !"
						: "Welcome back !",
				severity: "success",
			});

			router.replace("/dashboard");
		}).catch(() => {
			cb();
			setUser(undefined);
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
		cb: () => void
	): Promise<void> => {
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
		}).catch(() => {
			cb();

			setUser(undefined);
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

export const useAuth = (): AuthValue | undefined => useContext(AuthContext);
