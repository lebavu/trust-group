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
import { PawnTickets } from "@/api/types";
import { Helmet } from "react-helmet-async";
import DateTime from "@/components/DateTime";
import http from "@/utils/http";
import { pawnTicketSchema } from "@/utils/rules";
import Breadcrumbs from "@/components/Breadcrumbs";

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
export async function getPawnTicketById(id: string | undefined): Promise<PawnTickets | null> {
  try {
    const response = await http.get(`pawn-tickets/${id}`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching Pawn Ticket by ID:", error);
    return null;
  }
}

const UpdatePawnTicket: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [editedTicket, setEditedTicket] = useState<PawnTickets | null>(null);
  // eslint-disable-next-line
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const { data: users = [] } = useQuery("users", fetchUsers);
  useEffect(() => {
    getPawnTicketById(id)
      .then((ticketData) => {
        setEditedTicket(ticketData);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [id]);

  useEffect(() => {
    if (editedTicket) {
      pawnTicketSchema
        .validate(editedTicket, { abortEarly: false })
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
  }, [editedTicket]);
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
          setEditedTicket((prevEditTicket) => {
            if (prevEditTicket) {
              return {
                ...prevEditTicket,
                date: formattedDate,
              };
            }
            return null;
          });
        }
      }else{
        setEditedTicket((prevEditTicket) => {
          if (prevEditTicket){
            return {
              ...prevEditTicket,
              date: value,
            };
          }
          return null;
        });
      }
    }
    else if (name === "pawn_type") {
      const intValue = parseInt(value, 10);
      setEditedTicket((prevEditTicket) => {
        if (prevEditTicket) {
          return {
            ...prevEditTicket,
            pawn_type: intValue,
          };
        }
        return null;
      });
    }
    else {
      setEditedTicket((prevEditTicket) =>  {
        if (prevEditTicket) {
          return {
            ...prevEditTicket,
            [name]: value,
          };
        }
        return null;
      });
    }
  };
  const [selectedPawnTicket, setSelectedPawnTicket] = useState<PawnTickets | null>(null);
  const handleUpdatePawnTicket = async () => {
    try {
      await pawnTicketSchema.validate(editedTicket, { abortEarly: false });
      const updatedPawnTicket: PawnTickets = {
        id: selectedPawnTicket?.id || "",
        user_id: editedTicket?.user_id || selectedPawnTicket?.user_id || "",
        name: editedTicket?.name || selectedPawnTicket?.name || "",
        pawn_status: editedTicket?.pawn_status || selectedPawnTicket?.pawn_status || "",
        ticket_no: editedTicket?.ticket_no || selectedPawnTicket?.ticket_no || "",
        pawn_type: editedTicket?.pawn_type || selectedPawnTicket?.pawn_type || 0,
        pawn_amount: editedTicket?.pawn_amount || selectedPawnTicket?.pawn_amount || "",
        interest_payable: editedTicket?.interest_payable || selectedPawnTicket?.interest_payable || "",
        downloan_amount: editedTicket?.downloan_amount || selectedPawnTicket?.downloan_amount || "",
        monthly_repayment: editedTicket?.monthly_repayment || selectedPawnTicket?.monthly_repayment || "",
        already_paid: editedTicket?.already_paid || selectedPawnTicket?.already_paid || "",
        balance_remaining: editedTicket?.balance_remaining || selectedPawnTicket?.balance_remaining || "",
        duration: editedTicket?.duration || selectedPawnTicket?.duration || "",
        pawn_date: editedTicket?.pawn_date || selectedPawnTicket?.pawn_date || "",
        next_renewal: editedTicket?.next_renewal || selectedPawnTicket?.next_renewal || "",
        expiry_date: editedTicket?.expiry_date || selectedPawnTicket?.expiry_date || "",
      };
      // await updatePawnTicketMutation.mutateAsync(updatedPawnTicket);
      await http.put(`pawn-tickets/${editedTicket?.id}`, updatedPawnTicket);
      setSelectedPawnTicket(null);
      toast.success("User data has been saved successfully!");
    } catch (err: any) {
      const validationErrors: { [key: string]: string } = {};
      if (yup.ValidationError.isError(err)) {
        err.inner.forEach((e) => {
          if (e.path) {
            validationErrors[e.path] = e.message;
          }
        });
      }
      setEditedTicket((prevEditedTicket) => {
        if (prevEditedTicket) {
          return {
            ...prevEditedTicket,
            errors: validationErrors,
          };
        }
        return null;
      });
    }
  };
  const pawnTypeOptions = [
    { value: 0, label: "Due" },
    { value: 1, label: "Instalment" },
    { value: 2, label: "2nd month" },
    { value: 3, label: "Expired" },
  ];
  return (
    <div>
      <Helmet>
        <title>Update Pawn Ticket | Trust Group</title>
        <meta name="description" content="Pawn Tickets to have access!" />
      </Helmet>
      <div className=" mb-[3rem]">
        <StyledLink className="gap-2 flex items-center !text-black back-btn" to="/pawn-tickets">
          <ArrowBackIosNewIcon className="!text-[1.2rem]" />
          <Typography variant="h6">
            Back
          </Typography>
        </StyledLink>
      </div>
      <Breadcrumbs/>
      {editedTicket && (
        <div className="flex w-full flex-col gap-y-12 !pt-6">
          <div className="grid md:grid-cols-2 gap-x-[1.5rem] gap-y-[3rem] items-end">
            <FormControl fullWidth sx={{ ".MuiFormLabel-root": { background: "#fff", padding: "0 3px" } }}>
              <InputLabel size="small" id="select-user">User</InputLabel>
              <Select
                labelId="select-user"
                id="user-select"
                size="small"
                name="user_id"
                value={editedTicket.user_id}
                onChange={handleInputChange}
                IconComponent={ExpandMoreIcon}
                variant="outlined"
                error={!!editedTicket.errors?.user_id}
              >
                {users.map((role:any) => (
                  <MenuItem key={role.id} value={role.id}>
                    {role.name}
                  </MenuItem>
                ))}
              </Select>
              {editedTicket.errors?.user_id && <FormHelperText error>{editedTicket.errors.user_id}</FormHelperText>}
            </FormControl>
            <TextField
              name="name"
              label="Name"
              value={editedTicket.name}
              onChange={handleInputChange}
              variant="outlined"
              size="small"
              fullWidth
              error={!!editedTicket.errors?.name}
              helperText={editedTicket.errors?.name}
            />
          </div>
          <div className="grid md:grid-cols-2 gap-x-[1.5rem] gap-y-[3rem] items-end">
            <FormControl fullWidth sx={{ ".MuiFormLabel-root": { background: "#fff", padding: "0 3px" } }}>
              <InputLabel size="small" id="select-pawn-type-label">Pawn Type</InputLabel>
              <Select
                labelId="select-pawn-type-label"
                id="pawn-type-select"
                size="small"
                name="pawn_type"
                value={editedTicket.pawn_type.toString()}
                onChange={handleInputChange}
                IconComponent={ExpandMoreIcon}
                variant="outlined"
                error={!!editedTicket.errors?.pawn_type}
              >
                {pawnTypeOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value.toString()}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
              {editedTicket.errors?.pawn_type && <FormHelperText error>{editedTicket.errors.pawn_type}</FormHelperText>}
            </FormControl>

            <TextField
              name="ticket_no"
              label="Ticket No"
              value={editedTicket.ticket_no}
              onChange={handleInputChange}
              variant="outlined"
              size="small"
              fullWidth
              error={!!editedTicket.errors?.ticket_no}
              helperText={editedTicket.errors?.ticket_no}
            />
          </div>
          <div className="grid md:grid-cols-2 gap-x-[1.5rem] gap-y-[3rem] items-end">
            <TextField
              name="pawn_amount"
              label="Pawn Amount"
              type="number"
              inputProps={{ step: "any" }}
              value={editedTicket.pawn_amount}
              onChange={handleInputChange}
              variant="outlined"
              size="small"
              fullWidth
              error={!!editedTicket.errors?.pawn_amount}
              helperText={editedTicket.errors?.pawn_amount}
            />
            <TextField
              name="interest_payable"
              label="Interest Payable"
              value={editedTicket.interest_payable || ""}
              onChange={handleInputChange}
              variant="outlined"
              type="number"
              size="small"
              fullWidth
              error={!!editedTicket.errors?.interest_payable}
              helperText={editedTicket.errors?.interest_payable}
            />
          </div>
          <div className="grid md:grid-cols-2 gap-x-[1.5rem] gap-y-[3rem] items-end">
            <TextField
              name="downloan_amount"
              label="Downloan Amount"
              value={editedTicket.downloan_amount || ""}
              onChange={handleInputChange}
              variant="outlined"
              size="small"
              type="number"
              fullWidth
              error={!!editedTicket.errors?.downloan_amount}
              helperText={editedTicket.errors?.downloan_amount}
            />
            <TextField
              name="monthly_repayment"
              label="Monthly Repayment"
              value={editedTicket.monthly_repayment || ""}
              onChange={handleInputChange}
              variant="outlined"
              size="small"
              type="number"
              fullWidth
              error={!!editedTicket.errors?.monthly_repayment}
              helperText={editedTicket.errors?.monthly_repayment}
            />
          </div>
          <div className="grid md:grid-cols-2 gap-x-[1.5rem] gap-y-[3rem] items-end">
            <TextField
              name="already_paid"
              label="Already Paid"
              value={editedTicket.already_paid || ""}
              onChange={handleInputChange}
              variant="outlined"
              type="number"
              size="small"
              fullWidth
              error={!!editedTicket.errors?.already_paid}
              helperText={editedTicket.errors?.already_paid}
            />
            <TextField
              name="balance_remaining"
              label="Balance Remaining"
              type="number"
              value={editedTicket.balance_remaining || ""}
              onChange={handleInputChange}
              variant="outlined"
              size="small"
              fullWidth
              error={!!editedTicket.errors?.balance_remaining}
              helperText={editedTicket.errors?.balance_remaining}
            />
          </div>
          <div className="grid md:grid-cols-2 gap-x-[1.5rem] gap-y-[3rem] items-end">
            <div className="relative">
              <DateTime
                label="Pawn Date"
                value={editedTicket.pawn_date}
                onChange={(newValue) => {
                  const event = {
                    target: {
                      name: "pawn_date",
                      value: newValue instanceof Date ? newValue.toISOString() : null,
                    },
                  } as React.ChangeEvent<HTMLInputElement>;
                  handleInputChange(event);
                }}
              />
              {editedTicket.errors?.pawn_date && (
                <p className="el-error">This field is required</p>
              )}
            </div>
            <TextField
              name="duration"
              label="Duration"
              value={editedTicket.duration || ""}
              onChange={handleInputChange}
              variant="outlined"
              size="small"
              fullWidth
              error={!!editedTicket.errors?.duration}
              helperText={errors?.duration}
            />
          </div>
          <div className="grid md:grid-cols-2 gap-x-[1.5rem] gap-y-[3rem] items-end">
            <DateTime
              label="Next Renewal"
              value={editedTicket.next_renewal}
              onChange={(newValue) => {
                const event = {
                  target: {
                    name: "next_renewal",
                    value: newValue instanceof Date ? newValue.toISOString() : null,
                  },
                } as React.ChangeEvent<HTMLInputElement>;
                handleInputChange(event);
              }}
            />
            <DateTime
              label="Expiry Date"
              value={editedTicket.expiry_date}
              onChange={(newValue) => {
                const event = {
                  target: {
                    name: "expiry_date",
                    value: newValue instanceof Date ? newValue.toISOString() : null,
                  },
                } as React.ChangeEvent<HTMLInputElement>;
                handleInputChange(event);
              }}
            />
          </div>
          <Stack spacing={2} direction="row">
            <Button variant="contained" className="w-full" color="primary" onClick={handleUpdatePawnTicket}>
              Update
            </Button>
          </Stack>
        </div>
      )}
    </div>
  );
};

export default UpdatePawnTicket;