import { memo } from "react";
import { Outlet,Link } from "react-router-dom";
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
                <Link className='flex w-full items-center gap-3' to="/branches">
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
                </Link>
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton>
                <Link className='flex w-full items-center gap-3' to="/e-valuation-categories">
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
                </Link>
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton>
                <Link className='flex w-full items-center gap-3' to="/evaluations">
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
                </Link>
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton>
                <Link className='flex w-full items-center gap-3' to="/blogs">
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
                </Link>
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton>
                <Link className='flex w-full items-center gap-3' to="/instalment-plans">
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
                </Link>
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton>
                <Link className='flex w-full items-center gap-3' to="/pawn-tickets">
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
                </Link>
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton>
                <Link className='flex w-full items-center gap-3' to="/product-categories">
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
                </Link>
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton>
                <Link className='flex w-full items-center gap-3' to="/products">
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
                </Link>
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton>
                <Link className='flex w-full items-center gap-3' to="/projects">
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
                </Link>
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton>
                <Link className='flex w-full items-center gap-3' to="/roles">
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
                </Link>
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton>
                <Link className='flex w-full items-center gap-3' to="/stories">
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
                </Link>
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton>
                <Link className='flex w-full items-center gap-3' to="/users">
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
                </Link>
              </ListItemButton>
            </ListItem>
          </List>
        </Drawer>
        <Box component='main' sx={{ flexGrow: 1, padding: "5rem 3rem", width: 100 + "%" }}>
          {children}
          <Outlet />
        </Box>
      </Box>
    </>
  );
}

const DefaultLayout = memo(DefaultLayoutInner);

export default DefaultLayout;


