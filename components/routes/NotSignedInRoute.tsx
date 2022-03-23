import { CircularProgress } from "@mui/material";
import { useAuth } from "@providers/AuthProvider";
import { useRouter } from "next/router";
import { ReactElement, ReactNode, useEffect } from "react";
import NotSignedInLayout from "../layout/NotSignInedLayout";

const NotSignedInRoute = ({
	children,
	title,
}: {
	children: ReactNode;
	title: string;
}): ReactElement => {
	const auth = useAuth();

	const router = useRouter();

	useEffect(() => {
		if (router.isReady && auth?.status === "connected") {
			router.push("/dashboard");
		}
	}, [auth, router]);

	return auth?.status === "loading" ||
		(router.isReady && auth?.status === "connected") ? (
		<NotSignedInLayout>
			<CircularProgress sx={{ color: "white" }} />
		</NotSignedInLayout>
	) : (
		<NotSignedInLayout title={title}>{children}</NotSignedInLayout>
	);
};

export default NotSignedInRoute;
