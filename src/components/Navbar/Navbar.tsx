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
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import ManageAccountsRoundedIcon from "@mui/icons-material/ManageAccountsRounded";
import LogoutTwoToneIcon from "@mui/icons-material/LogoutTwoTone";
import { useAppStore } from "@/appStore";
import { AppContext } from "@/context/app.context";
import { useMutation } from "react-query";
import authApi from "@/api/auth.api";
import Image from "@/components/Image";

const AppBar = styled(
  MuiAppBar,
  {},
)(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
}));

export default function PrimarySearchAppBar() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
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
  const  handleProfile = () => {
    navigate(`/users/update-user/${userInfo?.id}`);
  };
  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
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
            sx={{ ".MuiMenu-paper" : {
              paddingTop: "0",
              borderRadius: ".8rem",
            },
            "ul": {
              overflow: "hidden"
            } }}
            id={menuId}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={isMenuOpen}
            onClose={handleMenuClose}
          >
            <MenuItem
              key="my-account"
              onClick={() => {
                handleProfile();
                handleMenuClose();
              }}
              sx={{ display: "flex", alignItems: "center", gap: ".5rem" }}
            >
              <ManageAccountsRoundedIcon/>
              Profile
            </MenuItem>
            <MenuItem
              key="logout"
              onClick={() => {
                handleLogout();
                handleMenuClose();
              }}
              sx={{ display: "flex", alignItems: "center", gap: ".5rem" }}
            >
              <LogoutTwoToneIcon/>
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
              <Box sx={{ display: "flex" }}>
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
                      <Image src={userInfo?.profile_image} alt='avatar' classNames='h-[2.5rem] w-[2.5rem] rounded-full object-cover' />
                    </div>
                  </div>
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
      {renderMenu}
    </Box>
  );
}
