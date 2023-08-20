import { memo } from "react";
import { Outlet,Link, useLocation } from "react-router-dom";
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
import LinkIcon from "@mui/icons-material/Link";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import WebStoriesIcon from "@mui/icons-material/WebStories";
import ArticleIcon from "@mui/icons-material/Article";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import CategoryIcon from "@mui/icons-material/Category";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ArchiveIcon from "@mui/icons-material/Archive";
import Navbar from "src/components/Navbar";
import { useAppStore } from "@/appStore";

const drawerWidth = 240;

interface Props {
  children?: React.ReactNode
}

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
    width: 0,
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
function DefaultLayoutInner({ children }: Props) {
  const theme = useTheme();
  // const navigate = useNavigate();
  const open = useAppStore((state) => state.dopen);
  const location = useLocation();
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
              <Link className={`flex w-full items-center gap-3 link ${location.pathname === "/branches" ? "link-active" : ""}`} to="/branches">
                <ListItemButton className="menu-link">
                  <ListItemIcon
                    sx={{
                      flexShrink: 0,
                      minWidth: "3rem",
                      justifyContent: "center",
                    }}
                  >
                    <LinkIcon />
                  </ListItemIcon>
                  <ListItemText sx={{ opacity: open ? 1 : 0 }} primary='Branches' />
                </ListItemButton>
              </Link>
            </ListItem>
            <ListItem disablePadding>
              <Link className={`flex w-full items-center gap-3 link ${location.pathname === "/e-valuation-categories" ? "link-active" : ""}`} to="/e-valuation-categories">
                <ListItemButton className="menu-link">
                  <ListItemIcon
                    sx={{
                      flexShrink: 0,
                      minWidth: "3rem",
                      justifyContent: "center",
                    }}
                  >
                    <CategoryIcon />
                  </ListItemIcon>
                  <ListItemText sx={{ opacity: open ? 1 : 0 }} primary='E Valuation Categories' />
                </ListItemButton>
              </Link>
            </ListItem>
            <ListItem disablePadding>
              <Link className={`flex w-full items-center gap-3 link ${location.pathname === "/evaluations" ? "link-active" : ""}`} to="/evaluations">
                <ListItemButton className="menu-link">
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
                </ListItemButton>
              </Link>
            </ListItem>
            <ListItem disablePadding>
              <Link className={`flex w-full items-center gap-3 link ${location.pathname === "/blogs" ? "link-active" : ""}`} to="/blogs">
                <ListItemButton className="menu-link">
                  <ListItemIcon
                    sx={{
                      flexShrink: 0,
                      minWidth: "3rem",
                      justifyContent: "center",
                    }}
                  >
                    <ArticleIcon />
                  </ListItemIcon>
                  <ListItemText sx={{ opacity: open ? 1 : 0 }} primary='Blogs' />
                </ListItemButton>
              </Link>
            </ListItem>
            <ListItem disablePadding>
              <Link className={`flex w-full items-center gap-3 link ${location.pathname === "/instalment-plans" ? "link-active" : ""}`} to="/instalment-plans">
                <ListItemButton className="menu-link">
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
                </ListItemButton>
              </Link>
            </ListItem>
            <ListItem disablePadding>
              <Link className={`flex w-full items-center gap-3 link ${location.pathname === "/pawn-tickets" ? "link-active" : ""}`} to="/pawn-tickets">
                <ListItemButton className="menu-link">
                  <ListItemIcon
                    sx={{
                      flexShrink: 0,
                      minWidth: "3rem",
                      justifyContent: "center",
                    }}
                  >
                    <ConfirmationNumberIcon />
                  </ListItemIcon>
                  <ListItemText sx={{ opacity: open ? 1 : 0 }} primary='Pawn Tickets' />
                </ListItemButton>
              </Link>
            </ListItem>
            <ListItem disablePadding>
              <Link className={`flex w-full items-center gap-3 link ${location.pathname === "/product-categories" ? "link-active" : ""}`} to="/product-categories">
                <ListItemButton className="menu-link">
                  <ListItemIcon
                    sx={{
                      flexShrink: 0,
                      minWidth: "3rem",
                      justifyContent: "center",
                    }}
                  >
                    <CategoryIcon />
                  </ListItemIcon>
                  <ListItemText sx={{ opacity: open ? 1 : 0 }} primary='Product Categories' />
                </ListItemButton>
              </Link>
            </ListItem>
            <ListItem disablePadding>
              <Link className={`flex w-full items-center gap-3 link ${location.pathname === "/products" ? "link-active" : ""}`} to="/products">
                <ListItemButton className="menu-link">
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
                </ListItemButton>
              </Link>
            </ListItem>
            <ListItem disablePadding>
              <Link className={`flex w-full items-center gap-3 link ${location.pathname === "/projects" ? "link-active" : ""}`} to="/projects">
                <ListItemButton className="menu-link">
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
                </ListItemButton>
              </Link>
            </ListItem>
            <ListItem disablePadding>
              <Link className={`flex w-full items-center gap-3 link ${location.pathname === "/roles" ? "link-active" : ""}`} to="/roles">
                <ListItemButton className="menu-link">
                  <ListItemIcon
                    sx={{
                      flexShrink: 0,
                      minWidth: "3rem",
                      justifyContent: "center",
                    }}
                  >
                    <SupervisorAccountIcon />
                  </ListItemIcon>
                  <ListItemText sx={{ opacity: open ? 1 : 0 }} primary='Roles' />
                </ListItemButton>
              </Link>
            </ListItem>
            <ListItem disablePadding>
              <Link className={`flex w-full items-center gap-3 link ${location.pathname === "/stories" ? "link-active" : ""}`} to="/stories">
                <ListItemButton className="menu-link">
                  <ListItemIcon
                    sx={{
                      flexShrink: 0,
                      minWidth: "3rem",
                      justifyContent: "center",
                    }}
                  >
                    <WebStoriesIcon />
                  </ListItemIcon>
                  <ListItemText sx={{ opacity: open ? 1 : 0 }} primary='Stories' />
                </ListItemButton>
              </Link>
            </ListItem>
            <ListItem disablePadding>
              <Link className={`flex w-full items-center gap-3 link ${location.pathname === "/users" ? "link-active" : ""}`} to="/users">
                <ListItemButton className="menu-link">
                  <ListItemIcon
                    sx={{
                      flexShrink: 0,
                      minWidth: "3rem",
                      justifyContent: "center",
                    }}
                  >
                    <AccountBoxIcon />
                  </ListItemIcon>
                  <ListItemText sx={{ opacity: open ? 1 : 0 }} primary='Users' />
                </ListItemButton>
              </Link>
            </ListItem>
          </List>
        </Drawer>
        <Box component='main' sx={{ flexGrow: 1, padding: "5rem 3rem", width: "calc(100% - 240px)" }}>
          {children}
          <Outlet />
        </Box>
      </Box>
    </>
  );
}

const DefaultLayout = memo(DefaultLayoutInner);

export default DefaultLayout;


