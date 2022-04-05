import MenuIcon from "@mui/icons-material/Menu";
import { IconButton } from "@mui/material";
import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material/";
import CssBaseline from "@mui/material/CssBaseline";
import { useAuth } from "@providers/AuthProvider";
import Image from "next/image";
import Link from "next/link";
import { ReactElement, ReactNode, useState } from "react";
import CustomDrawer, { DRAWER_WIDTH } from "./CustomDrawer";
import ToolBarMenu from "./ToolBarMenu";
import ToolBarUserInfo from "./ToolBarUserInfo";

const SignedInLayout = ({
	children,
	title,
}: {
	children: ReactNode;
	title: string;
}): ReactElement => {
	const auth = useAuth();

	const [mobileOpen, setMobileOpen] = useState(false);

	const handleDrawerToggle = (): void => setMobileOpen(!mobileOpen);

	return (
		<Box sx={{ display: "flex", height: "100%" }}>
			<CssBaseline />

			<AppBar
				position="fixed"
				sx={{
					zIndex: (theme) => theme.zIndex.drawer + 1,
					// width: { sm: `calc(100% - ${drawerWidth}px)` },
					ml: { sm: `${DRAWER_WIDTH}px` },
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
							display:
								auth?.value.user !== null && auth?.value.user !== undefined
									? { sm: "none" }
									: { xs: "none" },
						}}
					>
						<MenuIcon />
					</IconButton>

					<Link
						href={auth?.value.status === "connected" ? "/dashboard" : "/"}
						passHref
					>
						<Button>
							<Image alt="logo" src="/logo-light.png" height={50} width={100} />
						</Button>
					</Link>

					{auth?.value.status === "connected" ? (
						<Box sx={{ display: "flex", alignItems: "center" }}>
							<ToolBarUserInfo />

							<ToolBarMenu />
						</Box>
					) : (
						<Box />
					)}
				</Toolbar>
			</AppBar>

			{auth?.value.status === "connected" ? (
				<CustomDrawer
					handleDrawerToggle={(): void => handleDrawerToggle()}
					mobileOpen={mobileOpen}
				/>
			) : (
				<Box />
			)}

			<Box
				component="main"
				sx={{
					p: 3,
					backgroundColor: "background.default",
					color: "text.primary",
					flexGrow: 1,
					width: "100%",
				}}
			>
				<Toolbar />
				<Typography variant="h1" sx={{ m: 1 }}>
					{title}
				</Typography>
				{children}
			</Box>
		</Box>
	);
};

export default SignedInLayout;
