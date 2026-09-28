import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Stack,
  Typography,
} from "@mui/material";

import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import HistoryRoundedIcon from "@mui/icons-material/HistoryRounded";

import api from "../services/api";

interface ConflictItem {
  id?: number;
  sync_id: string;
  record_id: string;
  operation: string;
  status: string;
  conflict_status?: string | null;
  message?: string | null;
  server_version?: number | null;
  error_details?: string | null;
  client_timestamp?: string | null;
  created_at?: string | null;
}

interface SyncHistoryResponse {
  items?: ConflictItem[];
  results?: ConflictItem[];
  total?: number;
  page?: number;
  page_size?: number;
  total_pages?: number;
}

export default function Conflicts() {
  const [conflicts, setConflicts] = useState<ConflictItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadConflicts() {
    try {
      setLoading(true);
      setError("");

      const response =
        await api.get<SyncHistoryResponse>(
          "/sync/history",
          {
            params: {
              page: 1,
              page_size: 100,
            },
          }
        );

      const data = response.data;

      const items =
        data.items ??
        data.results ??
        [];

      const conflictItems = items.filter(
        (item) =>
          item.status?.toLowerCase() ===
            "conflict" ||
          item.conflict_status
            ?.toLowerCase() ===
            "conflict"
      );

      setConflicts(conflictItems);
    } catch (err: any) {
      console.error(
        "Failed to load conflicts:",
        err
      );

      setError(
        err?.response?.data?.detail ||
          "Unable to load synchronization conflicts."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadConflicts();
  }, []);

  function formatDate(
    value?: string | null
  ) {
    if (!value) {
      return "—";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return date.toLocaleString();
  }

  return (
    <Box>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: {
            xs: "flex-start",
            md: "center",
          },
          flexDirection: {
            xs: "column",
            md: "row",
          },
          gap: 2,
          mb: 3,
        }}
      >
        <Box>
          <Stack
            direction="row"
            spacing={1.5}
            alignItems="center"
          >
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: 3,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                background:
                  "linear-gradient(135deg,#ff8a00,#ffb000)",
                boxShadow:
                  "0 8px 20px rgba(255,138,0,.22)",
              }}
            >
              <WarningAmberRoundedIcon />
            </Box>

            <Box>
              <Typography
                variant="h4"
                fontWeight={900}
              >
                Synchronization Conflicts
              </Typography>

              <Typography
                color="text.secondary"
                sx={{ mt: 0.5 }}
              >
                Review records where offline
                changes conflicted with server
                data.
              </Typography>
            </Box>
          </Stack>
        </Box>

        <Button
          variant="contained"
          startIcon={
            <RefreshRoundedIcon />
          }
          onClick={loadConflicts}
          disabled={loading}
          sx={{
            borderRadius: 2.5,
            fontWeight: 800,
            px: 2.5,
            background:
              "linear-gradient(135deg,#ff8a00,#ffb000)",
            "&:hover": {
              background:
                "linear-gradient(135deg,#e97900,#ed9e00)",
            },
          }}
        >
          Refresh
        </Button>
      </Box>

      {/* Error */}
      {error && (
        <Alert
          severity="error"
          sx={{
            mb: 3,
            borderRadius: 3,
          }}
        >
          {error}
        </Alert>
      )}

      {/* Summary */}
      {!loading && !error && (
        <Card
          sx={{
            mb: 3,
            borderRadius: 4,
            border: "1px solid #e8eaf0",
            background:
              "linear-gradient(135deg,#fff8ed,#ffffff)",
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Stack
              direction="row"
              spacing={2}
              alignItems="center"
            >
              <Box
                sx={{
                  width: 58,
                  height: 58,
                  borderRadius: 3,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background:
                    "linear-gradient(135deg,#ff8a00,#ffb000)",
                  color: "white",
                }}
              >
                <WarningAmberRoundedIcon
                  sx={{ fontSize: 30 }}
                />
              </Box>

              <Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  fontWeight={600}
                >
                  Total Conflicts
                </Typography>

                <Typography
                  variant="h4"
                  fontWeight={900}
                >
                  {conflicts.length}
                </Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      )}

      {/* Main content */}
      <Card
        sx={{
          borderRadius: 4,
          border: "1px solid #e8eaf0",
          overflow: "hidden",
        }}
      >
        <CardContent sx={{ p: 0 }}>
          {/* Loading */}
          {loading && (
            <Box
              sx={{
                minHeight: 350,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Stack
                spacing={2}
                alignItems="center"
              >
                <CircularProgress />

                <Typography color="text.secondary">
                  Loading conflicts...
                </Typography>
              </Stack>
            </Box>
          )}

          {/* No conflicts */}
          {!loading &&
            !error &&
            conflicts.length === 0 && (
              <Box
                sx={{
                  minHeight: 380,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                  p: 4,
                }}
              >
                <Stack
                  spacing={2}
                  alignItems="center"
                >
                  <Box
                    sx={{
                      width: 82,
                      height: 82,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background:
                        "linear-gradient(135deg,#e8fff4,#dff5ff)",
                    }}
                  >
                    <CheckCircleRoundedIcon
                      sx={{
                        fontSize: 44,
                        color: "#00a878",
                      }}
                    />
                  </Box>

                  <Typography
                    variant="h5"
                    fontWeight={900}
                  >
                    No Conflicts
                  </Typography>

                  <Typography
                    color="text.secondary"
                    sx={{
                      maxWidth: 480,
                    }}
                  >
                    Your synchronization is
                    currently clean. Conflicting
                    offline changes will appear
                    here when detected.
                  </Typography>
                </Stack>
              </Box>
            )}

          {/* Conflict list */}
          {!loading &&
            !error &&
            conflicts.length > 0 &&
            conflicts.map(
              (conflict, index) => (
                <Box
                  key={
                    conflict.id ??
                    conflict.sync_id ??
                    index
                  }
                >
                  <Box
                    sx={{
                      p: 3,
                      "&:hover": {
                        backgroundColor:
                          "#fffaf2",
                      },
                    }}
                  >
                    {/* Top */}
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent:
                          "space-between",
                        alignItems:
                          "flex-start",
                        gap: 2,
                        flexWrap: "wrap",
                      }}
                    >
                      <Box>
                        <Stack
                          direction="row"
                          spacing={1.5}
                          alignItems="center"
                          sx={{ mb: 1 }}
                        >
                          <WarningAmberRoundedIcon
                            sx={{
                              color:
                                "#ff8a00",
                            }}
                          />

                          <Typography
                            fontWeight={900}
                            fontSize={17}
                          >
                            {conflict.sync_id}
                          </Typography>

                          <Chip
                            label="CONFLICT"
                            color="warning"
                            size="small"
                            sx={{
                              fontWeight: 800,
                            }}
                          />
                        </Stack>

                        <Typography
                          variant="body2"
                          color="text.secondary"
                        >
                          Record ID:{" "}
                          <strong>
                            {
                              conflict.record_id
                            }
                          </strong>
                        </Typography>
                      </Box>

                      <Typography
                        variant="caption"
                        color="text.secondary"
                      >
                        {formatDate(
                          conflict.created_at ??
                            conflict.client_timestamp
                        )}
                      </Typography>
                    </Box>

                    {/* Details */}
                    <Box
                      sx={{
                        mt: 2.5,
                        display: "grid",
                        gridTemplateColumns:
                          {
                            xs: "1fr",
                            sm: "repeat(3, 1fr)",
                          },
                        gap: 2,
                      }}
                    >
                      <Box
                        sx={{
                          p: 2,
                          borderRadius: 2.5,
                          background:
                            "#f7f7fb",
                        }}
                      >
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          fontWeight={600}
                        >
                          Operation
                        </Typography>

                        <Typography
                          fontWeight={800}
                          sx={{
                            mt: 0.5,
                            textTransform:
                              "capitalize",
                          }}
                        >
                          {conflict.operation}
                        </Typography>
                      </Box>

                      <Box
                        sx={{
                          p: 2,
                          borderRadius: 2.5,
                          background:
                            "#fff8ed",
                        }}
                      >
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          fontWeight={600}
                        >
                          Conflict Status
                        </Typography>

                        <Typography
                          fontWeight={800}
                          sx={{ mt: 0.5 }}
                        >
                          {conflict.conflict_status ??
                            "Detected"}
                        </Typography>
                      </Box>

                      <Box
                        sx={{
                          p: 2,
                          borderRadius: 2.5,
                          background:
                            "#eef7ff",
                        }}
                      >
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          fontWeight={600}
                        >
                          Server Version
                        </Typography>

                        <Typography
                          fontWeight={800}
                          sx={{ mt: 0.5 }}
                        >
                          {conflict.server_version ??
                            "Unknown"}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Message */}
                    {conflict.message && (
                      <Box sx={{ mt: 2 }}>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          fontWeight={700}
                        >
                          Resolution Message
                        </Typography>

                        <Typography
                          sx={{
                            mt: 0.5,
                            color: "#4e5363",
                          }}
                        >
                          {conflict.message}
                        </Typography>
                      </Box>
                    )}

                    {/* Error */}
                    {conflict.error_details && (
                      <Alert
                        severity="warning"
                        sx={{
                          mt: 2,
                          borderRadius: 2.5,
                        }}
                      >
                        {conflict.error_details}
                      </Alert>
                    )}

                    {/* Status */}
                    <Box sx={{ mt: 2 }}>
                      <Chip
                        icon={
                          conflict.conflict_status
                            ?.toLowerCase() ===
                          "resolved" ? (
                            <CheckCircleRoundedIcon />
                          ) : (
                            <HistoryRoundedIcon />
                          )
                        }
                        label={
                          conflict.conflict_status
                            ?.toLowerCase() ===
                          "resolved"
                            ? "Conflict Resolved"
                            : "Requires Review"
                        }
                        color={
                          conflict.conflict_status
                            ?.toLowerCase() ===
                          "resolved"
                            ? "success"
                            : "warning"
                        }
                        sx={{
                          fontWeight: 800,
                        }}
                      />
                    </Box>
                  </Box>

                  {index <
                    conflicts.length - 1 && (
                    <Divider />
                  )}
                </Box>
              )
            )}
        </CardContent>
      </Card>
    </Box>
  );
}