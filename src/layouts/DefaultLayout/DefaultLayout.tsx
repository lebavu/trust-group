import { ReactNode } from "react";
import PropTypes from "prop-types";
import { styled, useTheme } from "@mui/material/styles";
import { type Theme } from "@mui/material";
import { type CSSObject } from "@emotion/react";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ArchiveIcon from "@mui/icons-material/Archive";
import { NavLink } from "react-router-dom";
import config from "@/config";
import Navbar from "src/components/Navbar";
import { useAppStore } from "@/appStore";

const drawerWidth = 240;

DefaultLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: "0",
  [theme.breakpoints.up("md")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  [theme.breakpoints.down("md")]: {
    position: "fixed",
    top: 0,
    left: 0,
    background: "#fff",
    zIndex: 99,
  },
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));
export default function DefaultLayout({ children }: { children: ReactNode }) {
  const theme = useTheme();
  // const navigate = useNavigate();
  const open = useAppStore((state) => state.dopen);
  return (
    <>
      <Navbar></Navbar>
      <Box height={50} />
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <Drawer variant='permanent' open={open}>
          <DrawerHeader>
            <IconButton
              sx={{
                "&:hover,&:focus": {
                  // backgroundColor: "none!important",
                  outline: "none",
                },
              }}
            >
              {theme.direction === "rtl" ? <ChevronRightIcon /> : <ChevronLeftIcon />}
            </IconButton>
          </DrawerHeader>
          <Divider />

          <List>
            <ListItem disablePadding>
              <ListItemButton>
                <NavLink className='flex w-full items-center gap-3' to={config.routes.Blogs}>
                  <ListItemIcon
                    sx={{
                      flexShrink: 0,
                      minWidth: "3rem",
                      justifyContent: "center",
                    }}
                  >
                    <ArchiveIcon />
                  </ListItemIcon>
                  <ListItemText sx={{ opacity: open ? 1 : 0 }} primary='Blogs' />
                </NavLink>
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton>
                <NavLink className='flex w-full items-center gap-3' to={config.routes.Branches}>
                  <ListItemIcon
                    sx={{
                      flexShrink: 0,
                      minWidth: "3rem",
                      justifyContent: "center",
                    }}
                  >
                    <ArchiveIcon />
                  </ListItemIcon>
                  <ListItemText sx={{ opacity: open ? 1 : 0 }} primary='Branches' />
                </NavLink>
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton>
                <NavLink className='flex w-full items-center gap-3' to={config.routes.EValuationCategories}>
                  <ListItemIcon
                    sx={{
                      flexShrink: 0,
                      minWidth: "3rem",
                      justifyContent: "center",
                    }}
                  >
                    <ArchiveIcon />
                  </ListItemIcon>
                  <ListItemText sx={{ opacity: open ? 1 : 0 }} primary='E Valuation Categories' />
                </NavLink>
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton>
                <NavLink className='flex w-full items-center gap-3' to={config.routes.EValuations}>
                  <ListItemIcon
                    sx={{
                      flexShrink: 0,
                      minWidth: "3rem",
                      justifyContent: "center",
                    }}
                  >
                    <ArchiveIcon />
                  </ListItemIcon>
                  <ListItemText sx={{ opacity: open ? 1 : 0 }} primary='E Valuation' />
                </NavLink>
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton>
                <NavLink className='flex w-full items-center gap-3' to={config.routes.InstalmentPlans}>
                  <ListItemIcon
                    sx={{
                      flexShrink: 0,
                      minWidth: "3rem",
                      justifyContent: "center",
                    }}
                  >
                    <ArchiveIcon />
                  </ListItemIcon>
                  <ListItemText sx={{ opacity: open ? 1 : 0 }} primary='Instalment Plans' />
                </NavLink>
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton>
                <NavLink className='flex w-full items-center gap-3' to={config.routes.PawnTickets}>
                  <ListItemIcon
                    sx={{
                      flexShrink: 0,
                      minWidth: "3rem",
                      justifyContent: "center",
                    }}
                  >
                    <ArchiveIcon />
                  </ListItemIcon>
                  <ListItemText sx={{ opacity: open ? 1 : 0 }} primary='Pawn Tickets' />
                </NavLink>
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton>
                <NavLink className='flex w-full items-center gap-3' to={config.routes.ProductCategories}>
                  <ListItemIcon
                    sx={{
                      flexShrink: 0,
                      minWidth: "3rem",
                      justifyContent: "center",
                    }}
                  >
                    <ArchiveIcon />
                  </ListItemIcon>
                  <ListItemText sx={{ opacity: open ? 1 : 0 }} primary='Product Categories' />
                </NavLink>
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton>
                <NavLink className='flex w-full items-center gap-3' to={config.routes.Products}>
                  <ListItemIcon
                    sx={{
                      flexShrink: 0,
                      minWidth: "3rem",
                      justifyContent: "center",
                    }}
                  >
                    <ArchiveIcon />
                  </ListItemIcon>
                  <ListItemText sx={{ opacity: open ? 1 : 0 }} primary='Products' />
                </NavLink>
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton>
                <NavLink className='flex w-full items-center gap-3' to={config.routes.Projects}>
                  <ListItemIcon
                    sx={{
                      flexShrink: 0,
                      minWidth: "3rem",
                      justifyContent: "center",
                    }}
                  >
                    <ArchiveIcon />
                  </ListItemIcon>
                  <ListItemText sx={{ opacity: open ? 1 : 0 }} primary='Projects' />
                </NavLink>
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton>
                <NavLink className='flex w-full items-center gap-3' to={config.routes.Roles}>
                  <ListItemIcon
                    sx={{
                      flexShrink: 0,
                      minWidth: "3rem",
                      justifyContent: "center",
                    }}
                  >
                    <ArchiveIcon />
                  </ListItemIcon>
                  <ListItemText sx={{ opacity: open ? 1 : 0 }} primary='Roles' />
                </NavLink>
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton>
                <NavLink className='flex w-full items-center gap-3' to={config.routes.Stories}>
                  <ListItemIcon
                    sx={{
                      flexShrink: 0,
                      minWidth: "3rem",
                      justifyContent: "center",
                    }}
                  >
                    <ArchiveIcon />
                  </ListItemIcon>
                  <ListItemText sx={{ opacity: open ? 1 : 0 }} primary='Stories' />
                </NavLink>
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton>
                <NavLink className='flex w-full items-center gap-3' to={config.routes.Users}>
                  <ListItemIcon
                    sx={{
                      flexShrink: 0,
                      minWidth: "3rem",
                      justifyContent: "center",
                    }}
                  >
                    <ArchiveIcon />
                  </ListItemIcon>
                  <ListItemText sx={{ opacity: open ? 1 : 0 }} primary='Users' />
                </NavLink>
              </ListItemButton>
            </ListItem>
          </List>
        </Drawer>
        <Box component='main' sx={{ flexGrow: 1, padding: "5rem 3rem", width: 100 + "%" }}>
          {children}
        </Box>
      </Box>
    </>
  );
}

DefaultLayout.propTypes = {
  children: PropTypes.node.isRequired,
};
