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
  CircularProgress,
} from "@mui/material";
import Select from "@mui/material/Select";
import type { SelectChangeEvent } from "@mui/material/Select";
import { Delete, CropFreeRounded } from "@mui/icons-material";
import vendorList from "./vendorList";
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
        setRowsPerPage(12);
      }
    }
    updateRows();
    window.addEventListener("resize", updateRows);
    return () => window.removeEventListener("resize", updateRows);
  }, []);

  return rowsPerPage;
}

/** ---- Types for API docs ---- */
type ApiDoc = {
  file_path?: string;
  filePath?: string;
  path?: string;
  file?: string;
  url?: string;
  link?: string;
  file_url?: string;

  type?: string;
  document_type?: string;

  status?: string;

  created_at?: string;
  createdAt?: string;
  uploaded_at?: string;
  date?: string;

  updated_at?: string;
  updatedAt?: string;
};

type Doc = {
  file_path: string; // used for name & fallback href
  type: string;
  created_at: string;
  updated_at?: string;
  status?: string;
  url?: string; // used for preview href if present
};

function normalizeDoc(d: ApiDoc): Doc | null {
  const file_path =
    d.file_path ||
    d.filePath ||
    d.path ||
    d.file ||
    d.url ||
    d.link ||
    d.file_url;
  const created_at = d.created_at || d.createdAt || d.uploaded_at || d.date;
  const url = d.url || d.link || d.file_url || undefined;
  const type = (d.type || d.document_type || "").toString();
  if (!file_path || !created_at) return null;
  return {
    file_path,
    type,
    created_at,
    updated_at: d.updated_at || d.updatedAt,
    status: d.status,
    url,
  };
}

function normalizeApiPayload(payload: any): {
  vendor_id?: string | number;
  documents: Doc[];
} {
  // Accept either { vendor_id, documents: [...] } or a bare array
  const rawDocs: any[] = Array.isArray(payload?.documents)
    ? payload.documents
    : Array.isArray(payload)
    ? payload
    : [];
  const documents = rawDocs.map(normalizeDoc).filter(Boolean) as Doc[];
  return {
    vendor_id: payload?.vendor_id ?? payload?.user_id ?? payload?.vendorId,
    documents,
  };
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
  const [vendors, setVendors] = useState<any[]>([]);

  console.log("VENDORS : ", vendors);

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);
  const [previewTitle, setPreviewTitle] = useState<string>("");
  const base_url = import.meta.env.VITE_API_BASE_URL;

  // ✅ API state
  const [documents, setDocuments] = useState<Doc[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState<boolean>(false);

  // ✅ Fetch vendor documents from API
  useEffect(() => {
    if (!user_id) return;

    const controller = new AbortController();
    const API_URL = `/api/get-vendor-doc?user_id=${encodeURIComponent(
      String(user_id)
    )}`;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(API_URL, {
          method: "GET",
          signal: controller.signal,
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            // ...authHeader,
          },
          credentials: "include", // remove if CORS/cookies not needed
        });

        if (res.status === 404) {
          // 👇 Treat 404 as "no docs" UX instead of an error row
          setNotFound(true);
          setDocuments([]);
          return;
        }
        if (!res.ok) {
          throw new Error(`Request failed: ${res.status} ${res.statusText}`);
        }
        const json = await res.json();
        const normalized = normalizeApiPayload(json);

        // Optional: if the backend might return mixed vendor docs, filter by user_id
        const filtered =
          String(normalized.vendor_id ?? user_id) === String(user_id)
            ? normalized.documents
            : normalized.documents.filter(Boolean);

        setDocuments(filtered);
      } catch (err: any) {
        if (err?.name !== "AbortError") {
          setError(err?.message || "Failed to fetch documents.");
          setDocuments([]);
        }
      } finally {
        setLoading(false);
      }
    })();

    return () => controller.abort();
  }, [user_id]);

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

  // replace your existing 'profile' memo with this:
  const profile = useMemo(() => {
    // try API list first
    const fromApi = vendors.find((v: any) => String(v.id) === String(user_id));
    if (fromApi) return fromApi;
  }, [vendors, user_id]);


  // ✅ Filtering + sorting
  const filteredDocs = useMemo(() => {
    const searchLower = searchTerm.toLowerCase();

    const typeMatches = (docType: string) => {
      if (fileTypeFilter === "All") return true;
      return (docType || "").toLowerCase() === fileTypeFilter.toLowerCase();
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
          <div className="flex flex-col md:flex-row gap-2 items-start md:items-center justify-between text-white w-full lg:px-10">
            <Typography>
              <strong>Name:</strong>{" "}
              {`${profile?.first_name ?? ""} ${
                profile?.last_name ?? ""
              }`.trim()}
            </Typography>
            <Typography>
              <strong>Email:</strong> {profile?.email}
            </Typography>
            {/* <Typography>
              <strong>Phone:</strong> {profile?.phone || "9865782556"}
            </Typography> */}
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

        {/* Table + Pagination wrapper */}
        <div className="overflow-x-auto rounded-sm lg:rounded-lg mt-2 flex flex-col max-h-[66vh] md:min-h-[66vh] lg:min-h-[78vh]">
          <TableContainer
            component={Paper}
            className="border border-black max-h-[57vh] md:minh-[59vh] xl:min-h-[70vh]"
            sx={{ borderRadius: "10px" }}
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
                {/* Loading state */}
                {loading && (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      <div className="flex items-center justify-center gap-2 py-6">
                        <CircularProgress size={20} />
                        <span className="text-sm">Loading documents…</span>
                      </div>
                    </TableCell>
                  </TableRow>
                )}

                {/* Error state */}
                {!loading && notFound && (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      <div className="py-6 text-red-600 text-sm">
                        No Document Available
                      </div>
                    </TableCell>
                  </TableRow>
                )}

                {/* Empty state */}
                {!loading && !notFound && !error && paginated.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      <div className="py-6 text-sm">No documents found.</div>
                    </TableCell>
                  </TableRow>
                )}

                {/* Data rows */}
                {!loading &&
                  !error &&
                  !notFound &&
                  paginated.map((doc, index) => {
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
                          {doc.type || "—"}
                        </TableCell>
                        <TableCell sx={{ textTransform: "capitalize" }}>
                          {doc.status ?? "—"}
                        </TableCell>
                        <TableCell sx={{ minWidth: "110px" }}>
                          {formatDate(doc.created_at)}
                        </TableCell>
                        <TableCell sx={{ display: "flex" }}>
                          <Tooltip title="Preview">
                            <IconButton
                              color="primary"
                              onClick={() => {
                                const href = doc.url || doc.file_path;
                                setPreviewSrc(href);
                                setPreviewTitle(fileName);
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
