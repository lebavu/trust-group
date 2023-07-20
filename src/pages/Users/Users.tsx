import { ReactNode, useState, ChangeEvent } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { ToastContainer, toast } from "react-toastify";
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
} from "@mui/material";

import { User } from "@/api/types";
import { fetchUsers, createUser, updateUser, deleteUser } from "@/api/user.api";

const userSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  email: yup.string().required("Email is required"),
  profile_image: yup
    .mixed()
    .test("fileType", "Invalid file type", function (value) {
      if (!value) return true;
      const validFormats = ["image/jpeg", "image/png"];
      const fileType = (value as File).type;

      return validFormats.includes(fileType);
    })
    .test("fileSize", "File size is too large", function (value) {
      if (!value) return true;

      const fileSizeInMB = (value as File).size / (1024 * 1024);
      const maxSizeInMB = 20;
      return fileSizeInMB <= maxSizeInMB;
    }),
  handphone_number: yup.string().required("Handphone Number is required"),
  role_id: yup.string().required("Role is required"),
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be more than 6 characters")
    .max(32, "Password must be less than 32 characters"),
  verified_code_forgot: yup.string(),
});

// Function to render the image URL or file preview
const renderImageUrl = (imageUrl: string | File | undefined): ReactNode => {
  if (typeof imageUrl === "string") {
    return <img src={imageUrl} alt="User" style={{ width: "5rem" }} />;
  } else if (imageUrl instanceof File) {
    const temporaryUrl = URL.createObjectURL(imageUrl);
    return <img src={temporaryUrl} alt="User" style={{ width: "5rem" }} />;
  } else {
    return null;
  }
};

// Main component for managing users
const UserComponent: React.FC = () => {
  const queryClient = useQueryClient();

  const { data: users = [] } = useQuery<User[]>("users", fetchUsers);

  const createUserMutation = useMutation(createUser, {
    onSuccess: () => {
      queryClient.invalidateQueries("users");
      toast.success("User created successfully.");
    },
    onError: () => {
      toast.error("Failed to create user.");
    },
  });

  const updateUserMutation = useMutation(updateUser, {
    onSuccess: () => {
      queryClient.invalidateQueries("users");
      toast.success("User updated successfully.");
    },
    onError: () => {
      toast.error("Failed to update user.");
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
    password: "",
    verified_code_forgot: ""
  });

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [open, setOpen] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
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

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setNewUser((prevNewUser) => ({
        ...prevNewUser,
        profile_image: prevNewUser.profile_image instanceof File ? prevNewUser.profile_image : file,
      }));

      if (selectedUser) {
        setSelectedUser((prevSelectedUser) => ({
          ...(prevSelectedUser as User),
          profile_image: prevSelectedUser?.profile_image instanceof File ? prevSelectedUser.profile_image : file,
        }));
      }
    }
  };
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users ? users.slice(indexOfFirstUser, indexOfLastUser) : [];

  const filteredUsers = currentUsers.filter((user) => {
    if (user && user.name) {
      const nameMatch = user.name.toLowerCase().includes(searchKeyword.toLowerCase());
      const addressMatch = user.email.toLowerCase().includes(searchKeyword.toLowerCase());
      return nameMatch || addressMatch;
    }
    return false;
  });

  const totalPages = Math.ceil(users.length / usersPerPage);

  const openFormPopup = () => {
    setSelectedUser(null);
    setNewUser({
      id: "",
      name: "",
      email: "",
      profile_image: "",
      handphone_number: "",
      role_id: "",
      password: "",
      verified_code_forgot: ""
    });
    setOpen(true);
  };

  const openEditFormPopup = (user: User) => {
    setSelectedUser(user);
    setNewUser(user);
    setOpen(true);
  };

  const closeFormPopup = () => {
    setSelectedUser(null);
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
        verified_code_forgot: ""
      });
      setOpen(false);
    } catch (err: any) {
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

  const handleUpdateUser = async () => {
    try {
      await userSchema.validate(newUser, { abortEarly: false });

      const updatedUser: User = {
        id: selectedUser?.id || "",
        name: newUser.name || selectedUser?.name || "",
        email: newUser.email || selectedUser?.email || "",
        handphone_number: newUser.handphone_number || selectedUser?.handphone_number || "",
        password: newUser.password || selectedUser?.password || "",
        role_id: newUser.role_id || selectedUser?.role_id || "",

        verified_code_forgot: newUser.verified_code_forgot || selectedUser?.verified_code_forgot || "",
        profile_image: newUser.profile_image || selectedUser?.profile_image || "",
      };

      // Check if the image URL is not changed, use the current value
      if (!newUser.profile_image) {
        updatedUser.profile_image = selectedUser?.profile_image || "";
      }

      await updateUserMutation.mutateAsync(updatedUser);

      setSelectedUser(null);
      setOpen(false);

      setNewUser({
        id: "",
        name: "",
        email: "",
        profile_image: "",
        handphone_number: "",
        verified_code_forgot: "",
        password: "",
        role_id: "",
        errors: {},
      });
    } catch (err: any) {
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

  return (
    <div>
      <Typography variant="h3" mb={"3rem"}>
        Users List
      </Typography>
      <div className="mb-10 flex items-center justify-between gap-3">
        <TextField
          label="Search"
          size="small"
          value={searchKeyword}
          onChange={handleSearchChange}
          variant="outlined"
          sx={{ marginBottom: "2rem" }}
        />
        <Button variant="contained" color="primary" onClick={openFormPopup}>
          Create User
        </Button>
      </div>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                {users.length > 0 ? "Name" : <Skeleton variant="rectangular" height={40} animation="wave" />}
              </TableCell>
              <TableCell>
                {users.length > 0 ? "Email" : <Skeleton variant="rectangular" height={40} animation="wave" />}
              </TableCell>
              <TableCell sx={{ maxWidth: "30rem" }}>
                {users.length > 0 ? "Handphone Number" : <Skeleton variant="rectangular" height={40} animation="wave" />}
              </TableCell>
              <TableCell sx={{ maxWidth: "30rem" }}>
                {users.length > 0 ? "Profile Image" : <Skeleton variant="rectangular" height={40} animation="wave" />}
              </TableCell>
              <TableCell sx={{ maxWidth: "30rem" }}>
                {users.length > 0 ? "Role id" : <Skeleton variant="rectangular" height={40} animation="wave" />}
              </TableCell>
              <TableCell align="right">{users.length > 0 ? "Action" : <Skeleton variant="rectangular" height={40} animation="wave" />}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.handphone_number}</TableCell>
                  <TableCell className="max-w-[30rem] break-words">{renderImageUrl(user.profile_image)}</TableCell>
                  <TableCell>{user.role_id}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap items-center justify-end gap-5">
                      <Button variant="contained" color="primary" onClick={() => openEditFormPopup(user)}>
                        Edit
                      </Button>
                      <Button variant="contained" color="secondary" onClick={() => openDeleteConfirmation(user)}>
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6}>
                  {users.length === 0 ? (
                    <Skeleton variant="rectangular" height={50} animation="wave" />
                  ) : (
                    <p className="text-[1.6rem] text-center">No users found.</p>
                  )}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
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
        <DialogTitle className="!pt-10">{selectedUser ? "Edit User" : "Create New User"}</DialogTitle>
        <DialogContent className="flex w-full flex-col gap-y-6 !pt-6">
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
            sx={{ marginBottom: "2rem" }}
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
            sx={{ marginBottom: "2rem" }}
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
            sx={{ marginBottom: "2rem" }}
          />
          <TextField
            name="role_id"
            label="Role Id"
            size="small"
            value={newUser.role_id}
            onChange={handleInputChange}
            variant="outlined"
            fullWidth
            error={!!newUser.errors?.role_id}
            helperText={newUser.errors?.role_id}
            sx={{ marginBottom: "2rem" }}
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
            sx={{ marginBottom: "2rem" }}
          />

          {selectedUser && selectedUser.profile_image && (
            <>
              {renderImageUrl(selectedUser.profile_image)}
              {newUser.errors?.profile_image && (
                <div className="error-text">{newUser.errors.profile_image}</div>
              )}
            </>
          )}
          <input type="file" onChange={handleFileChange} />
        </DialogContent>
        <DialogActions className="!p-10">
          {selectedUser ? (
            <>
              <Button variant="contained" color="primary" onClick={handleUpdateUser}>
                Update
              </Button>
              <Button variant="contained" color="secondary" onClick={closeFormPopup}>
                Cancel
              </Button>
            </>
          ) : (
            <>
              <Button variant="contained" color="primary" onClick={handleCreateUser}>
                Create
              </Button>
              <Button variant="contained" color="secondary" onClick={closeFormPopup}>
                Cancel
              </Button>
            </>
          )}
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
      <ToastContainer />
    </div>
  );
};

export default UserComponent;
