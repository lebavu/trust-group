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

const ProductCategoriesComponent = () => {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: "",
    desc: "",
    parent: "",
  });
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [open, setOpen] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(5);
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8888/trustGroup/public/api/product-categories"
      );
      setProducts(response.data.data);
    } catch (error) {
      toast.error("Failed to fetch products.");
    }
  };

  const createProduct = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8888/trustGroup/public/api/product-categories",
        {
          name: newProduct.name,
          desc: newProduct.desc,
          parent: newProduct.parent,
        }
      );
      await fetchProducts();
      toast.success("Product created successfully.");
      setNewProduct({
        name: "",
        desc: "",
        parent: "",
      });
      setOpen(false);
    } catch (error) {
      toast.error("Failed to create product.");
    }
  };

  const updateProduct = async () => {
    try {
      const response = await axios.put(
        `http://localhost:8888/trustGroup/public/api/product-categories/${selectedProduct.data.id}`,
        {
          name: newProduct.name,
          desc: newProduct.desc,
          parent: newProduct.parent,
        }
      );
      await fetchProducts();
      toast.success("Product updated successfully.");
      setSelectedProduct(null);
      setOpen(false);
    } catch (error) {
      toast.error("Failed to update product.");
    }
  };

  const deleteProduct = async (product) => {
    try {
      await axios.delete(
        `http://localhost:8888/trustGroup/public/api/product-categories/${product.data.id}`
      );
      const updatedProducts = products.filter(
        (p) => p.data.id !== product.data.id
      );
      setProducts(updatedProducts);
      toast.success("Product deleted successfully.");
      setDeleteConfirmationOpen(false);
      setProductToDelete(null);
    } catch (error) {
      toast.error("Failed to delete product.");
    }
  };

  const handleInputChange = (event) => {
    setNewProduct((prevNewProduct) => ({
      ...prevNewProduct,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSearchChange = (event) => {
    setSearchKeyword(event.target.value);
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const filteredProducts = currentProducts.filter((product) => {
    if (product.data && product.data.name) {
      const nameMatch = product.data.name
        .toLowerCase()
        .includes(searchKeyword.toLowerCase());
      const descMatch = product.data.desc
        .toLowerCase()
        .includes(searchKeyword.toLowerCase());
      return nameMatch || descMatch;
    }
    return false;
  });

  const totalPages = Math.ceil(products.length / productsPerPage);

  const openFormPopup = () => {
    setOpen(true);
  };

  const openEditFormPopup = (product) => {
    setSelectedProduct(product);
    setNewProduct({
      name: product.data.name,
      desc: product.data.desc,
      parent: product.data.parent,
    });
    setOpen(true);
  };

  const closeFormPopup = () => {
    setSelectedProduct(null);
    setOpen(false);
  };

  const openDeleteConfirmation = (product) => {
    setDeleteConfirmationOpen(true);
    setProductToDelete(product);
  };

  const closeDeleteConfirmation = () => {
    setDeleteConfirmationOpen(false);
    setProductToDelete(null);
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
        />
        <Button variant="contained" color="primary" onClick={openFormPopup}>
          Create Product
        </Button>
      </div>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Parent</TableCell>
              <TableCell align="right">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredProducts.map((product) => (
              <TableRow key={product.data.id}>
                <TableCell>{product.data.name}</TableCell>
                <TableCell>{product.data.desc}</TableCell>
                <TableCell>{product.data.parent}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap items-center justify-end gap-5">
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => openEditFormPopup(product)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => openDeleteConfirmation(product)}
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
        <DialogTitle>
          {selectedProduct ? "Edit Product" : "Create New Product"}
        </DialogTitle>
        <DialogContent>
          <TextField
            name="name"
            label="Name"
            value={newProduct.name}
            onChange={handleInputChange}
            variant="outlined"
            fullWidth
            margin="normal"
          />
          <TextField
            name="desc"
            label="Description"
            value={newProduct.desc}
            onChange={handleInputChange}
            variant="outlined"
            fullWidth
            margin="normal"
          />
          <TextField
            name="parent"
            label="Parent"
            value={newProduct.parent}
            onChange={handleInputChange}
            variant="outlined"
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={selectedProduct ? updateProduct : createProduct}>
            {selectedProduct ? "Update" : "Create"}
          </Button>
          <Button onClick={closeFormPopup}>Cancel</Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={deleteConfirmationOpen}
        onClose={closeDeleteConfirmation}
        PaperProps={{ sx: { width: "100%", maxWidth: "40rem" } }}
      >
        <DialogTitle>Delete Product</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the product?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => deleteProduct(productToDelete)} color="error">
            Delete
          </Button>
          <Button onClick={closeDeleteConfirmation}>Cancel</Button>
        </DialogActions>
      </Dialog>
      <ToastContainer />
    </div>
  );
};

export default ProductCategoriesComponent;
