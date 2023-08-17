import { useState, ChangeEvent } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { ToastContainer, toast } from "react-toastify";
import { Helmet } from "react-helmet-async";
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
  Stack,
  InputAdornment
} from "@mui/material";
import { Search } from "@mui/icons-material";
import { Role } from "@/api/types";
import { fetchRoles, createRole, updateRole, deleteRole } from "@/api/role.api";

// Schema for validating the Role object
const roleSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  role: yup.string().required("Role is required"),
});

// Main component for managing roles
const RoleComponent: React.FC = () => {
  const queryClient = useQueryClient();
  const { data: roles = [] } = useQuery<Role[]>("roles", fetchRoles);

  const createRoleMutation = useMutation(createRole, {
    onSuccess: () => {
      queryClient.invalidateQueries("roles");
      toast.success("Role created successfully.");
    },
    onError: () => {
      toast.error("Failed to create Role.");
    },
  });

  const updateRoleMutation = useMutation(updateRole, {
    onSuccess: () => {
      queryClient.invalidateQueries("roles");
      toast.success("Role updated successfully.");
    },
    onError: () => {
      toast.error("Failed to update Role.");
    },
  });

  const deleteRoleMutation = useMutation(deleteRole, {
    onSuccess: () => {
      queryClient.invalidateQueries("roles");
      toast.success("Role deleted successfully.");
    },
    onError: () => {
      toast.error("Failed to delete Role.");
    },
  });

  const [newRole, setNewRole] = useState<Role>({
    id: "",
    name: "",
    role: "",
  });

  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [open, setOpen] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rolesPerPage = 10;
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState<Role | null>(null);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setNewRole((prevNewRole) => ({
      ...prevNewRole,
      [name]: value,
    }));
  };

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchKeyword(event.target.value);
  };

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
  };

  const indexOfLastRole = currentPage * rolesPerPage;
  const indexOfFirstRole = indexOfLastRole - rolesPerPage;
  const currentRoles = roles.slice(indexOfFirstRole, indexOfLastRole);

  const filteredRoles = currentRoles.filter((role) => {
    if (role && role.name) {
      const nameMatch = role.name.toLowerCase().includes(searchKeyword.toLowerCase());
      return nameMatch;
    }
    return false;
  });

  const totalPages = Math.ceil(roles.length / rolesPerPage);

  const openFormPopup = () => {
    setSelectedRole(null);
    setNewRole({
      id: "",
      name: "",
      role: "",
    });
    setOpen(true);
  };

  const openEditFormPopup = (role: Role) => {
    setSelectedRole(role);
    setNewRole({
      ...role,
    });
    setOpen(true);
  };

  const closeFormPopup = () => {
    setSelectedRole(null);
    setOpen(false);
  };

  const openDeleteConfirmation = (role: Role) => {
    setDeleteConfirmationOpen(true);
    setRoleToDelete(role);
  };

  const closeDeleteConfirmation = () => {
    setDeleteConfirmationOpen(false);
    setRoleToDelete(null);
  };

  const handleCreateRole = async () => {
    try {
      await roleSchema.validate(newRole, { abortEarly: false });
      createRoleMutation.mutate(newRole);
      setNewRole({
        id: "",
        name: "",
        role: "",
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
      setNewRole((prevNewRole) => ({
        ...prevNewRole,
        errors: validationErrors,
      }));
    }
  };

  const handleUpdateRole = async () => {
    try {
      await roleSchema.validate(newRole, { abortEarly: false });

      const updatedRole: Role = {
        id: selectedRole?.id || "",
        name: newRole.name || selectedRole?.name || "",
        role: newRole.role || selectedRole?.role || "",
      };

      await updateRoleMutation.mutateAsync(updatedRole);

      setSelectedRole(null);
      setOpen(false);

      setNewRole({
        id: "",
        name: "",
        role: "",
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
      setNewRole((prevNewRole) => ({
        ...prevNewRole,
        errors: validationErrors,
      }));
    }
  };

  const handleDeleteRole = (role: Role | null) => {
    if (role) {
      deleteRoleMutation.mutate(role.id);
    }
    setDeleteConfirmationOpen(false);
    setRoleToDelete(null);
  };

  return (
    <div>
      <Helmet>
        <title>Roles | Trust Group</title>
        <meta name='description' content='Roles to have access!' />
      </Helmet>
      <Typography variant="h3" mb={"3rem"}>
        Roles List
      </Typography>
      <div className="mb-10 flex items-center justify-between gap-3">
        <TextField
          label="Search"
          size="small"
          value={searchKeyword}
          onChange={handleSearchChange}
          variant="outlined"
          InputProps={{
            endAdornment: (
              <InputAdornment position='end'>
                <Search />
              </InputAdornment>
            )
          }}
        />
        <Button variant="contained" color="primary" onClick={openFormPopup}>
          Create Role
        </Button>
      </div>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                {roles.length > 0 ? "Id" : <Skeleton variant="rectangular" height={40} animation="wave" />}
              </TableCell>
              <TableCell>
                {roles.length > 0 ? "Name" : <Skeleton variant="rectangular" height={40} animation="wave" />}
              </TableCell>
              <TableCell sx={{ maxWidth: "30rem" }}>
                {roles.length > 0 ? "Role" : <Skeleton variant="rectangular" height={40} animation="wave" />}
              </TableCell>
              <TableCell align="right">
                {roles.length > 0 ? "Action" : <Skeleton variant="rectangular" height={40} animation="wave" />}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRoles.length > 0 ? (
              filteredRoles.map((role) => (
                <TableRow key={role.id}>
                  <TableCell>{role.id}</TableCell>
                  <TableCell>{role.name}</TableCell>
                  <TableCell>{role.role}</TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={2} justifyContent={"end"}>
                      <Button variant="contained" color="primary" onClick={() => openEditFormPopup(role)}>
                        Edit
                      </Button>
                      <Button variant="contained" color="secondary" onClick={() => openDeleteConfirmation(role)}>
                        Delete
                      </Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5}>
                  {roles.length === 0 ? (
                    <Skeleton variant="rectangular" height={50} animation="wave" />
                  ) : (
                    <p className="text-[1.6rem] text-center">No roles found.</p>
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
        <DialogTitle className="!pt-10">{selectedRole ? "Edit Role" : "Create New Role"}</DialogTitle>
        <DialogContent className="flex w-full flex-col gap-y-6 !pt-6">
          <TextField
            name="name"
            label="Name"
            value={newRole.name}
            onChange={handleInputChange}
            variant="outlined"
            size="small"
            fullWidth
            error={!!newRole.errors?.name}
            helperText={newRole.errors?.name}
            sx={{ marginBottom: "2rem" }}
          />
          <TextField
            name="role"
            label="Role"
            value={newRole.role}
            onChange={handleInputChange}
            variant="outlined"
            size="small"
            fullWidth
            error={!!newRole.errors?.role}
            helperText={newRole.errors?.role}
            sx={{ marginBottom: "2rem" }}
          />
        </DialogContent>
        <DialogActions className="!p-10">
          {selectedRole ? (
            <>
              <Button variant="contained" color="primary" onClick={handleUpdateRole}>
                Update
              </Button>
              <Button variant="contained" color="secondary" onClick={closeFormPopup}>
                Cancel
              </Button>
            </>
          ) : (
            <>
              <Button variant="contained" color="primary" onClick={handleCreateRole}>
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
        <DialogTitle>Delete Role</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to delete this Role?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="secondary" onClick={() => handleDeleteRole(roleToDelete)}>
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

export default RoleComponent;
