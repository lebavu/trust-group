import { useState, ChangeEvent, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "react-query";
import { toast } from "react-toastify";
import { styled } from "@mui/material/styles";
import "react-toastify/dist/ReactToastify.css";
import * as yup from "yup";
import {
  Button,
  TextField,
  Typography,
  Select,
  MenuItem,
  FormControl,
  FormHelperText,
  InputLabel,
  Stack
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { type SelectChangeEvent } from "@mui/material";
import { EValuation } from "@/api/types";
import { Helmet } from "react-helmet-async";
import DateTime from "@/components/DateTime";
import MediaManager from "@/components/Media";
import http from "@/utils/http";
import { eValuationSchema } from "@/utils/rules";
import RichTextEditor from "@/components/Editor";
import Breadcrumbs from "@/components/Breadcrumbs";
import Image from "@/components/Image";

const StyledLink = styled(Link)`
  font-family: "Roboto";
  color: #1e2f8d;
  &:hover,&.active {
    text-decoration: underline;
  }
`;

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

export async function getEValuationById(id: string | undefined): Promise<EValuation | null> {
  try {
    const response = await http.get(`e-valuations/${id}`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching Evaluation by ID:", error);
    return null;
  }
}

const UpdateEValuation: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [editedEValuation, setEditedEValuation] = useState<EValuation | null>(null);
  const [selectedImageUrl, setSelectedImageUrl] = useState("");
  // eslint-disable-next-line
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const { data: users = [] } = useQuery("users", fetchUsers);
  const { data: branches = [] } = useQuery("branches", fetchBranches);
  const { data: categories = [] } = useQuery("categories", fetchCategories);
  useEffect(() => {
    getEValuationById(id)
      .then((ticketData) => {
        setEditedEValuation(ticketData);
        setSelectedImageUrl(ticketData?.image || "");
      })
      .catch((error) => {
        console.error(error);
      });
  }, [id]);

  useEffect(() => {
    if (editedEValuation) {
      eValuationSchema
        .validate(editedEValuation, { abortEarly: false })
        .then(() => setErrors({}))
        .catch((err) => {
          const validationErrors: { [key: string]: string } = {};
          err.inner.forEach((e:any) => {
            if (e.path) {
              validationErrors[e.path] = e.message;
            }
          });
          setErrors(validationErrors);
        });
    }
  }, [editedEValuation]);
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
          setEditedEValuation((prevEditEValuation) => {
            if (prevEditEValuation) {
              return {
                ...prevEditEValuation,
                date: formattedDate,
              };
            }
            return null;
          });
        }
      }else{
        setEditedEValuation((prevEditEValuation) => {
          if (prevEditEValuation) {
            return {
              ...prevEditEValuation,
              date: value,
            };
          }
          return null;
        });
      }
    } else if (name === "appointment_date") {
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
          setEditedEValuation((prevEditEValuation) => {
            if (prevEditEValuation) {
              return {
                ...prevEditEValuation,
                appointment_date: formattedDate,
              };
            }
            return null;
          });
        }
      }else{
        setEditedEValuation((prevEditEValuation) => {
          if (prevEditEValuation) {
            return {
              ...prevEditEValuation,
              appointment_date: value,
            };
          }
          return null;
        });
      }
    }  else if (name === "status") {
      const intValue = parseInt(value, 10);
      setEditedEValuation((prevEditEValuation) => {
        if (prevEditEValuation) {
          return {
            ...prevEditEValuation,
            status: intValue,
          };
        }
        return null;
      });
    } else {
      setEditedEValuation((prevEditEValuation) => {
        if (prevEditEValuation) {
          return {
            ...prevEditEValuation,
            [name]: value,
          };
        }
        return null;
      });
    }
  };
  const handleSelectedMedia = (media: any) => {
    setSelectedImageUrl(media.image_url);
    setEditedEValuation((prevEditEValuation) => {
      if (prevEditEValuation) {
        return {
          ...prevEditEValuation,
          image: media.image_url,
        };
      }
      return null;
    });
  };
  const [selectedEValuation, setSelectedEValuation] = useState<EValuation | null>(null);
  const handleUpdateEValuation = async () => {
    try {
      await eValuationSchema.validate(editedEValuation, { abortEarly: false });
      const updatedEValuation: EValuation = {
        id: selectedEValuation?.id || "",
        user_id: editedEValuation?.user_id || selectedEValuation?.user_id || "",
        category_id: editedEValuation?.category_id || selectedEValuation?.category_id || "",
        status: editedEValuation?.status || selectedEValuation?.status || 0,
        name: editedEValuation?.name || selectedEValuation?.name || "",
        price: editedEValuation?.price || selectedEValuation?.price || "",
        image: editedEValuation?.image || selectedEValuation?.image || "",
        type: editedEValuation?.type || selectedEValuation?.type || "",
        metal: editedEValuation?.metal || selectedEValuation?.metal || "",
        size: editedEValuation?.size || selectedEValuation?.size || "",
        weight: editedEValuation?.weight || selectedEValuation?.weight || "",
        other_remarks: editedEValuation?.other_remarks || selectedEValuation?.other_remarks || "",
        content: editedEValuation?.content || selectedEValuation?.content || "",
        date: editedEValuation?.date || selectedEValuation?.date || null,
        appointment_date: editedEValuation?.appointment_date || selectedEValuation?.appointment_date || null,
        branch_id: editedEValuation?.branch_id || selectedEValuation?.branch_id || "",
      };
      if (editedEValuation !== null && editedEValuation !== undefined) {
        editedEValuation.status = 0;
      }
      console.log(editedEValuation);
      await http.put(`e-valuations/${editedEValuation?.id}`, updatedEValuation);
      setSelectedEValuation(null);
      toast.success("User data has been saved successfully!");
    } catch (err: any) {
      console.log(err);
      const validationErrors: { [key: string]: string } = {};
      if (yup.ValidationError.isError(err)) {
        err.inner.forEach((e) => {
          if (e.path) {
            validationErrors[e.path] = e.message;
          }
        });
      }
      setEditedEValuation((prevEditedEValuation) => {
        if (prevEditedEValuation) {
          return {
            ...prevEditedEValuation,
            errors: validationErrors,
          };
        }
        return null;
      });
    }
  };
  const EVStatusOptions = [
    { value: 0, label: "Pending" },
    { value: 1, label: "On Progress" },
    { value: 2, label: "Completed" },
  ];
  return (
    <div>
      <Helmet>
        <title>Update Evaluation | Trust Group</title>
        <meta name="description" content="Evaluations to have access!" />
      </Helmet>
      <div className=" mb-[3rem]">
        <StyledLink className="gap-2 flex items-center !text-black back-btn" to="/evaluations">
          <ArrowBackIosNewIcon className="!text-[1.2rem]" />
          <Typography variant="h6">
            Back
          </Typography>
        </StyledLink>
      </div>
      <Breadcrumbs/>
      {editedEValuation && (
        <div className="flex w-full flex-col gap-y-12 !pt-6">
          <div className="grid md:grid-cols-2 gap-x-[1.5rem] gap-y-[3rem] items-end">
            <FormControl fullWidth sx={{ ".MuiFormLabel-root": { background: "#fff", padding: "0 3px" } }}>
              <InputLabel size="small" id="select-user">User</InputLabel>
              <Select
                labelId="select-user"
                id="user-select"
                size="small"
                name="user_id"
                value={editedEValuation.user_id}
                IconComponent={ExpandMoreIcon}
                onChange={handleInputChange}
                variant="outlined"
                error={!!editedEValuation.errors?.user_id}
              >
                {users.map((role:any) => (
                  <MenuItem key={role.id} value={role.id}>
                    {role.name}
                  </MenuItem>
                ))}
              </Select>
              {editedEValuation.errors?.user_id && <FormHelperText error>{editedEValuation.errors.user_id}</FormHelperText>}
            </FormControl>
            <FormControl fullWidth sx={{ ".MuiFormLabel-root": { background: "#fff", padding: "0 3px" } }}>
              <InputLabel size="small" id="select-category">Category</InputLabel>
              <Select
                labelId="select-category"
                id="category-select"
                size="small"
                name="category_id"
                value={editedEValuation.category_id}
                IconComponent={ExpandMoreIcon}
                onChange={handleInputChange}
                variant="outlined"
                error={!!editedEValuation.errors?.category_id}
              >
                {categories.map((category:any) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
              {editedEValuation.errors?.category_id && <FormHelperText error>{editedEValuation.errors.category_id}</FormHelperText>}
            </FormControl>
          </div>
          <div className="grid md:grid-cols-2 gap-x-[1.5rem] gap-y-[3rem] items-end">
            <FormControl fullWidth sx={{ ".MuiFormLabel-root": { background: "#fff", padding: "0 3px" } }}>
              <InputLabel size="small" id="status">Status</InputLabel>
              <Select
                name="status"
                label="Status"
                value={editedEValuation.status.toString()}
                onChange={handleInputChange}
                IconComponent={ExpandMoreIcon}
                variant="outlined"
                fullWidth
                size="small"
                error={!!editedEValuation.errors?.status}
              >
                {EVStatusOptions.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
              {editedEValuation.errors?.status && <FormHelperText error>{editedEValuation.errors.status}</FormHelperText>}
            </FormControl>
            <TextField
              name="name"
              label="Name"
              size="small"
              value={editedEValuation.name}
              onChange={handleInputChange}
              variant="outlined"
              fullWidth
              error={!!editedEValuation.errors?.name}
              helperText={editedEValuation.errors?.name}
            />
          </div>
          <div className="grid md:grid-cols-2 gap-x-[1.5rem] gap-y-[3rem] items-end">
            <TextField
              name="price"
              label="Price"
              type="number"
              value={editedEValuation.price}
              onChange={handleInputChange}
              variant="outlined"
              size="small"
              fullWidth
              error={!!editedEValuation.errors?.price}
              helperText={editedEValuation.errors?.price}
            />
            <div className="relative">
              <DateTime
                label="Appointment Date"
                value={editedEValuation.appointment_date}
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
              {editedEValuation.errors?.appointment_date && (
                <p className="el-error">This field is required</p>
              )}
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-x-[1.5rem] gap-y-[3rem] items-end">
            <TextField
              name="type"
              label="Type"
              value={editedEValuation.type}
              onChange={handleInputChange}
              variant="outlined"
              size="small"
              fullWidth
              error={!!editedEValuation.errors?.type}
              helperText={editedEValuation.errors?.type}
            />
            <TextField
              name="metal"
              label="Metal"
              value={editedEValuation.metal}
              onChange={handleInputChange}
              variant="outlined"
              size="small"
              fullWidth
              error={!!editedEValuation.errors?.metal}
              helperText={editedEValuation.errors?.metal}
            />
          </div>
          <div className="grid md:grid-cols-2 gap-x-[1.5rem] gap-y-[3rem] items-end">
            <TextField
              name="size"
              label="Size"
              value={editedEValuation.size}
              onChange={handleInputChange}
              variant="outlined"
              size="small"
              fullWidth
              error={!!editedEValuation.errors?.size}
              helperText={editedEValuation.errors?.size}
            />
            <TextField
              name="weight"
              label="Weight"
              value={editedEValuation.weight}
              onChange={handleInputChange}
              variant="outlined"
              size="small"
              fullWidth
              error={!!editedEValuation.errors?.weight}
              helperText={editedEValuation.errors?.weight}
            />
          </div>
          <div className="grid md:grid-cols-2 gap-x-[1.5rem] gap-y-[3rem] items-end">
            <TextField
              name="other_remarks"
              label="Other Remarks"
              value={editedEValuation.other_remarks}
              onChange={handleInputChange}
              variant="outlined"
              size="small"
              fullWidth
              error={!!editedEValuation.errors?.other_remarks}
              helperText={errors?.other_remarks}
            />
            <FormControl fullWidth sx={{ ".MuiFormLabel-root": { background: "#fff", padding: "0 3px" } }}>
              <InputLabel size="small" id="select-branch">Branch</InputLabel>
              <Select
                labelId="select-branch"
                id="branch-select"
                size="small"
                name="branch_id"
                value={editedEValuation.branch_id}
                IconComponent={ExpandMoreIcon}
                onChange={handleInputChange}
                variant="outlined"
                error={!!editedEValuation.errors?.branch_id}
              >
                {branches.map((branch:any) => (
                  <MenuItem key={branch.id} value={branch.id}>
                    {branch.name}
                  </MenuItem>
                ))}
              </Select>
              {editedEValuation.errors?.branch_id && <FormHelperText error>{editedEValuation.errors.branch_id}</FormHelperText>}
            </FormControl>
          </div>
          <div>
            <span className="!mb-3 block !font-medium !text-[1.3rem]"> Content:
            </span>
            <RichTextEditor
              value={editedEValuation.content || ""} // Pass the current content value
              onChange={(content: string) => {
                console.log(content);
                setEditedEValuation((prevEditedEValuation) => {
                  if (prevEditedEValuation) {
                    return {
                      ...prevEditedEValuation,
                      content: content,
                    };
                  }
                  return null;
                });
              }}
            />
          </div>
          <div className="grid md:grid-cols-2 gap-x-[1.5rem] gap-y-[3rem] items-end">
            <div className="relative">
              <DateTime
                label="Date"
                value={editedEValuation.date}
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
              {editedEValuation.errors?.date && (
                <p className="el-error">This field is required</p>
              )}
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-x-[1.5rem] gap-y-[3rem] items-end">
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
          <Stack spacing={2} direction="row">
            <Button variant="contained" className="w-full" color="primary" onClick={handleUpdateEValuation}>
              Update
            </Button>
          </Stack>
        </div>
      )}
    </div>
  );
};

export default UpdateEValuation;