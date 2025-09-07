import {
  Box,
  Paper,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Button,
  Divider,
  CircularProgress,
  Stack,
  Tooltip,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  PersonOutline,
  LockOutlined,
  Google,
  Facebook,
} from "@mui/icons-material";
import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

import LoginImage from "../../../assets/loginPage.jpg";
import "./LoginPage.css";

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
    defaultValues: { email: "", password: "" },
  });

  const { login } = useAuth();

  const togglePasswordVisibility = () => setShowPassword((p) => !p);

  const onSubmit: SubmitHandler<LoginFormData> = async (data) => {
    setIsLoading(true);
    try {
      const success = await login(data);

      if (!success) {
        toast.error("Invalid email or password", { position: "bottom-right" });
        reset({ password: "" });
        return;
      }

      toast.success("Login successful!", { position: "bottom-right" });
      setTimeout(() => navigate("/dashboard"), 500);
      reset();
    } catch (err) {
      console.error("Login error:", err);
      toast.error("Something went wrong. Please try again.", {
        position: "bottom-right",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="login-layout">
        {/* Left: Illustration + Create account link (hidden on small screens) */}
        <div className="image-panel">
          <img
            src={LoginImage}
            alt="Login illustration"
            className="login-image"
          />
        </div>

        {/* Right: Form */}
        <div className="form-panel">
          <Paper
            elevation={0}
            sx={{
              width: "100%",
              maxWidth: 520,
              borderRadius: 3,
              p: { xs: 2, sm: 3, md: 4 },
              boxShadow:
                "0 10px 20px rgba(0,0,0,0.06), 0 6px 6px rgba(0,0,0,0.05)",
              bgcolor: "#fff",
            }}
          >
            <Box
              component="form"
              onSubmit={handleSubmit(onSubmit)}
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                gap: 2.5,
              }}
            >
              <Typography variant="h4" fontWeight={800}>
                Log In
              </Typography>

              <TextField
                fullWidth
                label="Your Address"
                variant="standard"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Invalid email format",
                  },
                })}
                error={!!errors.email}
                helperText={errors.email?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonOutline fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                fullWidth
                label="Password"
                variant="standard"
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
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlined fontSize="small" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={togglePasswordVisibility} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                type="submit"
                fullWidth
                disabled={isLoading}
                sx={{
                  mt: 0.5,
                  borderRadius: 2,
                  height: 44,
                  bgcolor: "#5b9bd5",
                  color: "white",
                  fontWeight: 600,
                  textTransform: "none",
                  "&:hover": { bgcolor: "#4b83b6" },
                }}
              >
                {isLoading ? <CircularProgress size={22} /> : "Log in"}
              </Button>

              <Divider sx={{ my: { xs: 0, md: 1.5 }, color: "#6b7280" }}>
                Or login with
              </Divider>

              <Stack direction="row" spacing={1}>
                <Tooltip title="Google (coming soon)">
                  <span>
                    <IconButton
                      disabled
                      sx={{
                        border: "1px solid #e5e7eb",
                        borderRadius: 2,
                        width: 40,
                        height: 40,
                      }}
                    >
                      <Google fontSize="small" />
                    </IconButton>
                  </span>
                </Tooltip>

                <Tooltip title="Facebook (coming soon)">
                  <span>
                    <IconButton
                      disabled
                      sx={{
                        border: "1px solid #e5e7eb",
                        borderRadius: 2,
                        width: 40,
                        height: 40,
                      }}
                    >
                      <Facebook fontSize="small" />
                    </IconButton>
                  </span>
                </Tooltip>
              </Stack>
            </Box>
          </Paper>
        </div>
      </div>

      <ToastContainer />
    </>
  );
}

export default LoginPage;
