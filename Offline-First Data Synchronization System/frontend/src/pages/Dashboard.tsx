import { useCallback, useEffect, useState } from "react";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  LinearProgress,
  Typography,
} from "@mui/material";

import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import SyncRoundedIcon from "@mui/icons-material/SyncRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import CloudDoneRoundedIcon from "@mui/icons-material/CloudDoneRounded";
import CloudOffRoundedIcon from "@mui/icons-material/CloudOffRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";

import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { getRecords } from "../services/recordService";
import { getSyncHistory } from "../services/syncService";


interface SyncHistoryItem {
  id?: number;
  sync_id?: string;
  record_id?: string;
  operation?: string;
  status?: string;
  conflict_status?: string;
  error_details?: string | null;
  timestamp?: string;
}


function StatCard({
  title,
  value,
  subtitle,
  icon,
  gradient,
}: {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ReactNode;
  gradient: string;
}) {
  return (
    <Card
      sx={{
        height: "100%",
        border: "1px solid #eaecf2",
        borderRadius: 4,
        overflow: "hidden",
        position: "relative",
        transition: "all .25s ease",
        "&:hover": {
          transform: "translateY(-5px)",
          boxShadow: "0 18px 40px rgba(30,35,90,.12)",
        },
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 5,
          background: gradient,
        }}
      />

      <CardContent sx={{ p: 3 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box>
            <Typography
              variant="body2"
              color="text.secondary"
              fontWeight={600}
            >
              {title}
            </Typography>

            <Typography
              variant="h3"
              fontWeight={800}
              sx={{
                mt: 1,
                color: "#171925",
              }}
            >
              {value}
            </Typography>

            <Typography
              variant="caption"
              color="text.secondary"
            >
              {subtitle}
            </Typography>
          </Box>

          <Box
            sx={{
              width: 54,
              height: 54,
              borderRadius: 3,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: gradient,
              color: "white",
            }}
          >
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}


export default function Dashboard() {
  const navigate = useNavigate();

  /*
   * IMPORTANT:
   * Dashboard waits for AuthProvider to finish restoring
   * the logged-in user before calling protected APIs.
   */
  const {
    user,
    loading: authLoading,
  } = useAuth();

  const [totalRecords, setTotalRecords] = useState(0);

  const [syncHistory, setSyncHistory] =
    useState<SyncHistoryItem[]>([]);

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [error, setError] = useState("");

  const [online, setOnline] =
    useState(navigator.onLine);


  const loadDashboard = useCallback(
    async (showLoader = true) => {
      /*
       * Never call protected endpoints without
       * an authenticated user.
       */
      if (authLoading || !user) {
        return;
      }

      try {
        if (showLoader) {
          setLoading(true);
        } else {
          setRefreshing(true);
        }

        setError("");

        const [
          recordsResponse,
          historyResponse,
        ] = await Promise.all([
          getRecords(
            1,
            20,
            "",
            false
          ),

          getSyncHistory(
            1,
            100
          ),
        ]);

        setTotalRecords(
          recordsResponse.total
        );

        /*
         * The sync service may return either
         * an array or an object containing items/results.
         */
        if (Array.isArray(historyResponse)) {
          setSyncHistory(historyResponse);
        } else if (
          historyResponse &&
          Array.isArray(
            (historyResponse as any).items
          )
        ) {
          setSyncHistory(
            (historyResponse as any).items
          );
        } else if (
          historyResponse &&
          Array.isArray(
            (historyResponse as any).results
          )
        ) {
          setSyncHistory(
            (historyResponse as any).results
          );
        } else {
          setSyncHistory([]);
        }
      } catch (err: any) {
        console.error(
          "Dashboard loading error:",
          err
        );

        const status =
          err?.response?.status;

        if (status === 401) {
          setError(
            "Your session has expired. Please login again."
          );
        } else {
          setError(
            err?.response?.data?.detail ||
              "Unable to load dashboard data."
          );
        }
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [
      authLoading,
      user,
    ]
  );


  /*
   * Load dashboard only after AuthProvider
   * has finished authentication.
   */
  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!user) {
      setLoading(false);
      return;
    }

    loadDashboard();
  }, [
    authLoading,
    user,
    loadDashboard,
  ]);


  /*
   * Online / Offline detection.
   */
  useEffect(() => {
    const handleOnline = () => {
      setOnline(true);
    };

    const handleOffline = () => {
      setOnline(false);
    };

    window.addEventListener(
      "online",
      handleOnline
    );

    window.addEventListener(
      "offline",
      handleOffline
    );

    return () => {
      window.removeEventListener(
        "online",
        handleOnline
      );

      window.removeEventListener(
        "offline",
        handleOffline
      );
    };
  }, []);


  const successfulSyncs =
    syncHistory.filter(
      (item) =>
        item.status === "success"
    ).length;


  const conflicts =
    syncHistory.filter(
      (item) =>
        item.status === "conflict" ||
        item.conflict_status ===
          "resolved" ||
        item.conflict_status ===
          "pending"
    ).length;


  const failedSyncs =
    syncHistory.filter(
      (item) =>
        item.status === "failed"
    ).length;


  const totalOperations =
    syncHistory.length;


  const syncProgress =
    totalOperations === 0
      ? 100
      : Math.round(
          (successfulSyncs /
            totalOperations) *
            100
        );


  /*
   * Authentication is still loading.
   */
  if (authLoading) {
    return (
      <Box
        sx={{
          minHeight: "60vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
        }}
      >
        <CircularProgress
          size={42}
        />

        <Typography
          color="text.secondary"
          fontWeight={600}
        >
          Checking authentication...
        </Typography>
      </Box>
    );
  }


  /*
   * User is not authenticated.
   */
  if (!user) {
    return (
      <Box
        sx={{
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Card
          sx={{
            borderRadius: 4,
            maxWidth: 500,
            width: "100%",
          }}
        >
          <CardContent
            sx={{
              p: 4,
              textAlign: "center",
            }}
          >
            <Typography
              variant="h5"
              fontWeight={800}
              gutterBottom
            >
              Authentication Required
            </Typography>

            <Typography
              color="text.secondary"
              sx={{ mb: 3 }}
            >
              Please login to access your
              dashboard.
            </Typography>

            <Button
              variant="contained"
              onClick={() =>
                navigate("/login")
              }
            >
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </Box>
    );
  }


  /*
   * Dashboard loading.
   */
  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "60vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
        }}
      >
        <CircularProgress
          size={42}
        />

        <Typography
          color="text.secondary"
          fontWeight={600}
        >
          Loading dashboard...
        </Typography>
      </Box>
    );
  }


  return (
    <Box>
      {/* ERROR */}
      {error && (
        <Alert
          severity="warning"
          sx={{
            mb: 3,
            borderRadius: 3,
          }}
          action={
            <Button
              color="inherit"
              size="small"
              startIcon={
                <RefreshRoundedIcon />
              }
              onClick={() =>
                loadDashboard(false)
              }
            >
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      )}


      {/* HERO HEADER */}
      <Box
        sx={{
          mb: 4,
          p: {
            xs: 3,
            md: 4,
          },
          borderRadius: 5,
          color: "white",
          background:
            "linear-gradient(135deg, #5b2be0 0%, #7c4dff 45%, #00b8d9 100%)",
          boxShadow:
            "0 18px 45px rgba(92,43,224,.22)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent:
              "space-between",
            alignItems: {
              xs: "flex-start",
              md: "center",
            },
            flexDirection: {
              xs: "column",
              md: "row",
            },
            gap: 3,
          }}
        >
          <Box>
            <Typography
              variant="h4"
              fontWeight={900}
              sx={{ mb: 1 }}
            >
              Welcome back 👋
            </Typography>

            <Typography
              sx={{
                maxWidth: 650,
                color:
                  "rgba(255,255,255,.82)",
              }}
            >
              Manage your records,
              synchronize offline changes,
              resolve conflicts and monitor
              your data from one centralized
              workspace.
            </Typography>
          </Box>

          <Button
            variant="contained"
            startIcon={
              <AddRoundedIcon />
            }
            onClick={() =>
              navigate("/records")
            }
            sx={{
              bgcolor: "white",
              color: "#5b2be0",
              fontWeight: 800,
              px: 2.5,
              borderRadius: 2.5,
              whiteSpace: "nowrap",
              "&:hover": {
                bgcolor: "#f3f0ff",
              },
            }}
          >
            Manage Records
          </Button>
        </Box>
      </Box>


      {/* STATISTICS */}
      <Grid
        container
        spacing={3}
      >
        <Grid
          size={{
            xs: 12,
            sm: 6,
            lg: 3,
          }}
        >
          <StatCard
            title="Total Records"
            value={totalRecords}
            subtitle="Active records"
            icon={
              <DescriptionRoundedIcon />
            }
            gradient="linear-gradient(135deg,#5b2be0,#8f5cff)"
          />
        </Grid>

        <Grid
          size={{
            xs: 12,
            sm: 6,
            lg: 3,
          }}
        >
          <StatCard
            title="Synced"
            value={successfulSyncs}
            subtitle="Successful operations"
            icon={
              <SyncRoundedIcon />
            }
            gradient="linear-gradient(135deg,#00a878,#19c989)"
          />
        </Grid>

        <Grid
          size={{
            xs: 12,
            sm: 6,
            lg: 3,
          }}
        >
          <StatCard
            title="Conflicts"
            value={conflicts}
            subtitle={
              conflicts > 0
                ? "Requires attention"
                : "No conflicts detected"
            }
            icon={
              <WarningAmberRoundedIcon />
            }
            gradient="linear-gradient(135deg,#ff8a00,#ffb000)"
          />
        </Grid>

        <Grid
          size={{
            xs: 12,
            sm: 6,
            lg: 3,
          }}
        >
          <StatCard
            title="Connection"
            value={
              online
                ? "Online"
                : "Offline"
            }
            subtitle={
              online
                ? "Server connection active"
                : "Working offline"
            }
            icon={
              online ? (
                <CloudDoneRoundedIcon />
              ) : (
                <CloudOffRoundedIcon />
              )
            }
            gradient={
              online
                ? "linear-gradient(135deg,#0084ff,#00c6ff)"
                : "linear-gradient(135deg,#64748b,#94a3b8)"
            }
          />
        </Grid>
      </Grid>


      {/* OVERVIEW + QUICK ACTIONS */}
      <Grid
        container
        spacing={3}
        sx={{ mt: 1 }}
      >
        <Grid
          size={{
            xs: 12,
            md: 8,
          }}
        >
          <Card
            sx={{
              borderRadius: 4,
              border:
                "1px solid #eaecf2",
            }}
          >
            <CardContent
              sx={{ p: 3 }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent:
                    "space-between",
                  alignItems: "center",
                  mb: 3,
                }}
              >
                <Box>
                  <Typography
                    fontWeight={800}
                    fontSize={18}
                  >
                    Synchronization Overview
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    Current synchronization
                    health
                  </Typography>
                </Box>

                <SyncRoundedIcon
                  color="primary"
                />
              </Box>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 1 }}
              >
                Synchronization progress
              </Typography>

              <LinearProgress
                variant="determinate"
                value={syncProgress}
                sx={{
                  height: 10,
                  borderRadius: 5,
                  mb: 2,
                }}
              />

              <Box
                sx={{
                  display: "flex",
                  justifyContent:
                    "space-between",
                  gap: 2,
                }}
              >
                <Typography
                  fontWeight={700}
                >
                  {totalOperations === 0
                    ? "No sync operations yet"
                    : successfulSyncs ===
                        totalOperations
                      ? "All changes synchronized"
                      : "Synchronization in progress"}
                </Typography>

                <Typography
                  color="success.main"
                  fontWeight={700}
                >
                  {syncProgress}%
                </Typography>
              </Box>


              {/* SUMMARY */}
              <Grid
                container
                spacing={2}
                sx={{ mt: 2 }}
              >
                <Grid
                  size={{
                    xs: 12,
                    sm: 4,
                  }}
                >
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 3,
                      background:
                        "#f0fdf4",
                    }}
                  >
                    <Typography
                      variant="caption"
                      color="text.secondary"
                    >
                      Successful
                    </Typography>

                    <Typography
                      variant="h5"
                      fontWeight={800}
                      color="success.main"
                    >
                      {successfulSyncs}
                    </Typography>
                  </Box>
                </Grid>

                <Grid
                  size={{
                    xs: 12,
                    sm: 4,
                  }}
                >
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 3,
                      background:
                        "#fff7ed",
                    }}
                  >
                    <Typography
                      variant="caption"
                      color="text.secondary"
                    >
                      Conflicts
                    </Typography>

                    <Typography
                      variant="h5"
                      fontWeight={800}
                      color="warning.main"
                    >
                      {conflicts}
                    </Typography>
                  </Box>
                </Grid>

                <Grid
                  size={{
                    xs: 12,
                    sm: 4,
                  }}
                >
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 3,
                      background:
                        "#fef2f2",
                    }}
                  >
                    <Typography
                      variant="caption"
                      color="text.secondary"
                    >
                      Failed
                    </Typography>

                    <Typography
                      variant="h5"
                      fontWeight={800}
                      color="error.main"
                    >
                      {failedSyncs}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>


        {/* QUICK ACTIONS */}
        <Grid
          size={{
            xs: 12,
            md: 4,
          }}
        >
          <Card
            sx={{
              height: "100%",
              borderRadius: 4,
              border:
                "1px solid #eaecf2",
            }}
          >
            <CardContent
              sx={{ p: 3 }}
            >
              <Typography
                fontWeight={800}
                fontSize={18}
              >
                Quick Actions
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  mt: 0.5,
                  mb: 2,
                }}
              >
                Frequently used operations
              </Typography>

              <Button
                fullWidth
                variant="outlined"
                endIcon={
                  <ArrowForwardRoundedIcon />
                }
                sx={{
                  mb: 1.5,
                  justifyContent:
                    "space-between",
                  borderRadius: 2.5,
                  py: 1.2,
                }}
                onClick={() =>
                  navigate("/records")
                }
              >
                View Records
              </Button>

              <Button
                fullWidth
                variant="outlined"
                endIcon={
                  <ArrowForwardRoundedIcon />
                }
                sx={{
                  mb: 1.5,
                  justifyContent:
                    "space-between",
                  borderRadius: 2.5,
                  py: 1.2,
                }}
                onClick={() =>
                  navigate(
                    "/sync-history"
                  )
                }
              >
                Sync History
              </Button>

              <Button
                fullWidth
                variant="outlined"
                endIcon={
                  <ArrowForwardRoundedIcon />
                }
                sx={{
                  justifyContent:
                    "space-between",
                  borderRadius: 2.5,
                  py: 1.2,
                }}
                onClick={() =>
                  navigate("/conflicts")
                }
              >
                Review Conflicts
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>


      {/* REFRESH */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          mt: 3,
        }}
      >
        <Button
          variant="text"
          startIcon={
            <RefreshRoundedIcon
              sx={{
                animation: refreshing
                  ? "spin 1s linear infinite"
                  : "none",
                "@keyframes spin": {
                  from: {
                    transform:
                      "rotate(0deg)",
                  },
                  to: {
                    transform:
                      "rotate(360deg)",
                  },
                },
              }}
            />
          }
          disabled={refreshing}
          onClick={() =>
            loadDashboard(false)
          }
        >
          {refreshing
            ? "Refreshing..."
            : "Refresh Dashboard"}
        </Button>
      </Box>
    </Box>
  );
}