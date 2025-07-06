import React, { useState } from "react";
import {
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
  const rowsPerPage = useResponsiveRowsPerPage();

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
    navigate(`/dashboard/vendor/${userId}`);
  };

  return (
    <div className="h-full bg-white w-[100vw] lg:w-full mx-auto px-1 sm:px-1 space-y-4 pb-4">
      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row gap-4 mt-6">
        {/* First row for md and above: Search + Filter */}
        <div className="flex flex-col md:flex-row lg:w-1/2 gap-4">
          <TextField
            variant="outlined"
            label="Search Vendors"
            placeholder="Search by Name, Business, or Address"
            size="small"
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full md:flex-1"
          />
          <FormControl size="small" className="w-full md:flex-1">
            <InputLabel>Filter</InputLabel>
            <Select
              value={sortOrder}
              onChange={handleSortChange}
              label="Filter"
            >
              <MenuItem value="Latest">Latest</MenuItem>
              <MenuItem value="Oldest">Oldest</MenuItem>
            </Select>
          </FormControl>
        </div>

        {/* Second row for md and above: From + To */}
        <div className="flex flex-col md:flex-row lg:w-1/2 gap-4">
          <TextField
            variant="outlined"
            label="From"
            type="date"
            size="small"
            InputLabelProps={{ shrink: true }}
            value={fromDate || ""}
            onChange={handleFromDateChange}
            className="w-full md:w-1/2"
          />
          <TextField
            variant="outlined"
            label="To"
            type="date"
            size="small"
            InputLabelProps={{ shrink: true }}
            value={toDate || ""}
            onChange={handleToDateChange}
            className="w-full md:w-1/2"
          />
        </div>
      </div>

      {/* Table with horizontal scroll on small devices */}
      <div className="overflow-x-auto rounded-lg shadow-md border mx-1">
        <TableContainer
          component={Paper}
          className=""
          sx={{
            borderRadius: "10px",
          }}
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#F3F4F6" }}>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    color: "#7452f5",
                    whiteSpace: "nowrap",
                  }}
                  className="max-w-9 sm:w-16 md:w-20 "
                >
                  No.
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    color: "#7452f5",
                    whiteSpace: "nowrap",
                  }}
                  className="w-32 sm:min-w-36 md:w-48 "
                >
                  Vendor Name
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    color: "#7452f5",
                    whiteSpace: "nowrap",
                  }}
                  className="min-w-44 sm:min-w-50 md:w-64 "
                >
                  Address
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    color: "#7452f5",
                    whiteSpace: "nowrap",
                  }}
                  className="min-w-40 sm:w-36 md:w-44 "
                >
                  Phone
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    color: "#7452f5",
                    whiteSpace: "nowrap",
                  }}
                  className="w-36 sm:w-44 md:w-52 "
                >
                  Business Name
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    color: "#7452f5",
                    whiteSpace: "nowrap",
                  }}
                  className="w-24 sm:w-32 md:w-40 "
                >
                  Date
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    color: "#7452f5",
                    whiteSpace: "nowrap",
                  }}
                  className="min-w-28 sm:w-28 md:w-32  "
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
      </div>

      {/* Pagination */}
      <div className="overflow-x-auto -mt-5">
        <TablePagination
          component="div"
          count={filteredVendors.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[]}
          sx={{
            backgroundColor: "rgb(162,160,255)",
            borderRadius: "10px",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            mt: 2,
          }}
        />
      </div>
    </div>
  );
}

export default Vendor;


function useResponsiveRowsPerPage() {
  const [rowsPerPage, setRowsPerPage] = useState(10); // default for desktop

  React.useEffect(() => {
    function updateRows() {
      const width = window.innerWidth;
      if (width < 640) {
        setRowsPerPage(10); // mobile
      } else if (width < 1024) {
        setRowsPerPage(13); // tablet
      } else {
        setRowsPerPage(14); // desktop
      }
    }

    updateRows(); // run on mount
    window.addEventListener("resize", updateRows);
    return () => window.removeEventListener("resize", updateRows);
  }, []);

  return rowsPerPage;
}
