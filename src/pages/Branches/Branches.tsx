import { ReactNode, useState, ChangeEvent } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as yup from "yup";
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
  Skeleton,
  InputAdornment,
  IconButton,
  List,
  Grid,
  ListItemButton,
  ListItemText,
  ListItemIcon,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ModeEditSharpIcon from "@mui/icons-material/ModeEditSharp";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import { Helmet } from "react-helmet-async";
import { Search } from "@mui/icons-material";
import { Branch } from "@/api/types";
import { fetchBranches, createBranch, updateBranch, deleteBranch } from "@/api/branch.api";
import MediaManager from "@/components/Media";
import Popover from "@/components/Popover";
import Breadcrumbs from "@/components/Breadcrumbs";
import DataTable from "@/components/Table";
import Image from "@/components/Image";

const branchSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  address: yup.string().required("Address is required"),
  image_url: yup.string().required("Address is required"),
});

// Function to render the image URL or file preview
const renderImageUrl = (imageUrl: string | File | undefined): ReactNode => {
  if (typeof imageUrl === "string") {
    return <Image src={imageUrl} alt="Branch" style={{ width: "5rem" }} />;
  } else if (imageUrl instanceof File) {
    const temporaryUrl = URL.createObjectURL(imageUrl);
    return <Image src={temporaryUrl} alt="Branch" style={{ width: "5rem" }} />;
  } else {
    return null;
  }
};

const BranchComponent: React.FC = () => {
  const queryClient = useQueryClient();

  const { data: branches = [] } = useQuery<Branch[]>("branches", fetchBranches);

  const createBranchMutation = useMutation(createBranch, {
    onSuccess: () => {
      queryClient.invalidateQueries("branches");
      toast.success("Branch created successfully.");
    },
    onError: () => {
      toast.error("Failed to create branch.");
    },
  });

  const updateBranchMutation = useMutation(updateBranch, {
    onSuccess: () => {
      queryClient.invalidateQueries("branches");
      toast.success("Branch updated successfully.");
    },
    onError: () => {
      toast.error("Failed to update branch.");
    },
  });

  const deleteBranchMutation = useMutation(deleteBranch, {
    onSuccess: () => {
      queryClient.invalidateQueries("branches");
      toast.success("Branch deleted successfully.");
    },
    onError: () => {
      toast.error("Failed to delete branch.");
    },
  });

  const [newBranch, setNewBranch] = useState<Branch>({
    id: "",
    name: "",
    address: "",
    image_url: "",
  });

  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [open, setOpen] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [currentPage] = useState(1);
  const branchesPerPage = 10;
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [branchToDelete, setBranchToDelete] = useState<Branch | null>(null);
  const [selectedImageUrl, setSelectedImageUrl] = useState("");
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

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setNewBranch((prevNewBranch) => ({
      ...prevNewBranch,
      [name]: value,
    }));
  };

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchKeyword(event.target.value);
  };


  const indexOfLastBranch = currentPage * branchesPerPage;
  const indexOfFirstBranch = indexOfLastBranch - branchesPerPage;
  const currentBranches = branches.slice(indexOfFirstBranch, indexOfLastBranch);

  const filteredBranches = currentBranches.filter((branch) => {
    if (branch && branch.name) {
      const nameMatch = branch.name.toLowerCase().includes(searchKeyword.toLowerCase());
      const addressMatch = branch.address.toLowerCase().includes(searchKeyword.toLowerCase());
      return nameMatch || addressMatch;
    }
    return false;
  });

  const openFormPopup = () => {
    setSelectedBranch(null);
    setNewBranch({
      id: "",
      name: "",
      address: "",
      image_url: "",
    });
    setSelectedImageUrl("");
    setOpen(true);
  };

  const openEditFormPopup = (branch: Branch) => {
    setSelectedBranch(branch);
    setNewBranch(branch);
    setSelectedImageUrl(branch.image_url);
    setOpen(true);
  };

  const closeFormPopup = () => {
    setSelectedBranch(null);
    setOpen(false);
  };

  const openDeleteConfirmation = (branch: Branch) => {
    setDeleteConfirmationOpen(true);
    setBranchToDelete(branch);
  };

  const closeDeleteConfirmation = () => {
    setDeleteConfirmationOpen(false);
    setBranchToDelete(null);
  };

  const handleCreateBranch = async () => {
    try {
      await branchSchema.validate(newBranch, { abortEarly: false });
      createBranchMutation.mutate(newBranch);
      setNewBranch({
        id: "",
        name: "",
        address: "",
        image_url: "",
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
      setNewBranch((prevNewBranch) => ({
        ...prevNewBranch,
        errors: validationErrors,
      }));
    }
  };

  const handleUpdateBranch = async () => {
    try {
      await branchSchema.validate(newBranch, { abortEarly: false });

      const updatedBranch: Branch = {
        id: selectedBranch?.id || "",
        name: newBranch.name || selectedBranch?.name || "",
        address: newBranch.address || selectedBranch?.address || "",
        image_url: newBranch.image_url || selectedBranch?.image_url || "",
      };

      if (!newBranch.image_url) {
        updatedBranch.image_url = selectedBranch?.image_url || "";
      }

      await updateBranchMutation.mutateAsync(updatedBranch);

      setSelectedBranch(null);
      setOpen(false);

      setNewBranch({
        id: "",
        name: "",
        address: "",
        image_url: "",
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
      setNewBranch((prevNewBranch) => ({
        ...prevNewBranch,
        errors: validationErrors,
      }));
    }
  };

  const handleDeleteSelectedRows = async (selectedRows:any) => {
    if (selectedRows.length === 0) {
      return;
    }
    try {
      await Promise.all(selectedRows.map((branchId:any) => deleteBranchMutation.mutateAsync(branchId)));
      queryClient.invalidateQueries("branches");
      setSelectedRows([]);
      toast.success("Selected branches have been deleted successfully.");
    } catch (error) {
      console.error("Error while deleting branches:", error);
      toast.error("An error occurred while deleting selected branches.");
    }
  };

  const handleDeleteBranch = (branch: Branch | null) => {
    if (branch) {
      deleteBranchMutation.mutate(branch.id);
    }
    setDeleteConfirmationOpen(false);
    setBranchToDelete(null);
  };


  const handleSelectedMedia = (media: any) => {
    setSelectedImageUrl(media.image_url);
    setNewBranch((prevNewBranch) => ({
      ...prevNewBranch,
      image_url: media.image_url,
    }));
  };

  const pageSizeOptions = [5, 10, 20, 50, 100];
  const columns = [
    {
      field: "name",
      headerName: "Name",
      flex: 1,
    },
    {
      field: "address",
      headerName: "Address",
      flex: 1,
    },
    {
      field: "image_url",
      headerName: "Image",
      flex: 1,
      renderCell: (params: any) => {
        return renderImageUrl(params.value);
      },
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
        <title>Branches | Trust Group</title>
        <meta name='description' content='Branches to have access!' />
      </Helmet>
      <Typography variant="h3" mb={"3rem"}>
        Branches List
      </Typography>
      <Breadcrumbs />
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
          Create Branch
        </Button>
      </div>
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
          rows={filteredBranches}
          initialPagination={{
            page: currentPage,
            pageSize: branchesPerPage,
          }}
          pageSizeOptions={pageSizeOptions}
          checkboxSelection={true}
          disableRowSelectionOnClick={true}
          selectedRows={selectedRows}
          onRowSelectionModelChange={handleRowSelectionChange}
          onDeleteRow={handleDeleteSelectedRows}
        />
      )}
      <Dialog open={open} onClose={closeFormPopup} PaperProps={{ sx: { width: "100%", maxWidth: "50rem" } }}>
        <DialogTitle className="!pt-10">{selectedBranch ? "Edit Branch" : "Create New Branch"}</DialogTitle>
        <DialogContent className="flex w-full flex-col gap-y-12  !pt-6">
          <TextField
            name="name"
            label="Name"
            value={newBranch.name}
            onChange={handleInputChange}
            variant="outlined"
            size="small"
            fullWidth
            error={!!newBranch.errors?.name}
            helperText={newBranch.errors?.name}
            sx={{ marginBottom: "2rem" }}
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
            error={!!newBranch.errors?.address}
            helperText={newBranch.errors?.address}
            sx={{ marginBottom: "2rem" }}
          />
          {selectedImageUrl && (
            <div>
              <p className="text-[1.2rem] text-gray-700 mb-2">Selected Image:</p>
              <div className="image w-[8rem] h-[8rem] bg-slate-100 border-solid border-slate-300 border-[1px]">
                <Image src={selectedImageUrl} classNames="w-full h-full object-cover" alt="Selected Media" />
              </div>
            </div>
          )}
          <MediaManager onMediaSelect={handleSelectedMedia} />
        </DialogContent>
        <DialogActions className="!p-10">
          {selectedBranch ? (
            <>
              <Button variant="contained" color="primary" onClick={handleUpdateBranch}>
                Update
              </Button>
              <Button variant="contained" color="secondary" onClick={closeFormPopup}>
                Cancel
              </Button>
            </>
          ) : (
            <>
              <Button variant="contained" color="primary" onClick={handleCreateBranch}>
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
        <DialogTitle>Delete Branch</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to delete this branch?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="secondary" onClick={() => handleDeleteBranch(branchToDelete)}>
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

export default BranchComponent;

