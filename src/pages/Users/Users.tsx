import { ReactNode, useState, ChangeEvent } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as yup from "yup";
import {
  Button,
  TextField,
  Box,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
  Pagination,
  Skeleton,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  FormHelperText,
  InputLabel,
  Checkbox,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  ListItemIcon,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AddIcon from "@mui/icons-material/Add";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ModeEditSharpIcon from "@mui/icons-material/ModeEditSharp";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import { type SelectChangeEvent } from "@mui/material";
import { Search } from "@mui/icons-material";
import { User } from "@/api/types";
import { fetchUsers, createUser, deleteUser } from "@/api/user.api";
import MediaManager from "@/components/Media";
import http from "@/utils/http";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import Popover from "@/components/Popover";
import Breadcrumbs from "@/components/Breadcrumbs";
import Image from "@/components/Image";

type SelectedUsers = { [userId: string]: boolean };

const userSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  email: yup.string().required("Email is required"),
  profile_image: yup.string().required("Profile image is required"),
  handphone_number: yup.number().required("Handphone Number is required"),
  role_id: yup.string().required("Role is required"),
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Length from 6 - 160 characters")
    .max(160, "Length from 6 - 160 characters"),
  verified_code_forgot: yup.string(),
});

const renderImageUrl = (imageUrl: string | File | undefined): ReactNode => {
  if (typeof imageUrl === "string") {
    return <Image src={imageUrl} alt="User" style={{ width: "5rem" }} />;
  } else if (imageUrl instanceof File) {
    const temporaryUrl = URL.createObjectURL(imageUrl);
    return <Image src={temporaryUrl} alt="User" style={{ width: "5rem" }} />;
  } else {
    return null;
  }
};
//role
const fetchRoles = async () => {
  const response = await http.get("roles");
  return response.data.data;
};

const fetchRoleName = async (roleId: string) => {
  const response = await http.get(`roles/${roleId}`);
  return response.data.data.name;
};

const RoleName: React.FC<{ roleId: string }> = ({ roleId }) => {
  const { data: roleName } = useQuery(["roleName", roleId], () => fetchRoleName(roleId));
  return <>{roleName}</>;
};

const UserComponent: React.FC = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: users = [] } = useQuery<User[]>("users", fetchUsers);
  const { data: roles = [] } = useQuery("roles", fetchRoles);

  const createUserMutation = useMutation(createUser, {
    onSuccess: () => {
      queryClient.invalidateQueries("users");
      toast.success("User created successfully.");
    },
    onError: () => {
      toast.error("Failed to create user.");
    },
  });

  const deleteUserMutation = useMutation(deleteUser, {
    onSuccess: () => {
      queryClient.invalidateQueries("users");
      toast.success("User deleted successfully.");
    },
    onError: () => {
      toast.error("Failed to delete user.");
    },
  });
  const [newUser, setNewUser] = useState<User>({
    id: "",
    name: "",
    email: "",
    profile_image: "",
    handphone_number: "",
    role_id: "",
    new_password: "",
    password: "",
    verified_code_forgot: ""
  });

  const [open, setOpen] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [selectedImageUrl, setSelectedImageUrl] = useState("");
  const [selectedRoleId, setSelectedRoleId] = useState<string>("");
  const [selectedRoleIdFilter, setSelectedRoleIdFilter] = useState<string>("");
  const [selectedUsers, setSelectedUsers] = useState<SelectedUsers>({});
  const [popoverInfo, setPopoverInfo] = useState<{ [key: string]: { open: boolean; anchorEl: HTMLElement | null } }>({});

  const handleOpenPopover = (branchId: string, event: React.MouseEvent<HTMLElement>) => {
    setPopoverInfo((prevInfo) => ({
      ...prevInfo,
      [branchId]: { open: true, anchorEl: event.currentTarget },
    }));
  };

  const handleClosePopover = (branchId: string) => {
    setPopoverInfo((prevInfo) => ({
      ...prevInfo,
      [branchId]: { ...prevInfo[branchId], open: false },
    }));
  };

  const handleSelectAll = () => {
    const areAllSelected = Object.values(selectedUsers).every((selected) => selected);

    const updatedSelectedUsers = { ...selectedUsers };

    users.forEach((users) => {
      updatedSelectedUsers[users.id] = !areAllSelected;
    });

    setSelectedUsers(updatedSelectedUsers);
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>) => {
    const { name, value } = event.target;
    if (name === "role_id") {
      setSelectedRoleId(value as string);
    }
    setNewUser((prevNewUser) => ({
      ...prevNewUser,
      [name]: value,
    }));
  };
  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchKeyword(event.target.value);
  };

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
  };

  const handleSelectedMedia = (media: any) => {
    setSelectedImageUrl(media.image_url);
    setNewUser((prevNewUser) => ({
      ...prevNewUser,
      profile_image: media.image_url, // Set the profile_image property
    }));
  };

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users ? users.slice(indexOfFirstUser, indexOfLastUser) : [];
  const filteredUsers = currentUsers.filter((user) => {
    const isMatchingRole = !selectedRoleIdFilter || user.role_id === selectedRoleIdFilter;

    if (user && user.name) {
      const nameMatch = user.name.toLowerCase().includes(searchKeyword.toLowerCase());
      const addressMatch = user.email.toLowerCase().includes(searchKeyword.toLowerCase());
      return isMatchingRole && (nameMatch || addressMatch);
    }
    return false;
  });

  const totalPages = Math.ceil(users.length / usersPerPage);

  const openFormPopup = () => {
    setNewUser({
      id: "",
      name: "",
      email: "",
      profile_image: "",
      handphone_number: "",
      role_id: "",
      password: "",
      new_password: "",
      verified_code_forgot: ""
    });
    setSelectedImageUrl("");
    setOpen(true);
  };

  const openEditFormPopup = (user: User) => {
    navigate(`/users/update-user/${user.id}`);
  };

  const closeFormPopup = () => {
    setOpen(false);
  };

  const openDeleteConfirmation = (user: User) => {
    setDeleteConfirmationOpen(true);
    setUserToDelete(user);
  };

  const closeDeleteConfirmation = () => {
    setDeleteConfirmationOpen(false);
    setUserToDelete(null);
  };

  const handleCreateUser = async () => {
    try {
      if (!newUser.profile_image) {
        setNewUser((prevNewUser) => ({
          ...prevNewUser,
          profile_image: "",
        }));
      }
      await userSchema.validate(newUser, { abortEarly: false });
      createUserMutation.mutate(newUser);
      setNewUser({
        id: "",
        name: "",
        email: "",
        profile_image: "",
        handphone_number: "",
        role_id: "",
        password: "",
        new_password: "",
        verified_code_forgot: ""
      });
      setOpen(false);
    } catch (err: any) {
      console.error(err);
      const validationErrors: { [key: string]: string } = {};
      if (yup.ValidationError.isError(err)) {
        err.inner.forEach((e) => {
          if (e.path) {
            validationErrors[e.path] = e.message;
          }
        });
      }
      setNewUser((prevNewUser) => ({
        ...prevNewUser,
        errors: validationErrors,
      }));
    }
  };

  const handleDeleteUser = (user: User | null) => {
    if (user) {
      deleteUserMutation.mutate(user.id);
    }
    setDeleteConfirmationOpen(false);
    setUserToDelete(null);
  };

  const handleCheckboxChange = (userId: string) => {
    setSelectedUsers((prevSelectedUsers) => ({
      ...prevSelectedUsers,
      [userId]: !prevSelectedUsers[userId],
    }));
  };

  const handleDeleteSelectedUsers = () => {
    const usersToDelete = Object.keys(selectedUsers).filter((userId) => selectedUsers[userId]);
    if (usersToDelete.length > 0) {
      usersToDelete.forEach((userId) => {
        deleteUserMutation.mutate(userId);
      });
      // Clear selected Users
      setSelectedUsers({});
    }
  };
  const countSelectedUsers = () => {
    return Object.values(selectedUsers).filter((selected) => selected).length;
  };
  const selectedUsersCount = countSelectedUsers();

  const uniqueRoleIds = Array.from(new Set(users.map(user => user.role_id)));

  return (
    <div>
      <Helmet>
        <title>Users | Trust Group</title>
        <meta name='description' content='Users to have access!' />
      </Helmet>
      <Typography variant="h3" mb={"3rem"}>
        Users List
      </Typography>
      <Breadcrumbs/>
      <div className="mb-10 flex items-center justify-between gap-3 flex-wrap">
        <TextField
          label="Search"
          size="small"
          value={searchKeyword}
          onChange={handleSearchChange}
          variant="outlined"
          sx={{ maxWidth: "22rem", width: "100%" }}
          InputProps={{
            endAdornment: (
              <InputAdornment position='end'>
                <Search />
              </InputAdornment>
            )
          }}
        />
        <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={openFormPopup}>
          Create User
        </Button>
      </div>
      <Box sx={{ maxWidth: "22rem" }} mb={"2rem"}>
        <FormControl fullWidth >
          <InputLabel size="small" id="select-filter-label">All Role</InputLabel>
          <Select
            labelId="select-filter-label"
            id="simple-select-filter"
            size="small"
            label="All Role"
            value={selectedRoleIdFilter}
            IconComponent={ExpandMoreIcon}
            onChange={(event) => setSelectedRoleIdFilter(event.target.value)}
          >
            <MenuItem value="">All Roles</MenuItem>
            {uniqueRoleIds.map((roleId) => (
              <MenuItem key={roleId} value={roleId}>
                <RoleName roleId={roleId} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                {users.length > 0 ? (
                  <Checkbox
                    indeterminate={
                      Object.values(selectedUsers).some((selected) => selected) &&
                      Object.values(selectedUsers).some((selected) => !selected)
                    }
                    checked={Object.values(selectedUsers).every((selected) => selected)}
                    onChange={handleSelectAll}
                  />
                ) : (
                  <Skeleton  height={60} animation="wave" />
                )
                }
              </TableCell>
              <TableCell>
                {users.length > 0 ? "Name" : <Skeleton  height={60} animation="wave" />}
              </TableCell>
              <TableCell>
                {users.length > 0 ? "Email" : <Skeleton  height={60} animation="wave" />}
              </TableCell>
              <TableCell sx={{ maxWidth: "30rem" }}>
                {users.length > 0 ? "Handphone Number" : <Skeleton  height={60} animation="wave" />}
              </TableCell>
              <TableCell sx={{ maxWidth: "30rem" }}>
                {users.length > 0 ? "Profile Image" : <Skeleton  height={60} animation="wave" />}
              </TableCell>
              <TableCell sx={{ maxWidth: "30rem" }}>
                {users.length > 0 ? "Role id" : <Skeleton  height={60} animation="wave" />}
              </TableCell>
              <TableCell align="right">{users.length > 0 ? "Action" : <Skeleton  height={60} animation="wave" />}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedUsers[user.id] || false}
                      onChange={() => handleCheckboxChange(user.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <strong>{user.name}</strong>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.handphone_number}</TableCell>
                  <TableCell className="max-w-[30rem] break-words">{renderImageUrl(user.profile_image)}</TableCell>
                  <TableCell>
                    {user.role_id && (
                      <RoleName roleId={user.role_id} />
                    )}
                  </TableCell>
                  <TableCell className="!text-right">
                    <IconButton color="primary" onClick={(e) => handleOpenPopover(user.id, e)}>
                      <MoreVertIcon />
                    </IconButton>
                    <Popover
                      open={popoverInfo[user.id]?.open || false}
                      anchorEl={popoverInfo[user.id]?.anchorEl}
                      onClose={() => handleClosePopover(user.id)}
                    >
                      <List>
                        <ListItemButton onClick={() => openEditFormPopup(user)}>
                          <ListItemIcon sx={{ minWidth: "3.5rem" }}>
                            <ModeEditSharpIcon color="primary"/>
                          </ListItemIcon>
                          <ListItemText primary="Edit" />
                        </ListItemButton>
                        <ListItemButton onClick={() => openDeleteConfirmation(user)} >
                          <ListItemIcon sx={{ minWidth: "3.5rem" }}>
                            <DeleteRoundedIcon color="secondary"/>
                          </ListItemIcon>
                          <ListItemText primary="Delete" className="text-secondary"/>
                        </ListItemButton>
                      </List>
                    </Popover>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7}>
                  {users.length === 0 ? (
                    <Skeleton  height={60} animation="wave" />
                  ) : (
                    <p className="text-[1.6rem] text-center">No users found.</p>
                  )}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {Object.values(selectedUsers).some((selected) => selected) && (
        <div className="mt-6">
          <Button variant="outlined" startIcon={<DeleteRoundedIcon />} color="primary" onClick={handleDeleteSelectedUsers} disabled={selectedUsersCount === 0}>
            Delete Selected ({selectedUsersCount})
          </Button>
        </div>
      )}
      <Box mt={2} display="flex" justifyContent="center">
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
          showFirstButton
          showLastButton
        />
      </Box>
      <Dialog open={open} onClose={closeFormPopup} PaperProps={{ sx: { width: "100%", maxWidth: "50rem" } }}>
        <DialogTitle className="!pt-10"> Create New User </DialogTitle>
        <DialogContent className="flex w-full flex-col gap-y-12  !pt-6">
          <TextField
            name="name"
            label="Name"
            size="small"
            value={newUser.name}
            onChange={handleInputChange}
            variant="outlined"
            fullWidth
            error={!!newUser.errors?.name}
            helperText={newUser.errors?.name}

          />
          <TextField
            name="email"
            label="Email"
            size="small"
            value={newUser.email}
            onChange={handleInputChange}
            variant="outlined"
            fullWidth
            error={!!newUser.errors?.email}
            helperText={newUser.errors?.email}

          />
          <TextField
            name="handphone_number"
            label="Phone"
            size="small"
            value={newUser.handphone_number}
            onChange={handleInputChange}
            variant="outlined"
            fullWidth
            error={!!newUser.errors?.handphone_number}
            helperText={newUser.errors?.handphone_number}

          />
          <TextField
            name="password"
            label="Password"
            size="small"
            type="password"
            value={newUser.password}
            onChange={handleInputChange}
            variant="outlined"
            fullWidth
            error={!!newUser.errors?.password}
            helperText={newUser.errors?.password}

          />
          <FormControl fullWidth sx={{ ".MuiFormLabel-root": { background: "#fff", padding: "0 3px" } }}>
            <InputLabel size="small" id="select-role">Role</InputLabel>
            <Select
              labelId="select-role"
              id="role-select"
              size="small"
              name="role_id"
              value={selectedRoleId || newUser.role_id}
              onChange={handleInputChange}
              IconComponent={ExpandMoreIcon}
              variant="outlined"
              error={!!newUser.errors?.role_id}

            >
              {roles.map((role:any) => (
                <MenuItem key={role.id} value={role.id}>
                  {role.name}
                </MenuItem>
              ))}
            </Select>
            {newUser.errors?.role_id && <FormHelperText error>{newUser.errors.role_id}</FormHelperText>}
          </FormControl>
          <div>
            <p className="!mb-3 block !font-medium !text-[1.3rem]">Profile Image</p>
            <MediaManager onMediaSelect={handleSelectedMedia} />
            {selectedImageUrl && (
              <div>
                <p className="text-[1.2rem] text-gray-700 mb-2">Selected Image:</p>
                <div className="image w-[8rem] h-[8rem] bg-slate-100 border-solid border-slate-300 border-[1px]">
                  <Image src={selectedImageUrl} classNames="w-full h-full object-cover" alt="Selected Media" />
                </div>
              </div>
            )}
          </div>
        </DialogContent>
        <DialogActions className="!p-10">
          <Button variant="contained" color="primary" onClick={handleCreateUser}>
            Create
          </Button>
          <Button variant="contained" color="secondary" onClick={closeFormPopup}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={deleteConfirmationOpen} onClose={closeDeleteConfirmation}>
        <DialogTitle>Delete User</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to delete this user?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="secondary" onClick={() => handleDeleteUser(userToDelete)}>
            Delete
          </Button>
          <Button variant="contained" color="primary" onClick={closeDeleteConfirmation}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default UserComponent;
