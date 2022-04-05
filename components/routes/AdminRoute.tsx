import { CircularProgress } from "@mui/material";
import { useAuth } from "@providers/AuthProvider";
import { useRouter } from "next/router";
import { ReactElement, ReactNode, useEffect } from "react";
import SignedInLayout from "../layout/SignedInLayout";

export type RouteProps = {
	children: ReactNode;
	title: string;
};

const AdminRoute = ({ children, title }: RouteProps): ReactElement => {
	const auth = useAuth();

	const router = useRouter();

	useEffect(() => {
		if (router.isReady && auth?.value.status !== "connected") {
			router.push("/");
		} else if (
			router.isReady &&
			auth?.value.status === "connected" &&
			!auth.isAdmin(auth?.value.user)
		) {
			router.push("/dashboard");
		}
	}, [auth, router]);

	return (
		<SignedInLayout title={title}>
			{auth?.value.status === "loading" ||
			(router.isReady && auth?.value.status !== "connected") ||
			(router.isReady &&
				auth?.value.status === "connected" &&
				!auth.isAdmin(auth?.value.user)) ? (
				<CircularProgress />
			) : (
				children
			)}
		</SignedInLayout>
	);
};

export default AdminRoute;
