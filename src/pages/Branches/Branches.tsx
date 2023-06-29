import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Button,
  TextField,
  Modal,
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
} from "@mui/material";

const BranchComponent = () => {
  const [branches, setBranches] = useState([]);
  const [newBranch, setNewBranch] = useState({
    name: "",
    address: "",
    image: null,
  });
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [open, setOpen] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [branchesPerPage] = useState(5);
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [branchToDelete, setBranchToDelete] = useState(null);

  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8888/trustGroup/public/api/branches"
      );
      setBranches(response.data.data);
    } catch (error) {
      toast.error("Failed to fetch branches.");
    }
  };

  const createBranch = async () => {
    try {
      const formData = new FormData();
      formData.append("name", newBranch.name);
      formData.append("address", newBranch.address);
      formData.append("image", newBranch.image);
      const response = await axios.post(
        "http://localhost:8888/trustGroup/public/api/branches",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      // setBranches((prevBranches) => [response.data.data, ...prevBranches]);
      // const newBranchData = response.data.data;
      // setBranches((prevBranches) => [newBranchData, ...prevBranches]);
      await fetchBranches();
      toast.success("Branch created successfully.");
      setNewBranch({
        name: "",
        address: "",
        image: null,
      });
      setOpen(false);
    } catch (error) {
      toast.error("Failed to create branch.");
    }
  };

  const updateBranch = async () => {
    try {
      const formData = new FormData();
      formData.append("_method", "PUT");
      formData.append("name", newBranch.name);
      formData.append("address", newBranch.address);
      formData.append("image", newBranch.image);

      const response = await axios.post(
        `http://localhost:8888/trustGroup/public/api/branches/${selectedBranch.data.id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // const updatedBranchData = response.data.data;
      // setBranches((prevBranches) =>
      //   prevBranches.map((branch) =>
      //     branch.data.id === selectedBranch.data.id ? updatedBranchData : branch
      //   )
      // );
      await fetchBranches();
      toast.success("Branch updated successfully.");
      setSelectedBranch(null);
      setOpen(false);
    } catch (error) {
      toast.error("Failed to update branch.");
    }
  };

  const deleteBranch = async (branch) => {
    try {
      await axios.delete(
        `http://localhost:8888/trustGroup/public/api/branches/${branch.data.id}`
      );
      const updatedBranches = branches.filter(
        (p) => p.data.id !== branch.data.id
      );
      setBranches(updatedBranches);
      toast.success("Branch deleted successfully.");
      setDeleteConfirmationOpen(false);
      setBranchToDelete(null);
    } catch (error) {
      toast.error("Failed to delete branch.");
    }
  };

  const handleInputChange = (event) => {
    setNewBranch((prevNewBranch) => ({
      ...prevNewBranch,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSearchChange = (event) => {
    setSearchKeyword(event.target.value);
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };
  const handleFileChange = (event) => {
    setNewBranch({
      ...newBranch,
      image: event.target.files[0],
    });
  };

  const indexOfLastBranch = currentPage * branchesPerPage;
  const indexOfFirstBranch = indexOfLastBranch - branchesPerPage;
  const currentBranches = branches.slice(indexOfFirstBranch, indexOfLastBranch);

  const filteredBranches = currentBranches.filter((branch) => {
    if (branch.data && branch.data.name) {
      const nameMatch = branch.data.name
        .toLowerCase()
        .includes(searchKeyword.toLowerCase());
      const addressMatch = branch.data.address
        .toLowerCase()
        .includes(searchKeyword.toLowerCase());
      return nameMatch || addressMatch;
    }
    return false;
  });

  const totalPages = Math.ceil(branches.length / branchesPerPage);

  const openFormPopup = () => {
    setOpen(true);
  };

  const openEditFormPopup = (branch) => {
    setSelectedBranch(branch);
    setNewBranch({
      name: branch.data.name,
      address: branch.data.address,
      image: branch.data.image_url,
    });
    setOpen(true);
  };

  const closeFormPopup = () => {
    setSelectedBranch(null);
    setOpen(false);
  };

  const openDeleteConfirmation = (branch) => {
    setDeleteConfirmationOpen(true);
    setBranchToDelete(branch);
  };

  const closeDeleteConfirmation = () => {
    setDeleteConfirmationOpen(false);
    setBranchToDelete(null);
  };

  return (
    <div>
      <div className="mb-10 flex items-center justify-between gap-3">
        <TextField
          label="Search"
          size="small"
          value={searchKeyword}
          onChange={handleSearchChange}
          variant="outlined"
          mb={2}
        />
        <Button variant="contained" color="primary" onClick={openFormPopup}>
          Create Branch
        </Button>
      </div>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Address</TableCell>
              <TableCell sx={{ maxWidth: "30rem" }}>Image</TableCell>
              <TableCell align="right">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredBranches.map((branch) => (
              <TableRow key={branch.data.id}>
                <TableCell>{branch.data.name}</TableCell>
                <TableCell>{branch.data.address}</TableCell>
                <TableCell className="max-w-[30rem] break-words">
                  {branch.data.image_url}
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap items-center justify-end gap-5">
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => openEditFormPopup(branch)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => openDeleteConfirmation(branch)}
                    >
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
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
      <Dialog
        open={open}
        onClose={closeFormPopup}
        PaperProps={{ sx: { width: "100%", maxWidth: "50rem" } }}
      >
        <DialogTitle className="!pt-10">
          {selectedBranch ? "Edit Branch" : "Create New Branch"}
        </DialogTitle>
        <DialogContent className="flex w-full flex-col gap-y-10 !pt-6">
          <TextField
            name="name"
            label="Name"
            value={newBranch.name}
            onChange={handleInputChange}
            variant="outlined"
            fullWidth
            mb={2}
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
            mb={2}
          />
          {selectedBranch && selectedBranch.data.image_url && (
            <img
              src={selectedBranch.data.image_url}
              alt="Branch"
              style={{ width: "100%", marginBottom: "1rem" }}
            />
          )}
          <input type="file" onChange={handleFileChange} />
        </DialogContent>
        <DialogActions className="!p-10">
          {selectedBranch ? (
            <>
              <Button
                variant="contained"
                color="primary"
                onClick={updateBranch}
              >
                Update
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={closeFormPopup}
              >
                Cancel
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="contained"
                color="primary"
                onClick={createBranch}
              >
                Create
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={closeFormPopup}
              >
                Cancel
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
      <Dialog open={deleteConfirmationOpen} onClose={closeDeleteConfirmation}>
        <DialogTitle>Delete Branch</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this branch?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => deleteBranch(branchToDelete)}
          >
            Delete
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={closeDeleteConfirmation}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
      <ToastContainer />
    </div>
  );
};

export default BranchComponent;
