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
import useUser from "../../hooks/useUser";
import useSnackbars from "../../hooks/useSnackbars";
import Image from "next/image";
import Link from "next/link";

const GlobalLayout = ({ children }: { children: React.ReactNode }) => {
  const theme: Theme = useTheme();

  const router = useRouter();

  const { user, loggedIn } = useUser();

  const snackbarsService = useSnackbars();

  const onLogoutClick = async () =>
    await signOut(() => {
      console.log("pusshing home");
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

          <Link href={loggedIn ? "/dashboard" : "/"}>
            <Button>
              <Image src="/logo_light.png" height={50} width={100} />
            </Button>
          </Link>

          {loggedIn ? (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <ToolBarUserInfo />

              <Button sx={{ color: "white" }} onClick={onLogoutClick}>
                Logout
              </Button>
            </Box>
          ) : (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Link href="/auth/sign-in">
                <Button sx={{ color: "white" }}>Sign In</Button>
              </Link>

              <Typography>|</Typography>

              <Link href="/auth/sign-up">
                <Button sx={{ color: "white" }}>Sign Up</Button>
              </Link>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      {loggedIn ? (
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
