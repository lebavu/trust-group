// UpdateUserPage.js

import { useState, useEffect, ChangeEvent } from "react";
import { useParams, Link } from "react-router-dom";
import { styled } from "@mui/material/styles";
import { useQuery } from "react-query";
import Box from "@mui/material/Box";
import { Helmet } from "react-helmet-async";
import { toast } from "react-toastify";
import { type SelectChangeEvent } from "@mui/material";
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
  InputLabel
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import "./EditUser.sass";
import { User } from "@/api/types";
import http from "@/utils/http";
import MediaManager from "@/components/Media";
import Breadcrumbs from "@/components/Breadcrumbs";
import Image from "@/components/Image";

const StyledLink = styled(Link)`
  font-family: "Roboto";
  color: #1e2f8d;
  &:hover,&.active {
    text-decoration: underline;
  }
`;

const userSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  email: yup.string().required("Email is required"),
  profile_image: yup.string().required("Profile image is required"),
  handphone_number: yup.string().required("Handphone Number is required"),
  role_id: yup.string().required("Role is required"),
  verified_code_forgot: yup.string(),
  new_password: yup
    .string()
    .min(6, "Length from 6 - 160 characters")
    .max(160, "Length from 6 - 160 characters"),
});

export async function fetchUserById(id: string | undefined): Promise<User | null> {
  try {
    const response = await http.get(`users/${id}`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    return null;
  }
}

const fetchRoles = async () => {
  const response = await http.get("roles");
  return response.data.data;
};

const EditUser: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [editedUser, setEditedUser] = useState<User | null>(null);
  // eslint-disable-next-line
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const [selectedImageUrl, setSelectedImageUrl] = useState("");
  const [selectedRoleId, setSelectedRoleId] = useState<string>("");

  const [isDirty, setIsDirty] = useState(false);

  const [showInput, setShowInput] = useState(false);

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const generateRandomPassword = () => {
    const length = 10;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
    let newPassword = "";

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      newPassword += charset[randomIndex];
    }
    setEditedUser((prevUser) => ({
      ...prevUser!,
      new_password: newPassword,
    }));
    setIsDirty(true);
  };


  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleInput = () => {
    setShowInput(!showInput);
  };

  const { data: roles = [] } = useQuery("roles", fetchRoles);

  useEffect(() => {
    fetchUserById(id)
      .then((userData) => {
        setEditedUser(userData);
        setSelectedImageUrl(userData?.profile_image || "");
      })
      .catch((error) => {
        console.error(error);
      });
  }, [id]);
  useEffect(() => {
    if (editedUser) {
      userSchema
        .validate(editedUser, { abortEarly: false })
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
  }, [editedUser]);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>) => {
    const { name, value } = event.target;
    if (name === "role_id") {
      setSelectedRoleId(value as string);
    } else if (name === "new_password") {
      setPassword(value);
    }  setEditedUser((prevUser) => ({
      ...prevUser!,
      [name]: value,
    }));
    setIsDirty(true);
  };
  const handleSelectedMedia = (media: any) => {
    setSelectedImageUrl(media.image_url);
    setEditedUser((prevUser) => ({
      ...prevUser!,
      profile_image: media.image_url,
    }));
    setIsDirty(true);
  };

  const handleSave = async () => {
    try {
      if (!editedUser) {
        throw new Error("User data is not available");
      }
      await userSchema.validate(editedUser, { abortEarly: false });
      await http.put(`users/${editedUser.id}`, editedUser);
      // setSelectedImageUrl("");
      toast.success("User data has been saved successfully!");
    } catch (err) {
      toast.error("An error occurred while saving user data.");
    }
  };

  return (
    <div>
      <Helmet>
        <title>Update user | Trust Group</title>
        <meta name='description' content='Users to have access!' />
      </Helmet>
      <div className=" mb-[3rem]">
        <StyledLink className="gap-2 flex items-center !text-black back-btn" to="/users">
          <ArrowBackIosNewIcon className="!text-[1.2rem]" />
          <Typography variant="h6">
            Back
          </Typography>
        </StyledLink>
      </div>
      <Breadcrumbs/>
      <div className="update-user-wrapper">
        <Box>
          <Typography variant="h4" mb={"3rem"}>
            Profile Infomation
          </Typography>
          {editedUser ? (
            <div className="flex md:flex-row-reverse max-md:flex-col">
              <div className="md:w-[250px] md:flex-shrink-0 upload-box flex justify-start gap-6 flex-col items-center">
                <p className="block !font-medium !text-[1.3rem]">Profile Image</p>
                {selectedImageUrl && (
                  <div className="mx-auto">
                    <div className="image w-[12rem] h-[12rem] bg-slate-100 border-solid border-slate-300 border-[1px]">
                      <Image src={selectedImageUrl} classNames="w-full h-full object-cover" alt="Selected Media" />
                    </div>
                  </div>
                )}
                <MediaManager onMediaSelect={handleSelectedMedia} />
              </div>
              <div className="md:w-full md:flex-1 flex flex-col gap-y-12">
                <TextField
                  name="name"
                  label="Name"
                  size="small"
                  value={editedUser.name}
                  onChange={handleInputChange}
                  variant="outlined"
                  fullWidth
                  error={!!editedUser.errors?.name}
                  helperText={editedUser.errors?.name}

                />
                <TextField
                  name="email"
                  label="Email"
                  size="small"
                  value={editedUser.email}
                  onChange={handleInputChange}
                  variant="outlined"
                  fullWidth
                  error={!!editedUser.errors?.email}
                  helperText={editedUser.errors?.email}

                />
                <TextField
                  name="handphone_number"
                  label="Phone"
                  size="small"
                  value={editedUser.handphone_number}
                  onChange={handleInputChange}
                  variant="outlined"
                  fullWidth
                  error={!!editedUser.errors?.handphone_number}
                  helperText={editedUser.errors?.handphone_number}

                />
                <FormControl fullWidth sx={{ ".MuiFormLabel-root": { background: "#fff", padding: "0 3px" } }}>
                  <InputLabel size="small" id="select-role">Role</InputLabel>
                  <Select
                    labelId="select-role"
                    id="role-select"
                    size="small"
                    name="role_id"
                    value={selectedRoleId || editedUser.role_id}
                    onChange={handleInputChange}
                    IconComponent={ExpandMoreIcon}
                    variant="outlined"
                    error={!!editedUser.errors?.role_id}

                  >
                    {roles.map((role:any) => (
                      <MenuItem key={role.id} value={role.id}>
                        {role.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {editedUser.errors?.role_id && <FormHelperText error>{editedUser.errors.role_id}</FormHelperText>}
                </FormControl>
                <div>
                  <div className="flex items-center gap-5">
                    <span className="block !font-medium !text-[1.3rem]">New Password</span>
                    <Button variant="outlined" color="primary" className="!capitalize"  onClick={toggleInput}>
                      Set New Password
                    </Button>
                  </div>
                  {showInput && (
                    <div className="password-form">
                      <div className="password-input">
                        <TextField
                          name="new_password"
                          label=""
                          size="small"
                          placeholder="Enter Password"
                          type={showPassword ? "text" : "password"}
                          value={password || editedUser.new_password || ""}
                          onChange={handleInputChange}
                          variant="outlined"
                          fullWidth
                          error={!!errors?.new_password}
                          helperText={errors?.new_password}
                        />
                        <button onClick={togglePasswordVisibility} className="toggle-pass">
                          {showPassword ? <VisibilityOffIcon/> : <RemoveRedEyeIcon/> }
                        </button>
                      </div>
                      <button className="generate" onClick={generateRandomPassword}>Generate Password</button>
                    </div>
                  )}
                </div>
                <Button className="!mt-10" variant="contained" color="primary" onClick={handleSave} disabled={!isDirty}>
                  Save
                </Button>
              </div>
            </div>
          ) : (
            <div>Loading user data...</div>
          )}
        </Box>
      </div>
    </div>
  );
};

export default EditUser;
