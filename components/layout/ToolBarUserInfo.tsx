import { Box, IconButton, Tooltip, Typography } from "@mui/material/";
import React from "react";
import useUser from "../../hooks/useUser";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import { capitalizeFirstLetter } from "../../utils/functions";

function ToolBarUserInfo() {
  const { user } = useUser();

  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      {user?.isAdmin ? (
        <Tooltip title="Admin">
          <IconButton>
            <AdminPanelSettingsIcon sx={{ color: "white" }} />
          </IconButton>
        </Tooltip>
      ) : (
        <Box />
      )}
      {user?.isPremium ? (
        <Tooltip title="Premium">
          <IconButton>
            <WorkspacePremiumIcon sx={{ color: "white" }} />
          </IconButton>
        </Tooltip>
      ) : (
        <Box />
      )}
      <Typography
        sx={{
          display: { xs: "none", md: "block" },
        }}
      >
        {`${capitalizeFirstLetter(user?.name)} |`}
      </Typography>
    </Box>
  );
}

export default ToolBarUserInfo;
