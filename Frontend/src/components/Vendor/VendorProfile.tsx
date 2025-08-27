import { useParams } from "react-router-dom";
import {
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
  MenuItem,
  TablePagination,
} from "@mui/material";
import Select from "@mui/material/Select";
import type { SelectChangeEvent } from "@mui/material/Select";
import { Delete, CropFreeRounded } from "@mui/icons-material";
import vendorList from "./vendorList";
import fileList from "./fileList";
import React, { useEffect, useMemo, useState } from "react";
import ImagePreviewDialog from "./ImagePreviewDialog";

// --- helpers ---
const formatDate = (date: string) => new Date(date).toLocaleDateString("en-GB");

const getFileNameFromPath = (p: string) => {
  try {
    const clean = p.split("?")[0]; // drop query if present
    return clean.split("/").pop() ?? clean;
  } catch {
    return p;
  }
};

type SortOrder = "Latest" | "Oldest";

// ✅ Simple, breakpoint-based rows-per-page (same pattern as your Vendor screen)
function useResponsiveRowsPerPage() {
  const [rowsPerPage, setRowsPerPage] = useState(10);

  React.useEffect(() => {
    function updateRows() {
      const width = window.innerWidth;
      if (width < 640) {
        setRowsPerPage(10);
      } else if (width < 1024) {
        setRowsPerPage(12);
      } else if (width > 1600) {
        setRowsPerPage(12)
      }
    }
    updateRows();
    window.addEventListener("resize", updateRows);
    return () => window.removeEventListener("resize", updateRows);
  }, []);

  return rowsPerPage;
}

function VendorProfile() {
  const { user_id } = useParams();
  const [fileTypeFilter, setFileTypeFilter] = useState<string>("All");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [page, setPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<SortOrder>("Latest");
  const [fromDate, setFromDate] = useState<string | null>(null);
  const [toDate, setToDate] = useState<string | null>(null);
  const rowsPerPage = useResponsiveRowsPerPage();

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);
  const [previewTitle, setPreviewTitle] = useState<string>("");

  // find vendor profile (best-effort, since vendorList may differ)
  const profile = useMemo(
    () =>
      vendorList.find(
        (v: any) => String(v.user_id ?? v.id) === String(user_id)
      ),
    [user_id]
  );

  // ✅ Only include documents if vendor_id matches the URL param user_id
  const documents: Array<{
    file_path: string;
    type: string;
    created_at: string;
    updated_at?: string;
    status?: string;
    url?: string;
  }> =
    String(fileList.vendor_id) === String(user_id) &&
    Array.isArray(fileList.documents)
      ? fileList.documents
      : [];

  // ✅ Filtering + sorting
  const filteredDocs = useMemo(() => {
    const searchLower = searchTerm.toLowerCase();

    const typeMatches = (docType: string) => {
      if (fileTypeFilter === "All") return true;
      return docType.toLowerCase() === fileTypeFilter.toLowerCase();
    };

    const statusMatches = (status?: string) => {
      if (statusFilter === "All") return true;
      return (status ?? "").toLowerCase() === statusFilter.toLowerCase();
    };

    return documents
      .filter((d) => {
        const name = getFileNameFromPath(d.file_path).toLowerCase();
        return name.includes(searchLower);
      })
      .filter((d) => typeMatches(d.type))
      .filter((d) => statusMatches(d.status))
      .filter((d) => {
        if (!fromDate && !toDate) return true;
        const docDate = new Date(d.created_at);
        const from = fromDate ? new Date(fromDate) : null;
        const to = toDate ? new Date(toDate) : null;
        if (from && docDate < from) return false;
        if (to && docDate > to) return false;
        return true;
      })
      .sort((a, b) => {
        const aT = new Date(a.created_at).getTime();
        const bT = new Date(b.created_at).getTime();
        return sortOrder === "Latest" ? bT - aT : aT - bT;
      });
  }, [
    documents,
    searchTerm,
    fileTypeFilter,
    statusFilter,
    fromDate,
    toDate,
    sortOrder,
  ]);

  // ✅ Keep page in range when any dependency (including rowsPerPage) changes
  useEffect(() => {
    setPage(0);
  }, [
    rowsPerPage,
    fileTypeFilter,
    statusFilter,
    sortOrder,
    fromDate,
    toDate,
    searchTerm,
  ]);

  // ✅ Pagination slice
  const paginated = useMemo(
    () =>
      filteredDocs.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [filteredDocs, page, rowsPerPage]
  );

  const handleChangePage = (_: unknown, newPage: number) => setPage(newPage);

  const handleSortChange = (event: SelectChangeEvent) => {
    setSortOrder(event.target.value as SortOrder);
    setPage(0);
  };

  const fileTypeLabelId = "file-type-label";
  const statusLabelId = "status-label";
  const sortLabelId = "sort-label";

  return (
    <main>
      <div className="flex flex-col bg-[#fff] h-full w-full px-1.5 md:px-3 pt-2">
        {/* Header / Profile */}
        <div
          className="max-h-[100px] md:h-[auto] md:min-h-[70px] lg:min-h-[40px] min-w-[350px] bg-[#121f54e0] p-1 md:p-1 lg:p-2 border border-gray-300 rounded-lg"
          style={{ boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)" }}
        >
          <div className="flex flex-col md:flex-row gap-2 items-start md:items-center justify-between text-white w-full">
            <Typography>
              <strong>Name:</strong>{" "}
              {profile?.name ??
                (`${profile?.first_name ?? ""} ${
                  profile?.last_name ?? ""
                }`.trim() ||
                  "Venugopalan Shivkumar Iyer")}
            </Typography>
            <Typography>
              <strong>Email:</strong> {profile?.email || "example@example.com"}
            </Typography>
            <Typography>
              <strong>Phone:</strong> {profile?.phone || "9865782556"}
            </Typography>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col lg:flex-row items-stretch mt-3 gap-3">
          <TextField
            variant="outlined"
            label="Search Files"
            placeholder="Search by file name"
            size="small"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(0);
            }}
            className="w-full lg:flex-1"
          />

          <div className="flex flex-col gap-2 lg:flex-row ">
            <div className="flex gap-1 ">
              <FormControl className="w-full lg:w-36" size="small">
                <InputLabel id={fileTypeLabelId}>File Type</InputLabel>
                <Select
                  labelId={fileTypeLabelId}
                  value={fileTypeFilter}
                  onChange={(e: SelectChangeEvent) => {
                    setFileTypeFilter(e.target.value);
                    setPage(0);
                  }}
                  label="File Type"
                >
                  <MenuItem value="All">All</MenuItem>
                  <MenuItem value="Purchase">Purchase</MenuItem>
                  <MenuItem value="Sales">Sales</MenuItem>
                </Select>
              </FormControl>
              <FormControl className="w-full lg:w-36" size="small">
                <InputLabel id={statusLabelId}>Status</InputLabel>
                <Select
                  labelId={statusLabelId}
                  value={statusFilter}
                  onChange={(e: SelectChangeEvent) => {
                    setStatusFilter(e.target.value);
                    setPage(0);
                  }}
                  label="Status"
                >
                  <MenuItem value="All">All</MenuItem>
                  <MenuItem value="approved">Approved</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="rejected">Rejected</MenuItem>
                </Select>
              </FormControl>
              <FormControl className="w-full lg:w-36" size="small">
                <InputLabel id={sortLabelId}>Sort</InputLabel>
                <Select
                  labelId={sortLabelId}
                  value={sortOrder}
                  onChange={handleSortChange}
                  label="Sort"
                >
                  <MenuItem value="Latest">Latest</MenuItem>
                  <MenuItem value="Oldest">Oldest</MenuItem>
                </Select>
              </FormControl>
            </div>

            <div className="flex gap-1">
              <TextField
                variant="outlined"
                label="From"
                type="date"
                size="small"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={fromDate ?? ""}
                onChange={(e) => {
                  setFromDate(e.target.value);
                  setPage(0);
                }}
              />
              <TextField
                variant="outlined"
                label="To"
                type="date"
                size="small"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={toDate ?? ""}
                onChange={(e) => {
                  setToDate(e.target.value);
                  setPage(0);
                }}
              />
            </div>
          </div>
        </div>

        {/* Table + Pagination wrapper (same structure as Vendor screen) */}
        <div className="overflow-x-auto rounded-sm lg:rounded-lg mt-2 flex flex-col max-h-[66vh] md:min-h-[66vh] lg:min-h-[78vh]">
          <TableContainer 
            component={Paper}
            className="border border-black max-h-[57vh] md:min-h-[59vh] xl:min-h-[70vh]"
            sx={{borderRadius: "10px"}}
          >
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow sx={{ backgroundColor: "#F3F4F6" }}>
                  <TableCell sx={{ fontWeight: "bold", color: "#0A345E" }}>
                    No.
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "#0A345E" }}>
                    File Name
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "#0A345E" }}>
                    Type
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "#0A345E" }}>
                    Status
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
                {paginated.map((doc, index) => {
                  const fileName = getFileNameFromPath(doc.file_path);
                  return (
                    <TableRow
                      key={`${doc.file_path}-${doc.created_at}-${index}`} // ✅ stable unique key
                      sx={{
                        backgroundColor:
                          index % 2 === 0 ? "#EDE7F6" : "#FFFFFF",
                      }}
                    >
                      <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                      <TableCell sx={{ minWidth: 160 }}>{fileName}</TableCell>
                      <TableCell sx={{ textTransform: "capitalize" }}>
                        {doc.type}
                      </TableCell>
                      <TableCell sx={{ textTransform: "capitalize" }}>
                        {doc.status ?? "—"}
                      </TableCell>
                      <TableCell sx={{minWidth: "110px"}}>{formatDate(doc.created_at)}</TableCell>
                      <TableCell sx={{display: "flex"}}>
                        <Tooltip title="Preview">
                          <IconButton
                            color="primary"
                            onClick={() => {
                              const href = doc.url || doc.file_path;
                              setPreviewSrc(href);
                              setPreviewTitle(
                                getFileNameFromPath(doc.file_path)
                              );
                              setPreviewOpen(true);
                            }}
                          >
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
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination (outside scroll area so it's always visible) */}
          <div className="overflow-x-auto lg:mt-1">
            <TablePagination
              component="div"
              count={filteredDocs.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
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

      <ImagePreviewDialog
        open={previewOpen}
        src={previewSrc}
        title={previewTitle}
        onClose={() => setPreviewOpen(false)}
      />
    </main>
  );
}

export default VendorProfile;
