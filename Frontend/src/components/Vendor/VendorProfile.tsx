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
import React, { useMemo, useState } from "react";
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

// optional: responsive rows-per-page like your other screen
function useResponsiveRowsPerPage() {
  const [rowsPerPage, setRowsPerPage] = useState(10);
  React.useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w < 640) setRowsPerPage(10);
      else if (w < 1024) setRowsPerPage(13);
      else setRowsPerPage(14);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return rowsPerPage;
}

function VendorProfile() {
  const { user_id } = useParams();
  const [fileTypeFilter, setFileTypeFilter] = useState<string>("All"); // by extension
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

  // source data now comes from fileList.documents
  const documents: Array<{
    file_path: string;
    type: string; // "purchase" | "sales" | ...
    created_at: string;
    updated_at?: string;
    status?: string; // "approved" | "pending" | "rejected"
    url?: string;
  }> = Array.isArray((fileList as any)?.documents)
    ? (fileList as any).documents
    : [];

  // filters
  const filteredDocs = useMemo(() => {
    const searchLower = searchTerm.toLowerCase();

    const extMatches = (path: string) => {
      if (fileTypeFilter === "All") return true;
      const name = getFileNameFromPath(path).toLowerCase();
      // crude extension check
      return name.endsWith(`.${fileTypeFilter.toLowerCase()}`);
    };

    const statusMatches = (status?: string) => {
      if (statusFilter === "All") return true;
      // normalize: Api uses lowercase; UI uses Titlecase
      return (status ?? "").toLowerCase() === statusFilter.toLowerCase();
    };

    return documents
      .filter((d) => {
        const name = getFileNameFromPath(d.file_path).toLowerCase();
        return name.includes(searchLower);
      })
      .filter((d) => extMatches(d.file_path))
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

  // pagination slice
  const paginated = filteredDocs.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
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
      <div className="flex flex-col bg-[#fff] h-full w-full px-3 pt-2">
        {/* Header / Profile */}
        <div
          className="h-[auto] min-h-[70px] min-w-[350px] border-2 border-white bg-[#121f54e0] p-4 rounded-lg"
          style={{ boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)" }}
        >
          <div className="flex flex-col md:flex-row gap-2 items-start md:items-center justify-between text-white w-full">
            <Typography>
              <strong>Name:</strong>{" "}
              {profile?.name ??
                (`${profile?.first_name ?? ""} ${
                  profile?.last_name ?? ""
                }`.trim() ||
                  "N/A")}
            </Typography>
            <Typography>
              <strong>Email:</strong> {profile?.email || "example@example.com"}
            </Typography>
            <Typography>
              <strong>Phone:</strong> {profile?.phone || "N/A"}
            </Typography>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center mt-3 gap-3">
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

          <div className="flex gap-3 flex-wrap">
            <FormControl className="w-36" size="small">
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
                <MenuItem value="pdf">PDF</MenuItem>
                <MenuItem value="jpg">JPG</MenuItem>
                <MenuItem value="jpeg">JPEG</MenuItem>
                <MenuItem value="png">PNG</MenuItem>
                <MenuItem value="webp">WEBP</MenuItem>
              </Select>
            </FormControl>

            <FormControl className="w-36" size="small">
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

            <FormControl className="w-36" size="small">
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

            <TextField
              variant="outlined"
              label="From"
              type="date"
              size="small"
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
              InputLabelProps={{ shrink: true }}
              value={toDate ?? ""}
              onChange={(e) => {
                setToDate(e.target.value);
                setPage(0);
              }}
            />
          </div>
        </div>

        {/* Table */}
        <TableContainer
          component={Paper}
          sx={{
            maxHeight: { xs: 420, md: 520 },
            overflowX: "auto",
            boxShadow:
              "0 2px 4px rgba(0, 0, 0, 0.1), 0 -2px 4px rgba(0, 0, 0, 0.1)",
            borderRadius: "10px",
            mt: 2,
          }}
          className="p-2"
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
                    minWidth: 160,
                  }}
                >
                  File Name
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    color: "#7452f5",
                    py: 0.5,
                    minWidth: 90,
                  }}
                >
                  Type
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    color: "#7452f5",
                    py: 0.5,
                    minWidth: 110,
                  }}
                >
                  Status
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    color: "#7452f5",
                    py: 0.5,
                    minWidth: 150,
                  }}
                >
                  Created At
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    color: "#7452f5",
                    py: 0.5,
                    minWidth: 120,
                  }}
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {paginated.map((doc, index) => {
                const fileName = getFileNameFromPath(doc.file_path);
                return (
                  <TableRow
                    key={`${doc.file_path}-${doc.created_at}`}
                    sx={{
                      backgroundColor: index % 2 === 0 ? "#EDE7F6" : "#FFFFFF",
                    }}
                  >
                    <TableCell sx={{ py: 0.5 }}>
                      {page * rowsPerPage + index + 1}
                    </TableCell>
                    <TableCell sx={{ py: 0.5, minWidth: 160 }}>
                      {fileName}
                    </TableCell>
                    <TableCell sx={{ py: 0.5, textTransform: "capitalize" }}>
                      {doc.type}
                    </TableCell>
                    <TableCell sx={{ py: 0.5, textTransform: "capitalize" }}>
                      {doc.status ?? "—"}
                    </TableCell>
                    <TableCell sx={{ py: 0.5 }}>
                      {formatDate(doc.created_at)}
                    </TableCell>
                    <TableCell sx={{ py: 0.5 }}>
                      <Tooltip title="Preview">
                        <IconButton
                          color="primary"
                          onClick={() => {
                            const href = doc.url || doc.file_path;
                            setPreviewSrc(href);
                            setPreviewTitle(getFileNameFromPath(doc.file_path));
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

        {/* Pagination */}
        <TablePagination
          component="div"
          count={filteredDocs.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[]}
          sx={{ mt: 1 }}
        />
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
