import { useAuth } from "@providers/AuthProvider";
import {
	getUser,
	signInWithEmailAndPassword,
	signInWithGoogle,
	signOut,
	signUpWithEmailAndPassword,
} from "@services/authApi";
import { useRouter } from "next/router";
import {
	Context,
	createContext,
	ReactElement,
	useCallback,
	useContext,
	useEffect,
} from "react";
import { useSnackbars } from "./SnackbarProvider";
import { AuthActionsValue, User } from "./user";

const AuthActionsContext: Context<AuthActionsValue | undefined> = createContext<
	AuthActionsValue | undefined
>(undefined);

export const AuthActionsProvider = ({
	children,
}: {
	children: ReactElement;
}): ReactElement => {
	const auth = useAuth();

	const snackbarsService = useSnackbars();

	const router = useRouter();

	const fetchCurrentUser = useCallback(() => {
		auth.setValue({ status: "loading", user: undefined });

		getUser((user: User) => {
			auth.setValue({ status: "connected", user });
		}).catch(() => {
			auth.setValue({ status: "not-connected", user: undefined });

			// TODO: there is probably a better way to get NotSignedInRoutes
			if (
				router.route !== "/" &&
				router.route !== "/auth/sign-in" &&
				router.route !== "/auth/sign-up" &&
				router.route !== "/auth/reset-password"
			) {
				snackbarsService?.addSnackbar({
					message: "An error occurred while fetching user.",
					severity: "error",
				});
			}
		});
	}, [auth, router.route, snackbarsService]);

	useEffect(() => {
		fetchCurrentUser();
	}, [fetchCurrentUser]);

	const logout = async (): Promise<void> => {
		await signOut(() => {
			auth.setValue({ status: "not-connected", user: undefined });
			router.push("/");
		}).catch(() => {
			auth.setValue({ status: "not-connected", user: undefined });
			snackbarsService?.addSnackbar({
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
		auth.setValue({ status: "loading", user: undefined });

		await signInWithEmailAndPassword(email, password, (user: User) => {
			cb();

			auth.setValue({ status: "connected", user });

			snackbarsService?.addSnackbar({
				message:
					user.lastLogin === undefined
						? "Welcome to ImLazy app !"
						: "Welcome back !",
				severity: "success",
			});

			router.push("/dashboard");
		}).catch(() => {
			cb();

			auth.setValue({ status: "not-connected", user: undefined });
			//TODO: add internet connection checker and customize message error
			snackbarsService?.addSnackbar({
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
		auth.setValue({ status: "loading", user: undefined });

		await signInWithGoogle(token, (user: User) => {
			cb();

			auth.setValue({ status: "connected", user });

			snackbarsService?.addSnackbar({
				message:
					user.lastLogin === undefined
						? "Welcome to ImLazy app !"
						: "Welcome back !",
				severity: "success",
			});

			router.replace("/dashboard");
		}).catch(() => {
			cb();

			auth.setValue({ status: "not-connected", user: undefined });

			snackbarsService?.addSnackbar({
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
		auth.setValue({ status: "loading", user: undefined });

		await signUpWithEmailAndPassword(name, email, password, (user: User) => {
			cb();

			auth.setValue({ status: "connected", user });

			snackbarsService?.addSnackbar({
				message: "Welcome to ImLazy app !",
				severity: "success",
			});

			router.replace("/dashboard");
		}).catch(() => {
			cb();

			auth.setValue({ status: "not-connected", user: undefined });

			snackbarsService?.addSnackbar({
				message:
					"An error occurred while signing up. This email might be used already",
				severity: "error",
			});
		});
	};

	return (
		<AuthActionsContext.Provider
			value={{
				logout,
				login,
				loginWithGoogle,
				register,
				fetchCurrentUser,
			}}
		>
			{children}
		</AuthActionsContext.Provider>
	);
};

export const useAuthActions = (): AuthActionsValue => {
	const context = useContext(AuthActionsContext);

	if (context === undefined) {
		throw new Error(
			"useAuthActions must be used withing a AuthActionsProvider"
		);
	}

	return context;
};
