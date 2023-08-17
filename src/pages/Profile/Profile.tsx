import React, { useState , useContext } from "react";
import { Box, Container, Typography, Tabs, Tab, List, ListItem, ListItemText } from "@mui/material";
import { AppContext } from "@/context/app.context";
import { Helmet } from "react-helmet-async";


const Profile = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const { userInfo } = useContext(AppContext);
  const handleTabChange = (_: React.ChangeEvent<unknown>, newIndex: number) => {
    setTabIndex(newIndex);
  };

  return (
    <Box sx={{ flexGrow: 1, marginTop: "20px" }}>
      <Helmet>
        <title>Profile | Trust Group</title>
        <meta name='description' content='Profile to have access!' />
      </Helmet>
      <Container maxWidth='lg'>
        <Typography variant='h4' gutterBottom>
          My Account
        </Typography>
        <Tabs value={tabIndex} onChange={handleTabChange}>
          <Tab label='Personal Information' />
          <Tab label='Account Settings' />
        </Tabs>
        {tabIndex === 0 && (
          <Box sx={{ mt: 5 }}>
            <div className="w-[5rem] h-[5rem] rounded-[50%] mb-[3rem] overflow-hidden">
              <img src={userInfo?.profile_image} alt="user" className="w-full h-full object-cover" />
            </div>
            <Typography className="!mb-[1.5rem] !last:mb-0">
              <strong>Id:</strong> { userInfo?.id}
            </Typography>
            <Typography className="!mb-[1.5rem] !last:mb-0">
              <strong>Full Name:</strong> { userInfo?.name}
            </Typography>
            <Typography className="!mb-[1.5rem] !last:mb-0">
              <strong>Email Address:</strong> { userInfo?.email}
            </Typography>
            <Typography className="!mb-[1.5rem] !last:mb-0">
              <strong>Handphone Number:</strong> { userInfo?.handphone_number}
            </Typography>
            <Typography className="!mb-[1.5rem] !last:mb-0">
              <strong>Role:</strong> { userInfo?.role_id}
            </Typography>
          </Box>
        )}
        {tabIndex === 1 && (
          <Box sx={{ marginTop: "20px" }}>
            <Typography variant='h5' gutterBottom>
              Account Settings
            </Typography>
            <List>
              <ListItem>
                <ListItemText primary='Change Password' secondary='Click here to change your password' />
              </ListItem>
            </List>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default Profile;
