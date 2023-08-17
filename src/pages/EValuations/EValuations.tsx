import { ReactNode, useState, ChangeEvent } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { ToastContainer, toast } from "react-toastify";
import { Helmet } from "react-helmet-async";
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
  Stack,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  FormHelperText,
  InputLabel
} from "@mui/material";
import { type SelectChangeEvent } from "@mui/material";
import { Search } from "@mui/icons-material";
import { EValuation } from "@/api/types";
import { fetchEValuations, createEValuation, updateEValuation, deleteEValuation } from "@/api/e-valuation.api";
import DateTime from "@/components/DateTime";
import http from "@/utils/http";

const eValuationSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  price: yup
    .mixed()
    .test(
      "is-decimal-10-2",
      "Price amount must be in the format of DECIMAL(10,2)",
      function (value) {
        if (value === undefined) {
          return true;
        }
        return /^[0-9]{1,7}\.[0-9]{2}$/.test(value.toString());
      }
    )
    .typeError("Price amount must be a numeric value"),
});

const renderImageUrl = (imageUrl: string | File | undefined): ReactNode => {
  if (typeof imageUrl === "string") {
    return <img src={imageUrl} alt="User" style={{ width: "5rem" }} />;
  } else if (imageUrl instanceof File) {
    const temporaryUrl = URL.createObjectURL(imageUrl);
    return <img src={temporaryUrl} alt="User" style={{ width: "5rem" }} />;
  } else {
    return null;
  }
};

const fetchUsers = async () => {
  const response = await http.get("users");
  return response.data.data;
};

const fetchUserName = async (userId: string) => {
  const response = await http.get(`users/${userId}`);
  return response.data.data.name;
};

const UserName: React.FC<{ userId: string }> = ({ userId }) => {
  const { data: userName } = useQuery(["userName", userId], () => fetchUserName(userId));
  return <>{userName}</>;
};

const EValuationComponent: React.FC = () => {
  const queryClient = useQueryClient();
  const { data: eValuations = [] } = useQuery<EValuation[]>("eValuations", fetchEValuations);
  const { data: users = [] } = useQuery("users", fetchUsers);
  const createEValuationMutation = useMutation(createEValuation, {
    onSuccess: () => {
      queryClient.invalidateQueries("eValuations");
      toast.success("EValuation created successfully.");
    },
    onError: () => {
      toast.error("Failed to create EValuation.");
    },
  });

  const updateEValuationMutation = useMutation(updateEValuation, {
    onSuccess: () => {
      queryClient.invalidateQueries("eValuations");
      toast.success("EValuation updated successfully.");
    },
    onError: () => {
      toast.error("Failed to update EValuation.");
    },
  });

  const deleteEValuationMutation = useMutation(deleteEValuation, {
    onSuccess: () => {
      queryClient.invalidateQueries("eValuations");
      toast.success("EValuation deleted successfully.");
    },
    onError: () => {
      toast.error("Failed to delete EValuation.");
    },
  });

  const [newEValuation, setNewEValuation] = useState<EValuation>({
    id: "",
    user_id: "",
    category_id: "",
    status: "",
    name: "",
    price: "",
    image: "",
    type: "",
    metal: "",
    size: "",
    weight: "",
    other_remarks: "",
    content: "",
    date: null,
    appointment_date: null,
    branch_id: "",
  });

  const [selectedEValuation, setSelectedEValuation] = useState<EValuation | null>(null);
  const [open, setOpen] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const eValuationsPerPage = 10;
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [eValuationToDelete, setEValuationToDelete] = useState<EValuation | null>(null);
  const [selectedUserIdFilter, setSelectedUserIdFilter] = useState<string>("");

  const handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>) => {
    const { name, value } = event.target;
    setNewEValuation((prevNewEValuation) => ({
      ...prevNewEValuation,
      [name]: value,
    }));
  };

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchKeyword(event.target.value);
  };

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
  };

  const indexOfLastEValuation = currentPage * eValuationsPerPage;
  const indexOfFirstEValuation = indexOfLastEValuation - eValuationsPerPage;
  const currentEValuations = eValuations.slice(indexOfFirstEValuation, indexOfLastEValuation);

  const filteredEValuations = currentEValuations.filter((eValuation) => {
    if (eValuation && eValuation.name) {
      const nameMatch = eValuation.name.toLowerCase().includes(searchKeyword.toLowerCase());
      return nameMatch;
    }
    return false;
  });

  const totalPages = Math.ceil(eValuations.length / eValuationsPerPage);

  const openFormPopup = () => {
    setSelectedEValuation(null);
    setNewEValuation({
      id: "",
      user_id: "",
      category_id: "",
      status: "",
      name: "",
      price: "",
      image: "",
      type: "",
      metal: "",
      size: "",
      weight: "",
      other_remarks: "",
      content: "",
      date: null,
      appointment_date: null,
      branch_id: "",
    });
    setOpen(true);
  };

  const openEditFormPopup = (eValuation: EValuation) => {
    setSelectedEValuation(eValuation);
    setNewEValuation({
      ...eValuation,
    });
    setOpen(true);
  };

  const closeFormPopup = () => {
    setSelectedEValuation(null);
    setOpen(false);
  };

  const openDeleteConfirmation = (eValuation: EValuation) => {
    setDeleteConfirmationOpen(true);
    setEValuationToDelete(eValuation);
  };

  const closeDeleteConfirmation = () => {
    setDeleteConfirmationOpen(false);
    setEValuationToDelete(null);
  };

  const handleCreateEValuation = async () => {
    try {
      await eValuationSchema.validate(newEValuation, { abortEarly: false });
      createEValuationMutation.mutate(newEValuation);
      setNewEValuation({
        id: "",
        user_id: "",
        category_id: "",
        status: "",
        name: "",
        price: "",
        image: "",
        type: "",
        metal: "",
        size: "",
        weight: "",
        other_remarks: "",
        content: "",
        date: null,
        appointment_date: null,
        branch_id: "",
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
      setNewEValuation((prevNewEValuation) => ({
        ...prevNewEValuation,
        errors: validationErrors,
      }));
    }
  };

  const handleUpdateEValuation = async () => {
    try {
      await eValuationSchema.validate(newEValuation, { abortEarly: false });

      const updatedEValuation: EValuation = {
        id: selectedEValuation?.id || "",
        user_id: newEValuation.user_id || selectedEValuation?.user_id || "",
        category_id: newEValuation.category_id || selectedEValuation?.category_id || "",
        status: newEValuation.status || selectedEValuation?.status || "",
        name: newEValuation.name || selectedEValuation?.name || "",
        price: newEValuation.price || selectedEValuation?.price || "",
        image: newEValuation.image || selectedEValuation?.image || "",
        type: newEValuation.type || selectedEValuation?.type || "",
        metal: newEValuation.metal || selectedEValuation?.metal || "",
        size: newEValuation.size || selectedEValuation?.size || "",
        weight: newEValuation.weight || selectedEValuation?.weight || "",
        other_remarks: newEValuation.other_remarks || selectedEValuation?.other_remarks || "",
        content: newEValuation.content || selectedEValuation?.content || "",
        date: newEValuation.date || selectedEValuation?.date || null,
        appointment_date: newEValuation.appointment_date || selectedEValuation?.appointment_date || null,
        branch_id: newEValuation.branch_id || selectedEValuation?.branch_id || "",
      };

      await updateEValuationMutation.mutateAsync(updatedEValuation);

      setSelectedEValuation(null);
      setOpen(false);

      setNewEValuation({
        id: "",
        user_id: "",
        category_id: "",
        status: "",
        name: "",
        price: "",
        image: "",
        type: "",
        metal: "",
        size: "",
        weight: "",
        other_remarks: "",
        content: "",
        date: null,
        appointment_date: null,
        branch_id: "",
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
      setNewEValuation((prevNewEValuation) => ({
        ...prevNewEValuation,
        errors: validationErrors,
      }));
    }
  };

  const handleDeleteEValuation = (eValuation: EValuation | null) => {
    if (eValuation) {
      deleteEValuationMutation.mutate(eValuation.id);
    }
    setDeleteConfirmationOpen(false);
    setEValuationToDelete(null);
  };
  const uniqueUserIds = Array.from(new Set(eValuations.map(eValuation => eValuation.user_id)));

  return (
    <div>
      <Helmet>
        <title>EValuations | Trust Group</title>
        <meta name='description' content='EValuations to have access!' />
      </Helmet>
      <Typography variant="h3" mb={"3rem"}>
        EValuations List
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
          Create EValuation
        </Button>
      </div>
      <Box sx={{ maxWidth: "20rem" }} mb={"2rem"}>
        <FormControl fullWidth >
          <InputLabel size="small" id="select-filter-label">Users</InputLabel>
          <Select
            labelId="select-filter-label"
            id="simple-select-filter"
            size="small"
            label="All Users"
            value={selectedUserIdFilter} // Sử dụng selectedRoleId
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
      <TableContainer className="has-action-fixed">
        <Table className="min-w-[1000px]">
          <TableHead>
            <TableRow>
              <TableCell>
                {eValuations.length > 0 ? "Id" : <Skeleton variant="rectangular" height={40} animation="wave" />}
              </TableCell>
              <TableCell>
                {eValuations.length > 0 ? "User Id" : <Skeleton variant="rectangular" height={40} animation="wave" />}
              </TableCell>
              <TableCell sx={{ maxWidth: "30rem" }}>
                {eValuations.length > 0 ? "Category Id" : <Skeleton variant="rectangular" height={40} animation="wave" />}
              </TableCell>
              <TableCell>
                {eValuations.length > 0 ? "Status" : <Skeleton variant="rectangular" height={40} animation="wave" />}
              </TableCell>
              <TableCell>
                {eValuations.length > 0 ? "Name" : <Skeleton variant="rectangular" height={40} animation="wave" />}
              </TableCell>
              <TableCell sx={{ maxWidth: "30rem" }}>
                {eValuations.length > 0 ? "Price" : <Skeleton variant="rectangular" height={40} animation="wave" />}
              </TableCell>
              <TableCell>
                {eValuations.length > 0 ? "Image" : <Skeleton variant="rectangular" height={40} animation="wave" />}
              </TableCell>
              <TableCell>
                {eValuations.length > 0 ? "Type" : <Skeleton variant="rectangular" height={40} animation="wave" />}
              </TableCell>
              <TableCell>
                {eValuations.length > 0 ? "Metal" : <Skeleton variant="rectangular" height={40} animation="wave" />}
              </TableCell>
              <TableCell>
                {eValuations.length > 0 ? "Size" : <Skeleton variant="rectangular" height={40} animation="wave" />}
              </TableCell>
              <TableCell sx={{ maxWidth: "30rem" }}>
                {eValuations.length > 0 ? "Weight" : <Skeleton variant="rectangular" height={40} animation="wave" />}
              </TableCell>
              <TableCell sx={{ maxWidth: "30rem" }}>
                {eValuations.length > 0 ? "Other Remarks" : <Skeleton variant="rectangular" height={40} animation="wave" />}
              </TableCell>
              <TableCell sx={{ maxWidth: "30rem" }}>
                {eValuations.length > 0 ? "Content" : <Skeleton variant="rectangular" height={40} animation="wave" />}
              </TableCell>
              <TableCell sx={{ maxWidth: "30rem" }}>
                {eValuations.length > 0 ? "Date" : <Skeleton variant="rectangular" height={40} animation="wave" />}
              </TableCell>
              <TableCell sx={{ maxWidth: "30rem" }}>
                {eValuations.length > 0 ? "Appointment Date" : <Skeleton variant="rectangular" height={40} animation="wave" />}
              </TableCell>
              <TableCell sx={{ maxWidth: "30rem" }}>
                {eValuations.length > 0 ? "Branch Id" : <Skeleton variant="rectangular" height={40} animation="wave" />}
              </TableCell>
              <TableCell align="right">
                {eValuations.length > 0 ? "Action" : <Skeleton variant="rectangular" height={40} animation="wave" />}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredEValuations.length > 0 ? (
              filteredEValuations.map((eValuation) => (
                <TableRow key={eValuation.id}>
                  <TableCell>{eValuation.id}</TableCell>
                  <TableCell>{eValuation.user_id}</TableCell>
                  <TableCell>{eValuation.category_id}</TableCell>
                  <TableCell>{eValuation.status}</TableCell>
                  <TableCell>{eValuation.name}</TableCell>
                  <TableCell>{eValuation.price}</TableCell>
                  <TableCell>{renderImageUrl(eValuation.image)}</TableCell>
                  <TableCell>{eValuation.type}</TableCell>
                  <TableCell>{eValuation.metal}</TableCell>
                  <TableCell>{eValuation.size}</TableCell>
                  <TableCell>{eValuation.weight}</TableCell>
                  <TableCell>{eValuation.other_remarks}</TableCell>
                  <TableCell>{eValuation.content}</TableCell>
                  <TableCell>{eValuation.date ? new Date(eValuation.date).toLocaleString() : ""}</TableCell>
                  <TableCell>{eValuation.appointment_date ? new Date(eValuation.appointment_date).toLocaleString() : ""}</TableCell>
                  <TableCell>{eValuation.branch_id}</TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={2} justifyContent={"end"}>
                      <Button variant="contained" color="primary" onClick={() => openEditFormPopup(eValuation)}>
                        Edit
                      </Button>
                      <Button variant="contained" color="secondary" onClick={() => openDeleteConfirmation(eValuation)}>
                        Delete
                      </Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={17}>
                  {eValuations.length === 0 ? (
                    <Skeleton variant="rectangular" height={50} animation="wave" />
                  ) : (
                    <p className="text-[1.6rem] text-center">No eValuations found.</p>
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
      <Dialog open={open} onClose={closeFormPopup} PaperProps={{ sx: { width: "100%", maxWidth: "100rem" } }}>
        <DialogTitle className="!pt-10">{selectedEValuation ? "Edit Role" : "Create New EValuation"}</DialogTitle>
        <DialogContent className="flex w-full flex-col gap-y-6 !pt-6">
          <div className="grid md:grid-cols-2 gap-x-[1.5rem] gap-y-[3rem] items-end">
            <FormControl fullWidth sx={{ ".MuiFormLabel-root": { background: "#fff", padding: "0 3px" } }}>
              <InputLabel size="small" id="select-user">User</InputLabel>
              <Select
                labelId="select-user"
                id="user-select"
                size="small"
                name="user_id"
                value={newEValuation.user_id}
                onChange={handleInputChange}
                variant="outlined"
                error={!!newEValuation.errors?.user_id}
              >
                {users.map((role:any) => (
                  <MenuItem key={role.id} value={role.id}>
                    {role.name}
                  </MenuItem>
                ))}
              </Select>
              {newEValuation.errors?.user_id && <FormHelperText error>{newEValuation.errors.user_id}</FormHelperText>}
            </FormControl>
            <TextField
              name="Category"
              label=""
              value={newEValuation.category_id}
              onChange={handleInputChange}
              variant="outlined"
              size="small"
              rows={4}
              fullWidth
              error={!!newEValuation.errors?.category_id}
              helperText={newEValuation.errors?.category_id}
            />
          </div>
          <div className="grid md:grid-cols-2 gap-x-[1.5rem] gap-y-[3rem] items-end">
            <TextField
              name="Status"
              label="Status"
              value={newEValuation.status}
              onChange={handleInputChange}
              variant="outlined"
              size="small"
              rows={4}
              fullWidth
              error={!!newEValuation.errors?.status}
              helperText={newEValuation.errors?.status}
            />
            <TextField
              name="Name"
              label="Name"
              value={newEValuation.name}
              onChange={handleInputChange}
              variant="outlined"
              size="small"
              rows={4}
              fullWidth
              error={!!newEValuation.errors?.name}
              helperText={newEValuation.errors?.name}
            />
          </div>
          <div className="grid md:grid-cols-2 gap-x-[1.5rem] gap-y-[3rem] items-end">
            <TextField
              name="price"
              label="Price"
              type="number"
              value={newEValuation.price}
              onChange={handleInputChange}
              variant="outlined"
              size="small"
              rows={4}
              fullWidth
              error={!!newEValuation.errors?.price}
              helperText={newEValuation.errors?.price}
            />
            <TextField
              name="image"
              label="Image"
              value={newEValuation.image}
              onChange={handleInputChange}
              variant="outlined"
              size="small"
              rows={4}
              fullWidth
              error={!!newEValuation.errors?.image}
              helperText={newEValuation.errors?.image}
            />
          </div>
          <div className="grid md:grid-cols-2 gap-x-[1.5rem] gap-y-[3rem] items-end">
            <TextField
              name="type"
              label="Type"
              value={newEValuation.type}
              onChange={handleInputChange}
              variant="outlined"
              size="small"
              rows={4}
              fullWidth
              error={!!newEValuation.errors?.type}
              helperText={newEValuation.errors?.type}
            />
            <TextField
              name="metal"
              label="Metal"
              value={newEValuation.metal}
              onChange={handleInputChange}
              variant="outlined"
              size="small"
              rows={4}
              fullWidth
              error={!!newEValuation.errors?.metal}
              helperText={newEValuation.errors?.metal}
            />
          </div>
          <div className="grid md:grid-cols-2 gap-x-[1.5rem] gap-y-[3rem] items-end">
            <TextField
              name="size"
              label="Size"
              value={newEValuation.size}
              onChange={handleInputChange}
              variant="outlined"
              size="small"
              rows={4}
              fullWidth
              error={!!newEValuation.errors?.size}
              helperText={newEValuation.errors?.size}
            />
            <TextField
              name="weight"
              label="Weight"
              value={newEValuation.weight}
              onChange={handleInputChange}
              variant="outlined"
              size="small"
              rows={4}
              fullWidth
              error={!!newEValuation.errors?.weight}
              helperText={newEValuation.errors?.weight}
            />
          </div>
          <div className="grid md:grid-cols-2 gap-x-[1.5rem] gap-y-[3rem] items-end">
            <TextField
              name="other_remarks"
              label="Other Remarks"
              value={newEValuation.other_remarks}
              onChange={handleInputChange}
              variant="outlined"
              size="small"
              rows={4}
              fullWidth
              error={!!newEValuation.errors?.other_remarks}
              helperText={newEValuation.errors?.other_remarks}
            />
            <TextField
              name="content"
              label="Content"
              value={newEValuation.content}
              onChange={handleInputChange}
              variant="outlined"
              size="small"
              rows={4}
              fullWidth
              error={!!newEValuation.errors?.content}
              helperText={newEValuation.errors?.content}
            />
          </div>
          <div className="grid md:grid-cols-2 gap-x-[1.5rem] gap-y-[3rem] items-end">
            <div>
              <DateTime
                label="Pawn Date"
                value={newEValuation.date}
                onChange={(newValue) => {
                  const event = {
                    target: {
                      name: "date",
                      value: newValue ? newValue.toISOString().replace("T", " ").slice(0, 19) : ""
                    }
                  } as React.ChangeEvent<HTMLInputElement>;
                  handleInputChange(event);
                }}
              />
              {newEValuation.errors?.date && (
                <p className="text-[red] px-[15px] text-[1.05rem] mt-[.5rem]">This field is required</p>
              )}
            </div>
            <div>
              <DateTime
                label="Appointment_date"
                value={newEValuation.appointment_date}
                onChange={(newValue) => {
                  const event = {
                    target: {
                      name: "appointment_date",
                      value: newValue ? newValue.toISOString().replace("T", " ").slice(0, 19) : ""
                    }
                  } as React.ChangeEvent<HTMLInputElement>;
                  handleInputChange(event);
                }}
              />
              {newEValuation.errors?.appointment_date && (
                <p className="text-[red] px-[15px] text-[1.05rem] mt-[.5rem]">This field is required</p>
              )}
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-x-[1.5rem] gap-y-[3rem] items-end">
            <TextField
              name="branch_id"
              label="Branch"
              value={newEValuation.branch_id}
              onChange={handleInputChange}
              variant="outlined"
              size="small"
              rows={4}
              fullWidth
              error={!!newEValuation.errors?.branch_id}
              helperText={newEValuation.errors?.branch_id}
            />
          </div>
        </DialogContent>
        <DialogActions className="!p-10">
          {selectedEValuation ? (
            <>
              <Button variant="contained" color="primary" onClick={handleUpdateEValuation}>
                Update
              </Button>
              <Button variant="contained" color="secondary" onClick={closeFormPopup}>
                Cancel
              </Button>
            </>
          ) : (
            <>
              <Button variant="contained" color="primary" onClick={handleCreateEValuation}>
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
        <DialogTitle>Delete Role</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to delete this Role?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="secondary" onClick={() => handleDeleteEValuation(eValuationToDelete)}>
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

export default EValuationComponent;

