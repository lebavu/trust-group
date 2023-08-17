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
  Stack,
  Skeleton,
  InputAdornment
} from "@mui/material";
import { Helmet } from "react-helmet-async";
import { Search } from "@mui/icons-material";
import { Branch } from "@/api/types";
import { fetchBranches, createBranch, updateBranch, deleteBranch } from "@/api/branch.api";
import MediaManager from "@/components/Media";

const branchSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  address: yup.string().required("Address is required"),
  image_url: yup.string().required("Address is required"),
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
  const branchesPerPage = 10;
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [branchToDelete, setBranchToDelete] = useState<Branch | null>(null);
  const [selectedImageUrl, setSelectedImageUrl] = useState("");

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
    setSelectedImageUrl("");
    setOpen(true);
  };

  const openEditFormPopup = (branch: Branch) => {
    setSelectedBranch(branch);
    setNewBranch(branch);
    setSelectedImageUrl(branch.image_url);
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

  const handleSelectedMedia = (media: any) => {
    setSelectedImageUrl(media.image_url);
    setNewBranch((prevNewBranch) => ({
      ...prevNewBranch,
      image_url: media.image_url,
    }));
  };

  return (
    <div>
      <Helmet>
        <title>Branches | Trust Group</title>
        <meta name='description' content='Branches to have access!' />
      </Helmet>
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
          {selectedImageUrl && (
            <div>
              <p className="text-[1.2rem] text-gray-700 mb-2">Selected Image:</p>
              <div className="image w-[8rem] h-[8rem] bg-slate-100 border-solid border-slate-300 border-[1px]">
                <img src={selectedImageUrl} className="w-full h-full object-cover" alt="Selected Media" />
              </div>
            </div>
          )}
          <MediaManager onMediaSelect={handleSelectedMedia} />
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
