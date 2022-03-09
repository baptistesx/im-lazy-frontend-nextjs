import AccountBoxIcon from "@mui/icons-material/AccountBox";
import GroupIcon from "@mui/icons-material/Group";
import HomeIcon from "@mui/icons-material/Home";
import { Box, Toolbar, CircularProgress } from "@mui/material/";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import React from "react";
import useUser from "../../hooks/useUser";
import { DRAWER_WIDTH } from "../../utils/constants";
import { useRouter } from "next/router";

const CustomDrawer = ({
  handleDrawerToggle,
  mobileOpen,
  window,
}: {
  handleDrawerToggle: any;
  mobileOpen: boolean;
  window: any;
}) => {
  const { user, loading } = useUser();

  const router = useRouter();

  const container =
    window !== undefined ? () => window().document.body : undefined;

  const drawerItems = [
    { route: "/dashboard", icon: <HomeIcon />, title: "Home" },
    { route: "/profile", icon: <AccountBoxIcon />, title: "Profile" },
  ];

  if (user && user?.isAdmin) {
    drawerItems.push({
      route: "/users",
      icon: <GroupIcon />,
      title: "Users",
    });
  }

  const handleNavigate = (path: string) => {
    router.push(path);
  };

  const drawer = (
    <div>
      <Toolbar />

      <Box sx={{ overflow: "auto" }}>
        <List>
          {drawerItems.map((element) => (
            <ListItem
              button
              key={element.title}
              component="a"
              onClick={() => handleNavigate(element.route)}
            >
              <ListItemIcon>{element.icon}</ListItemIcon>
              <ListItemText primary={element.title} />
            </ListItem>
          ))}
        </List>
      </Box>
    </div>
  );

  return user ? (
    <Box
      component="nav"
      sx={{ width: { sm: DRAWER_WIDTH }, flexShrink: { sm: 0 } }}
      aria-label="mailbox folders"
    >
      <Drawer
        container={container}
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
        {loading ? <CircularProgress /> : drawer}
      </Drawer>
    </Box>
  ) : (
    <Box />
  );
};

export default CustomDrawer;
