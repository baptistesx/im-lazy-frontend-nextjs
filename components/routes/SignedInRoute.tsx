import { CircularProgress } from "@mui/material";
import { useAuth } from "@providers/AuthProvider";
import { useRouter } from "next/router";
import { ReactElement, useEffect } from "react";
import SignedInLayout from "../layout/SignedInLayout";
import { RouteProps } from "./AdminRoute";

const SignedInRoute = ({ children, title }: RouteProps): ReactElement => {
	const auth = useAuth();

	const router = useRouter();

	useEffect(() => {
		if (router.isReady && auth?.value.status !== "connected") {
			router.push("/");
		}
	}, [auth, router]);

	return (
		<SignedInLayout title={title}>
			{auth?.value.status === "loading" ||
			(router.isReady && auth?.value.status !== "connected") ? (
				<CircularProgress />
			) : (
				children
			)}
		</SignedInLayout>
	);
};

export default SignedInRoute;
