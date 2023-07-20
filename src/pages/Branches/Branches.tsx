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
  InputAdornment
} from "@mui/material";
import { Search } from "@mui/icons-material";
import { Branch } from "@/api/types";
import { fetchBranches, createBranch, updateBranch, deleteBranch } from "@/api/branch.api";

// Schema for validating the branch object
const branchSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  address: yup.string().required("Address is required"),
  image_url: yup
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
    })
});

// Function to render the image URL or file preview
const renderImageUrl = (imageUrl: string | File | undefined): ReactNode => {
  if (typeof imageUrl === "string") {
    return <img src={imageUrl} alt="Branch" style={{ width: "5rem" }} />;
  } else if (imageUrl instanceof File) {
    const temporaryUrl = URL.createObjectURL(imageUrl);
    return <img src={temporaryUrl} alt="Branch" style={{ width: "5rem" }} />;
  } else {
    return null;
  }
};

// Main component for managing branches
const BranchComponent: React.FC = () => {
  const queryClient = useQueryClient();

  const { data: branches = [] } = useQuery<Branch[]>("branches", fetchBranches);

  const createBranchMutation = useMutation(createBranch, {
    onSuccess: () => {
      queryClient.invalidateQueries("branches");
      toast.success("Branch created successfully.");
    },
    onError: () => {
      toast.error("Failed to create branch.");
    },
  });

  const updateBranchMutation = useMutation(updateBranch, {
    onSuccess: () => {
      queryClient.invalidateQueries("branches");
      toast.success("Branch updated successfully.");
    },
    onError: () => {
      toast.error("Failed to update branch.");
    },
  });

  const deleteBranchMutation = useMutation(deleteBranch, {
    onSuccess: () => {
      queryClient.invalidateQueries("branches");
      toast.success("Branch deleted successfully.");
    },
    onError: () => {
      toast.error("Failed to delete branch.");
    },
  });

  const [newBranch, setNewBranch] = useState<Branch>({
    id: "",
    name: "",
    address: "",
    image_url: "",
  });

  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [open, setOpen] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const branchesPerPage = 5;
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [branchToDelete, setBranchToDelete] = useState<Branch | null>(null);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setNewBranch((prevNewBranch) => ({
      ...prevNewBranch,
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
      setNewBranch((prevNewBranch) => ({
        ...prevNewBranch,
        image_url: prevNewBranch.image_url instanceof File ? prevNewBranch.image_url : file,
      }));

      if (selectedBranch) {
        setSelectedBranch((prevSelectedBranch) => ({
          ...(prevSelectedBranch as Branch),
          image_url: prevSelectedBranch?.image_url instanceof File ? prevSelectedBranch.image_url : file,
        }));
      }
    }
  };
  const indexOfLastBranch = currentPage * branchesPerPage;
  const indexOfFirstBranch = indexOfLastBranch - branchesPerPage;
  const currentBranches = branches.slice(indexOfFirstBranch, indexOfLastBranch);

  const filteredBranches = currentBranches.filter((branch) => {
    if (branch && branch.name) {
      const nameMatch = branch.name.toLowerCase().includes(searchKeyword.toLowerCase());
      const addressMatch = branch.address.toLowerCase().includes(searchKeyword.toLowerCase());
      return nameMatch || addressMatch;
    }
    return false;
  });

  const totalPages = Math.ceil(branches.length / branchesPerPage);

  const openFormPopup = () => {
    setSelectedBranch(null);
    setNewBranch({
      id: "",
      name: "",
      address: "",
      image_url: "",
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
        address: "",
        image_url: "",
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
        address: newBranch.address || selectedBranch?.address || "",
        image_url: newBranch.image_url || selectedBranch?.image_url || "",
      };

      // Check if the image URL is not changed, use the current value
      if (!newBranch.image_url) {
        updatedBranch.image_url = selectedBranch?.image_url || "";
      }

      await updateBranchMutation.mutateAsync(updatedBranch);

      setSelectedBranch(null);
      setOpen(false);

      setNewBranch({
        id: "",
        name: "",
        address: "",
        image_url: "",
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
      <Typography variant="h3" mb={"3rem"}>
        Branches List
      </Typography>
      <div className="mb-10 flex items-center justify-between gap-3">
        <TextField
          label="Search"
          size="small"
          value={searchKeyword}
          onChange={handleSearchChange}
          variant="outlined"
          sx={{ marginBottom: "2rem" }}
          InputProps={{
            endAdornment: (
              <InputAdornment position='end'>
                <Search />
              </InputAdornment>
            )
          }}
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
                {branches.length > 0 ? "Address" : <Skeleton variant="rectangular" height={40} animation="wave" />}
              </TableCell>
              <TableCell sx={{ maxWidth: "30rem" }}>
                {branches.length > 0 ? "Image" : <Skeleton variant="rectangular" height={40} animation="wave" />}
              </TableCell>
              <TableCell align="right">{branches.length > 0 ? "Action" : <Skeleton variant="rectangular" height={40} animation="wave" />}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredBranches.length > 0 ? (
              filteredBranches.map((branch) => (
                <TableRow key={branch.id}>
                  <TableCell>{branch.name}</TableCell>
                  <TableCell>{branch.address}</TableCell>
                  <TableCell className="max-w-[30rem] break-words">{renderImageUrl(branch.image_url)}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap items-center justify-end gap-5">
                      <Button variant="contained" color="primary" onClick={() => openEditFormPopup(branch)}>
                        Edit
                      </Button>
                      <Button variant="contained" color="secondary" onClick={() => openDeleteConfirmation(branch)}>
                        Delete
                      </Button>
                    </div>
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
        <DialogContent className="flex w-full flex-col gap-y-6 !pt-6">
          <TextField
            name="name"
            label="Name"
            value={newBranch.name}
            onChange={handleInputChange}
            variant="outlined"
            size="small"
            fullWidth
            error={!!newBranch.errors?.name}
            helperText={newBranch.errors?.name}
            sx={{ marginBottom: "2rem" }}
          />
          <TextField
            name="address"
            label="Address"
            value={newBranch.address}
            onChange={handleInputChange}
            variant="outlined"
            multiline
            rows={4}
            fullWidth
            error={!!newBranch.errors?.address}
            helperText={newBranch.errors?.address}
            sx={{ marginBottom: "2rem" }}
          />
          {selectedBranch && selectedBranch.image_url && (
            <>
              {renderImageUrl(selectedBranch.image_url)}
              {newBranch.errors?.image_url && (
                <div className="error-text">{newBranch.errors.image_url}</div>
              )}
            </>
          )}
          <input type="file" onChange={handleFileChange} />
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
