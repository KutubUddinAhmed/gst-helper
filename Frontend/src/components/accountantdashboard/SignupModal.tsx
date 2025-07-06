import React from "react";
import {
  Modal,
  Box,
  TextField,
  Button,
  Typography,
  IconButton,
  InputAdornment,
} from "@mui/material";
import {
  Close as CloseIcon,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import { useForm, type SubmitHandler } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../../AppProvider";

const base_url = import.meta.env.VITE_API_BASE_URL;
const local_base_url = import.meta.env.VITE_API_LOCAL_URL;

interface SignupFormData {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  role: string;
  created_by: string;
}

interface SignupModalProps {
  open: boolean;
  onClose: () => void;
}

const SignupModal: React.FC<SignupModalProps> = ({ open, onClose }) => {
  const { auth } = useAuth();
  const accountantEmail = auth?.user.email;

  const [isPasswordVisible, setPasswordVisible] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SignupFormData>({
    defaultValues: {
      email: "",
      password: "",
      first_name: "",
      last_name: "",
      role: "vendor",
      created_by: "",
    },
  });

  const togglePasswordVisibility = () => {
    setPasswordVisible((prev) => !prev);
  };

  const onSubmit: SubmitHandler<SignupFormData> = async (data) => {
    setIsLoading(true)
    data.created_by = accountantEmail;

    try {
      const response = await fetch(`${local_base_url}/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData?.detail || "Signup failed";
        toast.error(errorMessage, { position: "bottom-right" });
        throw new Error(errorMessage);
      }

      toast.success("Account created successfully!", {
        position: "bottom-right",
      });

      reset();
      onClose();
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsLoading(false)
    }
  };

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="signup-modal">
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "90%",
          maxWidth: 500,
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
        }}
      >
        <IconButton
          onClick={onClose}
          sx={{ position: "absolute", top: 8, right: 8 }}
        >
          <CloseIcon />
        </IconButton>
        <Typography
          variant="h4"
          component="h2"
          textAlign="center"
          fontWeight="bold"
          mb={2}
        >
          Create a Vendor
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <TextField
            fullWidth
            label="First Name"
            {...register("first_name", { required: "First name is required" })}
            error={!!errors.first_name}
            helperText={errors.first_name?.message}
          />
          <TextField
            fullWidth
            label="Last Name"
            {...register("last_name", { required: "Last name is required" })}
            error={!!errors.last_name}
            helperText={errors.last_name?.message}
          />
          <TextField
            fullWidth
            label="Email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Invalid email format",
              },
            })}
            error={!!errors.email}
            helperText={errors.email?.message}
          />
          <TextField
            fullWidth
            label="Password"
            type={isPasswordVisible ? "text" : "password"}
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
            error={!!errors.password}
            helperText={errors.password?.message}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={togglePasswordVisibility} edge="end">
                    {isPasswordVisible ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button
            fullWidth
            type="submit"
            variant="contained"
            disabled={isLoading}
            sx={{
              borderRadius: 2,
              height: "48px",
              background: isLoading
                ? "linear-gradient(90deg, #c3c3c3 0%, #d6d6d6 100%)"
                : "linear-gradient(90deg, #6b46e5 0%, #b764e8 100%)",
              "&:hover": {
                background: isLoading
                  ? "linear-gradient(90deg, #c3c3c3 0%, #d6d6d6 100%)"
                  : "linear-gradient(90deg, #5a3ab5 0%, #9751c2 100%)",
              },
            }}
          >
            {isLoading ? "Siging in..." : "Add Vendor"}
          </Button>
        </form>

        <ToastContainer />
      </Box>
    </Modal>
  );
};

export default SignupModal;
