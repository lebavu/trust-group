import React, { useState } from "react";
import { Box, Container, Typography, TextField, Button, Tabs, Tab, List, ListItem, ListItemText } from "@mui/material";

interface MyAccountProps {
  // Các props cần thiết cho component MyAccount có thể được khai báo ở đây
}

const MyAccount: React.FC<MyAccountProps> = () => {
  const [tabIndex, setTabIndex] = useState(0);

  const handleTabChange = (event: React.ChangeEvent<{}>, newIndex: number) => {
    setTabIndex(newIndex);
  };

  return (
    <Box sx={{ flexGrow: 1, marginTop: "20px" }}>
      <Container maxWidth='lg'>
        <Typography variant='h4' gutterBottom>
          My Account
        </Typography>
        <Tabs value={tabIndex} onChange={handleTabChange}>
          <Tab label='Personal Information' />
          <Tab label='Account Settings' />
        </Tabs>
        {tabIndex === 0 && (
          <Box sx={{ marginTop: "20px", maxWidth: "50rem" }}>
            <Typography variant='h5' gutterBottom>
              Personal Information
            </Typography>
            <form>
              <TextField label='Full Name' fullWidth size='small' margin='normal' />
              <TextField label='Email' fullWidth size='small' margin='normal' />
              <Button variant='contained' size='large' sx={{ marginTop: "2rem" }} color='primary' type='submit'>
                Save Changes
              </Button>
            </form>
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
              <ListItem>
                <ListItemText primary='Email Notifications' secondary='Receive email notifications' />
              </ListItem>
              <ListItem>
                <ListItemText primary='Privacy Settings' secondary='Control your privacy settings' />
              </ListItem>
            </List>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default MyAccount;
