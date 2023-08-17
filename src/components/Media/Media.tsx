import React, { useState, useRef } from "react";
import { useQuery, useQueryClient } from "react-query";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { type AxiosResponse } from "axios";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import "./Media.scss";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import UploadImage from "@/assets/upload.png";

interface MediaItem {
  id: string;
  image_url: string;
}

interface MediaListProps {
  handleMediaClick: (media: MediaItem) => void;
  selectedMedia: MediaItem | null;
}

interface MediaManagerProps {
  onMediaSelect: (selectedMedia: any) => void;
  // Other props if applicable
}


const MediaList: React.FC<MediaListProps> = (props) => {
  const { data, error, isLoading } = useQuery<MediaItem[]>("media", async () => {
    const response: AxiosResponse<{ data: MediaItem[] }> = await axios.get(
      "https://pm55.corsivalab.xyz/trustGroup/public/api/v1/media"
    );
    return response.data.data;
  });

  if (isLoading) {
    return <div className="text-center text-primary">Loading...</div>;
  }

  if (!data) {
    return <div>No media data available.</div>;
  }

  if (error) {
    toast.error("An error occurred while uploading media");
  }

  return (
    <div>
      <div className="flex flex-wrap w-full h-full">
        <div className="md:w-4/5 p-[2rem] h-full overflow-hidden overflow-y-auto">
          <ul className="list-none items grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 xl:grid-cols-9 gap-[1.5rem]">
            {data.map((media: MediaItem) => (
              <li
                key={media.id}
                className={props.selectedMedia === media ? "item selected" : "item"}
              >
                <button
                  onClick={() => props.handleMediaClick(media)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      props.handleMediaClick(media);
                    }
                  }}
                  className="image-button"
                >
                  <img src={media.image_url} alt={`Media ${media.id}`} />
                </button>
              </li>
            ))}
          </ul>
        </div>
        {props.selectedMedia && (
          <aside className="md:w-1/5 media-aside bg-slate-100 p-5 pt-8">
            <h2 className="font-bold mb-3">Media Information</h2>
            <div className="image w-[6rem] h-[6rem] bg-white">
              <img className="object-cover w-full h-full" src={props.selectedMedia.image_url} alt="thumbnails" />
            </div>
            <ul className="mt-3 list-none text-[1.2rem]">
              <li>
                <strong>ID: {props.selectedMedia.id}</strong> </li>
              <li className="break-words">
                <strong>Image URL: </strong> {props.selectedMedia.image_url}</li>
              <li><strong>File Size: </strong> bytes</li>
            </ul>
          </aside>
        )}
      </div>
    </div>
  );
};


const MediaManager: React.FC<MediaManagerProps> = ({ onMediaSelect }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  const queryClient = useQueryClient();
  const [openPopup, setOpenPopup] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const handleOpenPopup = () => {
    setOpenPopup(true);
  };

  // Function to close the popup
  const handleClosePopup = () => {
    setOpenPopup(false);
  };

  const handleMediaClick = (media: MediaItem) => {
    setSelectedMedia(media);
    onMediaSelect(media);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFile(event.target.files[0]);
      setSelectedFileName(event.target.files[0].name);
    }
  };

  const handleDelete = async () => {
    if (selectedMedia) {
      try {
        await axios.delete(
          `https://pm55.corsivalab.xyz/trustGroup/public/api/v1/media/${selectedMedia.id}`
        );
        toast.success("Media deleted successfully");
        setSelectedMedia(null);
        queryClient.invalidateQueries("media");
      } catch (error) {
        toast.error("Error deleting media");
      }
    }
  };
  const handleUpload = async () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append("file", selectedFile);

      try {
        await axios.post(
          "https://pm55.corsivalab.xyz/trustGroup/public/api/v1/media/upload",
          formData
        );
        toast.success("Media uploaded successfully");
        setSelectedFile(null);
        setSelectedFileName(null);
        queryClient.invalidateQueries("media");
        setActiveTab(0);
      } catch (error) {
        toast.error("Error uploading media");
      }
    }
  };
  return (
    <div>
      <Button variant="outlined" color="secondary" sx={{ textTransform: "capitalize" }} onClick={handleOpenPopup} size="large" startIcon={<FileUploadIcon />}>Upload File</Button>
      <Dialog
        open={openPopup}
        onClose={handleClosePopup}
        className="popup-container"
        sx={{
          ".MuiPaper-root": {
            width: "100%",
            height: "100%",
            maxWidth: "100%"
          }
        }}
      >
        <Stack className="flex items-center justify-between gap-3 !flex-row">
          <DialogTitle>Featured image</DialogTitle>

          <IconButton onClick={handleClosePopup} className="w-[4rem] h-[4rem] !mr-3">
            <CloseIcon />
          </IconButton>
        </Stack>
        <DialogContent>
          <div className="content-wrapper">
            <Tabs selectedIndex={activeTab} onSelect={index => setActiveTab(index)}>
              <TabList>
                <Tab>Upload files</Tab>
                <Tab>Media library</Tab>
              </TabList>
              <TabPanel >
                <MediaList handleMediaClick={handleMediaClick} selectedMedia={selectedMedia}/>
              </TabPanel>
              <TabPanel>
                <Box sx={{ textAlign: "center", background: "#fff", padding: "7rem 3rem 3rem", border: "1px dashed #999" }}>
                  <Box sx={{ width: "100%", maxWidth: "6rem", marginInline: "auto" }}>
                    <img src={UploadImage} className="w-full" alt="upload" />
                  </Box>
                  <input type="file" onChange={handleFileChange} ref={inputRef} hidden/>
                  <Stack spacing={2} direction="row" justifyContent="center" sx={{ marginTop: 3 }}>
                    {selectedFileName ? (
                      <Button
                        size="large"
                        sx={{ textTransform: "capitalize" }}
                        onClick={() => inputRef.current?.click()}
                      >
                        {selectedFileName}
                      </Button>
                    ) : (
                      <Button
                        variant="outlined"
                        size="large"
                        sx={{ textTransform: "capitalize" }}
                        onClick={() => inputRef.current?.click()}
                      >
                        Browse
                      </Button>
                    )}
                  </Stack>
                  <Typography
                    variant="body2"
                    gutterBottom
                    sx={{
                      marginTop: 2,
                      paddingBottom: 2,
                      backgroundImage: "linear-gradient(to right, #000000 100%,transparent 0%)",
                      backgroundSize: "4rem 1.5px",
                      backgroundPosition: "center bottom",
                      backgroundRepeat: "no-repeat"
                    }}
                  > Maximum upload file size: 512 MB.
                  </Typography>
                  <Button variant="contained" size="large" onClick={handleUpload} sx={{ textTransform: "capitalize" , marginTop: "2rem" }} disabled={!selectedFile}>
                    Upload
                  </Button>
                </Box>
              </TabPanel>
            </Tabs>
          </div>
        </DialogContent>
        <DialogActions className="bg-slate-100 !p-8">
          {selectedMedia && (
            <Stack direction="row" spacing={2} justifyContent={"end"}>
              <Button
                onClick={handleDelete}
                variant="contained"
                color="error"
                sx={{ textTransform: "capitalize", minWidth: "12rem", marginLeft: 2 }}
                size="large"
              >
                Delete
              </Button>
              <Button onClick={() => { handleMediaClick(selectedMedia), handleClosePopup(); }}  variant="contained" color="secondary"  sx={{ textTransform: "capitalize", minWidth: "12rem" }} size="large">Set Image</Button>
            </Stack>
          )}
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default MediaManager;
