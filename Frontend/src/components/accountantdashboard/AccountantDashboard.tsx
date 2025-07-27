import { useState } from "react";
import { Add } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import SignupModal from "./SignupModal";
// import { useAuth } from "../../AppProvider";

const AccountantDashboard = () => {
  // const { auth } = useAuth();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <div className="bg-[#fff] p-4 h-full w-[90vw] md:w-[80vw] mx-auto">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mx-auto">
        {/* Box 1: Add Vendor */}
        <Box
          onClick={handleOpenModal}
          sx={{
            borderRadius: "20px",
            padding: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            minHeight: "150px",
            maxWidth: "250px",
            backgroundColor: "#DADFEA",
            "&:hover": {
              backgroundColor: "#7A8BB1",
            },
          }}
        >
          <Add sx={{ fontSize: 50 }} />
          <Typography variant="h6" sx={{ marginTop: 1, color: "#000" }}>
            Add Vendor
          </Typography>
        </Box>

        {/* Box 2 */}
        <Box
          sx={{
            borderRadius: "20px",
            padding: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            minHeight: "150px",
            maxWidth: "250px",
            backgroundColor: "#DADFEA",
            "&:hover": {
              backgroundColor: "#DADFEA",
            },
          }}
        >
          <AddCircleOutlineIcon sx={{ fontSize: 50 }} />
          <Typography variant="h6" sx={{ color: "#000" }}>
            Box 2
          </Typography>
        </Box>

        {/* Box 3 */}
        <Box
          sx={{
            borderRadius: "20px",
            padding: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            minHeight: "150px",
            maxWidth: "250px",
            backgroundColor: "#DADFEA",
            "&:hover": {
              backgroundColor: "#DADFEA",
            },
          }}
        >
          <AddCircleOutlineIcon sx={{ fontSize: 50 }} />
          <Typography variant="h6" sx={{ color: "#000" }}>
            Box 3
          </Typography>
        </Box>

        {/* Box 4 */}
        <Box
          sx={{
            borderRadius: "20px",
            padding: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            minHeight: "150px",
            maxWidth: "250px",
            backgroundColor: "#DADFEA",
            "&:hover": {
              backgroundColor: "#DADFEA",
            },
          }}
        >
          <AddCircleOutlineIcon sx={{ fontSize: 50 }} />
          <Typography variant="h6" sx={{ color: "#000" }}>
            Box 4
          </Typography>
        </Box>
      </div>

      {/* Add Vendor Modal */}
      <SignupModal open={isModalOpen} onClose={handleCloseModal} />
    </div>
  );
};

export default AccountantDashboard;
