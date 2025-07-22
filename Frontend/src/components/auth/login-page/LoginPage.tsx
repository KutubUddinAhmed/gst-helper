import {
  TextField,
  Button,
  Box,
  Divider,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Google, Facebook } from "@mui/icons-material";
import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link, useNavigate } from "react-router-dom";
// import Cookies from "js-cookie";
// const local_base_url = import.meta.env.VITE_API_LOCAL_URL;
// const base_url = import.meta.env.VITE_API_BASE_URL;

import { useAuth } from "../../../AppProvider";

interface LoginFormData {
  email: string;
  password: string;
}

function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LoginFormData>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { auth, login } = useAuth();

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const onSubmit: SubmitHandler<LoginFormData> = async (data) => {
    setIsLoading(true);
    try {
      const success = await login(data); // login from useAuth()

      if (!success) {
        toast.error("Invalid email or password", { position: "bottom-right" });
        reset();
        return;
      }

      toast.success("Login successful!", { position: "bottom-right" });

      setTimeout(() => {
        navigate("/dashboard");
      }, 500);

      reset();
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center">
      <Box
        p={4}
        borderRadius={4}
        boxShadow={4}
        textAlign="center"
        bgcolor="rgba(255, 255, 255, 0.6)"
        sx={{
          boxShadow: "0px 0px 12px rgba(0, 0, 0, 0.8)",
        }}
        className="w-[350px] sm:w-[450px]"
      >
        <h2 className="mb-2 font-bold text-4xl">Welcome Back</h2>
        <p className="text-[#6b7280] mb-4 ">Enter your details below</p>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
          <TextField
            fullWidth
            label="Email Address"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Invalid email format",
              },
            })}
            error={!!errors.email}
            helperText={errors.email?.message}
            variant="outlined"
            InputProps={{
              style: { borderRadius: "16px" },
            }}
          />

          <TextField
            fullWidth
            label="Password"
            type={showPassword ? "text" : "password"}
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
            error={!!errors.password}
            helperText={errors.password?.message}
            variant="outlined"
            InputProps={{
              endAdornment: (
                <IconButton onClick={togglePasswordVisibility}>
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              ),
              style: { borderRadius: "16px" },
            }}
          />

          <Button
            fullWidth
            type="submit"
            variant="contained"
            disabled={isLoading}
            sx={{
              borderRadius: "16px",
              height: "48px",
              background: "linear-gradient(90deg, #121f54 , #2563eb )",
              "&:hover": {
                background: "linear-gradient(90deg, #1e3d8d 30%, #121f54 )",
              },
              color: "white",
            }}
          >
            {isLoading ? (
              <CircularProgress size={24} className="text-white" />
            ) : (
              "Sign in"
            )}
          </Button>
        </form>

        <Link
          to="/forgot-password"
          style={{
            display: "block",
            marginTop: "16px",
            color: "#4f46e5",
            textDecoration: "none",
            fontSize: "0.9rem",
          }}
        >
          Forgot your password?
        </Link>

        <Divider
          style={{
            margin: "16px 0",
            color: "#6b7280",
          }}
        >
          Or sign in with
        </Divider>

        <Box display="flex" justifyContent="center" gap={2}>
          <Button
            disabled
            variant="outlined"
            startIcon={<Google />}
            sx={{
              width: "48%",
              borderRadius: "16px",
              borderColor: "black",
              height: "48px",
              textTransform: "none",
              fontSize: "0.9rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "black",
            }}
          >
            Google
          </Button>
          <Button
            disabled
            variant="outlined"
            startIcon={<Facebook />}
            sx={{
              width: "48%",
              borderRadius: "16px",
              borderColor: "black",
              color: "black",
              height: "48px",
              textTransform: "none",
              fontSize: "0.9rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            Facebook
          </Button>
        </Box>
      </Box>
      <ToastContainer />
    </Box>
  );
}

export default LoginPage;
