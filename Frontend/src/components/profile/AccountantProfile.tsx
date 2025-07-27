import React, { useState } from "react";
import {
  Avatar,
  Paper,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

const initialData = {
  firstName: "John",
  lastName: "Harlow",
  role: "Accountant",
  email: "email@email.com",
  phone: "9876543210",
  firm: "Firm Name",
  stats: {
    vendors: 100,
    documents: 2000,
  },
};

export default function AccountantProfile() {
  const [user, setUser] = useState(initialData);
  const [form, setForm] = useState(initialData);
  const [open, setOpen] = useState(false);

  const handleEdit = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    setUser(form);
    setOpen(false);
  };

  return (
    <>
      <Paper className="w-full h-full rounded-2xl p-6 md:p-10 shadow-md border border-[#DADFEA] lg:space-y-6 ">
        {/* Profile Header */}
        <Box className="relative flex flex-row gap-2 items-center lg:gap-6">
          <Avatar
            sx={{
              bgcolor: "#121f54",
              width: "110px",
              height: "110px",
              fontSize: "2.5rem",
            }}
            className={`border-[4px] border-white shadow-md z-10`}
          >
            {user.firstName[0]}
            {user.lastName[0]}
          </Avatar>

          <Paper
            variant="outlined"
            className="flex-1 rounded-xl p-6 border border-[#DADFEA] w-full"
          >
            <Box className="flex justify-between items-start md:items-center gap-4">
              <Box>
                <Typography
                  variant="h6"
                  className="text-[#121f54] font-bold uppercase"
                >
                  {user.firstName} {user.lastName}
                </Typography>
                <Typography className="text-[#7A8BB1] text-sm">
                  {user.role}
                </Typography>
                <Typography className="text-[#7A8BB1] text-sm mt-1">
                  {user.email}
                </Typography>
                <Typography className="text-[#7A8BB1] text-sm">
                  {user.phone}
                </Typography>
                <Typography className="text-[#0A0461] font-medium mt-2">
                  {user.firm}
                </Typography>
              </Box>
              <IconButton onClick={handleEdit} sx={{ color: "#0A0461" }}>
                <EditIcon />
              </IconButton>
            </Box>
          </Paper>
        </Box>

        {/* Stats Section */}

        <Box className="mt-4 lg:mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 lg:gap-10 justify-items-center">
          <Paper
            sx={{ background: "#DADFEA" }}
            className="h-[160px] w-full md:h-[200px] lg:w-[400px] flex items-center justify-center flex-col shadow-md border"
          >
            <Typography variant="h6" className="text-[#0A0461]">
              Total Vendors
            </Typography>

            <Typography variant="h6" className="font-bold text-[#121f54]">
              {user.stats.vendors}
            </Typography>
          </Paper>
          <Paper
            sx={{ background: "#DADFEA" }}
            className="h-[150px] w-full md:h-[200px] lg:w-[400px] flex items-center justify-center flex-col shadow-md border"
          >
            <Typography variant="h6" className="text-[#0A0461]">
              Total Documents
            </Typography>

            <Typography variant="h6" className="font-bold text-[#121f54]">
              {user.stats.documents}
            </Typography>
          </Paper>
          <Paper
            sx={{ background: "#DADFEA" }}
            className="h-[150px] w-full md:h-[200px] lg:w-[400px] flex items-center justify-center flex-col shadow-md border"
          >
            <Typography variant="h6" className="text-[#0A0461]">
              Verified Docs
            </Typography>
            <Typography variant="h6" className="font-bold text-[#121f54]">
              {Math.floor(user.stats.documents * 0.8)}
            </Typography>
          </Paper>
        </Box>

        {/* Edit Modal */}
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
          <DialogTitle className="text-[#121f54] font-bold">
            Edit Profile
          </DialogTitle>
          <DialogContent dividers className="h-aut ">
            <form onSubmit={handleSave} className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <TextField
                  label="First Name"
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  fullWidth
                  size="small"
                />
                <TextField
                  label="Last Name"
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  fullWidth
                  size="small"
                />
              </div>
              <div className="flex flex-col gap-4">
                <TextField
                  label="Email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  fullWidth
                  size="small"
                />
                <TextField
                  label="Phone"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  fullWidth
                  size="small"
                />
                <TextField
                  label="Business Name"
                  name="firm"
                  value={form.firm}
                  onChange={handleChange}
                  fullWidth
                  size="small"
                />
              </div>
            </form>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} sx={{ color: "#7A8BB1" }}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              variant="contained"
              sx={{
                backgroundColor: "#121f54",
                "&:hover": { backgroundColor: "#0A0461" },
              }}
            >
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </>
  );
}
