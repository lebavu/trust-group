// import { ReactNode, useState, ChangeEvent, useEffect } from "react";
// import { useQuery, useMutation, useQueryClient } from "react-query";
// import { toast } from "react-toastify";
// import { Helmet } from "react-helmet-async";
// import "react-toastify/dist/ReactToastify.css";
// import * as yup from "yup";
// import {
//   Button,
//   TextField,
//   Box,
//   Table,
//   TableContainer,
//   TableHead,
//   TableRow,
//   TableCell,
//   TableBody,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogContentText,
//   DialogTitle,
//   Typography,
//   Pagination,
//   Skeleton,
//   Stack,
//   InputAdornment,
//   Select,
//   MenuItem,
//   FormControl,
//   FormHelperText,
//   InputLabel,
//   Checkbox
// } from "@mui/material";
// import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
// import { type SelectChangeEvent } from "@mui/material";
// import { Search } from "@mui/icons-material";
// import { EValuation, EValuationsResponse } from "@/api/types";
// import { fetchEValuations, createEValuation, deleteEValuation } from "@/api/e-valuation.api";
// import DateTime from "@/components/DateTime";
// import MediaManager from "@/components/Media";
// import http from "@/utils/http";
// import { eValuationSchema } from "@/utils/rules";
// import { useNavigate } from "react-router-dom";
// import RichTextEditor from "@/components/Editor";

// type SelectedEValuations = { [eValuationId: string]: boolean };

// const renderImageUrl = (imageUrl: string | File | undefined): ReactNode => {
//   if (typeof imageUrl === "string") {
//     return <img src={imageUrl} alt="User" style={{ width: "5rem" }} />;
//   } else if (imageUrl instanceof File) {
//     const temporaryUrl = URL.createObjectURL(imageUrl);
//     return <img src={temporaryUrl} alt="User" style={{ width: "5rem" }} />;
//   } else {
//     return null;
//   }
// };

// const fetchUsers = async () => {
//   const response = await http.get("users");
//   return response.data.data;
// };

// const fetchBranches = async () => {
//   const response = await http.get("branches");
//   return response.data.data;
// };

// const fetchCategories = async () => {
//   const response = await http.get("e-valuation-categories");
//   return response.data.data;
// };

// const fetchUserName = async (userId: string) => {
//   const response = await http.get(`users/${userId}`);
//   return response.data.data.name;
// };

// const fetchBranchName = async (branchId: string) => {
//   const response = await http.get(`branches/${branchId}`);
//   return response.data.data.name;
// };

// const fetchCateName = async (cateId: string) => {
//   const response = await http.get(`e-valuation-categories/${cateId}`);
//   return response.data.data.name;
// };

// const UserName: React.FC<{ userId: string }> = ({ userId }) => {
//   const { data: userName } = useQuery(["userName", userId], () => fetchUserName(userId));
//   return <>{userName}</>;
// };

// const CateName: React.FC<{ cateId: string }> = ({ cateId }) => {
//   const { data: cateName } = useQuery(["userName", cateId], () => fetchCateName(cateId));
//   return <>{cateName}</>;
// };

// const BranchName: React.FC<{ branchId: string }> = ({ branchId }) => {
//   const { data: branchName } = useQuery(["userName", branchId], () => fetchBranchName(branchId));
//   return <>{branchName}</>;
// };

// const EValuationComponent: React.FC = () => {
//   const queryClient = useQueryClient();
//   const navigate = useNavigate();
//   const { data: users = [] } = useQuery("users", fetchUsers);
//   const { data: eValuationsResponse = {} as EValuationsResponse } = useQuery<EValuationsResponse>(
//     "eValuations",
//     () => fetchEValuations(1)
//   );

//   const { data: branches = [] } = useQuery("branches", fetchBranches);
//   const { data: categories = [] } = useQuery("categories", fetchCategories);
//   const createEValuationMutation = useMutation(createEValuation, {
//     onSuccess: () => {
//       queryClient.invalidateQueries("eValuations");
//       toast.success("EValuation created successfully.");
//     },
//     onError: () => {
//       toast.error("Failed to create EValuation.");
//     },
//   });

//   const deleteEValuationMutation = useMutation(deleteEValuation, {
//     onSuccess: () => {
//       queryClient.invalidateQueries("eValuations");
//       toast.success("EValuation deleted successfully.");
//     },
//     onError: () => {
//       toast.error("Failed to delete EValuation.");
//     },
//   });

//   const [newEValuation, setNewEValuation] = useState<EValuation>({
//     id: "",
//     user_id: "",
//     category_id: "",
//     status: "",
//     name: "",
//     price: "",
//     image: "",
//     type: "",
//     metal: "",
//     size: "",
//     weight: "",
//     other_remarks: "",
//     content: "",
//     date: null,
//     appointment_date: null,
//     branch_id: "",
//   });

//   const [selectedEValuation, setSelectedEValuation] = useState<EValuation | null>(null);
//   const [open, setOpen] = useState(false);
//   const [searchKeyword, setSearchKeyword] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
//   const [eValuationToDelete, setEValuationToDelete] = useState<EValuation | null>(null);
//   const [selectedImageUrl, setSelectedImageUrl] = useState("");
//   const [selectedUserIdFilter, setSelectedUserIdFilter] = useState<string>("");
//   const [selectedEValuations, setSelectedEValuations] = useState<SelectedEValuations>({});

//   const handleSelectAll = () => {
//     const areAllSelected = Object.values(selectedEValuations).every((selected) => selected);

//     const updatedSelectedEValuations = { ...selectedEValuations };

//     eValuations.forEach((eValuations) => {
//       updatedSelectedEValuations[eValuations.id] = !areAllSelected;
//     });

//     setSelectedEValuations(updatedSelectedEValuations);
//   };

//   const { data: eValuations = [], meta = {} } = eValuationsResponse;
//   const { per_page, total } = meta;

//   useEffect(() => {
//     setCurrentPage(1);
//   }, [eValuationsResponse]);

//   const handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>) => {
//     const { name, value } = event.target;
//     if (name === "date") {
//       if (value) {
//         const parsedDate = new Date(value);
//         if (!isNaN(parsedDate.getTime())) {
//           const formattedDate = `${parsedDate.getFullYear()}-${(parsedDate.getMonth() + 1)
//             .toString()
//             .padStart(2, "0")}-${parsedDate.getDate().toString().padStart(2, "0")} ${parsedDate
//             .getHours()
//             .toString()
//             .padStart(2, "0")}:${parsedDate.getMinutes().toString().padStart(2, "0")}:${parsedDate
//             .getSeconds()
//             .toString()
//             .padStart(2, "0")}`;

//           setNewEValuation((prevNewEValuation) => ({
//             ...prevNewEValuation,
//             date: formattedDate,
//           }));
//         }
//       }else{
//         setNewEValuation((prevNewEValuation) => ({
//           ...prevNewEValuation,
//           date: value,
//         }));
//       }
//     }
//     else if (name === "appointment_date") {
//       if (value) {
//         const parsedDate = new Date(value);
//         if (!isNaN(parsedDate.getTime())) {
//           const formattedDate = `${parsedDate.getFullYear()}-${(parsedDate.getMonth() + 1)
//             .toString()
//             .padStart(2, "0")}-${parsedDate.getDate().toString().padStart(2, "0")} ${parsedDate
//             .getHours()
//             .toString()
//             .padStart(2, "0")}:${parsedDate.getMinutes().toString().padStart(2, "0")}:${parsedDate
//             .getSeconds()
//             .toString()
//             .padStart(2, "0")}`;

//           setNewEValuation((prevNewEValuation) => ({
//             ...prevNewEValuation,
//             appointment_date: formattedDate,
//           }));
//         }
//       }else{
//         setNewEValuation((prevNewEValuation) => ({
//           ...prevNewEValuation,
//           appointment_date: value,
//         }));
//       }
//     } else if (name === "status") {
//       const intValue = parseInt(value, 10);
//       setNewEValuation((prevNewEValuation) => ({
//         ...prevNewEValuation,
//         status: intValue,
//       }));
//     } else {
//       setNewEValuation((prevNewEValuation) => ({
//         ...prevNewEValuation,
//         [name]: value,
//       }));
//     }
//   };

//   const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
//     setSearchKeyword(event.target.value);
//   };

//   const handlePageChange = async (_: React.ChangeEvent<unknown>, value: number) => {
//     setCurrentPage(value);
//     await queryClient.prefetchQuery("eValuations", () => fetchEValuations(value));
//   };


//   const indexOfLastEValuation = currentPage * per_page;
//   const indexOfFirstEValuation = indexOfLastEValuation - per_page;
//   const currentEValuations = eValuations.slice(
//     indexOfFirstEValuation,
//     indexOfLastEValuation
//   );

//   const filteredEValuations = currentEValuations.filter((eValuation) => {
//     const isMatchingUser = !selectedUserIdFilter || eValuation.user_id === selectedUserIdFilter;
//     if (eValuation && eValuation.name && eValuation.user_id) {
//       const nameMatch = eValuation.name
//         .toLowerCase()
//         .includes(searchKeyword.toLowerCase());
//       return isMatchingUser && nameMatch;
//     }
//     return false;
//   });

//   const totalPages = Math.ceil(total / per_page) || 1;
//   const handleSelectedMedia = (media: any) => {
//     setSelectedImageUrl(media.image_url);
//     setNewEValuation((prevNewEValuation) => ({
//       ...prevNewEValuation,
//       image: media.image_url,
//     }));
//   };

//   const openFormPopup = () => {
//     setSelectedEValuation(null);
//     setSelectedImageUrl("");
//     setNewEValuation({
//       id: "",
//       user_id: "",
//       category_id: "",
//       status: "",
//       name: "",
//       price: "",
//       image: "",
//       type: "",
//       metal: "",
//       size: "",
//       weight: "",
//       other_remarks: "",
//       content: "",
//       date: null,
//       appointment_date: null,
//       branch_id: "",
//     });
//     setOpen(true);
//   };

//   const openEditFormPopup = (eValuation: EValuation) => {
//     navigate(`/evaluations/update-e-valuation/${eValuation.id}`);
//   };

//   const closeFormPopup = () => {
//     setSelectedEValuation(null);
//     setSelectedImageUrl("");
//     setOpen(false);
//   };

//   const openDeleteConfirmation = (eValuation: EValuation) => {
//     setDeleteConfirmationOpen(true);
//     setEValuationToDelete(eValuation);
//   };

//   const closeDeleteConfirmation = () => {
//     setDeleteConfirmationOpen(false);
//     setEValuationToDelete(null);
//   };

//   const handleCreateEValuation = async () => {
//     try {
//       await eValuationSchema.validate(newEValuation, { abortEarly: false });
//       createEValuationMutation.mutate(newEValuation);
//       setNewEValuation({
//         id: "",
//         user_id: "",
//         category_id: "",
//         status: "",
//         name: "",
//         price: "",
//         image: "",
//         type: "",
//         metal: "",
//         size: "",
//         weight: "",
//         other_remarks: "",
//         content: "",
//         date: null,
//         appointment_date: null,
//         branch_id: "",
//       });
//       setOpen(false);
//     } catch (err: any) {
//       const validationErrors: { [key: string]: string } = {};
//       if (yup.ValidationError.isError(err)) {
//         err.inner.forEach((e) => {
//           if (e.path) {
//             validationErrors[e.path] = e.message;
//           }
//         });
//       }
//       setNewEValuation((prevNewEValuation) => ({
//         ...prevNewEValuation,
//         errors: validationErrors,
//       }));
//     }
//   };

//   const handleCheckboxChange = (eValuationId: string) => {
//     setSelectedEValuations((prevSelectedEValuations) => ({
//       ...prevSelectedEValuations,
//       [eValuationId]: !prevSelectedEValuations[eValuationId],
//     }));
//   };

//   const handleDeleteSelectedEValuations = () => {
//     const eValuationsToDelete = Object.keys(selectedEValuations).filter((eValuationId) => selectedEValuations[eValuationId]);
//     if (eValuationsToDelete.length > 0) {
//       eValuationsToDelete.forEach((eValuationId) => {
//         deleteEValuationMutation.mutate(eValuationId);
//       });
//       // Clear selected EValuations
//       setSelectedEValuations({});
//     }
//   };
//   const countSelectedEValuations = () => {
//     return Object.values(selectedEValuations).filter((selected) => selected).length;
//   };
//   const selectedEValuationsCount = countSelectedEValuations();

//   const handleDeleteEValuation = (eValuation: EValuation | null) => {
//     if (eValuation) {
//       deleteEValuationMutation.mutate(eValuation.id);
//     }
//     setDeleteConfirmationOpen(false);
//     setEValuationToDelete(null);
//   };


//   const uniqueUserIds = Array.from(new Set(eValuations.map(eValuation => eValuation.user_id)));
//   const EVStatusOptions = [
//     { value: 0, label: "Pending" },
//     { value: 1, label: "On Progress" },
//     { value: 2, label: "Completed" },
//   ];
//   return (
//     <div>
//       <Helmet>
//         <title>EValuations | Trust Group</title>
//         <meta name='description' content='EValuations to have access!' />
//       </Helmet>
//       <Typography variant="h3" mb={"3rem"}>
//         EValuations List
//       </Typography>
//       <div className="mb-10 flex items-center justify-between gap-3 flex-wrap">
//         <TextField
//           label="Search"
//           size="small"
//           value={searchKeyword}
//           onChange={handleSearchChange}
//           variant="outlined"
//           InputProps={{
//             endAdornment: (
//               <InputAdornment position='end'>
//                 <Search />
//               </InputAdornment>
//             )
//           }}
//         />
//         <Button variant="contained" color="primary" onClick={openFormPopup}>
//           Create EValuation
//         </Button>
//       </div>
//       <Box sx={{ maxWidth: "20rem" }} mb={"2rem"}>
//         <FormControl fullWidth >
//           <InputLabel size="small" id="select-filter-label">Users</InputLabel>
//           <Select
//             labelId="select-filter-label"
//             id="simple-select-filter"
//             size="small"
//             label="All Users"
//             value={selectedUserIdFilter} // Sử dụng selectedRoleId
//             onChange={(event) => setSelectedUserIdFilter(event.target.value)}
//           >
//             <MenuItem value="">All Users</MenuItem>
//             {uniqueUserIds.map((userId) => (
//               <MenuItem key={userId} value={userId}>
//                 <UserName userId={userId} />
//               </MenuItem>
//             ))}
//           </Select>
//         </FormControl>
//       </Box>
//       <TableContainer className="has-action-fixed">
//         <Table className="min-w-[1000px]">
//           <TableHead>
//             <TableRow>
//               <TableCell>
//                 {eValuations.length > 0 ? (
//                   <Checkbox
//                     indeterminate={
//                       Object.values(selectedEValuations).some((selected) => selected) &&
//                       Object.values(selectedEValuations).some((selected) => !selected)
//                     }
//                     checked={Object.values(selectedEValuations).every((selected) => selected)}
//                     onChange={handleSelectAll}
//                   />
//                 ) : (
//                   <Skeleton  height={60} animation="wave" />
//                 )
//                 }
//               </TableCell>
//               <TableCell>
//                 {eValuations.length > 0 ? "User Id" : <Skeleton  height={60} animation="wave" />}
//               </TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {filteredEValuations.length > 0 ? (
//               filteredEValuations.map((eValuation) => (
//                 <TableRow key={eValuation.id}>
//                   <TableCell>
//                     <Checkbox
//                       checked={selectedEValuations[eValuation.id] || false}
//                       onChange={() => handleCheckboxChange(eValuation.id)}
//                     />
//                   </TableCell>
//                   <TableCell>
//                     {eValuation.user_id && (
//                       <UserName userId={eValuation.user_id} />
//                     )}
//                   </TableCell>
//                   <TableCell>
//                     {eValuation.category_id && (
//                       <CateName cateId={eValuation.category_id} />
//                     )}
//                   </TableCell>
//                   <TableCell>
//                     {EVStatusOptions.find(option => option.value == eValuation.status)?.label || "Unknown"}
//                   </TableCell>
//                   <TableCell>
//                     <Stack direction="row" spacing={2} justifyContent={"end"}>
//                       <Button variant="contained" color="primary" onClick={() => openEditFormPopup(eValuation)}>
//                         Edit
//                       </Button>
//                       <Button variant="contained" color="secondary" onClick={() => openDeleteConfirmation(eValuation)}>
//                         Delete
//                       </Button>
//                     </Stack>
//                   </TableCell>
//                 </TableRow>
//               ))
//             ) : (
//               <TableRow>
//                 <TableCell colSpan={17}>
//                   {eValuations.length === 0 ? (
//                     <Skeleton  height={60} animation="wave" />
//                   ) : (
//                     <p className="text-[1.6rem] text-center">No eValuations found.</p>
//                   )}
//                 </TableCell>
//               </TableRow>
//             )}
//           </TableBody>
//         </Table>
//       </TableContainer>
//       {Object.values(selectedEValuations).some((selected) => selected) && (
//         <div className="mt-6">
//           <Button variant="outlined" startIcon={<DeleteRoundedIcon />} color="primary" onClick={handleDeleteSelectedEValuations} disabled={selectedEValuationsCount === 0}>
//             Delete Selected ({selectedEValuationsCount})
//           </Button>
//         </div>
//       )}
//       <Box mt={2} display="flex" justifyContent="center">
//         <Pagination
//           count={totalPages}
//           page={currentPage}
//           onChange={handlePageChange}
//           color="primary"
//           showFirstButton
//           showLastButton
//         />
//       </Box>
//       <Dialog open={open} onClose={closeFormPopup} PaperProps={{ sx: { width: "100%", maxWidth: "100rem" } }}>
//         <DialogTitle className="!pt-10">{selectedEValuation ? "Edit Role" : "Create New EValuation"}</DialogTitle>
//         <DialogContent className="flex w-full flex-col gap-y-12  !pt-6">
//           <div className="grid md:grid-cols-2 gap-x-[1.5rem] gap-y-[3rem] items-end">
//             <div>
//               <DateTime
//                 label="Date"
//                 value={newEValuation.date}
//                 onChange={(newValue) => {
//                   const event = {
//                     target: {
//                       name: "date",
//                       value: newValue instanceof Date ? newValue.toISOString() : null,
//                     },
//                   } as React.ChangeEvent<HTMLInputElement>;
//                   handleInputChange(event);
//                 }}
//               />
//               {newEValuation.errors?.date && (
//                 <p className="el-error">This field is required</p>
//               )}
//             </div>
//             <div>
//               <DateTime
//                 label="Appointment Date"
//                 value={newEValuation.appointment_date}
//                 onChange={(newValue) => {
//                   const event = {
//                     target: {
//                       name: "appointment_date",
//                       value: newValue instanceof Date ? newValue.toISOString() : null,
//                     },
//                   } as React.ChangeEvent<HTMLInputElement>;
//                   handleInputChange(event);
//                 }}
//               />
//               {newEValuation.errors?.appointment_date && (
//                 <p className="el-error">This field is required</p>
//               )}
//             </div>
//           </div>
//         </DialogContent>
//         <DialogActions className="!p-10">
//           <Button variant="contained" color="primary" onClick={handleCreateEValuation}>
//             Create
//           </Button>
//           <Button variant="contained" color="secondary" onClick={closeFormPopup}>
//             Cancel
//           </Button>
//         </DialogActions>
//       </Dialog>
//       <Dialog open={deleteConfirmationOpen} onClose={closeDeleteConfirmation}>
//         <DialogTitle>Delete Role</DialogTitle>
//         <DialogContent>
//           <DialogContentText>Are you sure you want to delete this Role?</DialogContentText>
//         </DialogContent>
//         <DialogActions>
//           <Button variant="contained" color="secondary" onClick={() => handleDeleteEValuation(eValuationToDelete)}>
//             Delete
//           </Button>
//           <Button variant="contained" color="primary" onClick={closeDeleteConfirmation}>
//             Cancel
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </div>
//   );
// };

// export default EValuationComponent;