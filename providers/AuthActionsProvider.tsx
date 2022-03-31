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
import { useSnackbar } from "notistack";
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
import { AuthActionsValue, User } from "./user.d";

const AuthActionsContext: Context<AuthActionsValue | undefined> = createContext<
	AuthActionsValue | undefined
>(undefined);

export const AuthActionsProvider = ({
	children,
}: {
	children: ReactElement | ReactElement[];
}): ReactElement => {
	const router = useRouter();
	const { locale } = router;
	const t = locale === "en" ? en : fr;
	const auth = useAuth();

	const { enqueueSnackbar } = useSnackbar();

	const fetchCurrentUser = useCallback(() => {
		auth.setValue({ status: "loading", user: undefined });

		getUser((user: User) => {
			auth.setValue({ status: "connected", user });
		}).catch((err) => {
			auth.setValue({ status: "not-connected", user: undefined });

			if (err.response.status === 401) {
				enqueueSnackbar(t.auth["sign-in-again"], {
					variant: "error",
				});
				logout();
			} else {
				if (
					!router.pathname.startsWith(routes.auth.root) &&
					router.pathname !== routes.root
				) {
					enqueueSnackbar(t.auth["error-fetching-user"], { variant: "error" });
				}
			}
		});
	}, [auth, router.route]);

	useEffect(() => {
		fetchCurrentUser();
	}, []);

	const logout = async (): Promise<void> => {
		await signOut(() => {
			auth.setValue({ status: "not-connected", user: undefined });
			router.push("/");
		}).catch(() => {
			auth.setValue({ status: "not-connected", user: undefined });

			enqueueSnackbar(t.auth["error-sign-out"], {
				variant: "error",
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

			enqueueSnackbar(
				user.lastLogin === undefined
					? t.auth["welcome-new-user"]
					: t.auth["welcome-back"],
				{
					variant: "success",
				}
			);

			// The NotSignedInRoute will redirect to /dashboard
		}).catch(() => {
			cb();

			auth.setValue({ status: "not-connected", user: undefined });

			enqueueSnackbar(t.auth["error-sign-in"], { variant: "error" });
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

			enqueueSnackbar(
				user.lastLogin === undefined
					? t.auth["welcome-new-user"]
					: t.auth["welcome-back"],
				{
					variant: "success",
				}
			);

			// The NotSignedInRoute will redirect to /dashboard
		}).catch(() => {
			cb();

			auth.setValue({ status: "not-connected", user: undefined });

			enqueueSnackbar(t.auth["error-sign-in-google"], {
				variant: "error",
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

			enqueueSnackbar(t.auth["welcome-new-user"], {
				variant: "success",
			});

			// The NotSignedInRoute will redirect to /dashboard
		}).catch(() => {
			cb();

			auth.setValue({ status: "not-connected", user: undefined });

			enqueueSnackbar(t.auth["error-sign-up"], {
				variant: "error",
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
