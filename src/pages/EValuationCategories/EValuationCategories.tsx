import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";

interface EValuationCategory {
  id: string;
  name: string;
  desc: string;
  parent: string;
}

const EValuationCategoriesComponent: React.FC = () => {
  const [categories, setCategories] = useState<EValuationCategory[]>([]);
  const [newCategory, setNewCategory] = useState({
    name: "",
    desc: "",
    parent: "",
  });
  const [selectedCategory, setSelectedCategory] = useState<EValuationCategory | null>(null);
  const [open, setOpen] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<EValuationCategory | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        "https://pm55.corsivalab.xyz/trustGroup/public/api/e-valuation-categories"
      );
      setCategories(response.data);
    } catch (error) {
      toast.error("Failed to fetch categories.");
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewCategory((prevNewCategory) => ({
      ...prevNewCategory,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchKeyword(event.target.value);
  };

  const openFormPopup = () => {
    setSelectedCategory(null);
    setOpen(true);
  };

  const openEditFormPopup = (category: EValuationCategory) => {
    setSelectedCategory(category);
    setNewCategory({
      name: category.name,
      desc: category.desc,
      parent: category.parent,
    });
    setOpen(true);
  };

  const closeFormPopup = () => {
    setSelectedCategory(null);
    setOpen(false);
  };

  const openDeleteConfirmation = (category: EValuationCategory) => {
    setCategoryToDelete(category);
    setDeleteConfirmationOpen(true);
  };

  const closeDeleteConfirmation = () => {
    setCategoryToDelete(null);
    setDeleteConfirmationOpen(false);
  };

  const createCategory = async () => {
    try {
      await axios.post("https://pm55.corsivalab.xyz/trustGroup/public/api/e-valuation-categories", {
        name: newCategory.name,
        desc: newCategory.desc,
        parent: newCategory.parent,
      });
      fetchCategories();
      toast.success("Category created successfully.");
      setNewCategory({ name: "", desc: "", parent: "" });
      setOpen(false);
    } catch (error) {
      toast.error("Failed to create category.");
    }
  };

  const updateCategory = async () => {
    try {
      if (!selectedCategory) return;
      await axios.put(
        `https://pm55.corsivalab.xyz/trustGroup/public/api/e-valuation-categories/${selectedCategory.id}`,
        {
          name: newCategory.name,
          desc: newCategory.desc,
          parent: newCategory.parent,
        }
      );

      setCategories((prevCategories) =>
        prevCategories.map((category) =>
          category.id === selectedCategory.id
            ? { ...category, name: newCategory.name, desc: newCategory.desc, parent: newCategory.parent }
            : category
        )
      );

      toast.success("Category updated successfully.");
      setSelectedCategory(null);
      setOpen(false);
      setNewCategory({ name: "", desc: "", parent: "" });
    } catch (error) {
      toast.error("Failed to update category.");
    }
  };

  const deleteCategory = async (category: EValuationCategory | null) => {
    if (!category) return;
    try {
      await axios.delete(
        `https://pm55.corsivalab.xyz/trustGroup/public/api/e-valuation-categories/${category.id}`
      );
      const updatedCategories = categories.filter((c) => c.id !== category.id);
      setCategories(updatedCategories);
      toast.success("Category deleted successfully.");
      setDeleteConfirmationOpen(false);
      setCategoryToDelete(null);
    } catch (error) {
      toast.error("Failed to delete category.");
    }
  };

  const filteredCategories = categories.filter((category) => {
    if (category.name && category.desc) {
      const nameMatch = category.name.toLowerCase().includes(searchKeyword.toLowerCase());
      const descMatch = category.desc.toLowerCase().includes(searchKeyword.toLowerCase());
      return nameMatch || descMatch;
    }
    return false;
  });

  const columns = [
    { field: "name", headerName: "Name", flex: 1 },
    { field: "desc", headerName: "Description", flex: 1 },
    { field: "parent", headerName: "Parent", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params: { row: EValuationCategory }) => (
        <div className="flex flex-wrap items-center justify-end gap-5">
          <Button variant="contained" color="primary" onClick={() => openEditFormPopup(params.row)}>
            Edit
          </Button>
          <Button variant="contained" color="secondary" onClick={() => openDeleteConfirmation(params.row)}>
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="mb-10 flex items-center justify-between gap-3">
        <TextField
          label="Search"
          size="small"
          value={searchKeyword}
          onChange={handleSearchChange}
          variant="outlined"
        />
        <Button variant="contained" color="primary" onClick={openFormPopup}>
          Create Category
        </Button>
      </div>
      <div style={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={filteredCategories}
          columns={columns}
          components={{
            Toolbar: GridToolbar,
          }}
        />
      </div>
      <Dialog open={open} onClose={closeFormPopup} PaperProps={{ sx: { width: "100%", maxWidth: "50rem" } }}>
        <DialogTitle>{selectedCategory ? "Edit Category" : "Create New Category"}</DialogTitle>
        <DialogContent>
          <TextField
            name="name"
            label="Name"
            value={newCategory.name}
            onChange={handleInputChange}
            variant="outlined"
            fullWidth
            margin="normal"
          />
          <TextField
            name="desc"
            label="Description"
            value={newCategory.desc}
            onChange={handleInputChange}
            variant="outlined"
            fullWidth
            margin="normal"
          />
          <TextField
            name="parent"
            label="Parent"
            value={newCategory.parent}
            onChange={handleInputChange}
            variant="outlined"
            fullWidth
            margin="normal"
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
          <Button onClick={() => deleteCategory(categoryToDelete)} color="error">
            Delete
          </Button>
          <Button onClick={closeDeleteConfirmation}>Cancel</Button>
        </DialogActions>
      </Dialog>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </div>
  );
};

export default EValuationCategoriesComponent;
