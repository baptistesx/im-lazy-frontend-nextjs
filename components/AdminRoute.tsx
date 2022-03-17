import { CircularProgress } from "@mui/material";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useAuth } from "../providers/AuthProvider";
import SignedInLayout from "./layout/SignedInLayout";
import { isAdmin } from "../utils/functions";

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const auth = useAuth();

  const router = useRouter();

  useEffect(() => {
    if (router.isReady && auth?.status !== "connected") {
      router.push("/");
    } else if (
      router.isReady &&
      auth?.status === "connected" &&
      !isAdmin(auth?.user)
    ) {
      router.push("/dashboard");
    }
  }, [auth]);

  return auth?.status === "loading" ||
    (router.isReady && auth?.status !== "connected") ||
    (router.isReady && auth?.status === "connected" && !isAdmin(auth?.user)) ? (
    <SignedInLayout>
      <CircularProgress />
    </SignedInLayout>
  ) : (
    <SignedInLayout>{children}</SignedInLayout>
  );
};

export default AdminRoute;
