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
		if (router.isReady && auth?.value.status === "connected") {
			router.push("/dashboard");
		}
	}, [auth, router]);

	return auth?.value.status === "loading" ||
		(router.isReady && auth?.value.status === "connected") ? (
		<NotSignedInLayout>
			<CircularProgress />
		</NotSignedInLayout>
	) : (
		<NotSignedInLayout title={title}>{children}</NotSignedInLayout>
	);
};

export default NotSignedInRoute;
