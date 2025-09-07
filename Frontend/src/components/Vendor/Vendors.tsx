import React, { useEffect, useState } from "react";
import {
  TextField,
  MenuItem,
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
import { useNavigate } from "react-router-dom";
import Select from "@mui/material/Select";
import type { SelectChangeEvent } from "@mui/material/Select";

function Vendor() {
  const [vendors, setVendors] = useState<any[]>([]);
  const [page, setPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [fromDate, setFromDate] = useState<string | null>(null);
  const [toDate, setToDate] = useState<string | null>(null);
  const rowsPerPage = useResponsiveRowsPerPage();
  
  const base_url = import.meta.env.VITE_API_BASE_URL;

  type SortOrder = "Latest" | "Oldest";
  
  const [sortOrder, setSortOrder] = useState<SortOrder>("Latest");

  const navigate = useNavigate();

  // ✅ Fetch vendor list from API
  useEffect(() => {
    const fetchVendors = async () => {
      const userString = localStorage.getItem("user");
      const OwnerData = userString ? JSON.parse(userString) : null;
      const AccountantEmnail = OwnerData.email;
      const vendorUrl = `${base_url}/get-vendors-by-accountant?created_by=${AccountantEmnail}`;
      try {
        const response = await fetch(vendorUrl);
        const data = await response.json();
        if (data?.vendors) {
          setVendors(data.vendors);
        }
      } catch (error) {
        console.error("Error fetching vendors:", error);
      }
    };

    fetchVendors();
  }, []);


  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const handleSortChange = (event: SelectChangeEvent) => {
    return setSortOrder(event.target.value as SortOrder);
  };

  // 4) Wire up labelId/id so the label works without warnings
  const labelId = "vendor-sort-label";
  const selectId = "vendor-sort";
  
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

  // ✅ Filtering + Sorting
  const filteredVendors = vendors
    .filter((vendor) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        vendor.first_name.toLowerCase().includes(searchLower) ||
        vendor.last_name.toLowerCase().includes(searchLower) ||
        vendor.email.toLowerCase().includes(searchLower)
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

  const handleViewVendor = (vendorId: string) => {
    navigate(`/dashboard/vendor/${vendorId}`);
  };

  return (
    <div className="h-full bg-white w-[100vw] lg:w-full mx-auto px-1 sm:px-1 space-y-4 pb-4">
      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row gap-4 mt-6">
        <div className="flex flex-col md:flex-row lg:w-1/2 gap-4">
          <TextField
            variant="outlined"
            label="Search Vendors"
            placeholder="Search by Name or Email"
            size="small"
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full md:flex-1"
          />
          <FormControl size="small" className="w-full md:flex-1">
            <InputLabel id={labelId}>Filter</InputLabel>
            <Select
              labelId={labelId}
              id={selectId}
              value={sortOrder}
              onChange={handleSortChange}
              label="Filter"
            >
              <MenuItem value="Latest">Latest</MenuItem>
              <MenuItem value="Oldest">Oldest</MenuItem>
            </Select>
          </FormControl>
        </div>

        {/* Date Filters */}
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

      {/* Table */}
      <div className="overflow-x-auto rounded-lg mx-1 flex flex-col space-y-3 min-h-[66vh]">
        <TableContainer
          component={Paper}
          className="border border-black min-h-[500px] md:min-h-[710px]"
          sx={{ borderRadius: "10px" }}
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#F3F4F6" }}>
                <TableCell sx={{ fontWeight: "bold", color: "#0A345E" }}>
                  No.
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#0A345E" }}>
                  Vendor Name
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#0A345E" }}>
                  Email
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#0A345E" }}>
                  Created At
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#0A345E" }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {paginatedVendors.map((vendor, index) => (
                <TableRow
                  key={vendor.id}
                  sx={{
                    backgroundColor: index % 2 === 0 ? "#BDE0FE" : "#F1FFFF",
                  }}
                >
                  <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                  <TableCell>
                    {vendor.first_name} {vendor.last_name}
                  </TableCell>
                  <TableCell>{vendor.email}</TableCell>
                  <TableCell>{formatDate(vendor.created_at)}</TableCell>
                  <TableCell>
                    <Tooltip title="View">
                      <IconButton
                        color="primary"
                        onClick={() => handleViewVendor(vendor.id)}
                      >
                        <ArrowOutwardOutlined />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton sx={{ color: "#f07167" }}>
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
        <div className="overflow-x-auto -mt-5">
          <TablePagination
            component="div"
            count={filteredVendors.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(event, newPage) => { void event; setPage(newPage); }}
            rowsPerPageOptions={[]}
            sx={{
              backgroundColor: "#15254D",
              borderRadius: "10px",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
              color: "white",
              mt: 2,
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default Vendor;

// ✅ Rows per page responsive hook
function useResponsiveRowsPerPage() {
  const [rowsPerPage, setRowsPerPage] = useState(10);

  React.useEffect(() => {
    function updateRows() {
      const width = window.innerWidth;
      if (width < 640) {
        setRowsPerPage(10);
      } else if (width < 1024) {
        setRowsPerPage(13);
      } else {
        setRowsPerPage(14);
      }
    }

    updateRows();
    window.addEventListener("resize", updateRows);
    return () => window.removeEventListener("resize", updateRows);
  }, []);

  return rowsPerPage;
}
