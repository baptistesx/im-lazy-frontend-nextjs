import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import { Box, IconButton, Tooltip, Typography } from "@mui/material/";
import { useAuth } from "@providers/AuthProvider";

function ToolBarUserInfo() {
	const auth = useAuth();

	return (
		<Box sx={{ display: { xs: "none", sm: "flex" }, alignItems: "center" }}>
			{auth?.isAdmin(auth?.user) ? (
				<Tooltip title="Admin">
					<IconButton>
						<AdminPanelSettingsIcon sx={{ color: "white" }} />
					</IconButton>
				</Tooltip>
			) : (
				<Box />
			)}
			{auth?.isPremium(auth?.user) ? (
				<Tooltip title="Premium">
					<IconButton>
						<WorkspacePremiumIcon sx={{ color: "white" }} />
					</IconButton>
				</Tooltip>
			) : (
				<Box />
			)}
			<Typography
				sx={{ textTransform: "capitalize" }}
			>{`${auth?.user?.name} |`}</Typography>
		</Box>
	);
}

export default ToolBarUserInfo;
