import { setUserId, setUserToken, setUserType } from "../../slices/userSlice"
import { DrawerMenuItem } from "../../interfaces/drawerMenuItem"
import { useAppDispatch, useAppSelector } from "../../hooks"
import ListItemButton from "@mui/material/ListItemButton"
import { Outlet, useNavigate } from "react-router-dom"
import ListItemIcon from "@mui/material/ListItemIcon"
import ListItemText from "@mui/material/ListItemText"
import CssBaseline from "@mui/material/CssBaseline"
import { SESSION_TOKEN_KEY } from "../../services"
import Typography from "@mui/material/Typography"
import IconButton from "@mui/material/IconButton"
import UserService from "../../services/users"
import ListItem from "@mui/material/ListItem"
import { useEffect, useState } from "react"
import Toolbar from "@mui/material/Toolbar"
import Divider from "@mui/material/Divider"
import AppBar from "@mui/material/AppBar"
import Drawer from "@mui/material/Drawer"
import List from "@mui/material/List"
import Icon from "@mui/material/Icon"
import Box from "@mui/material/Box"

const drawerWidth = 240

const upperDrawerMenuItems: DrawerMenuItem[] = [
  {
    icon: "calendar_month_outline",
    text: "Agendamentos",
    location: "/schedule"
  }
]

const middleDrawerMenuItems: DrawerMenuItem[] = [
  {
    icon: "devices_outline",
    text: "Recursos",
    location: "/resource"
  },
  {
    icon: "school_outline",
    text: "Turmas",
    location: "/classes"
  },
  {
    icon: "group_outline",
    text: "Usuários",
    location: "/users"
  },
  {
    icon: "block_outline",
    text: "Bloqueios",
    location: "/blocks"
  }
]

const lowerDrawerMenuItems: DrawerMenuItem[] = [
  {
    icon: "logout_outline",
    text: "Deslogar",
    location: "/logoff"
  }
]

export default function MainLayout() {
  const [mobileOpen, setMobileOpen] = useState<boolean>(false)
  const [isClosing, setIsClosing] = useState<boolean>(false)
  const { type } = useAppSelector((state) => state.user)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    (async () => {
      const token = sessionStorage.getItem(SESSION_TOKEN_KEY)
      if (!token) {
        redirect("/login")
        return
      }

      const userService = new UserService(token)
      let user
      try {
        user = await userService.getOneByToken()
      } catch (err) {
        redirect('/logoff')
        return
      }

      dispatch(setUserId(user.id))
      dispatch(setUserToken(token))
      dispatch(setUserType(user.type))
    })()
  }, [])

  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false);
  };

  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen);
    }
  };

  const redirect = (location: string) => {
    navigate(location)
    setMobileOpen(false)
  }

  const drawer = (
    <div>
      <Toolbar />
      <Divider />
      <List>
        {upperDrawerMenuItems.map((item) => (
          <ListItem key={item.location} disablePadding>
            <ListItemButton onClick={() => redirect(item.location)}>
              <ListItemIcon>
                <Icon>{item.icon}</Icon>
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      {
        ['admin', 'owner'].includes(type) &&
        <>
          <Divider />
          <List>
            {middleDrawerMenuItems.map((item) => (
              <ListItem key={item.location} disablePadding>
                <ListItemButton onClick={() => redirect(item.location)}>
                  <ListItemIcon>
                    <Icon>{item.icon}</Icon>
                  </ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </>

      }
      <Divider />
      <List>
        {lowerDrawerMenuItems.map((item) => (
          <ListItem key={item.location} disablePadding>
            <ListItemButton onClick={() => redirect(item.location)}>
              <ListItemIcon>
                <Icon>{item.icon}</Icon>
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <Icon>menu_outline</Icon>
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            AgendamentosGW
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { lg: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onTransitionEnd={handleDrawerTransitionEnd}
          onClose={handleDrawerClose}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { sm: 'block', md: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, width: { md: `calc(100% - ${drawerWidth}px)` } }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  )
}