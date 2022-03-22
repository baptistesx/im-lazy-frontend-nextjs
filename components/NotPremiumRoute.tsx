import { CircularProgress } from "@mui/material";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useAuth } from "../providers/AuthProvider";
import { isPremium } from "../utils/functions";
import SignedInLayout from "./layout/SignedInLayout";

const NotPremiumRoute = ({ children }: { children: React.ReactNode }) => {
  const auth = useAuth();

  const router = useRouter();

  useEffect(() => {
    if (router.isReady && auth?.status !== "connected") {
      router.push("/");
    } else if (
      router.isReady &&
      auth?.status === "connected" &&
      isPremium(auth?.user)
    ) {
      router.push("/dashboard");
    }
  }, [auth, router]);

  return auth?.status === "loading" ||
    (router.isReady && auth?.status !== "connected") ||
    (router.isReady &&
      auth?.status === "connected" &&
      isPremium(auth?.user)) ? (
    <SignedInLayout>
      <CircularProgress />
    </SignedInLayout>
  ) : (
    <SignedInLayout>{children}</SignedInLayout>
  );
};

export default NotPremiumRoute;
