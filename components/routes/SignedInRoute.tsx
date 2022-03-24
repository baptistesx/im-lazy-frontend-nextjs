import { CircularProgress } from "@mui/material";
import { useAuth } from "@providers/AuthProvider";
import { useRouter } from "next/router";
import { ReactElement, ReactNode, useEffect } from "react";
import SignedInLayout from "../layout/SignedInLayout";

const SignedInRoute = ({ children }: { children: ReactNode }): ReactElement => {
	const auth = useAuth();

	const router = useRouter();

	useEffect(() => {
		if (router.isReady && auth?.value.status !== "connected") {
			router.push("/");
		}
	}, [auth, router]);

	return auth?.value.status === "loading" ||
		(router.isReady && auth?.value.status !== "connected") ? (
		<SignedInLayout>
			<CircularProgress />
		</SignedInLayout>
	) : (
		<SignedInLayout>{children}</SignedInLayout>
	);
};

export default SignedInRoute;
