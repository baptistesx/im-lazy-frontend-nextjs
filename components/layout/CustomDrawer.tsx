import AccountBoxIcon from "@mui/icons-material/AccountBox";
import GroupIcon from "@mui/icons-material/Group";
import HomeIcon from "@mui/icons-material/Home";
import { Box, CircularProgress, Toolbar } from "@mui/material/";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Link from "next/link";
import { useRouter } from "next/router";
import { useAuth } from "../../providers/AuthProvider";
import { DRAWER_WIDTH } from "../../utils/constants";
import { isAdmin } from '../../utils/functions';

const CustomDrawer = ({
  handleDrawerToggle,
  mobileOpen,
}: {
  handleDrawerToggle: any;
  mobileOpen: boolean;
}) => {
  const auth = useAuth();

  const router = useRouter();

  const drawerItems = [
    { route: "/dashboard", icon: <HomeIcon />, title: "Dashboard" },
    { route: "/profile", icon: <AccountBoxIcon />, title: "Profile" },
  ];

  if (auth?.user && isAdmin(auth?.user)) {
    drawerItems.push({
      route: "/users",
      icon: <GroupIcon />,
      title: "Users",
    });
  }

  const drawer = (
    <div>
      <Toolbar />

      <Box sx={{ overflow: "auto" }}>
        <List>
          {drawerItems.map((element) => (
            <Link href={element.route}>
              <ListItem
                button
                key={element.title}
                selected={router.pathname === element.route}
              >
                <ListItemIcon>{element.icon}</ListItemIcon>
                <ListItemText primary={element.title} />
              </ListItem>
            </Link>
          ))}
        </List>
      </Box>
    </div>
  );

  return auth?.user ? (
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
        {auth?.status === "loading" ? <CircularProgress /> : drawer}
      </Drawer>
    </Box>
  ) : (
    <Box />
  );
};

export default CustomDrawer;
