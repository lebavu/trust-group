import { ReactNode, useState, ChangeEvent, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet-async";
import "react-toastify/dist/ReactToastify.css";
import * as yup from "yup";
import {
  Grid,
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
import { EValuation, EValuationsResponse, MetaData } from "@/api/types";
import { fetchEValuations, createEValuation, deleteEValuation } from "@/api/e-valuation.api";
import DateTime from "@/components/DateTime";
import MediaManager from "@/components/Media";
import http from "@/utils/http";
import { eValuationSchema } from "@/utils/rules";
import { useNavigate } from "react-router-dom";
import RichTextEditor from "@/components/Editor";
import Popover from "@/components/Popover";
import Breadcrumbs from "@/components/Breadcrumbs";
import Image from "@/components/Image";
import DataTable from "@/components/Table";

type SelectedEValuations = { [eValuationId: string]: boolean };

const renderImageUrl = (imageUrl: string | File | undefined): ReactNode => {
  if (typeof imageUrl === "string") {
    return <Image src={imageUrl} alt="User" style={{ width: "5rem" }} />;
  } else if (imageUrl instanceof File) {
    const temporaryUrl = URL.createObjectURL(imageUrl);
    return <Image src={temporaryUrl} alt="User" style={{ width: "5rem" }} />;
  } else {
    return null;
  }
};

const fetchUsers = async () => {
  const response = await http.get("users");
  return response.data.data;
};

const fetchBranches = async () => {
  const response = await http.get("branches");
  return response.data.data;
};

const fetchCategories = async () => {
  const response = await http.get("e-valuation-categories");
  return response.data.data;
};

const fetchUserName = async (userId: string) => {
  const response = await http.get(`users/${userId}`);
  return response.data.data.name;
};

const fetchBranchName = async (branchId: string) => {
  const response = await http.get(`branches/${branchId}`);
  return response.data.data.name;
};

const fetchCateName = async (cateId: string) => {
  const response = await http.get(`e-valuation-categories/${cateId}`);
  return response.data.data.name;
};

const UserName: React.FC<{ userId: string }> = ({ userId }) => {
  const { data: userName } = useQuery(["userName", userId], () => fetchUserName(userId));
  return <>{userName}</>;
};

const CateName: React.FC<{ cateId: string }> = ({ cateId }) => {
  const { data: cateName } = useQuery(["userName", cateId], () => fetchCateName(cateId));
  return <>{cateName}</>;
};

const BranchName: React.FC<{ branchId: string }> = ({ branchId }) => {
  const { data: branchName } = useQuery(["userName", branchId], () => fetchBranchName(branchId));
  return <>{branchName}</>;
};

const EValuationComponent: React.FC = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { data: users = [] } = useQuery("users", fetchUsers);
  const { data: eValuationsResponse = {} as EValuationsResponse } = useQuery<EValuationsResponse>(
    "eValuations",
    () => fetchEValuations(1)
  );

  const { data: branches = [] } = useQuery("branches", fetchBranches);
  const { data: categories = [] } = useQuery("categories", fetchCategories);
  const createEValuationMutation = useMutation(createEValuation, {
    onSuccess: () => {
      queryClient.invalidateQueries("eValuations");
      toast.success("EValuation created successfully.");
    },
    onError: () => {
      toast.error("Failed to create EValuation.");
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
  const tablePerPage = 10;
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [eValuationToDelete, setEValuationToDelete] = useState<EValuation | null>(null);
  const [selectedImageUrl, setSelectedImageUrl] = useState("");
  const [selectedUserIdFilter, setSelectedUserIdFilter] = useState<string>("");
  const [selectedEValuations, setSelectedEValuations] = useState<SelectedEValuations>({});
  const [popoverInfo, setPopoverInfo] = useState<{ [key: string]: { open: boolean; anchorEl: HTMLElement | null } }>({});
  const [selectedRows, setSelectedRows] = useState<any[]>([]);

  const handleRowSelectionChange = (newSelection: any[]) => {
    setSelectedRows(newSelection);
  };

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
    const areAllSelected = Object.values(selectedEValuations).every((selected) => selected);

    const updatedSelectedEValuations = { ...selectedEValuations };

    eValuations.forEach((eValuations) => {
      updatedSelectedEValuations[eValuations.id] = !areAllSelected;
    });

    setSelectedEValuations(updatedSelectedEValuations);
  };

  const { data: eValuations = [], meta = {} as MetaData } = eValuationsResponse;
  const { per_page, total } = meta as MetaData;

  useEffect(() => {
    setCurrentPage(1);
  }, [eValuationsResponse]);

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

          setNewEValuation((prevNewEValuation) => ({
            ...prevNewEValuation,
            date: formattedDate,
          }));
        }
      }else{
        setNewEValuation((prevNewEValuation) => ({
          ...prevNewEValuation,
          date: value,
        }));
      }
    }
    else if (name === "appointment_date") {
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

          setNewEValuation((prevNewEValuation) => ({
            ...prevNewEValuation,
            appointment_date: formattedDate,
          }));
        }
      }else{
        setNewEValuation((prevNewEValuation) => ({
          ...prevNewEValuation,
          appointment_date: value,
        }));
      }
    } else if (name === "status") {
      const intValue = parseInt(value, 10);
      setNewEValuation((prevNewEValuation) => ({
        ...prevNewEValuation,
        status: intValue,
      }));
    } else {
      setNewEValuation((prevNewEValuation) => ({
        ...prevNewEValuation,
        [name]: value,
      }));
    }
  };

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchKeyword(event.target.value);
  };

  const handlePageChange = async (_: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
    await queryClient.prefetchQuery("eValuations", () => fetchEValuations(value));
  };


  const indexOfLastEValuation = currentPage * per_page;
  const indexOfFirstEValuation = indexOfLastEValuation - per_page;
  const currentEValuations = eValuations.slice(
    indexOfFirstEValuation,
    indexOfLastEValuation
  );
  const filteredEValuations = currentEValuations.filter((eValuation) => {
    const isMatchingUser = !selectedUserIdFilter || eValuation.user_id === selectedUserIdFilter;
    if (eValuation && eValuation.name && eValuation.user_id) {
      const nameMatch = eValuation.name
        .toLowerCase()
        .includes(searchKeyword.toLowerCase());
      return isMatchingUser && nameMatch;
    }
    return false;
  });

  const totalPages = Math.ceil(total / per_page) || 1;

  const handleSelectedMedia = (media: any) => {
    setSelectedImageUrl(media.image_url);
    setNewEValuation((prevNewEValuation) => ({
      ...prevNewEValuation,
      image: media.image_url,
    }));
  };

  const openFormPopup = () => {
    setSelectedEValuation(null);
    setSelectedImageUrl("");
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
    navigate(`/evaluations/update-e-valuation/${eValuation.id}`);
  };

  const closeFormPopup = () => {
    setSelectedEValuation(null);
    setSelectedImageUrl("");
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

  const handleCheckboxChange = (eValuationId: string) => {
    setSelectedEValuations((prevSelectedEValuations) => ({
      ...prevSelectedEValuations,
      [eValuationId]: !prevSelectedEValuations[eValuationId],
    }));
  };

  const handleDeleteSelectedEValuations = () => {
    const eValuationsToDelete = Object.keys(selectedEValuations).filter((eValuationId) => selectedEValuations[eValuationId]);
    if (eValuationsToDelete.length > 0) {
      eValuationsToDelete.forEach((eValuationId) => {
        deleteEValuationMutation.mutate(eValuationId);
      });
      // Clear selected EValuations
      setSelectedEValuations({});
    }
  };

  const handleDeleteSelectedRows = async (selectedRows:any) => {
    if (selectedRows.length === 0) {
      return;
    }
    try {
      await Promise.all(selectedRows.map((id:any) => deleteEValuationMutation.mutateAsync(id)));
      queryClient.invalidateQueries("eValuations");
      setSelectedRows([]);
      toast.success("Selected e-valuations have been deleted successfully.");
    } catch (error) {
      console.error("Error while deleting e-valuations:", error);
      toast.error("An error occurred while deleting selected e-valuations.");
    }
  };

  const countSelectedEValuations = () => {
    return Object.values(selectedEValuations).filter((selected) => selected).length;
  };
  const selectedEValuationsCount = countSelectedEValuations();

  const handleDeleteEValuation = (eValuation: EValuation | null) => {
    if (eValuation) {
      deleteEValuationMutation.mutate(eValuation.id);
    }
    setDeleteConfirmationOpen(false);
    setEValuationToDelete(null);
  };


  const uniqueUserIds = Array.from(new Set(eValuations.map(eValuation => eValuation.user_id)));
  const EVStatusOptions = [
    { value: 0, label: "Pending", class: "pending" },
    { value: 1, label: "On Progress", class: "progress" },
    { value: 2, label: "Completed", class: "completed" },
  ];
  const pageSizeOptions = [5, 10, 20, 50, 100];
  const columns = [
    {
      field: "user_id",
      headerName: "User Id",
      flex: 1,
    },
    {
      field: "category_id",
      headerName: "Category Id",
      flex: 1,
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
    },
    {
      field: "name",
      headerName: "Name",
      flex: 1,
    },
    {
      field: "price",
      headerName: "Price",
      flex: 1,
    },
    {
      field: "image",
      headerName: "Image",
      flex: 1,
      renderCell: (params: any) => {
        return renderImageUrl(params.value);
      },
    },
    {
      field: "date",
      headerName: "Date",
      flex: 1,
    },
    {
      field: "appointment_date",
      headerName: "Appointment Date",
      flex: 1,
    },
    {
      field: "Branch Id",
      headerName: "branch_id",
      flex: 1,
    },
    {
      field: "actions",
      headerName: "Actions",
      sortable: false,
      width: 100,
      renderCell: (params: any) => {
        return (
          <>
            <IconButton color="primary" onClick={(e) => handleOpenPopover(params.id, e)}>
              <MoreVertIcon />
            </IconButton>
            <Popover
              open={popoverInfo[params.id]?.open || false}
              anchorEl={popoverInfo[params.id]?.anchorEl}
              onClose={() => handleClosePopover(params.id)}
            >
              <List>
                <ListItemButton onClick={() => openEditFormPopup(params)}>
                  <ListItemIcon sx={{ minWidth: "3.5rem" }}>
                    <ModeEditSharpIcon color="primary"/>
                  </ListItemIcon>
                  <ListItemText primary="Edit" />
                </ListItemButton>
                <ListItemButton onClick={() => openDeleteConfirmation(params)} >
                  <ListItemIcon sx={{ minWidth: "3.5rem" }}>
                    <DeleteRoundedIcon color="secondary"/>
                  </ListItemIcon>
                  <ListItemText primary="Delete" className="text-secondary"/>
                </ListItemButton>
              </List>
            </Popover>
          </>
        );
      },
    },
  ];
  return (
    <div>
      <Helmet>
        <title>EValuations | Trust Group</title>
        <meta name='description' content='EValuations to have access!' />
      </Helmet>
      <Typography variant="h3" mb={"3rem"}>
        EValuations List
      </Typography>
      <Breadcrumbs/>
      <div className="mb-10 flex items-center justify-between gap-3 flex-wrap">
        <TextField
          label="Search"
          size="small"
          value={searchKeyword}
          onChange={handleSearchChange}
          variant="outlined"
          sx={{ maxWidth: "22rem", width: "100%" }}
          InputProps={{
            endAdornment: (
              <InputAdornment position='end'>
                <Search />
              </InputAdornment>
            )
          }}
        />
        <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={openFormPopup}>
          Create EValuation
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
            <MenuItem value="">All Users</MenuItem>
            {uniqueUserIds.map((userId) => (
              <MenuItem key={userId} value={userId}>
                <UserName userId={userId} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      {branches.length === 0 ? (
        <Grid container spacing={2}>
          {[...Array(3)].map((_, rowIndex) => (
            <Grid container item spacing={2} key={rowIndex}>
              {[...Array(3)].map((_, colIndex) => (
                <Grid item xs={4} key={colIndex}>
                  <Skeleton width={"100%"} height={50}/>
                </Grid>
              ))}
            </Grid>
          ))}
        </Grid>
      ) : (
        <DataTable
          columns={columns}
          rows={filteredEValuations}
          initialPagination={{
            page: currentPage,
            pageSize: tablePerPage,
          }}
          pageSizeOptions={pageSizeOptions}
          checkboxSelection={true}
          disableRowSelectionOnClick={true}
          selectedRows={selectedRows}
          onRowSelectionModelChange={handleRowSelectionChange}
          onDeleteRow={handleDeleteSelectedRows}
        />
      )}
      <TableContainer className="has-action-fixed">
        <Table className="min-w-[1000px]">
          <TableHead>
            <TableRow>
              <TableCell>
                {eValuations.length > 0 ? (
                  <Checkbox
                    indeterminate={
                      Object.values(selectedEValuations).some((selected) => selected) &&
                      Object.values(selectedEValuations).some((selected) => !selected)
                    }
                    checked={Object.values(selectedEValuations).every((selected) => selected)}
                    onChange={handleSelectAll}
                  />
                ) : (
                  <Skeleton  height={60} animation="wave" />
                )
                }
              </TableCell>
              <TableCell>
                {eValuations.length > 0 ? "User Id" : <Skeleton  height={60} animation="wave" />}
              </TableCell>
              <TableCell sx={{ maxWidth: "30rem" }}>
                {eValuations.length > 0 ? "Category Id" : <Skeleton  height={60} animation="wave" />}
              </TableCell>
              <TableCell>
                {eValuations.length > 0 ? "Status" : <Skeleton  height={60} animation="wave" />}
              </TableCell>
              <TableCell>
                {eValuations.length > 0 ? "Name" : <Skeleton  height={60} animation="wave" />}
              </TableCell>
              <TableCell sx={{ maxWidth: "30rem" }}>
                {eValuations.length > 0 ? "Price" : <Skeleton  height={60} animation="wave" />}
              </TableCell>
              <TableCell>
                {eValuations.length > 0 ? "Image" : <Skeleton  height={60} animation="wave" />}
              </TableCell>
              <TableCell sx={{ maxWidth: "30rem" }}>
                {eValuations.length > 0 ? "Date" : <Skeleton  height={60} animation="wave" />}
              </TableCell>
              <TableCell sx={{ maxWidth: "30rem" }}>
                {eValuations.length > 0 ? "Appointment Date" : <Skeleton  height={60} animation="wave" />}
              </TableCell>
              <TableCell sx={{ maxWidth: "30rem" }}>
                {eValuations.length > 0 ? "Branch Id" : <Skeleton  height={60} animation="wave" />}
              </TableCell>
              <TableCell align="right">
                {eValuations.length > 0 ? "Action" : <Skeleton  height={60} animation="wave" />}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredEValuations.length > 0 ? (
              filteredEValuations.map((eValuation) => (
                <TableRow key={eValuation.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedEValuations[eValuation.id] || false}
                      onChange={() => handleCheckboxChange(eValuation.id)}
                    />
                  </TableCell>
                  <TableCell>
                    {eValuation.user_id && (
                      <UserName userId={eValuation.user_id} />
                    )}
                  </TableCell>
                  <TableCell>
                    {eValuation.category_id && (
                      <CateName cateId={eValuation.category_id} />
                    )}
                  </TableCell>
                  <TableCell>
                    <span className={`status-cell ${EVStatusOptions.find(option => option.value == eValuation.status)?.class || "unknown"}`}>
                      {EVStatusOptions.find(option => option.value == eValuation.status)?.label || "Unknown"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <strong>{eValuation.name}</strong>
                  </TableCell>
                  <TableCell>{eValuation.price}</TableCell>
                  <TableCell>{renderImageUrl(eValuation.image)}</TableCell>
                  <TableCell>{eValuation.date ? new Date(eValuation.date).toLocaleString() : ""}</TableCell>
                  <TableCell>{eValuation.appointment_date ? new Date(eValuation.appointment_date).toLocaleString() : ""}</TableCell>
                  <TableCell>
                    {eValuation.branch_id && (
                      <BranchName branchId={eValuation.branch_id} />
                    )}
                  </TableCell>
                  <TableCell className="!text-right">
                    <IconButton color="primary" onClick={(e) => handleOpenPopover(eValuation.id, e)}>
                      <MoreVertIcon />
                    </IconButton>
                    <Popover
                      open={popoverInfo[eValuation.id]?.open || false}
                      anchorEl={popoverInfo[eValuation.id]?.anchorEl}
                      onClose={() => handleClosePopover(eValuation.id)}
                    >
                      <List>
                        <ListItemButton onClick={() => openEditFormPopup(eValuation)}>
                          <ListItemIcon sx={{ minWidth: "3.5rem" }}>
                            <ModeEditSharpIcon color="primary"/>
                          </ListItemIcon>
                          <ListItemText primary="Edit" />
                        </ListItemButton>
                        <ListItemButton onClick={() => openDeleteConfirmation(eValuation)} >
                          <ListItemIcon sx={{ minWidth: "3.5rem" }}>
                            <DeleteRoundedIcon color="error"/>
                          </ListItemIcon>
                          <ListItemText primary="Delete" className="text-[red]"/>
                        </ListItemButton>
                      </List>
                    </Popover>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={17}>
                  {eValuations.length === 0 ? (
                    <Skeleton  height={60} animation="wave" />
                  ) : (
                    <p className="text-[1.6rem] text-center">No eValuations found.</p>
                  )}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {Object.values(selectedEValuations).some((selected) => selected) && (
        <div className="mt-6">
          <Button variant="outlined" startIcon={<DeleteRoundedIcon />} color="primary" onClick={handleDeleteSelectedEValuations} disabled={selectedEValuationsCount === 0}>
            Delete Selected ({selectedEValuationsCount})
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
        <DialogTitle className="!pt-10">{selectedEValuation ? "Edit Role" : "Create New EValuation"}</DialogTitle>
        <DialogContent className="flex w-full flex-col gap-y-12  !pt-6">
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
                IconComponent={ExpandMoreIcon}
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
            <FormControl fullWidth sx={{ ".MuiFormLabel-root": { background: "#fff", padding: "0 3px" } }}>
              <InputLabel size="small" id="select-category">Category</InputLabel>
              <Select
                labelId="select-category"
                id="category-select"
                size="small"
                name="category_id"
                value={newEValuation.category_id}
                IconComponent={ExpandMoreIcon}
                onChange={handleInputChange}
                variant="outlined"
                error={!!newEValuation.errors?.category_id}
              >
                {categories.map((category:any) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
              {newEValuation.errors?.category_id && <FormHelperText error>{newEValuation.errors.category_id}</FormHelperText>}
            </FormControl>
          </div>
          <div className="grid md:grid-cols-2 gap-x-[1.5rem] gap-y-[3rem] items-end">
            <FormControl fullWidth sx={{ ".MuiFormLabel-root": { background: "#fff", padding: "0 3px" } }}>
              <InputLabel size="small" id="status">Status</InputLabel>
              <Select
                name="status"
                label="Status"
                value={newEValuation.status.toString()}
                onChange={handleInputChange}
                variant="outlined"
                IconComponent={ExpandMoreIcon}
                fullWidth
                size="small"
                error={!!newEValuation.errors?.status}
              >
                {EVStatusOptions.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
              {newEValuation.errors?.status && <FormHelperText error>{newEValuation.errors.status}</FormHelperText>}
            </FormControl>
            <TextField
              name="name"
              label="Name"
              size="small"
              value={newEValuation.name}
              onChange={handleInputChange}
              variant="outlined"
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
              fullWidth
              error={!!newEValuation.errors?.price}
              helperText={newEValuation.errors?.price}
            />
            <div className="flex flex-col gap-3">
              <div>
                <span className="!mb-3 block !font-medium !text-[1.3rem]"> Image:
                </span>
                <MediaManager onMediaSelect={handleSelectedMedia} />
              </div>
              {selectedImageUrl && (
                <div>
                  <p className="text-[1.2rem] text-gray-700 mb-2">Selected Image:</p>
                  <div className="image w-[8rem] h-[8rem] bg-slate-100 border-solid border-slate-300 border-[1px]">
                    <Image src={selectedImageUrl} classNames="w-full h-full object-cover" alt="Selected Media" />
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-x-[1.5rem] gap-y-[3rem] items-end">
            <TextField
              name="type"
              label="Type"
              value={newEValuation.type}
              onChange={handleInputChange}
              variant="outlined"
              size="small"
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
              fullWidth
              error={!!newEValuation.errors?.other_remarks}
              helperText={newEValuation.errors?.other_remarks}
            />
            <FormControl fullWidth sx={{ ".MuiFormLabel-root": { background: "#fff", padding: "0 3px" } }}>
              <InputLabel size="small" id="select-branch">Branch</InputLabel>
              <Select
                labelId="select-branch"
                id="branch-select"
                size="small"
                name="branch_id"
                value={newEValuation.branch_id}
                IconComponent={ExpandMoreIcon}
                onChange={handleInputChange}
                variant="outlined"
                error={!!newEValuation.errors?.branch_id}
              >
                {branches.map((branch:any) => (
                  <MenuItem key={branch.id} value={branch.id}>
                    {branch.name}
                  </MenuItem>
                ))}
              </Select>
              {newEValuation.errors?.branch_id && <FormHelperText error>{newEValuation.errors.branch_id}</FormHelperText>}
            </FormControl>
          </div>
          <div>
            <span className="!mb-3 block !font-medium !text-[1.3rem]"> Content:
            </span>
            <RichTextEditor
              value={newEValuation.content || ""} // Pass the current content value
              onChange={(content: string) => {
                console.log(content);
                // Update the newEValuation state with the new content
                setNewEValuation((prevNewEValuation) => ({
                  ...prevNewEValuation,
                  content: content,
                }));
              }}
            />
          </div>
          <div className="grid md:grid-cols-2 gap-x-[1.5rem] gap-y-[3rem] items-end">
            <div className="relative">
              <DateTime
                label="Date"
                value={newEValuation.date}
                onChange={(newValue) => {
                  const event = {
                    target: {
                      name: "date",
                      value: newValue instanceof Date ? newValue.toISOString() : null,
                    },
                  } as React.ChangeEvent<HTMLInputElement>;
                  handleInputChange(event);
                }}
              />
              {newEValuation.errors?.date && (
                <p className="el-error">This field is required</p>
              )}
            </div>
            <div className="relative">
              <DateTime
                label="Appointment Date"
                value={newEValuation.appointment_date}
                onChange={(newValue) => {
                  const event = {
                    target: {
                      name: "appointment_date",
                      value: newValue instanceof Date ? newValue.toISOString() : null,
                    },
                  } as React.ChangeEvent<HTMLInputElement>;
                  handleInputChange(event);
                }}
              />
              {newEValuation.errors?.appointment_date && (
                <p className="el-error">This field is required</p>
              )}
            </div>
          </div>
        </DialogContent>
        <DialogActions className="!p-10">
          <Button variant="contained" color="primary" onClick={handleCreateEValuation}>
            Create
          </Button>
          <Button variant="contained" color="secondary" onClick={closeFormPopup}>
            Cancel
          </Button>
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
    </div>
  );
};

export default EValuationComponent;