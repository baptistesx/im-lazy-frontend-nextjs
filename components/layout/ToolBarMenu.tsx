import { ExpandLess, ExpandMore } from "@mui/icons-material";
import Logout from "@mui/icons-material/Logout";
import Settings from "@mui/icons-material/Settings";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useAuthActions } from "@providers/AuthActionsProvider";
import Link from "next/link";
import { useRouter } from "next/router";
import en from "public/locales/en/en";
import fr from "public/locales/fr/fr";
import * as React from "react";
import { MouseEvent, ReactElement } from "react";

const ToolBarMenu = (): ReactElement => {
	const router = useRouter();
	const { locale } = router;
	const t = locale === "en" ? en : fr;

	const authActions = useAuthActions();

	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);

	const handleClick = (event: MouseEvent<HTMLElement>): void => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = (): void => {
		setAnchorEl(null);
	};

	const onLogoutClick = async (): Promise<void | undefined> =>
		authActions?.logout();

	return (
		<>
			<IconButton
				onClick={handleClick}
				size="small"
				sx={{ ml: 2 }}
				aria-controls={open ? "account-menu" : undefined}
				aria-haspopup="true"
				aria-expanded={open ? "true" : undefined}
			>
				<Avatar sx={{ width: 32, height: 32 }}>
					{open ? <ExpandLess /> : <ExpandMore />}
				</Avatar>
			</IconButton>

			<Menu
				anchorEl={anchorEl}
				id="account-menu"
				open={open}
				onClose={handleClose}
				onClick={handleClose}
				PaperProps={{
					elevation: 0,
					sx: {
						overflow: "visible",
						filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
						mt: 1.5,
						"& .MuiAvatar-root": {
							width: 32,
							height: 32,
							ml: -0.5,
							mr: 1,
						},
						"&:before": {
							content: '""',
							display: "block",
							position: "absolute",
							top: 0,
							right: 14,
							width: 10,
							height: 10,
							bgcolor: "background.paper",
							transform: "translateY(-50%) rotate(45deg)",
							zIndex: 0,
						},
					},
				}}
				transformOrigin={{ horizontal: "right", vertical: "top" }}
				anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
			>
				<Link href={"/profile"} passHref>
					<MenuItem>
						<Avatar /> {t.profile.title}
					</MenuItem>
				</Link>

				<Divider />

				<Link href="/settings" passHref>
					<MenuItem>
						<ListItemIcon>
							<Settings fontSize="small" />
						</ListItemIcon>
						{t.settings.title}
					</MenuItem>
				</Link>

				<MenuItem onClick={onLogoutClick}>
					<ListItemIcon>
						<Logout fontSize="small" />
					</ListItemIcon>
					{t.auth.logout}
				</MenuItem>
			</Menu>
		</>
	);
};

export default ToolBarMenu;
