import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tooltip,
  Box,
  CircularProgress,
  Alert,
  Button,
} from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { Close, ZoomIn, ZoomOut, OpenInNew, Download } from "@mui/icons-material";

type Props = {
  open: boolean;
  src?: string | null;
  title?: string;
  onClose: () => void;
};

export default function ImagePreviewDialog({ open, src, title, onClose }: Props) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const [loaded, setLoaded] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [zoom, setZoom] = React.useState(1);

  React.useEffect(() => {
    if (open) {
      setLoaded(false);
      setError(false);
      setZoom(1);
    }
  }, [open, src]);

  const canShowImage = Boolean(src) && !error;

  const handleDownload = () => {
    if (!src) return;
    const a = document.createElement("a");
    a.href = src;
    a.download = title || "image";
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="lg"
      fullScreen={fullScreen}
      aria-labelledby="image-preview-title"
    >
      <DialogTitle id="image-preview-title">
        {title ?? "Preview"}
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ p: 0 }}>
        <Box
          sx={{
            width: "100%",
            height: fullScreen ? "calc(100vh - 160px)" : "70vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "auto",
            bgcolor: "background.default",
          }}
        >
          {!loaded && !error && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <CircularProgress size={24} />
              Loading image…
            </Box>
          )}

          {error && <Alert severity="error">Failed to load image.</Alert>}

          {canShowImage && (
            <img
              src={src!}
              alt={title ?? "Preview"}
              onLoad={() => setLoaded(true)}
              onError={() => setError(true)}
              style={{
                maxWidth: "100%",
                maxHeight: "100%",
                objectFit: "contain",
                transform: `scale(${zoom})`,
                transformOrigin: "center center",
                transition: "transform 120ms ease",
                display: loaded ? "block" : "none",
              }}
            />
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ justifyContent: "space-between", px: 2 }}>
        <Box>
          <Tooltip title="Zoom out">
            <span>
              <IconButton
                onClick={() => setZoom((z) => Math.max(0.25, +(z - 0.25).toFixed(2)))}
                disabled={!loaded || error}
              >
                <ZoomOut />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="Zoom in">
            <span>
              <IconButton
                onClick={() => setZoom((z) => Math.min(5, +(z + 0.25).toFixed(2)))}
                disabled={!loaded || error}
              >
                <ZoomIn />
              </IconButton>
            </span>
          </Tooltip>
          <Button
            onClick={() => setZoom(1)}
            disabled={!loaded || error}
            sx={{ ml: 1 }}
          >
            Reset
          </Button>
        </Box>

        <Box>
          <Tooltip title="Open in new tab">
            <span>
              <IconButton
                onClick={() => src && window.open(src, "_blank", "noopener,noreferrer")}
                disabled={!loaded || error}
              >
                <OpenInNew />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="Download">
            <span>
              <IconButton onClick={handleDownload} disabled={!loaded || error}>
                <Download />
              </IconButton>
            </span>
          </Tooltip>
        </Box>
      </DialogActions>
    </Dialog>
  );
}