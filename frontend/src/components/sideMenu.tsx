import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { useNavigate } from "react-router-dom";
import Icon from "@mui/material/Icon";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";

const drawerWidth = 240;

const SideMenu = () => {
  const redirect = useNavigate();

  const menuItems = [
    {
      id: 4,
      text: "Agendamentos",
      icon: "calendar_month",
      path: "/schedule",
    },
    {
      id: 2,
      text: "Recursos",
      icon: "devices",
      path: "/resource",
    },
    {
      id: 3,
      text: "Turmas",
      icon: "group",
      path: "/classes",
    },
    {
      id: 5,
      text: "Usuários",
      icon: "account_circle",
      path: "/users",
    },
  ];

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    redirect("/login");
  };

  const drawer = (
    <span>
      <List style={{ marginTop: 15 }}>
        {menuItems.map(({ text, icon, path }, index) => (
          <ListItem sx={{ color: "white" }} key={index} disablePadding>
            <ListItemButton onClick={() => redirect(path as string)}>
              <ListItemIcon style={{ color: "#E8EAED" }}>
                <Icon>{icon}</Icon>
              </ListItemIcon>
              <ListItemText sx={{ marginLeft: -3 }}>{text}</ListItemText>
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <ListItemButton sx={{ color: "white" }} onClick={handleLogout}>
        <ListItemIcon style={{ color: "red" }}>
          <PowerSettingsNewIcon />
        </ListItemIcon>
        <ListItemText
          sx={{
            marginLeft: -3,
            color: "red",
          }}
        >
          Logout
        </ListItemText>
      </ListItemButton>
    </span>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              backgroundColor: "#03244B",
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
    </Box>
  );
};

export default SideMenu;
