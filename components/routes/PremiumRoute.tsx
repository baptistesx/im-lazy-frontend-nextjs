import { CircularProgress } from "@mui/material";
import { useAuthActions } from "@providers/AuthActionsProvider";
import { useAuth } from "@providers/AuthProvider";
import { useRouter } from "next/router";
import { ReactElement, useEffect } from "react";
import SignedInLayout from "../layout/SignedInLayout";
import { RouteProps } from "./AdminRoute";

const PremiumRoute = ({ children, title }: RouteProps): ReactElement => {
	const auth = useAuth();
	const authActions = useAuthActions();

	const router = useRouter();

	useEffect(() => {
		if (router.isReady && auth?.value.status !== "connected") {
			router.push("/");
		} else if (
			router.isReady &&
			auth?.value.status === "connected" &&
			!auth?.isPremium(auth?.value.user)
		) {
			router.push("/dashboard");
		}
	}, [auth, authActions, router]);

	return (
		<SignedInLayout title={title}>
			{auth?.value.status === "loading" ||
			(router.isReady && auth?.value.status !== "connected") ||
			(router.isReady &&
				auth?.value.status === "connected" &&
				!auth?.isPremium(auth?.value.user)) ? (
				<CircularProgress />
			) : (
				children
			)}
		</SignedInLayout>
	);
};

export default PremiumRoute;
