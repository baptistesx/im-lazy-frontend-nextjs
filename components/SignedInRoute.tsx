import { CircularProgress } from "@mui/material";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useAuth } from "../providers/AuthProvider";
import SignedInLayout from "./layout/SignedInLayout";

const SignedInRoute = ({ children }: { children: React.ReactNode }) => {
  const auth = useAuth();

  const router = useRouter();

  useEffect(() => {
    if (router.isReady && auth?.status !== "connected") {
      router.push("/");
    }
  }, [auth, router]);

  return auth?.status === "loading" ||
    (router.isReady && auth?.status !== "connected") ? (
    <SignedInLayout>
      <CircularProgress />
    </SignedInLayout>
  ) : (
    <SignedInLayout>{children}</SignedInLayout>
  );
};

export default SignedInRoute;
