import * as React from "react";
import { styled, alpha } from "@mui/material/styles";
import MuiAppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import InputBase from "@mui/material/InputBase";
import Badge from "@mui/material/Badge";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MailIcon from "@mui/icons-material/Mail";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MoreIcon from "@mui/icons-material/MoreVert";
import { useAppStore } from "@/appStore";
import { NavLink , useNavigate } from "react-router-dom";
import config from "@/config";
import { toast } from "react-toastify";
// import { useState } from "react";
import { LoadingButton as _LoadingButton } from "@mui/lab";
import { useStateContext } from "@/context";
import { useMutation } from "react-query";
import { logoutUserFn } from "@/api/auth.api";

const LoadingButton = styled(_LoadingButton)`
  padding: 0.4rem;
  color: #222;
  font-weight: 500;

  &:hover {
    transform: translateY(-2px);
  }
`;

const AppBar = styled(
  MuiAppBar,
  {},
)(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
}));
const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));

interface MobileMenuProps {
  anchorEl: HTMLElement | null;
  mobileMoreAnchorEl: HTMLElement | null;
  handleMobileMenuClose: () => void;
  handleProfileMenuOpen: (event: React.MouseEvent<HTMLElement>) => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({
  mobileMoreAnchorEl,
  handleMobileMenuClose,
  handleProfileMenuOpen,
}) => {
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
  return (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id="primary-search-account-menu-mobile"
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem>
        <IconButton size="large" aria-label="show 4 new mails" color="inherit">
          <Badge badgeContent={4} color="error">
            <MailIcon />
          </Badge>
        </IconButton>
        <p>Messages</p>
      </MenuItem>
      <MenuItem>
        <IconButton size="large" aria-label="show 17 new notifications" color="inherit">
          <Badge badgeContent={17} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  );
};

export default function PrimarySearchAppBar() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState<null | HTMLElement>(null);
  const updateOpen = useAppStore((state) => state.updateOpen);
  const dopen = useAppStore((state) => state.dopen);
  const isMenuOpen = Boolean(anchorEl);
  const navigate = useNavigate();
  const stateContext = useStateContext();
  const user = stateContext.state.authUser;
  const { mutate: logoutUser, isLoading } = useMutation(
    async () => await logoutUserFn(),
    {
      onSuccess: () => {
        window.location.href = "/login";
      },
      onError: (error: any) => {
        if (Array.isArray(error.response.data.error)) {
          error.data.error.forEach((el: any) =>
            toast.error(el.message, {
              position: "top-right",
            })
          );
        } else {
          toast.error(error.response.data.message, {
            position: "top-right",
          });
        }
      },
    }
  );
  const onLogoutHandler = async () => {
    logoutUser();
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      {user ? (
        [
          <MenuItem key="my-account" onClick={() => navigate("/my-account")}>
            My account
          </MenuItem>,
          <MenuItem key="logout" onClick={onLogoutHandler}>
            Logout
          </MenuItem>,
          <MenuItem key="change-password" onClick={() => navigate("/change-password")}>
            Change Password
          </MenuItem>,
        ]
      ) : (
        [
          <LoadingButton
            key="signup"
            sx={{ mr: 2 }}
            onClick={() => navigate("/sign-up")}
          >
            SignUp
          </LoadingButton>,
          <LoadingButton key="login" loading={isLoading} onClick={() => navigate("/login")}>
            Login
          </LoadingButton>,
        ]
      )}
      {/* {user && (
        <>
          <LoadingButton
            loading={isLoading}
            onClick={() => navigate("/profile")}
          >
            Profile
          </LoadingButton>
          <LoadingButton onClick={onLogoutHandler} loading={isLoading}>
            Logout
          </LoadingButton>
        </>
      )}
      {!user && (
        <>
          <LoadingButton
            sx={{ mr: 2 }}
            onClick={() => navigate("/sign-up")}
          >
            SignUp
          </LoadingButton>
          <LoadingButton onClick={() => navigate("/login")}>
            Login
          </LoadingButton>
        </>
      )}
      {user && (
        <>
          <LoadingButton
            loading={isLoading}
            onClick={() => navigate("/profile")}
          >
            Profile
          </LoadingButton>
          <LoadingButton onClick={onLogoutHandler} loading={isLoading}>
            Logout
          </LoadingButton>
        </>
      )}
      {user && user?.role_id === "1" && (
        <LoadingButton
          sx={{ ml: 2 }}
          onClick={() => navigate("/admin")}
        >
          Admin
        </LoadingButton>
      )} */}
    </Menu>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{ mr: 2 }}
            onClick={() => updateOpen(!dopen)}
          >
            <MenuIcon />
          </IconButton>

          <NavLink to={config.routes.Home}>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{
                display: { xs: "none", sm: "block" },
                fontWeight: "bold",
                color: "#fff",
              }}
            >
              Trust Group
            </Typography>
          </NavLink>

          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase placeholder="Search…" inputProps={{ "aria-label": "search" }} />
          </Search>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { xs: "none", md: "flex" } }}>
            <IconButton size="large" aria-label="show 4 new mails" color="inherit">
              <Badge badgeContent={4} color="error">
                <MailIcon />
              </Badge>
            </IconButton>
            <IconButton size="large" aria-label="show 17 new notifications" color="inherit">
              <Badge badgeContent={17} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
          </Box>
          <Box sx={{ display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="show more"
              aria-controls="primary-search-account-menu-mobile"
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      <MobileMenu
        anchorEl={anchorEl}
        mobileMoreAnchorEl={mobileMoreAnchorEl}
        handleMobileMenuClose={handleMobileMenuClose}
        handleProfileMenuOpen={handleProfileMenuOpen}
      />
      {renderMenu}
    </Box>
  );
}
