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

const EValuationComponent = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState({
    name: "",
    desc: "",
    parent: "",
  });
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [open, setOpen] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [categoriesPerPage] = useState(5);
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:8888/trustGroup/public/api/e-valuation-categories");
      setCategories(response.data.data);
    } catch (error) {
      toast.error("Failed to fetch categories.");
    }
  };

  const createCategory = async () => {
    try {
      const response = await axios.post("http://localhost:8888/trustGroup/public/api/e-valuation-categories", {
        name: newCategory.name,
        desc: newCategory.desc,
        parent: newCategory.parent,
      });
      await fetchCategories();
      toast.success("Category created successfully.");
      setNewCategory({
        name: "",
        desc: "",
        parent: "",
      });
      setOpen(false);
    } catch (error) {
      toast.error("Failed to create category.");
    }
  };

  const updateCategory = async () => {
    try {
      const response = await axios.put(
        `http://localhost:8888/trustGroup/public/api/e-valuation-categories/${selectedCategory.data.id}`,
        {
          name: newCategory.name,
          desc: newCategory.desc,
          parent: newCategory.parent,
        },
      );
      await fetchCategories();
      toast.success("Category updated successfully.");
      setSelectedCategory(null);
      setOpen(false);
    } catch (error) {
      toast.error("Failed to update category.");
    }
  };

  const deleteCategory = async (category) => {
    try {
      await axios.delete(`http://localhost:8888/trustGroup/public/api/e-valuation-categories/${category.data.id}`);
      const updatedCategories = categories.filter((p) => p.data.id !== category.data.id);
      setCategories(updatedCategories);
      toast.success("Category deleted successfully.");
      setDeleteConfirmationOpen(false);
      setCategoryToDelete(null);
    } catch (error) {
      toast.error("Failed to delete category.");
    }
  };

  const handleInputChange = (event) => {
    setNewCategory((prevNewCategory) => ({
      ...prevNewCategory,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSearchChange = (event) => {
    setSearchKeyword(event.target.value);
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const indexOfLastCategory = currentPage * categoriesPerPage;
  const indexOfFirstCategory = indexOfLastCategory - categoriesPerPage;
  const currentCategories = categories.slice(indexOfFirstCategory, indexOfLastCategory);

  const filteredCategories = currentCategories.filter((category) => {
    if (category.data && category.data.name) {
      const nameMatch = category.data.name.toLowerCase().includes(searchKeyword.toLowerCase());
      const descMatch = category.data.desc.toLowerCase().includes(searchKeyword.toLowerCase());
      return nameMatch || descMatch;
    }
    return false;
  });

  const totalPages = Math.ceil(categories.length / categoriesPerPage);

  const openFormPopup = () => {
    setOpen(true);
  };

  const openEditFormPopup = (category) => {
    setSelectedCategory(category);
    setNewCategory({
      name: category.data.name,
      desc: category.data.desc,
      parent: category.data.parent,
    });
    setOpen(true);
  };

  const closeFormPopup = () => {
    setSelectedCategory(null);
    setOpen(false);
  };

  const openDeleteConfirmation = (category) => {
    setDeleteConfirmationOpen(true);
    setCategoryToDelete(category);
  };

  const closeDeleteConfirmation = () => {
    setDeleteConfirmationOpen(false);
    setCategoryToDelete(null);
  };

  return (
    <div>
      <div className='mb-10 flex items-center justify-between gap-3'>
        <TextField label='Search' size='small' value={searchKeyword} onChange={handleSearchChange} variant='outlined' />
        <Button variant='contained' color='primary' onClick={openFormPopup}>
          Create Category
        </Button>
      </div>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Parent</TableCell>
              <TableCell align='right'>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCategories.map((category) => (
              <TableRow key={category.data.id}>
                <TableCell>{category.data.name}</TableCell>
                <TableCell>{category.data.desc}</TableCell>
                <TableCell>{category.data.parent}</TableCell>
                <TableCell>
                  <div className='flex flex-wrap items-center justify-end gap-5'>
                    <Button variant='contained' color='primary' onClick={() => openEditFormPopup(category)}>
                      Edit
                    </Button>
                    <Button variant='contained' color='secondary' onClick={() => openDeleteConfirmation(category)}>
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box mt={2} display='flex' justifyContent='center'>
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={handlePageChange}
          color='primary'
          showFirstButton
          showLastButton
        />
      </Box>
      <Dialog open={open} onClose={closeFormPopup} PaperProps={{ sx: { width: "100%", maxWidth: "50rem" } }}>
        <DialogTitle>{selectedCategory ? "Edit Category" : "Create New Category"}</DialogTitle>
        <DialogContent>
          <TextField
            name='name'
            label='Name'
            value={newCategory.name}
            onChange={handleInputChange}
            variant='outlined'
            fullWidth
            margin='normal'
          />
          <TextField
            name='desc'
            label='Description'
            value={newCategory.desc}
            onChange={handleInputChange}
            variant='outlined'
            fullWidth
            margin='normal'
          />
          <TextField
            name='parent'
            label='Parent'
            value={newCategory.parent || ""}
            onChange={handleInputChange}
            variant='outlined'
            fullWidth
            margin='normal'
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={selectedCategory ? updateCategory : createCategory}>
            {selectedCategory ? "Update" : "Create"}
          </Button>
          <Button onClick={closeFormPopup}>Cancel</Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={deleteConfirmationOpen}
        onClose={closeDeleteConfirmation}
        PaperProps={{ sx: { width: "100%", maxWidth: "25rem" } }}
      >
        <DialogTitle>Delete Category</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to delete this category?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => deleteCategory(categoryToDelete)} color='error'>
            Delete
          </Button>
          <Button onClick={closeDeleteConfirmation}>Cancel</Button>
        </DialogActions>
      </Dialog>
      <ToastContainer position='top-right' autoClose={3000} hideProgressBar />
    </div>
  );
};

export default EValuationComponent;
