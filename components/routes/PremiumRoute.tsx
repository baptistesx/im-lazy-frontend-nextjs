import { CircularProgress } from "@mui/material";
import { useAuth } from "@providers/AuthProvider";
import { useRouter } from "next/router";
import { ReactElement, ReactNode, useEffect } from "react";
import SignedInLayout from "../layout/SignedInLayout";

const PremiumRoute = ({ children }: { children: ReactNode }): ReactElement => {
	const auth = useAuth();

	const router = useRouter();

	useEffect(() => {
		if (router.isReady && auth?.status !== "connected") {
			router.push("/");
		} else if (
			router.isReady &&
			auth?.status === "connected" &&
			!auth?.isPremium(auth?.user)
		) {
			router.push("/dashboard");
		}
	}, [auth, router]);

	return auth?.status === "loading" ||
		(router.isReady && auth?.status !== "connected") ||
		(router.isReady &&
			auth?.status === "connected" &&
			!auth?.isPremium(auth?.user)) ? (
		<SignedInLayout>
			<CircularProgress />
		</SignedInLayout>
	) : (
		<SignedInLayout>{children}</SignedInLayout>
	);
};

export default PremiumRoute;
