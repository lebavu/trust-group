import { useState, useEffect } from "react";
import { DataGrid, type GridColDef, type GridPaginationInitialState } from "@mui/x-data-grid";
import {
  Button,
  List,
  ListItemButton,
  ListItemText,
  ListItemIcon,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import Popover from "@/components/Popover";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";

export interface DataTableProps {
  columns: GridColDef[];
  rows: any[];
  initialPagination: {
    page: number;
    pageSize: number;
  };
  pageSizeOptions: number[];
  checkboxSelection: boolean;
  disableRowSelectionOnClick: boolean;
  onDeleteRow: (selectedRows: any[], selectedRowCount: number) => void;
  selectedRows: any[];
  onRowSelectionModelChange: (newSelection: any[]) => void;
}

export default function DataTable({
  columns,
  rows,
  initialPagination,
  pageSizeOptions,
  checkboxSelection,
  disableRowSelectionOnClick,
  onDeleteRow,
  selectedRows: initialSelectedRows,
  onRowSelectionModelChange,
}: DataTableProps) {
  const [selectedRows, setSelectedRows] = useState<any[]>(initialSelectedRows);
  const [selectedRowCount, setSelectedRowCount] = useState<number>(0);

  useEffect(() => {
    setSelectedRowCount(selectedRows.length);
  }, [selectedRows]);

  const initialState = {
    pagination: initialPagination as GridPaginationInitialState,
  };

  const [isPopoverOpen, setPopoverOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setPopoverOpen(true);
  };

  const handlePopoverClose = () => {
    setPopoverOpen(false);
  };

  const handleDeleteButtonClick = () => {
    onDeleteRow(selectedRows, selectedRowCount);
    setPopoverOpen(false);
  };

  return (
    <div style={{ height: 550, width: "100%" }}>
      {selectedRows.length > 0 && (
        <div className="mb-5">
          <Button color="primary" variant="outlined" onClick={handlePopoverOpen} endIcon={<KeyboardArrowDownIcon />}>
            Bulk Actions
          </Button>
          <Popover
            anchorEl={anchorEl}
            open={isPopoverOpen}
            onClose={handlePopoverClose}
          >
            <List>
              <ListItemButton onClick={handleDeleteButtonClick}>
                <ListItemIcon sx={{ minWidth: "3.5rem" }}>
                  <DeleteRoundedIcon color="secondary"/>
                </ListItemIcon>
                <ListItemText primary={`Delete (${selectedRowCount})`} className="text-secondary"/>
              </ListItemButton>
            </List>
          </Popover>
        </div>
      )}
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={initialState}
        pageSizeOptions={pageSizeOptions}
        checkboxSelection={checkboxSelection}
        disableRowSelectionOnClick={disableRowSelectionOnClick}
        rowSelectionModel={selectedRows}
        onRowSelectionModelChange={(newSelection) => {
          setSelectedRows(newSelection);
          onRowSelectionModelChange(newSelection);
        }}
      />
    </div>
  );
}
