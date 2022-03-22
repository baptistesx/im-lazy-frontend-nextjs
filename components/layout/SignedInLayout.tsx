import { useTheme } from "@emotion/react";
import MenuIcon from "@mui/icons-material/Menu";
import { IconButton } from "@mui/material";
import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material/";
import CssBaseline from "@mui/material/CssBaseline";
import { Theme } from "@mui/material/styles";
import { useAuth } from "@providers/AuthProvider";
import { DRAWER_WIDTH } from "@utils/constants";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import CustomDrawer from "./CustomDrawer";
import ToolBarUserInfo from "./ToolBarUserInfo";

const SignedInLayout = ({ children }: { children: React.ReactNode }) => {
	const theme: Theme = useTheme();

	const auth = useAuth();

	const onLogoutClick = async () => auth?.logout();

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
						sx={{
							mr: 2,
							display: auth?.user ? { sm: "none" } : { xs: "none" },
						}}
					>
						<MenuIcon />
					</IconButton>

					<Link
						href={auth?.status === "connected" ? "/dashboard" : "/"}
						passHref
					>
						<Button>
							<Image
								alt="logo-light"
								src="/logo-light.png"
								height={50}
								width={100}
							/>
						</Button>
					</Link>

					{auth?.status === "connected" ? (
						<Box sx={{ display: "flex", alignItems: "center" }}>
							<ToolBarUserInfo />

							<Button sx={{ color: "white" }} onClick={onLogoutClick}>
								Logout
							</Button>
						</Box>
					) : (
						<Box sx={{ display: "flex", alignItems: "center" }}>
							<Link href="/auth/sign-in" passHref>
								<Button sx={{ color: "white" }}>Sign In</Button>
							</Link>

							<Typography>|</Typography>

							<Link href="/auth/sign-up" passHref>
								<Button sx={{ color: "white" }}>Sign Up</Button>
							</Link>
						</Box>
					)}
				</Toolbar>
			</AppBar>

			{auth?.status === "connected" ? (
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

export default SignedInLayout;
