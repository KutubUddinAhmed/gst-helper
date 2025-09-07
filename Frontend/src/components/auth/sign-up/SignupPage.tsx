import { TextField, Button, Box, Divider } from "@mui/material";
import { Link } from "react-router-dom";
import { useForm, type SubmitHandler } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Facebook, Google } from "@mui/icons-material";

const base_url = import.meta.env.VITE_API_BASE_URL;


interface SignupFormData {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  role: string;
  created_by: string;
}




function SignupPage() {
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


  const onSubmit: SubmitHandler<SignupFormData> = async (data) => {

    data.created_by = data.email

    try {
      const response = await fetch(`${base_url}/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData?.detail
        // Show error toast
        toast.error(errorMessage, { position: "bottom-right" });
        // reset();
        throw new Error(errorMessage);
      }

      toast.success("Account created successfully!", {
        position: "bottom-right",
      });

      reset();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      width="100"
      height="70vh"
    >
      <Box
        p={2}
        borderRadius={4}
        boxShadow={4}
        // bgcolor="rgba(255, 255, 255, 0.6)"
        // maxWidth={400}
        width="100%"
        sx={{
          boxShadow: "0px 0px 12px rgba(0, 0, 0, 0.6)",
        }}
      >
        <h2 className="text-center mt-2 mb-5 text-3xl font-semibold">
          Create an Account
        </h2>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
          <TextField
            fullWidth
            label="First Name"
            {...register("first_name", { required: "First name is required" })}
            error={!!errors.first_name}
            helperText={errors.first_name?.message}
            variant="outlined"
            InputProps={{
              style: { borderRadius: "16px", backgroundColor: "white" },
            }}
            className="bg-white rounded-4xl"
            InputLabelProps={{
              style: {
                lineHeight: "1.1em", // Optional: Adjust label line height
              },
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                height: "48px",
              },
            }}
          />

          {/* Last Name */}
          <TextField
            fullWidth
            label="Last Name"
            {...register("last_name", { required: "Last name is required" })}
            error={!!errors.last_name}
            helperText={errors.last_name?.message}
            variant="outlined"
            InputProps={{ style: { borderRadius: "16px" } }}
            className="bg-white rounded-4xl"
            InputLabelProps={{
              style: {
                lineHeight: "1.1em", // Optional: Adjust label line height
              },
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                height: "48px",
              },
            }}
          />

          {/* Email */}
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
            type="email"
            variant="outlined"
            InputProps={{
              style: { borderRadius: "16px", backgroundColor: "white" },
            }}
            InputLabelProps={{
              style: {
                lineHeight: "1.1em", // Optional: Adjust label line height
              },
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                height: "48px",
              },
            }}
          />

          {/* Password */}
          <TextField
            fullWidth
            label="Password"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
            error={!!errors.password}
            helperText={errors.password?.message}
            type="password"
            variant="outlined"
            InputProps={{
              style: { borderRadius: "16px", backgroundColor: "white" },
            }}
            InputLabelProps={{
              style: {
                lineHeight: "1.1em", // Optional: Adjust label line height
              },
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                height: "48px",
              },
            }}
          />

        
          <input type="hidden" {...register("role")} />

          {/* Created at */}

          {/* Hidden Created At Field */}
          <input type="hidden" {...register("created_by")} />

          {/* Submit Button */}
          <Button
            fullWidth
            type="submit"
            variant="contained"
            sx={{
              borderRadius: "16px",
              height: "48px",
              background: "linear-gradient(90deg, #6b46e5 0%, #b764e8 100%)",
              "&:hover": {
                background: "linear-gradient(90deg, #5a3ab5 0%, #9751c2 100%)",
              },
              color: "white",
            }}
          >
            Sign up
          </Button>
        </form>

        <Divider
          style={{
            margin: "16px 0",
            color: "#6b7280",
          }}
        >
          Or sign up with
        </Divider>

        <Box display="flex" justifyContent="center" gap={2}>
          <Button
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

        {/* Switch to Login */}
        <p
          style={{
            marginTop: "1rem",
            textAlign: "center",
            fontSize: "0.9rem",
            color: "#333",
          }}
        >
          Already have an account?{" "}
          <Link
            to="/login"
            style={{ color: "#4f46e5", textDecoration: "none" }}
          >
            Login
          </Link>
        </p>
      </Box>
      <ToastContainer />
    </Box>
  );
}

export default SignupPage;
