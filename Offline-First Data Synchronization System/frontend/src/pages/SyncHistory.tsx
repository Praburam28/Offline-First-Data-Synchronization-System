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

import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import SyncRoundedIcon from "@mui/icons-material/SyncRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import ErrorRoundedIcon from "@mui/icons-material/ErrorRounded";
import HistoryRoundedIcon from "@mui/icons-material/HistoryRounded";

import api from "../services/api";

interface SyncHistoryItem {
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
  items?: SyncHistoryItem[];
  results?: SyncHistoryItem[];
  total?: number;
  page?: number;
  page_size?: number;
  total_pages?: number;
}

export default function SyncHistory() {
  const [history, setHistory] = useState<SyncHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function loadHistory() {
    try {
      setLoading(true);
      setError("");
      setSuccess("");

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

      setHistory(items);
    } catch (err: any) {
      console.error(
        "Failed to load sync history:",
        err
      );

      setError(
        err?.response?.data?.detail ||
          "Unable to load synchronization history."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadHistory();
  }, []);

  function getStatusColor(status: string) {
    const value = status.toLowerCase();

    if (
      value === "success" ||
      value === "completed"
    ) {
      return "success";
    }

    if (
      value === "conflict" ||
      value === "warning"
    ) {
      return "warning";
    }

    if (
      value === "failed" ||
      value === "error"
    ) {
      return "error";
    }

    return "default";
  }

  function getStatusIcon(status: string) {
    const value = status.toLowerCase();

    if (
      value === "success" ||
      value === "completed"
    ) {
      return (
        <CheckCircleRoundedIcon
          fontSize="small"
        />
      );
    }

    if (
      value === "conflict" ||
      value === "warning"
    ) {
      return (
        <WarningAmberRoundedIcon
          fontSize="small"
        />
      );
    }

    if (
      value === "failed" ||
      value === "error"
    ) {
      return (
        <ErrorRoundedIcon
          fontSize="small"
        />
      );
    }

    return (
      <HistoryRoundedIcon
        fontSize="small"
      />
    );
  }

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
                  "linear-gradient(135deg,#5b2be0,#0084ff)",
                boxShadow:
                  "0 8px 20px rgba(91,43,224,.22)",
              }}
            >
              <SyncRoundedIcon />
            </Box>

            <Box>
              <Typography
                variant="h4"
                fontWeight={900}
              >
                Synchronization History
              </Typography>

              <Typography
                color="text.secondary"
                sx={{ mt: 0.5 }}
              >
                View all synchronization
                operations and their results.
              </Typography>
            </Box>
          </Stack>
        </Box>

        <Button
          variant="contained"
          startIcon={
            <RefreshRoundedIcon />
          }
          onClick={loadHistory}
          disabled={loading}
          sx={{
            borderRadius: 2.5,
            fontWeight: 800,
            px: 2.5,
            background:
              "linear-gradient(135deg,#5b2be0,#0084ff)",
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

      {/* Success */}
      {success && (
        <Alert
          severity="success"
          sx={{
            mb: 3,
            borderRadius: 3,
          }}
        >
          {success}
        </Alert>
      )}

      {/* Summary */}
      {!loading && !error && (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(3, 1fr)",
            },
            gap: 2,
            mb: 3,
          }}
        >
          <Card
            sx={{
              borderRadius: 3,
              border: "1px solid #e8eaf0",
            }}
          >
            <CardContent>
              <Typography
                color="text.secondary"
                variant="body2"
                fontWeight={600}
              >
                Total Operations
              </Typography>

              <Typography
                variant="h4"
                fontWeight={900}
                sx={{ mt: 1 }}
              >
                {history.length}
              </Typography>
            </CardContent>
          </Card>

          <Card
            sx={{
              borderRadius: 3,
              border: "1px solid #e8eaf0",
            }}
          >
            <CardContent>
              <Typography
                color="text.secondary"
                variant="body2"
                fontWeight={600}
              >
                Successful
              </Typography>

              <Typography
                variant="h4"
                fontWeight={900}
                color="success.main"
                sx={{ mt: 1 }}
              >
                {
                  history.filter(
                    (item) =>
                      item.status.toLowerCase() ===
                      "success"
                  ).length
                }
              </Typography>
            </CardContent>
          </Card>

          <Card
            sx={{
              borderRadius: 3,
              border: "1px solid #e8eaf0",
            }}
          >
            <CardContent>
              <Typography
                color="text.secondary"
                variant="body2"
                fontWeight={600}
              >
                Conflicts
              </Typography>

              <Typography
                variant="h4"
                fontWeight={900}
                color="warning.main"
                sx={{ mt: 1 }}
              >
                {
                  history.filter(
                    (item) =>
                      item.status.toLowerCase() ===
                      "conflict"
                  ).length
                }
              </Typography>
            </CardContent>
          </Card>
        </Box>
      )}

      {/* History */}
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
                  Loading synchronization
                  history...
                </Typography>
              </Stack>
            </Box>
          )}

          {/* Empty */}
          {!loading &&
            !error &&
            history.length === 0 && (
              <Box
                sx={{
                  minHeight: 350,
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
                      width: 76,
                      height: 76,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background:
                        "linear-gradient(135deg,#eee7ff,#dff5ff)",
                    }}
                  >
                    <HistoryRoundedIcon
                      sx={{
                        fontSize: 38,
                        color: "#5b2be0",
                      }}
                    />
                  </Box>

                  <Typography
                    variant="h6"
                    fontWeight={800}
                  >
                    No synchronization history
                  </Typography>

                  <Typography
                    color="text.secondary"
                  >
                    Synchronization operations
                    will appear here after your
                    records are synchronized.
                  </Typography>
                </Stack>
              </Box>
            )}

          {/* History list */}
          {!loading &&
            history.length > 0 &&
            history.map((item, index) => (
              <Box key={item.id ?? item.sync_id ?? index}>
                <Box
                  sx={{
                    p: 3,
                    "&:hover": {
                      backgroundColor:
                        "#fafaff",
                    },
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent:
                        "space-between",
                      alignItems: "flex-start",
                      gap: 2,
                      flexWrap: "wrap",
                    }}
                  >
                    {/* Left */}
                    <Box sx={{ flex: 1 }}>
                      <Stack
                        direction="row"
                        spacing={1.5}
                        alignItems="center"
                        sx={{ mb: 1 }}
                      >
                        <Typography
                          fontWeight={800}
                          fontSize={16}
                        >
                          {item.sync_id}
                        </Typography>

                        <Chip
                          size="small"
                          icon={getStatusIcon(
                            item.status
                          )}
                          label={
                            item.status
                              .toUpperCase()
                          }
                          color={
                            getStatusColor(
                              item.status
                            ) as
                              | "success"
                              | "warning"
                              | "error"
                              | "default"
                          }
                          sx={{
                            fontWeight: 800,
                          }}
                        />
                      </Stack>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          mb: 1.5,
                        }}
                      >
                        Record ID:{" "}
                        <strong>
                          {item.record_id}
                        </strong>
                      </Typography>

                      <Stack
                        direction="row"
                        spacing={1}
                        flexWrap="wrap"
                        useFlexGap
                      >
                        <Chip
                          size="small"
                          variant="outlined"
                          label={`Operation: ${item.operation}`}
                        />

                        {item.conflict_status && (
                          <Chip
                            size="small"
                            variant="outlined"
                            label={`Conflict: ${item.conflict_status}`}
                          />
                        )}

                        {item.server_version !==
                          null &&
                          item.server_version !==
                            undefined && (
                            <Chip
                              size="small"
                              variant="outlined"
                              label={`Server version: ${item.server_version}`}
                            />
                          )}
                      </Stack>

                      {item.message && (
                        <Typography
                          variant="body2"
                          sx={{
                            mt: 2,
                            color: "#555b6e",
                          }}
                        >
                          {item.message}
                        </Typography>
                      )}

                      {item.error_details && (
                        <Alert
                          severity="error"
                          sx={{
                            mt: 2,
                            borderRadius: 2,
                          }}
                        >
                          {item.error_details}
                        </Alert>
                      )}
                    </Box>

                    {/* Date */}
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{
                        whiteSpace:
                          "nowrap",
                      }}
                    >
                      {formatDate(
                        item.created_at ??
                          item.client_timestamp
                      )}
                    </Typography>
                  </Box>
                </Box>

                {index <
                  history.length - 1 && (
                  <Divider />
                )}
              </Box>
            ))}
        </CardContent>
      </Card>
    </Box>
  );
}