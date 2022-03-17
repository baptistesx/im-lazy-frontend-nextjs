import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import { Box, IconButton, Tooltip, Typography } from "@mui/material/";
import { useAuth } from "../../providers/AuthProvider";
import { capitalizeFirstLetter, isAdmin, isPremium } from '../../utils/functions';

function ToolBarUserInfo() {
  const auth = useAuth();

  return (
    <Box sx={{ display: { xs: "none", sm: "flex" }, alignItems: "center" }}>
      {isAdmin(auth?.user) ? (
        <Tooltip title="Admin">
          <IconButton>
            <AdminPanelSettingsIcon sx={{ color: "white" }} />
          </IconButton>
        </Tooltip>
      ) : (
        <Box />
      )}
      {isPremium(auth?.user) ? (
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
