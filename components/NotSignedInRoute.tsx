import { CircularProgress } from "@mui/material";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useAuth } from "../providers/AuthProvider";
import NotSignedInLayout from "./layout/NotSignInedLayout";

const NotSignedInRoute = ({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) => {
  const auth = useAuth();

  const router = useRouter();

  useEffect(() => {
    if (router.isReady && auth?.status === "connected") {
      router.push("/dashboard");
    }
  }, [auth]);

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
