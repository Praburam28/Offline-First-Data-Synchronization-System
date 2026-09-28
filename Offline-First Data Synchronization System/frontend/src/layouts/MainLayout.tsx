import {
  AppBar,
  Avatar,
  Box,
  Chip,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import SyncRoundedIcon from "@mui/icons-material/SyncRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import HistoryRoundedIcon from "@mui/icons-material/HistoryRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import CloudDoneRoundedIcon from "@mui/icons-material/CloudDoneRounded";
import CloudOffRoundedIcon from "@mui/icons-material/CloudOffRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";

import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

const drawerWidth = 250;

const menuItems = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: <DashboardRoundedIcon />,
  },
  {
    label: "Records",
    path: "/records",
    icon: <DescriptionRoundedIcon />,
  },
  {
    label: "Synchronization",
    path: "/sync-history",
    icon: <SyncRoundedIcon />,
  },
  {
    label: "Conflicts",
    path: "/conflicts",
    icon: <WarningAmberRoundedIcon />,
  },
  {
    label: "Sync History",
    path: "/sync-history",
    icon: <HistoryRoundedIcon />,
  },
  {
    label: "Profile",
    path: "/profile",
    icon: <PersonRoundedIcon />,
  },
];

export default function MainLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down("md"));

  const [mobileOpen, setMobileOpen] = useState(false);

  const online = navigator.onLine;

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("token");
    navigate("/login");
  };

  const drawer = (
    <Box
      sx={{
        height: "100%",
        background:
          "linear-gradient(180deg, #17143d 0%, #211957 45%, #31205f 100%)",
        color: "white",
      }}
    >
      <Box
        sx={{
          px: 3,
          py: 3,
          display: "flex",
          alignItems: "center",
          gap: 1.5,
        }}
      >
        <Avatar
          sx={{
            width: 42,
            height: 42,
            background:
              "linear-gradient(135deg, #7c4dff 0%, #00c6ff 100%)",
          }}
        >
          <SyncRoundedIcon />
        </Avatar>

        <Box>
          <Typography fontWeight={800} fontSize={16}>
            OfflineSync
          </Typography>

          <Typography
            variant="caption"
            sx={{ color: "rgba(255,255,255,.6)" }}
          >
            Data Synchronization
          </Typography>
        </Box>
      </Box>

      <Box sx={{ px: 2 }}>
        <Typography
          variant="caption"
          sx={{
            px: 2,
            color: "rgba(255,255,255,.45)",
            fontWeight: 700,
            letterSpacing: 1,
          }}
        >
          WORKSPACE
        </Typography>
      </Box>

      <List sx={{ px: 1.5, mt: 1 }}>
        {menuItems.map((item) => {
          const selected =
            location.pathname === item.path ||
            (item.path === "/dashboard" &&
              location.pathname === "/");

          return (
            <ListItemButton
              key={item.path}
              selected={selected}
              onClick={() => {
                navigate(item.path);
                setMobileOpen(false);
              }}
              sx={{
                borderRadius: 2.5,
                mb: 0.7,
                color: "rgba(255,255,255,.75)",
                "& .MuiListItemIcon-root": {
                  color: "inherit",
                  minWidth: 42,
                },
                "&.Mui-selected": {
                  color: "white",
                  background:
                    "linear-gradient(90deg, rgba(124,77,255,.9), rgba(0,198,255,.55))",
                  boxShadow: "0 8px 25px rgba(0,0,0,.18)",
                },
                "&.Mui-selected:hover": {
                  background:
                    "linear-gradient(90deg, rgba(124,77,255,.95), rgba(0,198,255,.6))",
                },
                "&:hover": {
                  backgroundColor: "rgba(255,255,255,.08)",
                  color: "white",
                },
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  fontSize: 14,
                  fontWeight: selected ? 700 : 500,
                }}
              />
            </ListItemButton>
          );
        })}
      </List>

      <Box sx={{ mt: "auto", p: 2 }}>
        <ListItemButton
          onClick={handleLogout}
          sx={{
            borderRadius: 2.5,
            color: "rgba(255,255,255,.7)",
            "&:hover": {
              backgroundColor: "rgba(255,255,255,.08)",
              color: "white",
            },
          }}
        >
          <ListItemIcon sx={{ color: "inherit", minWidth: 42 }}>
            <LogoutRoundedIcon />
          </ListItemIcon>

          <ListItemText primary="Logout" />
        </ListItemButton>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f5f7fb" }}>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          ml: { md: `${drawerWidth}px` },
          width: { md: `calc(100% - ${drawerWidth}px)` },
          bgcolor: "rgba(255,255,255,.9)",
          backdropFilter: "blur(15px)",
          borderBottom: "1px solid #e7e9f0",
          color: "#1b1d29",
        }}
      >
        <Toolbar sx={{ minHeight: 70 }}>
          {mobile && (
            <IconButton
              onClick={() => setMobileOpen(true)}
              sx={{ mr: 1 }}
            >
              <MenuRoundedIcon />
            </IconButton>
          )}

          <Box sx={{ flexGrow: 1 }}>
            <Typography fontWeight={800} fontSize={18}>
              {menuItems.find((x) => x.path === location.pathname)?.label ||
                "Dashboard"}
            </Typography>

            <Typography
              variant="caption"
              sx={{ color: "text.secondary" }}
            >
              Manage your offline-first workspace
            </Typography>
          </Box>

          <Chip
            size="small"
            icon={
              online ? (
                <CloudDoneRoundedIcon />
              ) : (
                <CloudOffRoundedIcon />
              )
            }
            label={online ? "Online" : "Offline"}
            sx={{
              fontWeight: 700,
              bgcolor: online ? "#e7f8ef" : "#fff1f0",
              color: online ? "#16834d" : "#d83b36",
              "& .MuiChip-icon": {
                color: "inherit",
              },
            }}
          />
        </Toolbar>
      </AppBar>

      {!mobile && (
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              border: 0,
            },
          }}
        >
          {drawer}
        </Drawer>
      )}

      {mobile && (
        <Drawer
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          sx={{
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              border: 0,
            },
          }}
        >
          {drawer}
        </Drawer>
      )}

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minWidth: 0,
          pt: "90px",
          px: { xs: 2, sm: 3, md: 4 },
          pb: 4,
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}