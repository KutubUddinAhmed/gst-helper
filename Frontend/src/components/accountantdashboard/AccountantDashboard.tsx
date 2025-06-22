import { useEffect, useState } from "react";
import { Add } from "@mui/icons-material";
import { Box,Typography } from "@mui/material";
import SignupModal from "./SignupModal";
import { useAuth } from "../../AppProvider";

const AccountantDashboard = () => {

   const { auth } = useAuth()
    
 



  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <div className="bg-[#fff] p-4">
      <div className="grid grid-cols-4 gap-4">
        {/* Box 1: Add Vendor */}
        <Box
          onClick={handleOpenModal}
          sx={{
            border: "2px dashed #9c27b0",
            padding: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            maxWidth: "200px",
            cursor: "pointer",
            "&:hover": {
              backgroundColor: "#f3e5f5",
            },
          }}
        >
          <Add sx={{ color: "#9c27b0", fontSize: 40 }} />
          <Typography variant="body1" sx={{ marginTop: 1, color: "#9c27b0" }}>
            Add Vendor
          </Typography>
        </Box>

        {/* Box 2 */}
        <Box
          sx={{
            border: "2px dashed #4caf50",
            padding: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            maxWidth: "200px",
            "&:hover": {
              backgroundColor: "#e8f5e9",
            },
          }}
        >
          <Typography variant="body1" sx={{ color: "#4caf50" }}>
            Box 2
          </Typography>
        </Box>

        {/* Box 3 */}
        <Box
          sx={{
            border: "2px dashed #2196f3",
            padding: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            maxWidth: "200px",
            "&:hover": {
              backgroundColor: "#e3f2fd",
            },
          }}
        >
          <Typography variant="body1" sx={{ color: "#2196f3" }}>
            Box 3
          </Typography>
        </Box>

        {/* Box 4 */}
        <Box
          sx={{
            border: "2px dashed #ff5722",
            padding: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            maxWidth: "200px",
            "&:hover": {
              backgroundColor: "#fbe9e7",
            },
          }}
        >
          <Typography variant="body1" sx={{ color: "#ff5722" }}>
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
