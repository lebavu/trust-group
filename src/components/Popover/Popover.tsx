import React from "react";
import Popover from "@mui/material/Popover";

interface PopoverComponentProps {
  anchorEl: null | HTMLElement;
  open: boolean;
  onClose: () => void;
  children?: React.ReactNode;
}

const PopoverComponent: React.FC<PopoverComponentProps> = ({
  anchorEl,
  open,
  onClose,
  children,
}) => {
  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      sx={{ ".MuiPaper-root":{
        boxShadow: "rgb(234, 236, 240) 0px 0px 1px, rgba(29, 41, 57, 0.08) 0px 6px 12px",
        borderRadius: ".8rem",
        minWidth: "12rem",
        padding: ".5rem",
        ".MuiList-root": {
          padding: "0"
        },
        ".MuiListItemButton-root": {
          borderRadius: ".8rem",
          padding: ".5rem 1rem"
        }
      } }}
    >
      {children}
    </Popover>
  );
};

export default PopoverComponent;