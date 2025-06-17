import React, { useState } from "react";
import {
  Breadcrumbs,
  Link,
  Typography,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TablePagination,
  Tooltip,
} from "@mui/material";
import { ArrowOutwardOutlined, Delete } from "@mui/icons-material";
import { useNavigate } from "react-router-dom"; // Import the hook
import vendorList from "./vendorList";

function Vendor() {
  const [page, setPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<"Latest" | "Oldest">("Latest");
  const [fromDate, setFromDate] = useState<string | null>(null);
  const [toDate, setToDate] = useState<string | null>(null);
  const rowsPerPage = 10;

  const navigate = useNavigate(); // Initialize the hook

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const handleSortChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSortOrder(event.target.value as "Latest" | "Oldest");
  };

  const handleFromDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFromDate(event.target.value);
    setPage(0);
  };

  const handleToDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setToDate(event.target.value);
    setPage(0);
  };

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-GB");

  const filteredVendors = vendorList
    .filter((vendor) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        vendor.name.toLowerCase().includes(searchLower) ||
        vendor.business.toLowerCase().includes(searchLower) ||
        vendor.address.toLowerCase().includes(searchLower)
      );
    })
    .filter((vendor) => {
      if (fromDate || toDate) {
        const vendorDate = new Date(vendor.created_at);
        const from = fromDate ? new Date(fromDate) : null;
        const to = toDate ? new Date(toDate) : null;

        if (from && vendorDate < from) return false;
        if (to && vendorDate > to) return false;
      }
      return true;
    })
    .sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return sortOrder === "Latest" ? dateB - dateA : dateA - dateB;
    });

  const paginatedVendors = filteredVendors.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleViewVendor = (userId: string | number) => {
    navigate(`/vendor/${userId}`);
  };

  return (
    <div className="bg-[#fff] h-full px-4 space-y-4">
      {/* Breadcrumb */}
      <Breadcrumbs
        aria-label="breadcrumb"
        sx={{
          "& .MuiBreadcrumbs-separator": { color: "#7452f5" },
        }}
      >
        <Link underline="hover" fontSize={"14px"} color="#9333EA" href="/">
          Home
        </Link>
        <Link underline="hover" fontSize={"14px"} color="#9333EA" href="/">
          Dashboard
        </Link>
        <Typography fontSize={"14px"} className="text-purple-800 font-bold">
          Vendor
        </Typography>
      </Breadcrumbs>

      {/* Search and Filters */}
      <div className="flex items-center mt-10 gap-5 space-x-4">
        <TextField
          variant="outlined"
          label="Search Vendors"
          placeholder="Search by Name, Business, or Address"
          className="flex-grow"
          size="small"
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <FormControl className="w-36" size="small">
          <InputLabel>Filter</InputLabel>
          <Select value={sortOrder} onChange={handleSortChange} label="Filter">
            <MenuItem value="Latest">Latest</MenuItem>
            <MenuItem value="Oldest">Oldest</MenuItem>
          </Select>
        </FormControl>
        <TextField
          variant="outlined"
          label="From"
          type="date"
          size="small"
          InputLabelProps={{
            shrink: true,
          }}
          value={fromDate || ""}
          onChange={handleFromDateChange}
        />
        <TextField
          variant="outlined"
          label="To"
          type="date"
          size="small"
          InputLabelProps={{
            shrink: true,
          }}
          value={toDate || ""}
          onChange={handleToDateChange}
        />
      </div>

      {/* Vendor Table */}
      <TableContainer
        component={Paper}
        sx={{
          maxHeight: "520px",
          boxShadow:
            "0 2px 4px rgba(0, 0, 0, 0.1), 0 -2px 4px rgba(0, 0, 0, 0.1)",
          borderRadius: "10px",
        }}
        className="p-2"
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#F3F4F6" }}>
              <TableCell
                sx={{ fontWeight: "bold", color: "#7452f5", py: 1, pb: 2 }}
              >
                No.
              </TableCell>
              <TableCell
                sx={{ fontWeight: "bold", color: "#7452f5", py: 1, pb: 2 }}
              >
                Vendor Name
              </TableCell>
              <TableCell
                sx={{ fontWeight: "bold", color: "#7452f5", py: 1, pb: 2 }}
              >
                Address
              </TableCell>
              <TableCell
                sx={{ fontWeight: "bold", color: "#7452f5", py: 1, pb: 2 }}
              >
                Phone
              </TableCell>
              <TableCell
                sx={{ fontWeight: "bold", color: "#7452f5", py: 1, pb: 2 }}
              >
                Business Name
              </TableCell>
              <TableCell
                sx={{ fontWeight: "bold", color: "#7452f5", py: 1, pb: 2 }}
              >
                Date
              </TableCell>
              <TableCell
                sx={{ fontWeight: "bold", color: "#7452f5", py: 1, pb: 2 }}
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedVendors.map((vendor, index) => (
              <TableRow
                key={vendor.id}
                sx={{
                  backgroundColor: index % 2 === 0 ? "#EDE7F6" : "#FFFFFF",
                }}
              >
                <TableCell sx={{ py: 1 }}>
                  {page * rowsPerPage + index + 1}
                </TableCell>
                <TableCell sx={{ py: "3px" }}>{vendor.name}</TableCell>
                <TableCell sx={{ py: "3px" }}>{vendor.address}</TableCell>
                <TableCell sx={{ py: "3px" }}>{vendor.phone}</TableCell>
                <TableCell sx={{ py: "3px" }}>{vendor.business}</TableCell>
                <TableCell sx={{ py: "3px" }}>
                  {formatDate(vendor.created_at)}
                </TableCell>
                <TableCell sx={{ py: "3px" }}>
                  <Tooltip title="View">
                    <IconButton
                      color="primary"
                      onClick={() => handleViewVendor(vendor.user_id)}
                    >
                      <ArrowOutwardOutlined />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton sx={{ color: "#DB1616" }}>
                      <Delete />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <TablePagination
        component="div"
        count={filteredVendors.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPageOptions={[]}
        sx={{
          backgroundColor: "#F3F4F6",
          borderRadius: "10px",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        }}
      />
    </div>
  );
}

export default Vendor;
