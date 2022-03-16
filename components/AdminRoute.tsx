import { CircularProgress } from "@mui/material";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useAuth } from "../providers/AuthProvider";
import SignedInLayout from "./layout/SignedInLayout";

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const auth = useAuth();

  const router = useRouter();

  useEffect(() => {
    if (router.isReady && auth?.status !== "connected") {
      router.push("/");
    } else if (
      router.isReady &&
      auth?.status === "connected" &&
      !auth?.user?.isAdmin
    ) {
      router.push("/dashboard");
    }
  }, [auth]);

  return auth?.status === "loading" ||
    (router.isReady && auth?.status !== "connected") ||
    (router.isReady && auth?.status === "connected" && !auth?.user?.isAdmin) ? (
    <SignedInLayout>
      <CircularProgress />
    </SignedInLayout>
  ) : (
    <SignedInLayout>{children}</SignedInLayout>
  );
};

export default AdminRoute;
