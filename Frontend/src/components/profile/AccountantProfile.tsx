import React, { useEffect, useState } from "react";
import {
  Avatar,
  Paper,
  Typography,
  Dialog,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
} from "@mui/material";
// import EditIcon from "@mui/icons-material/Edit";



type User = {
  first_name: string; 
  last_name: string;
  email: string;
  role: string;
};

export default function UserProfile() {
  const [user, setUser] = useState<User | null>(null);
  const [form, setForm] = useState<User | null>(null);
  const [open, setOpen] = useState(false);

  const base_url = import.meta.env.VITE_API_BASE_URL;

  // ✅ Fetch user profile data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userString = localStorage.getItem("user");
        const OwnerData = userString ? JSON.parse(userString) : null;
        const UserId = OwnerData?.id;
        const token = sessionStorage.getItem("access_token"); // <-- Get token from localStorage

        if (!UserId || !token) {
          console.error("User ID or token missing!");
          return;
        }
        const res = await fetch(`${base_url}/user-profile/${UserId}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`, // <-- Pass token in headers
          },
        });

        if (!res.ok) {
          throw new Error(`API Error: ${res.status}`);
        }

        const data = await res.json();

        setUser(data.user || data);
        setForm(data.user || data);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, []);

  // const handleEdit = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!form) return;
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    if (form) {
      setUser(form);
    }
    setOpen(false);
  };

  if (!user) {
    return (
      <Typography className="text-center text-gray-500 mt-10">
        Loading profile...
      </Typography>
    );
  }

  return (
    <>
      <Paper className="w-full h-full rounded-2xl p-6 md:p-10 shadow-md border border-[#DADFEA] space-y-6">
        {/* Profile Header */}
        <Box className="relative flex flex-row gap-4 items-center">
          <Avatar
            sx={{
              bgcolor: "#121f54",
              width: "100px",
              height: "100px",
              fontSize: "2.5rem",
            }}
          >
            {user.first_name[0]}
            {user.last_name[0]}
          </Avatar>

          <Paper
            variant="outlined"
            className="flex-1 rounded-xl p-6 border border-[#DADFEA]"
          >
            <Box className="flex justify-between items-start md:items-center gap-4">
              <Box>
                <Typography
                  variant="h6"
                  className="text-[#121f54] font-bold uppercase"
                >
                  {user.first_name} {user.last_name}
                </Typography>
                <Typography className="text-[#7A8BB1] text-sm">
                  {user.role}
                </Typography>
                <Typography className="text-[#7A8BB1] text-sm mt-1">
                  {user.email}
                </Typography>
              </Box>
              {/* <IconButton onClick={handleEdit} sx={{ color: "#0A0461" }}>
                <EditIcon />
              </IconButton> */}
            </Box>
          </Paper>
        </Box>

        {/* Edit Modal */}
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
          {/* <DialogTitle className="text-[#121f54] font-bold">
            Edit Profile
          </DialogTitle> */}
          <DialogContent dividers>
            {form && (
              <form className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <TextField
                    label="First Name"
                    name="first_name"
                    value={form.first_name}
                    onChange={handleChange}
                    fullWidth
                    size="small"
                  />
                  <TextField
                    label="Last Name"
                    name="last_name"
                    value={form.last_name}
                    onChange={handleChange}
                    fullWidth
                    size="small"
                  />
                </div>
                <TextField
                  label="Email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  fullWidth
                  size="small"
                />
                <TextField
                  label="Role"
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  fullWidth
                  size="small"
                />
              </form>
            )}
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
