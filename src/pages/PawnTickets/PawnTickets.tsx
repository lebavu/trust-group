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
  Typography,
  Pagination,
  Skeleton,
  InputAdornment
} from "@mui/material";
import { Search } from "@mui/icons-material";
import { LocalizationProvider, DatePicker } from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import { PawnTickets } from "@/api/types";
import { fetchPawnTickets, createPawnTicket, updatePawnTicket, deletePawnTicket } from "@/api/pawn_ticket.api";

// Schema for validating the pawn ticket object
const pawnTicketSchema = yup.object().shape({
  user_id: yup.string().required("Name is required"),
  date_time: yup.string().required("Date time is required"),
  details: yup.date().required("Details is required"),
});

// Main component for managing pawn tickets
const PawnTicketComponent: React.FC = () => {
  const queryClient = useQueryClient();

  const { data: pawnTickets = [] } = useQuery<PawnTickets[]>("pawn_tickets", fetchPawnTickets);

  const createPawnTicketMutation = useMutation(createPawnTicket, {
    onSuccess: () => {
      queryClient.invalidateQueries("pawn_tickets");
      toast.success("Pawn ticket created successfully.");
    },
    onError: () => {
      toast.error("Failed to create pawn ticket.");
    },
  });

  const updatePawnTicketMutation = useMutation(updatePawnTicket, {
    onSuccess: () => {
      queryClient.invalidateQueries("pawn_tickets");
      toast.success("Pawn ticket updated successfully.");
    },
    onError: () => {
      toast.error("Failed to update pawn ticket.");
    },
  });

  const deletePawnTicketMutation = useMutation(deletePawnTicket, {
    onSuccess: () => {
      queryClient.invalidateQueries("pawn_tickets");
      toast.success("Pawn ticket deleted successfully.");
    },
    onError: () => {
      toast.error("Failed to delete pawn ticket.");
    },
  });

  const [newPawnTicket, setNewPawnTicket] = useState<PawnTickets>({
    id: "",
    user_id: "",
    date_time: new Date(),
    details: "",
  });

  const [selectedPawnTicket, setSelectedPawnTicket] = useState<PawnTickets | null>(null);
  const [open, setOpen] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pawnTicketsPerPage = 5;
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [pawnTicketToDelete, setPawnTicketToDelete] = useState<PawnTickets | null>(null);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setNewPawnTicket((prevNewPawnTicket) => ({
      ...prevNewPawnTicket,
      [name]: value,
    }));
  };

  const handleDate_timeChange = (date: Date | null) => {
    setNewPawnTicket((prevNewPawnTicket) => ({
      ...prevNewPawnTicket,
      date_time: date || new Date(),
    }));
  };

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchKeyword(event.target.value);
  };

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
  };
  const indexOfLastPawnTicket = currentPage * pawnTicketsPerPage;
  const indexOfFirstPawnTicket = indexOfLastPawnTicket - pawnTicketsPerPage;
  const currentPawnTickets = pawnTickets.slice(indexOfFirstPawnTicket, indexOfLastPawnTicket);

  const filteredPawnTickets = currentPawnTickets.filter((pawnTicket) => {
    if (pawnTicket && pawnTicket.user_id) {
      const userIdMatch = pawnTicket.user_id.toLowerCase().includes(searchKeyword.toLowerCase());
      return userIdMatch;
    }
    return false;
  });

  const totalPages = Math.ceil(pawnTickets.length / pawnTicketsPerPage);

  const openFormPopup = () => {
    setSelectedPawnTicket(null);
    setNewPawnTicket({
      id: "",
      user_id: "",
      date_time: new Date(),
      details: "",
    });
    setOpen(true);
  };

  const openEditFormPopup = (pawnTicket: PawnTickets) => {
    setSelectedPawnTicket(pawnTicket);
    setNewPawnTicket(pawnTicket);
    setOpen(true);
  };

  const closeFormPopup = () => {
    setSelectedPawnTicket(null);
    setOpen(false);
  };

  const openDeleteConfirmation = (pawnTicket: PawnTickets) => {
    setDeleteConfirmationOpen(true);
    setPawnTicketToDelete(pawnTicket);
  };

  const closeDeleteConfirmation = () => {
    setDeleteConfirmationOpen(false);
    setPawnTicketToDelete(null);
  };

  const handleCreatePawnTicket = async () => {
    try {
      await pawnTicketSchema.validate(newPawnTicket, { abortEarly: false });
      createPawnTicketMutation.mutate(newPawnTicket);
      setNewPawnTicket({
        id: "",
        user_id: "",
        date_time: new Date(),
        details: "",
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
      setNewPawnTicket((prevNewPawnTicket) => ({
        ...prevNewPawnTicket,
        errors: validationErrors,
      }));
    }
  };

  const handleUpdatePawnTicket = async () => {
    try {
      await pawnTicketSchema.validate(newPawnTicket, { abortEarly: false });

      const updatedPawnTicket: PawnTickets = {
        id: selectedPawnTicket?.id || "",
        user_id: newPawnTicket.user_id || selectedPawnTicket?.user_id || "",
        date_time: newPawnTicket.date_time || selectedPawnTicket?.date_time || new Date(),
        details: newPawnTicket.details || selectedPawnTicket?.details || "",
      };

      await updatePawnTicketMutation.mutateAsync(updatedPawnTicket);

      setSelectedPawnTicket(null);
      setOpen(false);

      setNewPawnTicket({
        id: "",
        user_id: "",
        date_time: new Date(),
        details: "",
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
      setNewPawnTicket((prevNewPawnTicket) => ({
        ...prevNewPawnTicket,
        errors: validationErrors,
      }));
    }
  };

  const handleDeletePawnTicket = (pawnTicket: PawnTickets | null) => {
    if (pawnTicket) {
      deletePawnTicketMutation.mutate(pawnTicket.id);
    }
    setDeleteConfirmationOpen(false);
    setPawnTicketToDelete(null);
  };

  return (
    <div>
      <Typography variant="h3" mb={"3rem"}>
        Pawn Tickets List
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
          Create Pawn Ticket
        </Button>
      </div>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                {pawnTickets.length > 0 ? "User Id" : <Skeleton variant="rectangular" height={40} animation="wave" />}
              </TableCell>
              <TableCell>
                {pawnTickets.length > 0 ? "Date and Time" : <Skeleton variant="rectangular" height={40} animation="wave" />}
              </TableCell>
              <TableCell>
                {pawnTickets.length > 0 ? "Details" : <Skeleton variant="rectangular" height={40} animation="wave" />}
              </TableCell>
              <TableCell align="right">
                {pawnTickets.length > 0 ? "Action" : <Skeleton variant="rectangular" height={40} animation="wave" />}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredPawnTickets.length > 0 ? (
              filteredPawnTickets.map((pawnTicket) => (
                <TableRow key={pawnTicket.id}>
                  <TableCell>{pawnTicket.user_id}</TableCell>
                  <TableCell>{pawnTicket.date_time.toString()}</TableCell>
                  <TableCell>{pawnTicket.details}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap items-center justify-end gap-5">
                      <Button variant="contained" color="primary" onClick={() => openEditFormPopup(pawnTicket)}>
                        Edit
                      </Button>
                      <Button variant="contained" color="secondary" onClick={() => openDeleteConfirmation(pawnTicket)}>
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5}>
                  {pawnTickets.length === 0 ? (
                    <Skeleton variant="rectangular" height={50} animation="wave" />
                  ) : (
                    <p className="text-[1.6rem] text-center">No pawn tickets found.</p>
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
        <DialogTitle className="!pt-10">{selectedPawnTicket ? "Edit Pawn Ticket" : "Create New Pawn Ticket"}</DialogTitle>
        <DialogContent className="flex w-full flex-col gap-y-6 !pt-6">
          <TextField
            name="user_id"
            label="User Id"
            value={newPawnTicket.user_id}
            onChange={handleInputChange}
            variant="outlined"
            size="small"
            fullWidth
            error={!!newPawnTicket.errors?.user_id}
            helperText={newPawnTicket.errors?.user_id}
            sx={{ marginBottom: "2rem" }}
          />
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Select a date"
              value={newPawnTicket.date_time}
              onChange={handleDate_timeChange}
              renderInput={(params:any) => <TextField {...params} variant="outlined" />}
            />
          </LocalizationProvider>
          <TextField
            name="details"
            label="Details"
            value={newPawnTicket.details}
            onChange={handleInputChange}
            variant="outlined"
            multiline
            rows={4}
            fullWidth
            error={!!newPawnTicket.errors?.details}
            helperText={newPawnTicket.errors?.details}
            sx={{ marginBottom: "2rem" }}
          />
        </DialogContent>
        <DialogActions className="!p-10">
          {selectedPawnTicket ? (
            <>
              <Button variant="contained" color="primary" onClick={handleUpdatePawnTicket}>
                Update
              </Button>
              <Button variant="contained" color="secondary" onClick={closeFormPopup}>
                Cancel
              </Button>
            </>
          ) : (
            <>
              <Button variant="contained" color="primary" onClick={handleCreatePawnTicket}>
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
        <DialogTitle>Delete Pawn Ticket</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to delete this pawn ticket?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="secondary" onClick={() => handleDeletePawnTicket(pawnTicketToDelete)}>
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

export default PawnTicketComponent;
