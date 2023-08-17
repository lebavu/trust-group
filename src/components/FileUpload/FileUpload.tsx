import React, { useState } from "react";
import { Button, IconButton, Paper, Typography  } from "@mui/material";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

interface ImageUploaderProps {
  onChange: (file: File | null) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onChange }) => {
  const [image, setImage] = useState<File | null>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setImage(file);
    onChange(file);
  };

  const handleRemoveImage = () => {
    setImage(null);
    onChange(null);
  };

  return (
    <div>
      <input
        type="file"
        id="image-upload"
        accept="image/*"
        onChange={handleImageChange}
        style={{ display: "none" }}
      />
      <label htmlFor="image-upload">
        <Button variant="outlined" component="span" className="!capitalize" size="small">
          <IconButton className="!text-primary">
            <CloudUploadIcon/>
          </IconButton>
          Upload Image
        </Button>
      </label>
      {image && (
        <Paper style={{ marginTop: "2rem", padding: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <img
              src={URL.createObjectURL(image)}
              alt="Uploaded Preview"
              style={{ maxWidth: "20rem" }}
            />
            <IconButton onClick={handleRemoveImage} color="secondary">
              <HighlightOffIcon />
            </IconButton>
          </div>
          <Typography className="!mt-[.7rem] text-[1.2rem]" variant="body2">{image.name}</Typography>
        </Paper>
      )}
    </div>
  );
};

export default ImageUploader;
