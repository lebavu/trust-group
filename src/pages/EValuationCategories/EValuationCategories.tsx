import { useState, ChangeEvent } from "react";
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
  Stack,
  Typography,
  Pagination,
  Skeleton,
  InputAdornment
} from "@mui/material";
import { Helmet } from "react-helmet-async";
import { Search } from "@mui/icons-material";
// Replace with actual API types
import { EValuationCategory } from "@/api/types";
// Replace with actual API functions
import { getEValuationsCategoriesById, fetchEValuationsCategories, createEValuationCategory, updateEValuationCategory, deleteEValuationCategory } from "@/api/e-valuation-category.api";

// Schema for validating the EValuationCategory object
const eValuationCategorySchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  desc: yup.string().required("desc is required"),
  parent: yup.string().required("Parent is required"),
});

// Main component for managing eValuationsCategories
const EValuationCategoryComponent: React.FC = () => {
  const queryClient = useQueryClient();
  const { data: eValuationsCategories = [] } = useQuery<EValuationCategory[]>("eValuationsCategories", fetchEValuationsCategories);

  async function fetchData(id: string) {
    try {
      const data = await getEValuationsCategoriesById(id);
      console.log(data?.name); // Do something with the data
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  // Call the fetchData function with the desired ID
  const categoryId = "1"; // Replace '123' with the desired ID
  fetchData(categoryId);

  const createEValuationCategoryMutation = useMutation(createEValuationCategory, {
    onSuccess: () => {
      queryClient.invalidateQueries("eValuationsCategories");
      toast.success("EValuationCategory created successfully.");
    },
    onError: () => {
      toast.error("Failed to create EValuationCategory.");
    },
  });

  const updateEValuationCategoryMutation = useMutation(updateEValuationCategory, {
    onSuccess: () => {
      queryClient.invalidateQueries("eValuationsCategories");
      toast.success("EValuationCategory updated successfully.");
    },
    onError: () => {
      toast.error("Failed to update EValuationCategory.");
    },
  });

  const deleteEValuationCategoryMutation = useMutation(deleteEValuationCategory, {
    onSuccess: () => {
      queryClient.invalidateQueries("eValuationsCategories");
      toast.success("EValuationCategory deleted successfully.");
    },
    onError: () => {
      toast.error("Failed to delete EValuationCategory.");
    },
  });

  const [newEValuationCategory, setNewEValuationCategory] = useState<EValuationCategory>({
    id: "",
    name: "",
    desc: "",
    parent: "",
  });

  const [selectedEValuationCategory, setSelectedEValuationCategory] = useState<EValuationCategory | null>(null);
  const [open, setOpen] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const eValuationsCategoriesPerPage = 10;
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [eValuationCategoryToDelete, setEValuationCategoryToDelete] = useState<EValuationCategory | null>(null);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setNewEValuationCategory((prevNewEValuationCategory) => ({
      ...prevNewEValuationCategory,
      [name]: value,
    }));
  };

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchKeyword(event.target.value);
  };

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
  };

  const indexOfLastEValuationCategory = currentPage * eValuationsCategoriesPerPage;
  const indexOfFirstEValuationCategory = indexOfLastEValuationCategory - eValuationsCategoriesPerPage;
  const currentEValuationsCategories = eValuationsCategories.slice(indexOfFirstEValuationCategory, indexOfLastEValuationCategory);

  const filteredEValuationsCategories = currentEValuationsCategories.filter((eValuationCategory) => {
    if (eValuationCategory && eValuationCategory.name) {
      const nameMatch = eValuationCategory.name.toLowerCase().includes(searchKeyword.toLowerCase());
      const descMatch = eValuationCategory.desc.toLowerCase().includes(searchKeyword.toLowerCase());
      return nameMatch || descMatch;
    }
    return false;
  });

  const totalPages = Math.ceil(eValuationsCategories.length / eValuationsCategoriesPerPage);

  const openFormPopup = () => {
    setSelectedEValuationCategory(null);
    setNewEValuationCategory({
      id: "",
      name: "",
      desc: "",
      parent: "",
    });
    setOpen(true);
  };

  const openEditFormPopup = (eValuationCategory: EValuationCategory) => {
    setSelectedEValuationCategory(eValuationCategory);
    setNewEValuationCategory({
      ...eValuationCategory,
    });
    setOpen(true);
  };

  const closeFormPopup = () => {
    setSelectedEValuationCategory(null);
    setOpen(false);
  };

  const openDeleteConfirmation = (eValuationCategory: EValuationCategory) => {
    setDeleteConfirmationOpen(true);
    setEValuationCategoryToDelete(eValuationCategory);
  };

  const closeDeleteConfirmation = () => {
    setDeleteConfirmationOpen(false);
    setEValuationCategoryToDelete(null);
  };

  const handleCreateEValuationCategory = async () => {
    try {
      await eValuationCategorySchema.validate(newEValuationCategory, { abortEarly: false });
      createEValuationCategoryMutation.mutate(newEValuationCategory);
      setNewEValuationCategory({
        id: "",
        name: "",
        desc: "",
        parent: "",
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
      setNewEValuationCategory((prevNewEValuationCategory) => ({
        ...prevNewEValuationCategory,
        errors: validationErrors,
      }));
    }
  };

  const handleUpdateEValuationCategory = async () => {
    try {
      await eValuationCategorySchema.validate(newEValuationCategory, { abortEarly: false });

      const updatedEValuationCategory: EValuationCategory = {
        id: selectedEValuationCategory?.id || "",
        name: newEValuationCategory.name || selectedEValuationCategory?.name || "",
        desc: newEValuationCategory.desc || selectedEValuationCategory?.desc || "",
        parent: newEValuationCategory.parent || selectedEValuationCategory?.parent || "",
      };

      await updateEValuationCategoryMutation.mutateAsync(updatedEValuationCategory);

      setSelectedEValuationCategory(null);
      setOpen(false);

      setNewEValuationCategory({
        id: "",
        name: "",
        desc: "",
        parent: "",
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
      setNewEValuationCategory((prevNewEValuationCategory) => ({
        ...prevNewEValuationCategory,
        errors: validationErrors,
      }));
    }
  };

  const handleDeleteEValuationCategory = (eValuationCategory: EValuationCategory | null) => {
    if (eValuationCategory) {
      deleteEValuationCategoryMutation.mutate(eValuationCategory.id);
    }
    setDeleteConfirmationOpen(false);
    setEValuationCategoryToDelete(null);
  };

  return (
    <div>
      <Helmet>
        <title>Categories | Trust Group</title>
        <meta name='description' content='Categories to have access!' />
      </Helmet>
      <Typography variant="h3" mb={"3rem"}>
        EValuationsCategories List
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
          Create EValuationCategory
        </Button>
      </div>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                {eValuationsCategories.length > 0 ? "Id" : <Skeleton variant="rectangular" height={40} animation="wave" />}
              </TableCell>
              <TableCell>
                {eValuationsCategories.length > 0 ? "Name" : <Skeleton variant="rectangular" height={40} animation="wave" />}
              </TableCell>
              <TableCell>
                {eValuationsCategories.length > 0 ? "desc" : <Skeleton variant="rectangular" height={40} animation="wave" />}
              </TableCell>
              <TableCell sx={{ maxWidth: "30rem" }}>
                {eValuationsCategories.length > 0 ? "Parent" : <Skeleton variant="rectangular" height={40} animation="wave" />}
              </TableCell>
              <TableCell align="right">
                {eValuationsCategories.length > 0 ? "Action" : <Skeleton variant="rectangular" height={40} animation="wave" />}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredEValuationsCategories.length > 0 ? (
              filteredEValuationsCategories.map((eValuationCategory) => (
                <TableRow key={eValuationCategory.id}>
                  <TableCell>{eValuationCategory.id}</TableCell>
                  <TableCell>{eValuationCategory.name}</TableCell>
                  <TableCell>{eValuationCategory.desc}</TableCell>
                  <TableCell></TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={2} justifyContent={"end"}>
                      <Button variant="contained" color="primary" onClick={() => openEditFormPopup(eValuationCategory)}>
                        Edit
                      </Button>
                      <Button variant="contained" color="secondary" onClick={() => openDeleteConfirmation(eValuationCategory)}>
                        Delete
                      </Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5}>
                  {eValuationsCategories.length === 0 ? (
                    <Skeleton variant="rectangular" height={50} animation="wave" />
                  ) : (
                    <p className="text-[1.6rem] text-center">No eValuationsCategories found.</p>
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
        <DialogTitle className="!pt-10">{selectedEValuationCategory ? "Edit EValuationCategory" : "Create New EValuationCategory"}</DialogTitle>
        <DialogContent className="flex w-full flex-col gap-y-6 !pt-6">
          <TextField
            name="name"
            label="Name"
            value={newEValuationCategory.name}
            onChange={handleInputChange}
            variant="outlined"
            size="small"
            fullWidth
            error={!!newEValuationCategory.errors?.name}
            helperText={newEValuationCategory.errors?.name}
            sx={{ marginBottom: "2rem" }}
          />
          <TextField
            name="desc"
            label="Desc"
            value={newEValuationCategory.desc}
            onChange={handleInputChange}
            variant="outlined"
            multiline
            rows={4}
            fullWidth
            error={!!newEValuationCategory.errors?.desc}
            helperText={newEValuationCategory.errors?.desc}
            sx={{ marginBottom: "2rem" }}
          />
          <TextField
            name="parent"
            label="Parent"
            value={newEValuationCategory.parent}
            onChange={handleInputChange}
            variant="outlined"
            size="small"
            fullWidth
            error={!!newEValuationCategory.errors?.parent}
            helperText={newEValuationCategory.errors?.parent}
            sx={{ marginBottom: "2rem" }}
          />
        </DialogContent>
        <DialogActions className="!p-10">
          {selectedEValuationCategory ? (
            <>
              <Button variant="contained" color="primary" onClick={handleUpdateEValuationCategory}>
                Update
              </Button>
              <Button variant="contained" color="secondary" onClick={closeFormPopup}>
                Cancel
              </Button>
            </>
          ) : (
            <>
              <Button variant="contained" color="primary" onClick={handleCreateEValuationCategory}>
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
        <DialogTitle>Delete EValuationCategory</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to delete this EValuationCategory?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="secondary" onClick={() => handleDeleteEValuationCategory(eValuationCategoryToDelete)}>
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

export default EValuationCategoryComponent;
