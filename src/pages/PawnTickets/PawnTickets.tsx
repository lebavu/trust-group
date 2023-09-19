import { useState, ChangeEvent } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
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
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  FormHelperText,
  InputLabel,
  Checkbox,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  ListItemIcon,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AddIcon from "@mui/icons-material/Add";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ModeEditSharpIcon from "@mui/icons-material/ModeEditSharp";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import { type SelectChangeEvent } from "@mui/material";
import { Search } from "@mui/icons-material";
import { PawnTickets } from "@/api/types";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { fetchPawnTickets, createPawnTicket, deletePawnTicket } from "@/api/pawn_ticket.api";
import DateTime from "@/components/DateTime";
import http from "@/utils/http";
import { pawnTicketSchema } from "@/utils/rules";
import Popover from "@/components/Popover";
import Breadcrumbs from "@/components/Breadcrumbs";

type SelectedPawnTickets = { [userId: string]: boolean };

const fetchUserName = async (userId: string) => {
  const response = await http.get(`users/${userId}`);
  return response.data.data.name;
};
const fetchUsers = async () => {
  const response = await http.get("users");
  return response.data.data;
};

const UserName: React.FC<{ userId: string }> = ({ userId }) => {
  const { data: userName } = useQuery(["userName", userId], () => fetchUserName(userId));
  return <>{userName}</>;
};

const PawnTicketComponent: React.FC = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: pawnTickets = [] } = useQuery<PawnTickets[]>("pawn_tickets", fetchPawnTickets);
  const { data: users = [] } = useQuery("users", fetchUsers);

  const createPawnTicketMutation = useMutation(createPawnTicket, {
    onSuccess: () => {
      queryClient.invalidateQueries("pawn_tickets");
      toast.success("Pawn ticket created successfully.");
    },
    onError: () => {
      toast.error("Failed to create pawn ticket.");
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

  const date = new Date(); // This is the date you want to format
  const formattedDate = date.toLocaleDateString("en-GB", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).split("/").reverse().join("-");;
  const formattedTime = date.toLocaleTimeString("en-US", { hour12: false }); // 24-hour format

  const fullFormattedDateTime = `${formattedDate} ${formattedTime}`;

  const [newPawnTicket, setNewPawnTicket] = useState<PawnTickets>({
    id: "",
    user_id: "",
    name: "",
    pawn_status: "",
    ticket_no: "",
    pawn_type: 0,
    pawn_amount: "",
    interest_payable: "",
    downloan_amount: "",
    monthly_repayment: "",
    already_paid: "",
    balance_remaining: "",
    duration: "",
    pawn_date: fullFormattedDateTime,
    next_renewal: fullFormattedDateTime,
    expiry_date: fullFormattedDateTime,
  });

  const [selectedPawnTicket, setSelectedPawnTicket] = useState<PawnTickets | null>(null);
  const [open, setOpen] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pawnTicketsPerPage = 10;
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [pawnTicketToDelete, setPawnTicketToDelete] = useState<PawnTickets | null>(null);
  const [selectedUserIdFilter, setSelectedUserIdFilter] = useState<string>("");
  const [selectedPawnTickets, setSelectedPawnTickets] = useState<SelectedPawnTickets>({});
  const [popoverInfo, setPopoverInfo] = useState<{ [key: string]: { open: boolean; anchorEl: HTMLElement | null } }>({});

  const handleOpenPopover = (branchId: string, event: React.MouseEvent<HTMLElement>) => {
    setPopoverInfo((prevInfo) => ({
      ...prevInfo,
      [branchId]: { open: true, anchorEl: event.currentTarget },
    }));
  };

  const handleClosePopover = (branchId: string) => {
    setPopoverInfo((prevInfo) => ({
      ...prevInfo,
      [branchId]: { ...prevInfo[branchId], open: false },
    }));
  };

  const handleSelectAll = () => {
    const areAllSelected = Object.values(selectedPawnTickets).every((selected) => selected);

    const updatedSelectedPawnTickets = { ...selectedPawnTickets };

    pawnTickets.forEach((pawnTickets) => {
      updatedSelectedPawnTickets[pawnTickets.id] = !areAllSelected;
    });
    setSelectedPawnTickets(updatedSelectedPawnTickets);
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>) => {
    const { name, value } = event.target;
    if (name === "date") {
      if (value) {
        const parsedDate = new Date(value);
        if (!isNaN(parsedDate.getTime())) {
          const formattedDate = `${parsedDate.getFullYear()}-${(parsedDate.getMonth() + 1)
            .toString()
            .padStart(2, "0")}-${parsedDate.getDate().toString().padStart(2, "0")} ${parsedDate
            .getHours()
            .toString()
            .padStart(2, "0")}:${parsedDate.getMinutes().toString().padStart(2, "0")}:${parsedDate
            .getSeconds()
            .toString()
            .padStart(2, "0")}`;

          setNewPawnTicket((prevNewPawnTicket) => ({
            ...prevNewPawnTicket,
            date: formattedDate,
          }));
        }
      }else{
        setNewPawnTicket((prevNewPawnTicket) => ({
          ...prevNewPawnTicket,
          date: value,
        }));
      }
    } else if (name === "next_renewal") {
      if (value) {
        const parsedDate = new Date(value);
        if (!isNaN(parsedDate.getTime())) {
          const formattedDate = `${parsedDate.getFullYear()}-${(parsedDate.getMonth() + 1)
            .toString()
            .padStart(2, "0")}-${parsedDate.getDate().toString().padStart(2, "0")} ${parsedDate
            .getHours()
            .toString()
            .padStart(2, "0")}:${parsedDate.getMinutes().toString().padStart(2, "0")}:${parsedDate
            .getSeconds()
            .toString()
            .padStart(2, "0")}`;

          setNewPawnTicket((prevNewPawnTicket) => ({
            ...prevNewPawnTicket,
            next_renewal: formattedDate,
          }));
        }
      }else{
        setNewPawnTicket((prevNewPawnTicket) => ({
          ...prevNewPawnTicket,
          next_renewal: value,
        }));
      }
    }else if (name === "expiry_date") {
      if (value) {
        const parsedDate = new Date(value);
        if (!isNaN(parsedDate.getTime())) {
          const formattedDate = `${parsedDate.getFullYear()}-${(parsedDate.getMonth() + 1)
            .toString()
            .padStart(2, "0")}-${parsedDate.getDate().toString().padStart(2, "0")} ${parsedDate
            .getHours()
            .toString()
            .padStart(2, "0")}:${parsedDate.getMinutes().toString().padStart(2, "0")}:${parsedDate
            .getSeconds()
            .toString()
            .padStart(2, "0")}`;

          setNewPawnTicket((prevNewPawnTicket) => ({
            ...prevNewPawnTicket,
            expiry_date: formattedDate,
          }));
        }
      }else{
        setNewPawnTicket((prevNewPawnTicket) => ({
          ...prevNewPawnTicket,
          expiry_date: value,
        }));
      }
    } else if (name === "pawn_type") {
      const intValue = parseInt(value, 10);
      setNewPawnTicket((prevNewPawnTicket) => ({
        ...prevNewPawnTicket,
        pawn_type: intValue,
      }));
    } else {
      setNewPawnTicket((prevNewPawnTicket) => ({
        ...prevNewPawnTicket,
        [name]: value,
      }));
    }
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
    const isMatchingUser = !selectedUserIdFilter || pawnTicket.user_id === selectedUserIdFilter;
    if (pawnTicket && pawnTicket.user_id) {
      const nameMatch = pawnTicket.name.toLowerCase().includes(searchKeyword.toLowerCase());
      const ticketNoMatch = pawnTicket.ticket_no.toLowerCase().includes(searchKeyword.toLowerCase());
      return isMatchingUser && (nameMatch || ticketNoMatch) ;
    }
    return false;
  });

  const totalPages = Math.ceil(pawnTickets.length / pawnTicketsPerPage);

  const openFormPopup = () => {
    setSelectedPawnTicket(null);
    setNewPawnTicket({
      id: "",
      user_id: "",
      name: "",
      pawn_status: "",
      ticket_no: "",
      pawn_type: 0,
      pawn_amount: "",
      interest_payable: "",
      downloan_amount: "",
      monthly_repayment: "",
      already_paid: "",
      balance_remaining: "",
      duration: "",
      pawn_date: "",
      next_renewal: "",
      expiry_date: "",
    });
    setOpen(true);
  };

  const openEditFormPopup = (pawnTicket: PawnTickets) => {
    navigate(`/pawn-tickets/update-pawn-ticket/${pawnTicket.id}`);
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
        name: "",
        pawn_status: "",
        ticket_no: "",
        pawn_type: 0,
        pawn_amount: "",
        interest_payable: "",
        downloan_amount: "",
        monthly_repayment: "",
        already_paid: "",
        balance_remaining: "",
        duration: "",
        pawn_date: "",
        next_renewal: "",
        expiry_date: "",
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

  const handleDeletePawnTicket = (pawnTicket: PawnTickets | null) => {
    if (pawnTicket) {
      deletePawnTicketMutation.mutate(pawnTicket.id);
    }
    setDeleteConfirmationOpen(false);
    setPawnTicketToDelete(null);
  };

  const handleCheckboxChange = (pawnTicketId: string) => {
    setSelectedPawnTickets((prevSelectedPawnTickets) => ({
      ...prevSelectedPawnTickets,
      [pawnTicketId]: !prevSelectedPawnTickets[pawnTicketId],
    }));
  };

  const handleDeleteSelectedPawnTickets = () => {
    const pawnTicketsToDelete = Object.keys(selectedPawnTickets).filter((pawnTicketId) => selectedPawnTickets[pawnTicketId]);
    if (pawnTicketsToDelete.length > 0) {
      pawnTicketsToDelete.forEach((pawnTicketId) => {
        deletePawnTicketMutation.mutate(pawnTicketId);
      });
      setSelectedPawnTickets({});
    }
  };
  const countSelectedPawnTickets = () => {
    return Object.values(selectedPawnTickets).filter((selected) => selected).length;
  };
  const selectedPawnTicketsCount = countSelectedPawnTickets();

  const pawnTypeOptions = [
    { value: 0, label: "Due" },
    { value: 1, label: "Instalment" },
    { value: 2, label: "2nd month" },
    { value: 3, label: "Expired" },
  ];
  const pawnStatusOptions = [
    { value: 0, label: "Pending", class: "pending" },
    { value: 1, label: "Successful", class: "successful" },
  ];
  const uniqueUserIds = Array.from(new Set(pawnTickets.map(pawnTicket => pawnTicket.user_id)));
  return (
    <div>
      <Helmet>
        <title>Pawn Tickets | Trust Group</title>
        <meta name="description" content="Pawn Tickets to have access!" />
      </Helmet>
      <Typography variant="h3" mb={"3rem"}>
        Pawn Tickets List
      </Typography>
      <Breadcrumbs/>
      <div className="mb-10 flex items-center justify-between gap-3 flex-wrap">
        <TextField
          sx={{ maxWidth: "22rem", width: "100%" }}
          label="Search"
          size="small"
          value={searchKeyword}
          onChange={handleSearchChange}
          variant="outlined"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Search />
              </InputAdornment>
            )
          }}
        />
        <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={openFormPopup}>
          Create Pawn Ticket
        </Button>
      </div>
      <Box sx={{ maxWidth: "22rem" }} mb={"2rem"}>
        <FormControl fullWidth >
          <InputLabel size="small" id="select-filter-label">Users</InputLabel>
          <Select
            labelId="select-filter-label"
            id="simple-select-filter"
            size="small"
            label="All Users"
            value={selectedUserIdFilter}
            IconComponent={ExpandMoreIcon}
            onChange={(event) => setSelectedUserIdFilter(event.target.value)}
          >
            <MenuItem value="">All Roles</MenuItem>
            {uniqueUserIds.map((userId) => (
              <MenuItem key={userId} value={userId}>
                <UserName userId={userId} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <TableContainer className="has-action-fixed" >
        <Table className="min-w-[1000px]">
          <TableHead>
            <TableRow>
              <TableCell>
                {pawnTickets.length > 0 ? (
                  <Checkbox
                    indeterminate={
                      Object.values(selectedPawnTickets).some((selected) => selected) &&
                      Object.values(selectedPawnTickets).some((selected) => !selected)
                    }
                    checked={Object.values(selectedPawnTickets).every((selected) => selected)}
                    onChange={handleSelectAll}
                  />
                ) : (
                  <Skeleton  height={60} animation="wave" />
                )
                }
              </TableCell>
              <TableCell>
                {pawnTickets.length > 0 ? "User Id" : <Skeleton  height={60} animation="wave" />}
              </TableCell>
              <TableCell>
                {pawnTickets.length > 0 ? "Name" : <Skeleton  height={60} animation="wave" />}
              </TableCell>
              <TableCell align="right">
                {pawnTickets.length > 0 ? "Pawn Status" : <Skeleton  height={60} animation="wave" />}
              </TableCell>
              <TableCell>
                {pawnTickets.length > 0 ? "Ticket No" : <Skeleton  height={60} animation="wave" />}
              </TableCell>
              <TableCell align="right">
                {pawnTickets.length > 0 ? "Paw Type" : <Skeleton  height={60} animation="wave" />}
              </TableCell>
              <TableCell>
                {pawnTickets.length > 0 ? "Pawn Amount" : <Skeleton  height={60} animation="wave" />}
              </TableCell>
              <TableCell align="right">
                {pawnTickets.length > 0 ? "Pawn Date" : <Skeleton  height={60} animation="wave" />}
              </TableCell>
              <TableCell align="right">
                {pawnTickets.length > 0 ? "Next Renewal" : <Skeleton  height={60} animation="wave" />}
              </TableCell>
              <TableCell align="right">
                {pawnTickets.length > 0 ? "Expiry Date" : <Skeleton  height={60} animation="wave" />}
              </TableCell>
              <TableCell align="right">
                {pawnTickets.length > 0 ? "Action" : <Skeleton  height={60} animation="wave" />}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredPawnTickets.length > 0 ? (
              filteredPawnTickets.map((pawnTicket) => (
                <TableRow key={pawnTicket.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedPawnTickets[pawnTicket.id] || false}
                      onChange={() => handleCheckboxChange(pawnTicket.id)}
                    />
                  </TableCell>
                  <TableCell>
                    {pawnTicket.user_id && (
                      <UserName userId={pawnTicket.user_id} />
                    )}
                  </TableCell>
                  <TableCell>
                    <strong>{pawnTicket.name}</strong>
                  </TableCell>
                  <TableCell>
                    <span className={`status-cell ${pawnStatusOptions.find(option => option.value == parseInt(pawnTicket.pawn_status))?.class || "unknown"}`}>
                      {pawnStatusOptions.find(option => option.value === parseInt(pawnTicket.pawn_status))?.label || "Unknown"}
                    </span>
                  </TableCell>
                  <TableCell>{pawnTicket.ticket_no}</TableCell>
                  <TableCell>
                    {pawnTypeOptions.find(option => option.value == pawnTicket.pawn_type)?.label || "Unknown"}
                  </TableCell>
                  <TableCell>{pawnTicket.pawn_amount}</TableCell>
                  <TableCell>{pawnTicket.pawn_date ? new Date(pawnTicket.pawn_date).toLocaleString() : ""}</TableCell>
                  <TableCell>{pawnTicket.next_renewal ? new Date(pawnTicket.next_renewal).toLocaleString() : ""}</TableCell>
                  <TableCell>{pawnTicket.expiry_date ? new Date(pawnTicket.expiry_date).toLocaleString() : ""}</TableCell>
                  <TableCell className="!text-right">
                    <IconButton color="primary" onClick={(e) => handleOpenPopover(pawnTicket.id, e)}>
                      <MoreVertIcon />
                    </IconButton>
                    <Popover
                      open={popoverInfo[pawnTicket.id]?.open || false}
                      anchorEl={popoverInfo[pawnTicket.id]?.anchorEl}
                      onClose={() => handleClosePopover(pawnTicket.id)}
                    >
                      <List>
                        <ListItemButton onClick={() => openEditFormPopup(pawnTicket)}>
                          <ListItemIcon sx={{ minWidth: "3.5rem" }}>
                            <ModeEditSharpIcon color="primary"/>
                          </ListItemIcon>
                          <ListItemText primary="Edit" />
                        </ListItemButton>
                        <ListItemButton onClick={() => openDeleteConfirmation(pawnTicket)} >
                          <ListItemIcon sx={{ minWidth: "3.5rem" }}>
                            <DeleteRoundedIcon color="secondary"/>
                          </ListItemIcon>
                          <ListItemText primary="Delete" className="text-secondary"/>
                        </ListItemButton>
                      </List>
                    </Popover>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={17}>
                  {pawnTickets.length === 0 ? (
                    <Skeleton  height={60} animation="wave" />
                  ) : (
                    <p className="text-[1.6rem] text-center">No pawn tickets found.</p>
                  )}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {Object.values(selectedPawnTickets).some((selected) => selected) && (
        <div className="mt-6">
          <Button variant="outlined" startIcon={<DeleteRoundedIcon />} color="primary" onClick={handleDeleteSelectedPawnTickets} disabled={selectedPawnTicketsCount === 0}>
            Delete Selected ({selectedPawnTicketsCount})
          </Button>
        </div>
      )}
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
      <Dialog open={open} onClose={closeFormPopup} PaperProps={{ sx: { width: "100%", maxWidth: "100rem" } }}>
        <DialogTitle className="!pt-10">{selectedPawnTicket ? "Edit Pawn Ticket" : "Create New Pawn Ticket"}</DialogTitle>
        <DialogContent className="flex w-full flex-col gap-y-12 !pt-6">
          <div className="grid md:grid-cols-2 gap-x-[1.5rem] gap-y-[3rem] items-end">
            <FormControl fullWidth sx={{ ".MuiFormLabel-root": { background: "#fff", padding: "0 3px" } }}>
              <InputLabel size="small" id="select-user">User</InputLabel>
              <Select
                labelId="select-user"
                id="user-select"
                size="small"
                name="user_id"
                value={newPawnTicket.user_id}
                IconComponent={ExpandMoreIcon}
                onChange={handleInputChange}
                variant="outlined"
                error={!!newPawnTicket.errors?.user_id}
              >
                {users.map((role:any) => (
                  <MenuItem key={role.id} value={role.id}>
                    {role.name}
                  </MenuItem>
                ))}
              </Select>
              {newPawnTicket.errors?.user_id && <FormHelperText error>{newPawnTicket.errors.user_id}</FormHelperText>}
            </FormControl>
            <TextField
              name="name"
              label="Name"
              value={newPawnTicket.name}
              onChange={handleInputChange}
              variant="outlined"
              size="small"
              fullWidth
              error={!!newPawnTicket.errors?.name}
              helperText={newPawnTicket.errors?.name}
            />
          </div>
          <div className="grid md:grid-cols-2 gap-x-[1.5rem] gap-y-[3rem] items-end">
            <FormControl fullWidth sx={{ ".MuiFormLabel-root": { background: "#fff", padding: "0 3px" } }}>
              <InputLabel size="small" id="select-pawn-type-label">Pawn Type</InputLabel>
              <Select
                labelId="select-pawn-type-label"
                id="pawn-type-select"
                size="small"
                name="pawn_type"
                value={newPawnTicket.pawn_type.toString()}
                IconComponent={ExpandMoreIcon}
                onChange={handleInputChange}
                variant="outlined"
                error={!!newPawnTicket.errors?.pawn_type}
              >
                {pawnTypeOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
              {newPawnTicket.errors?.pawn_type && <FormHelperText error>{newPawnTicket.errors.pawn_type}</FormHelperText>}
            </FormControl>

            <TextField
              name="ticket_no"
              label="Ticket No"
              value={newPawnTicket.ticket_no}
              onChange={handleInputChange}
              variant="outlined"
              size="small"
              fullWidth
              error={!!newPawnTicket.errors?.ticket_no}
              helperText={newPawnTicket.errors?.ticket_no}
            />
          </div>
          <div className="grid md:grid-cols-2 gap-x-[1.5rem] gap-y-[3rem] items-end">
            <TextField
              name="pawn_amount"
              label="Pawn Amount"
              type="number"
              inputProps={{ step: "any" }}
              value={newPawnTicket.pawn_amount}
              onChange={handleInputChange}
              variant="outlined"
              size="small"
              fullWidth
              error={!!newPawnTicket.errors?.pawn_amount}
              helperText={newPawnTicket.errors?.pawn_amount}
            />
            <TextField
              name="interest_payable"
              label="Interest Payable"
              value={newPawnTicket.interest_payable || ""}
              onChange={handleInputChange}
              variant="outlined"
              type="number"
              size="small"
              fullWidth
              error={!!newPawnTicket.errors?.interest_payable}
              helperText={newPawnTicket.errors?.interest_payable}
            />
          </div>
          <div className="grid md:grid-cols-2 gap-x-[1.5rem] gap-y-[3rem] items-end">
            <TextField
              name="downloan_amount"
              label="Downloan Amount"
              value={newPawnTicket.downloan_amount || ""}
              onChange={handleInputChange}
              variant="outlined"
              size="small"
              type="number"
              fullWidth
              error={!!newPawnTicket.errors?.downloan_amount}
              helperText={newPawnTicket.errors?.downloan_amount}
            />
            <TextField
              name="monthly_repayment"
              label="Monthly Repayment"
              value={newPawnTicket.monthly_repayment || ""}
              onChange={handleInputChange}
              variant="outlined"
              size="small"
              type="number"
              fullWidth
              error={!!newPawnTicket.errors?.monthly_repayment}
              helperText={newPawnTicket.errors?.monthly_repayment}
            />
          </div>
          <div className="grid md:grid-cols-2 gap-x-[1.5rem] gap-y-[3rem] items-end">
            <TextField
              name="already_paid"
              label="Already Paid"
              value={newPawnTicket.already_paid || ""}
              onChange={handleInputChange}
              variant="outlined"
              type="number"
              size="small"
              fullWidth
              error={!!newPawnTicket.errors?.already_paid}
              helperText={newPawnTicket.errors?.already_paid}
            />
            <TextField
              name="balance_remaining"
              label="Balance Remaining"
              type="number"
              value={newPawnTicket.balance_remaining || ""}
              onChange={handleInputChange}
              variant="outlined"
              size="small"
              fullWidth
              error={!!newPawnTicket.errors?.balance_remaining}
              helperText={newPawnTicket.errors?.balance_remaining}
            />
          </div>
          <div className="grid md:grid-cols-2 gap-x-[1.5rem] gap-y-[3rem] items-end">
            <div className="relative">
              <DateTime
                label="Pawn Date"
                value={newPawnTicket.pawn_date}
                onChange={(newValue) => {
                  const event = {
                    target: {
                      name: "pawn_date",
                      value: newValue instanceof Date ? newValue.toISOString() : null,
                    },
                  } as React.ChangeEvent<HTMLInputElement>;
                  handleInputChange(event);
                }}
              />
              {newPawnTicket.errors?.pawn_date && (
                <p className="el-error">This field is required</p>
              )}
            </div>
            <TextField
              name="duration"
              label="Duration"
              value={newPawnTicket.duration || ""}
              onChange={handleInputChange}
              variant="outlined"
              size="small"
              fullWidth
              error={!!newPawnTicket.errors?.duration}
              helperText={newPawnTicket.errors?.duration}
            />
          </div>
          <div className="grid md:grid-cols-2 gap-x-[1.5rem] gap-y-[3rem] items-end">
            <DateTime
              label="Next Renewal"
              value={newPawnTicket.next_renewal}
              onChange={(newValue) => {
                const event = {
                  target: {
                    name: "next_renewal",
                    value: newValue instanceof Date ? newValue.toISOString() : null,
                  },
                } as React.ChangeEvent<HTMLInputElement>;
                handleInputChange(event);
              }}
            />
            <DateTime
              label="Expiry Date"
              value={newPawnTicket.expiry_date}
              onChange={(newValue) => {
                const event = {
                  target: {
                    name: "expiry_date",
                    value: newValue instanceof Date ? newValue.toISOString() : null,
                  },
                } as React.ChangeEvent<HTMLInputElement>;
                handleInputChange(event);
              }}
            />
          </div>
        </DialogContent>
        <DialogActions className="!p-10">
          <Button variant="contained" color="primary" onClick={handleCreatePawnTicket}>
            Create
          </Button>
          <Button variant="contained" color="secondary" onClick={closeFormPopup}>
            Cancel
          </Button>
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
    </div>
  );
};

export default PawnTicketComponent;