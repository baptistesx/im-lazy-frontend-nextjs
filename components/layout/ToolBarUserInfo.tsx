import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import { Box, IconButton, Tooltip, Typography } from "@mui/material/";
import { useAuth } from "../../providers/AuthProvider";
import { capitalizeFirstLetter } from "../../utils/functions";

function ToolBarUserInfo() {
  const auth = useAuth();

  return (
    <Box sx={{ display: { xs: "none", sm: "flex" }, alignItems: "center" }}>
      {auth?.user?.isAdmin ? (
        <Tooltip title="Admin">
          <IconButton>
            <AdminPanelSettingsIcon sx={{ color: "white" }} />
          </IconButton>
        </Tooltip>
      ) : (
        <Box />
      )}
      {auth?.user?.isPremium ? (
        <Tooltip title="Premium">
          <IconButton>
            <WorkspacePremiumIcon sx={{ color: "white" }} />
          </IconButton>
        </Tooltip>
      ) : (
        <Box />
      )}
      <Typography>{`${capitalizeFirstLetter(auth?.user?.name)} |`}</Typography>
    </Box>
  );
}

export default ToolBarUserInfo;
