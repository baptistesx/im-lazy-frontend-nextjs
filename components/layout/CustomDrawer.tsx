import { DRAWER_WIDTH } from "@components/layout/utils/constants";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import GroupIcon from "@mui/icons-material/Group";
import HomeIcon from "@mui/icons-material/Home";
import { Box, CircularProgress, Collapse, Toolbar } from "@mui/material/";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { useAuth } from "@providers/AuthProvider";
import Link from "next/link";
import { useRouter } from "next/router";
import en from "public/locales/en/en";
import fr from "public/locales/fr/fr";
import { ReactElement, useState } from "react";

type DrawerItem = {
	route: string;
	icon: ReactElement;
	title: string;
	children?: DrawerItem[];
};

const CustomDrawerItem = ({
	element,
	paddingLeft,
}: {
	element: DrawerItem;
	paddingLeft?: number;
}): ReactElement => {
	const router = useRouter();

	const isInSubMenu =
		element.children !== undefined &&
		element.children.find((child) => child.route === router.route) !==
			undefined;

	const [open, setOpen] = useState(isInSubMenu);

	const toggleList = (): void => {
		setOpen(!open);
	};

	return (
		<>
			<Link key={element.title} href={element.route} passHref>
				<ListItem
					sx={{ pl: paddingLeft !== undefined ? paddingLeft : 2 }}
					button
					selected={router.pathname === element.route}
					onClick={toggleList}
				>
					<ListItemIcon>{element.icon}</ListItemIcon>
					<ListItemText primary={element.title} />
					{element.children === undefined ? (
						<Box />
					) : open ? (
						<ExpandLess />
					) : (
						<ExpandMore />
					)}
				</ListItem>
			</Link>
			{element.children === undefined ? (
				<Box />
			) : (
				<Collapse in={open} timeout="auto" unmountOnExit>
					<List component="div" disablePadding>
						{element.children.map((element) => (
							<Box key={element.title}>
								<CustomDrawerItem
									element={element}
									paddingLeft={paddingLeft !== undefined ? paddingLeft + 4 : 4}
								/>
							</Box>
						))}
					</List>
				</Collapse>
			)}
		</>
	);
};

const CustomDrawer = ({
	handleDrawerToggle,
	mobileOpen,
}: {
	handleDrawerToggle: () => void;
	mobileOpen: boolean;
}): ReactElement => {
	const auth = useAuth();

	const router = useRouter();
	const { locale } = router;
	const t = locale === "en" ? en : fr;

	const drawerItems: DrawerItem[] = [
		{ route: "/dashboard", icon: <HomeIcon />, title: t.dashboard.title },
	];

	if (auth?.value.user && auth.isAdmin(auth?.value.user)) {
		drawerItems.push({
			route: "/users",
			icon: <GroupIcon />,
			title: t.common.users,
		});
	}

	const drawer = (
		<div>
			<Toolbar />

			<Box sx={{ overflow: "auto" }}>
				<List component="nav">
					{drawerItems.map((element: DrawerItem) => (
						<CustomDrawerItem key={element.title} element={element} />
					))}
				</List>
			</Box>
		</div>
	);

	return auth?.value.user !== null && auth?.value.user !== undefined ? (
		<Box
			component="nav"
			sx={{ width: { sm: DRAWER_WIDTH }, flexShrink: { sm: 0 } }}
			aria-label="mailbox folders"
		>
			<Drawer
				variant="temporary"
				open={mobileOpen}
				onClose={handleDrawerToggle}
				ModalProps={{
					keepMounted: true, // Better open performance on mobile.
				}}
				sx={{
					display: { xs: "block", sm: "none" },
					"& .MuiDrawer-paper": {
						boxSizing: "border-box",
						width: DRAWER_WIDTH,
					},
				}}
			>
				{drawer}
			</Drawer>

			<Drawer
				variant="permanent"
				sx={{
					display: { xs: "none", sm: "block" },
					"& .MuiDrawer-paper": {
						boxSizing: "border-box",
						width: DRAWER_WIDTH,
					},
				}}
				open
			>
				{auth?.value.status === "loading" ? <CircularProgress /> : drawer}
			</Drawer>
		</Box>
	) : (
		<Box />
	);
};

export default CustomDrawer;
