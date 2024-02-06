import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import { Box, IconButton, Tooltip, Typography } from "@mui/material/";
import { useAuth } from "@providers/AuthProvider";
import { ReactElement } from "react";

const ToolBarUserInfo = (): ReactElement => {
	const auth = useAuth();

	return (
		<Box sx={{ display: { xs: "none", sm: "flex" }, alignItems: "center" }}>
			<Typography
				sx={{
					display: { xs: "none", sm: "flex" },
					textTransform: "capitalize",
				}}
			>{`${auth?.value.user?.name}`}</Typography>

			{auth?.isAdmin(auth?.value.user) ? (
				<Tooltip title="Admin">
					<IconButton>
						<AdminPanelSettingsIcon sx={{ color: "white" }} />
					</IconButton>
				</Tooltip>
			) : auth?.isPremium(auth?.value.user) ? (
				<Tooltip title="Premium">
					<IconButton>
						<WorkspacePremiumIcon sx={{ color: "white" }} />
					</IconButton>
				</Tooltip>
			) : (
				<Box />
			)}
		</Box>
	);
};

export default ToolBarUserInfo;
