import {
	Context,
	createContext,
	ReactElement,
	useContext,
	useState,
} from "react";
import { AuthValue, Connected, Loading, NotConnected, User } from "./user";

const AuthContext: Context<AuthValue | undefined> = createContext<
	AuthValue | undefined
>(undefined);

export const AuthProvider = ({
	children,
}: {
	children: ReactElement;
}): ReactElement => {
	const [value, setValue] = useState<Connected | NotConnected | Loading>({
		user: undefined,
		status: "not-connected",
	});

	const isAdmin = (user: User | undefined): boolean => user?.role === "admin";

	const isPremium = (user: User | undefined): boolean =>
		user?.role === "admin" || user?.role === "premium";

	return (
		<AuthContext.Provider
			value={{
				value,
				setValue,
				isAdmin,
				isPremium,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = (): AuthValue => {
	const context = useContext(AuthContext);

	if (context === undefined) {
		throw new Error("useAuth must be used withing a AuthProvider");
	}

	return context;
};
