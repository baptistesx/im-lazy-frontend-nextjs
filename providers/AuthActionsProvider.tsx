import { useAuth } from "@providers/AuthProvider";
import routes from "@providers/routes";
import {
	getUser,
	signInWithEmailAndPassword,
	signInWithGoogle,
	signOut,
	signUpWithEmailAndPassword,
} from "@services/authApi";
import { useRouter } from "next/router";
import en from "public/locales/en/en";
import fr from "public/locales/fr/fr";
import {
	Context,
	createContext,
	ReactElement,
	useCallback,
	useContext,
	useEffect,
} from "react";
import { useSnackbars } from "./SnackbarProvider";
import { AuthActionsValue, User } from "./user.d";

const AuthActionsContext: Context<AuthActionsValue | undefined> = createContext<
	AuthActionsValue | undefined
>(undefined);

export const AuthActionsProvider = ({
	children,
}: {
	children: ReactElement;
}): ReactElement => {
	const router = useRouter();
	const { locale } = router;
	const t = locale === "en" ? en : fr;
	const auth = useAuth();

	const snackbarsService = useSnackbars();

	const fetchCurrentUser = useCallback(() => {
		auth.setValue({ status: "loading", user: undefined });

		getUser((user: User) => {
			auth.setValue({ status: "connected", user });
		}).catch(() => {
			auth.setValue({ status: "not-connected", user: undefined });

			if (
				!router.pathname.startsWith(routes.auth.root) &&
				router.pathname !== routes.root
			) {
				snackbarsService?.addSnackbar({
					message: t.auth["error-fetching-user"],
					severity: "error",
				});
			}
		});
	}, [auth, router.route, snackbarsService]);

	useEffect(() => {
		fetchCurrentUser();
	}, []);

	const logout = async (): Promise<void> => {
		await signOut(() => {
			auth.setValue({ status: "not-connected", user: undefined });
			router.push("/");
		}).catch(() => {
			auth.setValue({ status: "not-connected", user: undefined });
			snackbarsService?.addSnackbar({
				message: t.auth["error-sign-out"],
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
						? t.auth["welcome-new-user"]
						: t.auth["welcome-back"],
				severity: "success",
			});

			// The NotSignedInRoute will redirect to /dashboard
		}).catch(() => {
			cb();

			auth.setValue({ status: "not-connected", user: undefined });
			//TODO: add internet connection checker and customize message error
			snackbarsService?.addSnackbar({
				message: t.auth["error-sign-in"],
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
						? t.auth["welcome-new-user"]
						: t.auth["welcome-back"],
				severity: "success",
			});

			// The NotSignedInRoute will redirect to /dashboard
		}).catch(() => {
			cb();

			auth.setValue({ status: "not-connected", user: undefined });

			snackbarsService?.addSnackbar({
				message: t.auth["error-sign-in-google"],
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
				message: t.auth["welcome-new-user"],
				severity: "success",
			});

			// The NotSignedInRoute will redirect to /dashboard
		}).catch(() => {
			cb();

			auth.setValue({ status: "not-connected", user: undefined });

			snackbarsService?.addSnackbar({
				message: t.auth["error-sign-up"],
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
