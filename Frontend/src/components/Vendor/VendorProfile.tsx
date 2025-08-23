import { useParams } from "react-router-dom";
import {
  Breadcrumbs,
  Link,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TablePagination,
} from "@mui/material";
import {
  Delete,
  ArrowOutwardOutlined,
  CropFreeRounded,
} from "@mui/icons-material";
import vendorList from "./vendorList";
import fileList from "./fileList";
import { useState } from "react";

function VendorProfile() {
  const { user_id }: any = useParams();
  const [fileTypeFilter, setFileTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const profile = vendorList.find((v) => v.user_id.toString() === user_id);
  const tableDataFileList = fileList.filter(
    (file) => file.user_id.toString() === user_id
  );

  const [page, setPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<"Latest" | "Oldest">("Latest");
  const [fromDate, setFromDate] = useState<string | null>(null);
  const [toDate, setToDate] = useState<string | null>(null);
  const rowsPerPage = 10;

  const handleChangePage = (event: any, newPage: number) => {
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

  const filteredVendors = tableDataFileList
    .filter((file) => {
      const searchLower = searchTerm.toLowerCase();
      return file.file_name.toLowerCase().includes(searchLower);
    })
    .filter((file) => {
      if (fromDate || toDate) {
        const vendorDate = new Date(file?.uploaded_at);
        const from = fromDate ? new Date(fromDate) : null;
        const to = toDate ? new Date(toDate) : null;

        if (from && vendorDate < from) return false;
        if (to && vendorDate > to) return false;
      }
      return true;
    })
    .sort((a, b) => {
      const dateA = new Date(a.uploaded_at).getTime();
      const dateB = new Date(b.uploaded_at).getTime();
      return sortOrder === "Latest" ? dateB - dateA : dateA - dateB;
    });

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-GB");

  // Paginated data
  const paginatedData = filteredVendors.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <main>
      <div className="flex flex-col  bg-[#fff] h-full w-full  px-3 pt-2">
        {/* Left Section */}
        <div
          className="h-[70px] min-w-[350px] border-2 border-white bg-[#121f54e0] p-4 rounded-lg "
          style={{
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
          }}
        >
          <div className="flex  gap-2 max-w-1/2 items-center justify-between text-white min-w-full">
            <Typography>
              <strong>Name:</strong> {profile?.name || "N/A"}
            </Typography>
            <Typography>
              <strong>Email:</strong> {profile?.email || "example@emaple.com"}
            </Typography>
            <Typography>
              <strong>Phone:</strong> {profile?.phone || "N/A"}
            </Typography>
          </div>
          {/* Add more details as needed */}
        </div>
        {/* Bottom Section */}
        <div className="flex-grow flex flex-col h-full lg:w-full">
          {/* Search and Filters */}
          <div className="flex items-center mt-3 gap-5 space-x-4">
            <TextField
              variant="outlined"
              label="Search Files"
              placeholder="Search File Name"
              className="flex-grow"
              size="small"
              value={searchTerm}
              onChange={handleSearchChange}
            />

            <FormControl className="w-36" size="small">
              <InputLabel>File Type</InputLabel>
              <Select
                value={fileTypeFilter}
                onChange={(e) => setFileTypeFilter(e.target.value)}
                label="File Type"
              >
                <MenuItem value="All">All</MenuItem>
                <MenuItem value="pdf">PDF</MenuItem>
                <MenuItem value="jpg">JPG</MenuItem>
                <MenuItem value="docx">DOCX</MenuItem>
                <MenuItem value="xlsx">XLSX</MenuItem>
                {/* Add other types you support */}
              </Select>
            </FormControl>

            <FormControl className="w-36" size="small">
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                label="Status"
              >
                <MenuItem value="All">All</MenuItem>
                <MenuItem value="Approved">Approved</MenuItem>
                <MenuItem value="Rejected">Rejected</MenuItem>
              </Select>
            </FormControl>

            <FormControl className="w-36" size="small">
              <InputLabel>Sort</InputLabel>
              <Select
                value={sortOrder}
                onChange={handleSortChange}
                label="Sort"
              >
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

          {/* Table */}
          <TableContainer
            component={Paper}
            sx={{
              maxHeight: "520px",
              boxShadow:
                "0 2px 4px rgba(0, 0, 0, 0.1), 0 -2px 4px rgba(0, 0, 0, 0.1)",
              borderRadius: "10px",
            }}
            className="p-2 mt-4"
          >
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{ fontWeight: "bold", color: "#7452f5", py: 0.5 }}
                  >
                    No.
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      color: "#7452f5",
                      py: 0.5,
                      minWidth: 50,
                    }}
                  >
                    File Name
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      color: "#7452f5",
                      py: 0.5,
                      minWidth: 100,
                    }}
                  >
                    File Size
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      color: "#7452f5",
                      py: 0.5,
                      minWidth: 150,
                    }}
                  >
                    User Name
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      color: "#7452f5",
                      py: 0.5,
                      minWidth: 50,
                    }}
                  >
                    Type
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      color: "#7452f5",
                      py: 0.5,
                      minWidth: 150,
                    }}
                  >
                    Uploaded At
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      color: "#7452f5",
                      py: 0.5,
                      minWidth: 150,
                    }}
                  >
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedData.map((file, index) => (
                  <TableRow
                    key={file.file_id}
                    sx={{
                      backgroundColor: index % 2 === 0 ? "#EDE7F6" : "#FFFFFF",
                    }}
                  >
                    <TableCell sx={{ py: 0.5 }}>
                      {page * rowsPerPage + index + 1}
                    </TableCell>
                    <TableCell sx={{ py: 0.5, minWidth: 60 }}>
                      {file.file_name}
                    </TableCell>
                    <TableCell sx={{ py: 0.5, minWidth: 40 }}>
                      {file.file_size}
                    </TableCell>
                    <TableCell sx={{ py: 0.5, minWidth: 100 }}>
                      {profile?.name || "Unknown"}
                    </TableCell>
                    <TableCell sx={{ py: 0.5, minWidth: 100 }}>
                      {file.file_type}
                    </TableCell>
                    <TableCell sx={{ py: 0.5, minWidth: 50 }}>
                      {formatDate(file.uploaded_at)}
                    </TableCell>
                    <TableCell sx={{ py: 0.5, minWidth: 50 }}>
                      <Tooltip title="Preview">
                        <IconButton color="primary">
                          <CropFreeRounded />
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
          />
        </div>
      </div>
    </main>
  );
}

export default VendorProfile;
