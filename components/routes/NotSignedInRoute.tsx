import { CircularProgress } from "@mui/material";
import { useAuth } from "@providers/AuthProvider";
import { useRouter } from "next/router";
import { ReactElement, useEffect } from "react";
import NotSignedInLayout from "../layout/NotSignInedLayout";
import { RouteProps } from "./AdminRoute";

const NotSignedInRoute = ({ children, title }: RouteProps): ReactElement => {
	const auth = useAuth();

	const router = useRouter();

	useEffect(() => {
		if (router.isReady && auth?.value.status === "connected") {
			router.push("/dashboard");
		}
	}, [auth, router]);

	return (
		<NotSignedInLayout title={title}>
			{auth?.value.status === "loading" ||
			(router.isReady && auth?.value.status === "connected") ? (
				<CircularProgress />
			) : (
				children
			)}
		</NotSignedInLayout>
	);
};

export default NotSignedInRoute;
