import React, { useState, useEffect, ChangeEvent } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import axios from "axios";
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
  Pagination,
  Skeleton,
  MenuItem,
  Stack
} from "@mui/material";

interface Parent {
  id: string;
  name: string;
  desc: string;
}

interface Branch {
  id: string;
  name: string;
  desc: string;
  parent: Parent;
  errors?: {
    name?: string;
    desc?: string;
    parent?: string;
  };
}

const branchSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  desc: yup.string().required("Description is required"),
  parent: yup.object().shape({
    id: yup.string().required("Parent ID is required"),
    name: yup.string().required("Parent Name is required"),
    desc: yup.string().required("Parent Description is required"),
  }),
});

const BranchComponent: React.FC = () => {
  const queryClient = useQueryClient();
  const { data: branches = [] } = useQuery<Branch[]>("branches", async () => {
    const response = await axios.get(
      "https://pm55.corsivalab.xyz/trustGroup/public/api/v1/product-categories"
    );
    return response.data.data;
  });

  const createBranchMutation = useMutation(
    (newBranch: Branch) => {
      return axios.post<Branch>(
        "https://pm55.corsivalab.xyz/trustGroup/public/api/v1/product-categories",
        newBranch
      );
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("branches");
        toast.success("Branch created successfully.");
      },
      onError: () => {
        toast.error("Failed to create branch.");
      },
    }
  );

  const updateBranchMutation = useMutation(
    (updatedBranch: Branch) => {
      return axios.put<Branch>(
        `https://pm55.corsivalab.xyz/trustGroup/public/api/v1/product-categories/${updatedBranch.id}`,
        updatedBranch
      );
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("branches");
        toast.success("Branch updated successfully.");
      },
      onError: () => {
        toast.error("Failed to update branch.");
      },
    }
  );

  const deleteBranchMutation = useMutation(
    (branchId: string) => {
      return axios.delete(
        `https://pm55.corsivalab.xyz/trustGroup/public/api/v1/product-categories/${branchId}`
      );
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("branches");
        toast.success("Branch deleted successfully.");
      },
      onError: () => {
        toast.error("Failed to delete branch.");
      },
    }
  );

  const [newBranch, setNewBranch] = useState<Branch>({
    id: "",
    name: "",
    desc: "",
    parent: {
      id: "",
      name: "",
      desc: "",
    },
  });

  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [open, setOpen] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const branchesPerPage = 10;
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [branchToDelete, setBranchToDelete] = useState<Branch | null>(null);

  const [parentOptions, setParentOptions] = useState<Parent[]>([]);

  useEffect(() => {
    axios.get("https://pm55.corsivalab.xyz/trustGroup/public/api/v1/product-categories").then((response) => {
      setParentOptions(response.data.data);
    });
  }, []);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    if (name === "parent") {
      if (!isParentSelectionValid(value, newBranch.id)) {
        toast.error("Invalid parent selection.");
        return;
      }
      const selectedParent = parentOptions.find((parent) => parent.id === value);
      setNewBranch((prevNewBranch) => ({
        ...prevNewBranch,
        parent: selectedParent || {
          id: "",
          name: "",
          desc: "",
        },
      }));

    } else {
      setNewBranch((prevNewBranch) => ({
        ...prevNewBranch,
        [name]: value,
      }));
    }
  };

  const isParentSelectionValid = (selectedParentId: string, branchId: string): boolean => {
    if (selectedParentId === branchId) {
      return false;
    }
    return true;
  };

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchKeyword(event.target.value);
  };

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
  };

  const indexOfLastBranch = currentPage * branchesPerPage;
  const indexOfFirstBranch = indexOfLastBranch - branchesPerPage;
  const currentBranches = branches.slice(indexOfFirstBranch, indexOfLastBranch);

  const filteredBranches = currentBranches.filter((branch) => {
    if (branch && branch.name) {
      const nameMatch = branch.name.toLowerCase().includes(searchKeyword.toLowerCase());
      const descMatch = branch.desc.toLowerCase().includes(searchKeyword.toLowerCase());
      return nameMatch || descMatch;
    }
    return false;
  });

  const totalPages = Math.ceil(branches.length / branchesPerPage);

  const openFormPopup = () => {
    setSelectedBranch(null);
    setNewBranch({
      id: "",
      name: "",
      desc: "",
      parent: {
        id: "",
        name: "",
        desc: "",
      },
    });
    setOpen(true);
  };

  const openEditFormPopup = (branch: Branch) => {
    setSelectedBranch(branch);
    setNewBranch(branch);
    setOpen(true);
  };

  const closeFormPopup = () => {
    setSelectedBranch(null);
    setOpen(false);
  };

  const openDeleteConfirmation = (branch: Branch) => {
    setDeleteConfirmationOpen(true);
    setBranchToDelete(branch);
  };

  const closeDeleteConfirmation = () => {
    setDeleteConfirmationOpen(false);
    setBranchToDelete(null);
  };

  const handleCreateBranch = async () => {
    try {
      await branchSchema.validate(newBranch, { abortEarly: false });
      createBranchMutation.mutate(newBranch);
      setNewBranch({
        id: "",
        name: "",
        desc: "",
        parent: {
          id: "",
          name: "",
          desc: "",
        },
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
      setNewBranch((prevNewBranch) => ({
        ...prevNewBranch,
        errors: validationErrors,
      }));
    }
  };

  const handleUpdateBranch = async () => {
    try {
      await branchSchema.validate(newBranch, { abortEarly: false });

      const updatedBranch: Branch = {
        id: selectedBranch?.id || "",
        name: newBranch.name || selectedBranch?.name || "",
        desc: newBranch.desc || selectedBranch?.desc || "",
        parent: {
          id: newBranch.parent.id || selectedBranch?.parent.id || "",
          name: newBranch.parent.name || selectedBranch?.parent.name || "",
          desc: newBranch.parent.desc || selectedBranch?.parent.desc || "",
        },
      };

      await updateBranchMutation.mutateAsync(updatedBranch);

      setSelectedBranch(null);
      setOpen(false);

      setNewBranch({
        id: "",
        name: "",
        desc: "",
        parent: {
          id: "",
          name: "",
          desc: "",
        },
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
      setNewBranch((prevNewBranch) => ({
        ...prevNewBranch,
        errors: validationErrors,
      }));
    }
  };

  const handleDeleteBranch = (branch: Branch | null) => {
    if (branch) {
      deleteBranchMutation.mutate(branch.id);
    }
    setDeleteConfirmationOpen(false);
    setBranchToDelete(null);
  };

  return (
    <div>
      <Helmet>
        <title>Products Categories | Trust Group</title>
        <meta name='description' content='Products Categories to have access!' />
      </Helmet>
      <div className="mb-10 flex items-center justify-between gap-3">
        <TextField
          label="Search"
          size="small"
          value={searchKeyword}
          onChange={handleSearchChange}
          variant="outlined"

        />
        <Button variant="contained" color="primary" onClick={openFormPopup}>
          Create Branch
        </Button>
      </div>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                {branches.length > 0 ? "Name" : <Skeleton variant="rectangular" height={40} animation="wave" />}
              </TableCell>
              <TableCell>
                {branches.length > 0 ? "Description" : <Skeleton variant="rectangular" height={40} animation="wave" />}
              </TableCell>
              <TableCell>
                {branches.length > 0 ? "Parent" : <Skeleton variant="rectangular" height={40} animation="wave" />}
              </TableCell>
              <TableCell align="right">
                {branches.length > 0 ? "Action" : <Skeleton variant="rectangular" height={40} animation="wave" />}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredBranches.length > 0 ? (
              filteredBranches.map((branch) => (
                <TableRow key={branch.id}>
                  <TableCell>{branch.name}</TableCell>
                  <TableCell>{branch.desc}</TableCell>
                  <TableCell>{branch.parent?.name}</TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={2} justifyContent={"end"}>
                      <Button variant="contained" color="primary" onClick={() => openEditFormPopup(branch)}>
                        Edit
                      </Button>
                      <Button variant="contained" color="secondary" onClick={() => openDeleteConfirmation(branch)}>
                        Delete
                      </Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4}>
                  {branches.length === 0 ? (
                    <Skeleton variant="rectangular" height={50} animation="wave" />
                  ) : (
                    <p className="text-[1.6rem] text-center">No branches found.</p>
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
        <DialogTitle className="!pt-10">{selectedBranch ? "Edit Branch" : "Create New Branch"}</DialogTitle>
        <DialogContent className="flex w-full flex-col gap-y-10 !pt-6">
          <TextField
            name="name"
            label="Name"
            value={newBranch.name}
            onChange={handleInputChange}
            variant="outlined"
            fullWidth
            error={!!newBranch.errors?.name}
            helperText={newBranch.errors?.name}
            sx={{ marginBottom: "2rem" }}
          />
          <TextField
            name="desc"
            label="Description"
            value={newBranch.desc}
            onChange={handleInputChange}
            variant="outlined"
            multiline
            rows={4}
            fullWidth
            error={!!newBranch.errors?.desc}
            helperText={newBranch.errors?.desc}
            sx={{ marginBottom: "2rem" }}
          />
          <TextField
            name="parent"
            label="Parent"
            select
            value={newBranch.parent?.id}
            onChange={handleInputChange}
            variant="outlined"
            fullWidth
            error={!!newBranch.errors?.parent}
            helperText={newBranch.errors?.parent}
            sx={{ marginBottom: "2rem" }}
          >
            <MenuItem value="">
              <em>Select a parent</em>
            </MenuItem>
            {parentOptions.map((parent) => (
              <MenuItem key={parent.id} value={parent.id}>
                {parent.name}
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions className="!p-10">
          {selectedBranch ? (
            <>
              <Button variant="contained" color="primary" onClick={handleUpdateBranch}>
                Update
              </Button>
              <Button variant="contained" color="secondary" onClick={closeFormPopup}>
                Cancel
              </Button>
            </>
          ) : (
            <>
              <Button variant="contained" color="primary" onClick={handleCreateBranch}>
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
        <DialogTitle>Delete Branch</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to delete this branch?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="secondary" onClick={() => handleDeleteBranch(branchToDelete)}>
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

export default BranchComponent;
