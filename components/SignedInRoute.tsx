import { CircularProgress } from "@mui/material";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useAuth } from "../providers/AuthProvider";
import GlobalLayout from "./layout/GlobalLayout";

const SignedInRoute = ({ children }: { children: React.ReactNode }) => {
  const auth = useAuth();

  const router = useRouter();

  useEffect(() => {
    if (router.isReady && auth?.status !== "connected") {
      router.push("/");
    }
  }, [auth]);

  return auth?.status === "loading" ||
    (router.isReady && auth?.status !== "connected") ? (
    <GlobalLayout>
      <CircularProgress />
    </GlobalLayout>
  ) : (
    <GlobalLayout>{children}</GlobalLayout>
  );
};

export default SignedInRoute;
