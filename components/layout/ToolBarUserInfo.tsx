import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import { Box, IconButton, Tooltip } from "@mui/material/";
import { useAuth } from "@providers/AuthProvider";
import { ReactElement } from "react";

const ToolBarUserInfo = (): ReactElement => {
	const auth = useAuth();

	return (
		<Box sx={{ display: { xs: "none", sm: "flex" }, alignItems: "center" }}>
			{auth?.isAdmin(auth?.value.user) ? (
				<Tooltip title="Admin">
					<IconButton>
						<AdminPanelSettingsIcon />
					</IconButton>
				</Tooltip>
			) : (
				<Box />
			)}

			{auth?.isPremium(auth?.value.user) ? (
				<Tooltip title="Premium">
					<IconButton>
						<WorkspacePremiumIcon />
					</IconButton>
				</Tooltip>
			) : (
				<Box />
			)}
		</Box>
	);
};

export default ToolBarUserInfo;
