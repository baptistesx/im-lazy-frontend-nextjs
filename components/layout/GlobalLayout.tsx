import { useTheme } from "@emotion/react";
import { Theme } from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";
import { IconButton } from "@mui/material";
import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material/";
import CssBaseline from "@mui/material/CssBaseline";
import React from "react";
import { useRouter } from "next/router";
import { DRAWER_WIDTH } from "../../utils/constants";
import CustomDrawer from "./CustomDrawer";
import ToolBarUserInfo from "./ToolBarUserInfo";
import { signOut } from "../../services/userApi";
import { User } from "../../hooks/useUser";
import useSnackbars from "../../hooks/useSnackbars";
import Image from "next/image";

//TODO: is there a way to not use showToolbarRightBox param (used for 404 error page as user is not requested, the page doesn't know if user is logged in)?
const GlobalLayout = ({
  user,
  children,
  showToolbarRightBox = true,
}: {
  user?: User;
  showToolbarRightBox?: boolean;
  children: React.ReactNode;
}) => {
  const theme: Theme = useTheme();

  const router = useRouter();

  const snackbarsService = useSnackbars();

  const handleLogoClick = () => {
    if (router.route != "/") {
      router.push("/");
    }
  };

  const onLogoutClick = async () =>
    await signOut(() => {
      router.push("/");
    }).catch((err: Error) => {
      snackbarsService?.addAlert({
        message: "An error occured while signing out",
        severity: "error",
      });
    });

  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          // width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${DRAWER_WIDTH}px` },
          backgroundColor: theme.palette.primary.main,
        }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: user ? { sm: "none" } : { xs: "none" } }}
          >
            <MenuIcon />
          </IconButton>

          <Button
            href={
              router.route !== "/" && router.route !== "/dashboard" ? "/" : ""
            }
          >
            <Image src="/logo_light.png" height={50} width={100} />
          </Button>

          {showToolbarRightBox ? (
            user ? (
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <ToolBarUserInfo />

                <Button sx={{ color: "white" }} onClick={onLogoutClick}>
                  Logout
                </Button>
              </Box>
            ) : (
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Button
                  sx={{ color: "white" }}
                  href={router.route !== "/auth/sign-in" ? "/auth/sign-in" : ""}
                >
                  Sign In
                </Button>

                <Typography>|</Typography>

                <Button
                  sx={{ color: "white" }}
                  href={router.route !== "/auth/sign-up" ? "/auth/sign-up" : ""}
                >
                  Sign Up
                </Button>
              </Box>
            )
          ) : (
            <Box />
          )}
        </Toolbar>
      </AppBar>

      {user ? (
        <CustomDrawer
          handleDrawerToggle={() => handleDrawerToggle()}
          mobileOpen={mobileOpen}
        />
      ) : (
        <Box />
      )}

      <Box
        component="main"
        sx={{
          p: 3,
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
};

export default GlobalLayout;
