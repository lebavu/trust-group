import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Checkbox,
  IconButton,
  Typography,
  Button,
  Tooltip,
  Box,
  TextField,
  Modal,
  Paper,
  Stack,
} from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddCircleIcon from "@mui/icons-material/AddCircle";

const columns = [
  { id: "name", label: "Dessert", minWidth: 170 },
  { id: "calories", label: "Calories", minWidth: 100 },
  { id: "fat", label: "Fat (g)", minWidth: 100 },
  { id: "carbs", label: "Carbs (g)", minWidth: 100 },
  { id: "protein", label: "Protein (g)", minWidth: 100 },
  { id: "actions", label: "Actions", minWidth: 100 },
];

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData("Cupcake", 305, 3.7, 67, 4.3),
  createData("Donut", 452, 25.0, 51, 4.9),
  createData("Eclair", 262, 16.0, 24, 6.0),
  createData("Frozen yoghurt", 159, 6.0, 24, 4.0),
  createData("Gingerbread", 356, 16.0, 49, 3.9),
  createData("Honeycomb", 408, 3.2, 87, 6.5),
  createData("Ice cream sandwich", 237, 9.0, 37, 4.3),
  createData("Jelly Bean", 375, 0.0, 94, 0.0),
  createData("KitKat", 518, 26.0, 65, 7.0),
  createData("Lollipop", 392, 0.2, 98, 0.0),
  createData("Marshmallow", 318, 0, 81, 2.0),
  createData("Nougat", 360, 19.0, 9, 37.0),
  createData("Oreo", 437, 18.0, 63, 7.0),
];

const EnhancedTable = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [editedRow, setEditedRow] = useState(null);
  const [newEntry, setNewEntry] = useState({
    name: "",
    calories: "",
    fat: "",
    carbs: "",
    protein: "",
  });

  const [showAlert, setShowAlert] = useState(false);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleAddNew = () => {
    setOpenModal(true);
  };

  const handleModalClose = () => {
    setOpenModal(false);
  };

  const handleNewEntryChange = (event) => {
    const { name, value } = event.target;
    setNewEntry((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleNewEntrySave = () => {
    const newRow = createData(newEntry.name, newEntry.calories, newEntry.fat, newEntry.carbs, newEntry.protein);
    rows.push(newRow);
    setNewEntry({
      name: "",
      calories: "",
      fat: "",
      carbs: "",
      protein: "",
    });
    setOpenModal(false);
    toast.error("Entry deleted successfully!");
  };

  const filteredRows = rows.filter((row) => row.name.toLowerCase().includes(searchQuery.toLowerCase()));
  //edit handle
  const handleEditRow = (row) => {
    setEditedRow(row);
    setOpenEditModal(true);
  };

  const handleEditEntryChange = (event) => {
    const { name, value } = event.target;
    setEditedRow((prevRow) => ({
      ...prevRow,
      [name]: value,
    }));
  };

  const handleEditEntrySave = () => {
    const editedRowIndex = rows.findIndex((row) => row.name === editedRow.name);
    const updatedRows = [...rows];
    updatedRows[editedRowIndex] = editedRow;
    setRows(updatedRows);
    setOpenEditModal(false);
    toast.success("Entry saved successfully!");
  };

  return (
    <Box>
      <Typography variant='h2' component='h2' mb={3}>
        Blogs
      </Typography>
      <Box display='flex' flexWrap='wrap' gap={2} alignItems='center' marginBottom='1rem'>
        <TextField
          label='Search'
          variant='outlined'
          value={searchQuery}
          onChange={handleSearchChange}
          fullWidth
          size='small'
          className='md:max-w-[25rem]'
        />
        <Button
          variant='contained'
          color='primary'
          startIcon={<AddCircleIcon />}
          style={{ marginLeft: "auto" }}
          onClick={handleAddNew}
        >
          Add New
        </Button>
      </Box>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding='checkbox'>
                <Checkbox />
              </TableCell>
              {columns.map((column) => (
                <TableCell key={column.id} align='left' style={{ minWidth: column.minWidth }}>
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
              <TableRow key={row.name}>
                <TableCell padding='checkbox'>
                  <Checkbox />
                </TableCell>
                <TableCell align='left'>{row.name}</TableCell>
                <TableCell align='left'>{row.calories}</TableCell>
                <TableCell align='left'>{row.fat}</TableCell>
                <TableCell align='left'>{row.carbs}</TableCell>
                <TableCell align='left'>{row.protein}</TableCell>
                <TableCell align='left'>
                  <Tooltip title='Edit'>
                    <IconButton aria-label='Edit' color='primary' onClick={() => handleEditRow(row)}>
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title='Delete'>
                    <IconButton aria-label='Delete' color='secondary'>
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component='div'
          count={filteredRows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
      <Modal open={openEditModal} onClose={() => setOpenEditModal(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "50%",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant='h6' component='h2' sx={{ marginBottom: "1rem" }}>
            Edit Entry
          </Typography>
          <TextField
            label='Dessert'
            name='name'
            value={editedRow?.name || ""}
            onChange={handleEditEntryChange}
            fullWidth
            margin='normal'
          />
          <TextField
            label='Calories'
            name='calories'
            value={editedRow?.calories || ""}
            onChange={handleEditEntryChange}
            fullWidth
            margin='normal'
          />
          <TextField
            label='Fat (g)'
            name='fat'
            value={editedRow?.fat || ""}
            onChange={handleEditEntryChange}
            fullWidth
            margin='normal'
          />
          <TextField
            label='Carbs (g)'
            name='carbs'
            value={editedRow?.carbs || ""}
            onChange={handleEditEntryChange}
            fullWidth
            margin='normal'
          />
          <TextField
            label='Protein (g)'
            name='protein'
            value={editedRow?.protein || ""}
            onChange={handleEditEntryChange}
            fullWidth
            margin='normal'
          />
          <Box display='flex' gap={2} flexWrap='wrap' mt={2}>
            <Button variant='contained' color='primary' onClick={handleEditEntrySave}>
              Save
            </Button>
            <Button variant='contained' onClick={() => setOpenEditModal(false)}>
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>
      <Modal open={openModal} onClose={handleModalClose} aria-labelledby='add-new-modal'>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant='h3' component='h3' gutterBottom>
            Add New
          </Typography>
          <TextField
            label='Dessert'
            name='name'
            value={newEntry.name}
            onChange={handleNewEntryChange}
            fullWidth
            margin='normal'
          />
          <TextField
            label='Calories'
            name='calories'
            value={newEntry.calories}
            onChange={handleNewEntryChange}
            fullWidth
            margin='normal'
          />
          <TextField
            label='Fat (g)'
            name='fat'
            value={newEntry.fat}
            onChange={handleNewEntryChange}
            fullWidth
            margin='normal'
          />
          <TextField
            label='Carbs (g)'
            name='carbs'
            value={newEntry.carbs}
            onChange={handleNewEntryChange}
            fullWidth
            margin='normal'
          />
          <TextField
            label='Protein (g)'
            name='protein'
            value={newEntry.protein}
            onChange={handleNewEntryChange}
            fullWidth
            margin='normal'
          />
          <Box display='flex' gap={2} flexWrap='wrap' mt={2}>
            <Button variant='contained' color='primary' onClick={handleNewEntrySave}>
              Submit
            </Button>
            <Button variant='contained' color='error' onClick={handleModalClose}>
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default EnhancedTable;
