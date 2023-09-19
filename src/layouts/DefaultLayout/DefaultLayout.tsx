import { memo, useState } from "react";
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
// import WebStoriesIcon from "@mui/icons-material/WebStories";
// import ArticleIcon from "@mui/icons-material/Article";
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
  children?: React.ReactNode;
}

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  zIndex: 999,
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
  ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ".MuiDrawer-paper":{
    borderRight: "1px solid rgb(242, 244, 247)",
    scrollbarWidth: "thin",
    scrollbarColor: "#ccc #f0f0f0",
    "&::-webkit-scrollbar": {
      width: "4px",
    },
    "&::-webkit-scrollbar-thumb": {
      background: "#ccc",
      borderRadius: "1rem",
    },
    "&::-webkit-scrollbar-thumb:hover": {
      background: "#888",
    },
    "&::-webkit-scrollbar-track": {
      background: "#f0f0f0",
    },
  },
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
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 900);
  const open = useAppStore((state) => state.dopen);
  const updateOpen = useAppStore((state) => state.updateOpen);
  const location = useLocation();
  window.addEventListener("resize", () => {
    setIsSmallScreen(window.innerWidth < 900);
  });

  const handleLinkClick = () => {

    if (isSmallScreen) {
      updateOpen(false);
    }
  };
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
              <Link className={`flex w-full items-center gap-3 link ${location.pathname === "/branches" ? "link-active" : ""}`} to="/branches" onClick={handleLinkClick}>
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
                  <ListItemText sx={{ opacity: open ? 1 : 0, marginLeft: "6px" }} primary='Branches' />
                </ListItemButton>
              </Link>
            </ListItem>
            <ListItem disablePadding>
              <Link className={`flex w-full items-center gap-3 link ${location.pathname === "/e-valuation-categories" ? "link-active" : ""}`} to="/e-valuation-categories" onClick={handleLinkClick}>
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
                  <ListItemText sx={{ opacity: open ? 1 : 0, marginLeft: "6px" }} primary='E Valuation Categories' />
                </ListItemButton>
              </Link>
            </ListItem>
            <ListItem disablePadding>
              <Link className={`flex w-full items-center gap-3 link ${location.pathname.startsWith("/evaluations") ? "link-active" : ""}`} to="/evaluations" onClick={handleLinkClick}>
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
                  <ListItemText sx={{ opacity: open ? 1 : 0, marginLeft: "6px" }} primary='E Valuation' />
                </ListItemButton>
              </Link>
            </ListItem>
            {/* <ListItem disablePadding>
              <Link className={`flex w-full items-center gap-3 link ${location.pathname.startsWith("/blog") ? "link-active" : ""}`} to="/blogs" onClick={handleLinkClick}>
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
                  <ListItemText sx={{ opacity: open ? 1 : 0, marginLeft: "6px" }} primary='Blogs' />
                </ListItemButton>
              </Link>
            </ListItem> */}
            {/* <ListItem disablePadding>
              <Link className={`flex w-full items-center gap-3 link ${location.pathname.startsWith("/instalment-plans") ? "link-active" : ""}`} to="/instalment-plans" onClick={handleLinkClick}>
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
                  <ListItemText sx={{ opacity: open ? 1 : 0, marginLeft: "6px" }} primary='Instalment Plans' />
                </ListItemButton>
              </Link>
            </ListItem> */}
            <ListItem disablePadding>
              <Link className={`flex w-full items-center gap-3 link ${location.pathname.startsWith("/pawn-tickets") ? "link-active" : ""}`} to="/pawn-tickets" onClick={handleLinkClick}>
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
                  <ListItemText sx={{ opacity: open ? 1 : 0, marginLeft: "6px" }} primary='Pawn Tickets' />
                </ListItemButton>
              </Link>
            </ListItem>
            <ListItem disablePadding>
              <Link className={`flex w-full items-center gap-3 link ${location.pathname === "/product-categories" ? "link-active" : ""}`} to="/product-categories" onClick={handleLinkClick}>
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
                  <ListItemText sx={{ opacity: open ? 1 : 0, marginLeft: "6px" }} primary='Product Categories' />
                </ListItemButton>
              </Link>
            </ListItem>
            {/* <ListItem disablePadding>
              <Link className={`flex w-full items-center gap-3 link ${location.pathname === "/products" ? "link-active" : ""}`} to="/products" onClick={handleLinkClick}>
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
                  <ListItemText sx={{ opacity: open ? 1 : 0, marginLeft: "6px" }} primary='Products' />
                </ListItemButton>
              </Link>
            </ListItem> */}
            {/* <ListItem disablePadding>
              <Link className={`flex w-full items-center gap-3 link ${location.pathname === "/projects" ? "link-active" : ""}`} to="/projects" onClick={handleLinkClick}>
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
                  <ListItemText sx={{ opacity: open ? 1 : 0, marginLeft: "6px" }} primary='Projects' />
                </ListItemButton>
              </Link>
            </ListItem> */}
            <ListItem disablePadding>
              <Link className={`flex w-full items-center gap-3 link ${location.pathname === "/roles" ? "link-active" : ""}`} to="/roles" onClick={handleLinkClick}>
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
                  <ListItemText sx={{ opacity: open ? 1 : 0, marginLeft: "6px" }} primary='Roles' />
                </ListItemButton>
              </Link>
            </ListItem>
            {/* <ListItem disablePadding>
              <Link className={`flex w-full items-center gap-3 link ${location.pathname === "/stories" ? "link-active" : ""}`} to="/stories" onClick={handleLinkClick}>
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
                  <ListItemText sx={{ opacity: open ? 1 : 0, marginLeft: "6px" }} primary='Stories' />
                </ListItemButton>
              </Link>
            </ListItem> */}
            <ListItem disablePadding>
              <Link className={`flex w-full items-center gap-3 link ${location.pathname.startsWith("/users") ? "link-active" : ""}`} to="/users" onClick={handleLinkClick}>
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
                  <ListItemText sx={{ opacity: open ? 1 : 0, marginLeft: "6px" }} primary='Users' />
                </ListItemButton>
              </Link>
            </ListItem>
          </List>
        </Drawer>
        <Box component='main' sx={{ flexGrow: 1, padding: "5rem", width: "calc(100% - 240px)", "@media (max-width: 900px)":{ padding: "5rem 2rem" } }}>
          {children}
          <Outlet />
        </Box>
      </Box>
    </>
  );
}

const DefaultLayout = memo(DefaultLayoutInner);

export default DefaultLayout;


