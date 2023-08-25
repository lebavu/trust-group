import * as React from "react";
import { useNavigate, Link } from "react-router-dom";
import { styled } from "@mui/material/styles";
import { useContext } from "react";
import MuiAppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Button from "src/components/Button";
import Typography from "@mui/material/Typography";
import Badge from "@mui/material/Badge";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MoreIcon from "@mui/icons-material/MoreVert";
import { useAppStore } from "@/appStore";
import { AppContext } from "@/context/app.context";
import { useMutation } from "react-query";
import authApi from "@/api/auth.api";

const AppBar = styled(
  MuiAppBar,
  {},
)(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
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
  const { isAuthenticated, userInfo } = useContext(AppContext);
  return (
    <div>
      {isAuthenticated && userInfo && (
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
            <IconButton size="large" aria-label="show 17 new notifications" color="inherit">
              <Badge badgeContent={17} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <p>Notifications</p>
          </MenuItem>
          <MenuItem onClick={handleProfileMenuOpen}>
            <div className="flex items-center gap-[1rem] pl-[12px]">
              <div className='h-[2.5rem] w-[2.5rem] rounded-full bg-white'>
                <img src={userInfo?.profile_image} alt='avatar' className='h-[2.5rem] w-[2.5rem] rounded-full object-cover' />
              </div>
              <span className="text-[1.4rem]">{userInfo.name}</span>
            </div>
          </MenuItem>
        </Menu>
      )}
    </div>
  );
};

export default function PrimarySearchAppBar() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState<null | HTMLElement>(null);
  const updateOpen = useAppStore((state) => state.updateOpen);
  const dopen = useAppStore((state) => state.dopen);
  const isMenuOpen = Boolean(anchorEl);
  const navigate = useNavigate();
  const { setIsAuthenticated, isAuthenticated, setProfile, userInfo } = useContext(AppContext);
  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      setIsAuthenticated(false);
      setProfile(null);
    }
  });

  const handleLogout = () => {
    logoutMutation.mutate();
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
    <div>
      {isAuthenticated && (
        [
          <Menu
            key="menu"
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
            <MenuItem key="my-account">
              <Link to="/Profile" onClick={handleMenuClose}>
                Profile
              </Link>
            </MenuItem>
            <MenuItem
              key="logout"
              onClick={() => {
                handleLogout();
                handleMenuClose();
              }}
            >
              Logout
            </MenuItem>
          </Menu>
        ]
      )}
    </div>
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

          <Link to="/">
            <Typography
              variant="h6"
              noWrap
              className="logo-tr"
              component="div"
              sx={{
                display: { xs: "none", sm: "block" },
                fontWeight: "bold",
                color: "#fff",
              }}
            >
              Trust Group
            </Typography>
          </Link>
          <Box sx={{ flexGrow: 1 }} />
          {isAuthenticated && userInfo && (
            <div>
              <Box sx={{ display: { xs: "none", md: "flex" } }}>
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
                  <div className="flex items-center gap-[1rem]">
                    <span className="text-[1.4rem] font-medium">Welcome, {userInfo.name}</span>
                    <div className='h-[2.5rem] w-[2.5rem] rounded-full bg-white'>
                      <img src={userInfo?.profile_image} alt='avatar' className='h-[2.5rem] w-[2.5rem] rounded-full object-cover' />
                    </div>
                  </div>
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
            </div>
          )}
          {!isAuthenticated && (
            <Box sx={{ display: { md: "flex" } }}>
              <Button
                onClick={() => navigate("/login")}
                className="flex bg-secondary h-[3.5rem] h-[2.5rem] font-medium min-w-[8rem] nowrap text-[1.4rem] w-full items-center justify-center py-0 px-6 rounded-[.5rem] text-white hover:bg-secondary/[.8]"
              >
                Login
              </Button>
            </Box>
          )}
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
