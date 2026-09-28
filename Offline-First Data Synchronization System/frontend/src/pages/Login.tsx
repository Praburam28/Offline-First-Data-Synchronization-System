import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CircularProgress,
  Divider,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import LockRoundedIcon from "@mui/icons-material/LockRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import CloudSyncRoundedIcon from "@mui/icons-material/CloudSyncRounded";
import SecurityRoundedIcon from "@mui/icons-material/SecurityRounded";
import SyncRoundedIcon from "@mui/icons-material/SyncRounded";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      await login(username, password);
      navigate("/dashboard");
    } catch (err: any) {
      setError(
        err.response?.data?.detail ||
          "Invalid username or password"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        background:
          "linear-gradient(135deg, #eef2ff 0%, #f5f3ff 45%, #ecfeff 100%)",
        px: 2,
        py: 4,
      }}
    >
      {/* Decorative background circles */}
      <Box
        sx={{
          position: "absolute",
          width: 420,
          height: 420,
          borderRadius: "50%",
          background:
            "linear-gradient(135deg, rgba(99,102,241,0.25), rgba(139,92,246,0.08))",
          top: -180,
          left: -120,
          filter: "blur(2px)",
        }}
      />

      <Box
        sx={{
          position: "absolute",
          width: 360,
          height: 360,
          borderRadius: "50%",
          background:
            "linear-gradient(135deg, rgba(6,182,212,0.20), rgba(59,130,246,0.08))",
          bottom: -160,
          right: -100,
        }}
      />

      {/* Main container */}
      <Card
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: 1050,
          minHeight: 610,
          display: "flex",
          overflow: "hidden",
          borderRadius: 5,
          position: "relative",
          zIndex: 1,
          backgroundColor: "rgba(255,255,255,0.92)",
          border: "1px solid rgba(255,255,255,0.8)",
          boxShadow:
            "0 30px 80px rgba(79,70,229,0.16)",
        }}
      >
        {/* Left branding section */}
        <Box
          sx={{
            width: "50%",
            display: { xs: "none", md: "flex" },
            flexDirection: "column",
            justifyContent: "space-between",
            p: 6,
            color: "#ffffff",
            position: "relative",
            overflow: "hidden",
            background:
              "linear-gradient(145deg, #4338ca 0%, #6366f1 45%, #06b6d4 100%)",
          }}
        >
          {/* Decorative shapes */}
          <Box
            sx={{
              position: "absolute",
              width: 280,
              height: 280,
              borderRadius: "50%",
              border: "1px solid rgba(255,255,255,0.18)",
              right: -100,
              top: -80,
            }}
          />

          <Box
            sx={{
              position: "absolute",
              width: 180,
              height: 180,
              borderRadius: "50%",
              border: "1px solid rgba(255,255,255,0.15)",
              left: -70,
              bottom: 80,
            }}
          />

          <Box sx={{ position: "relative", zIndex: 1 }}>
            <Box
              sx={{
                width: 58,
                height: 58,
                borderRadius: 3,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "rgba(255,255,255,0.16)",
                backdropFilter: "blur(10px)",
                mb: 3,
              }}
            >
              <CloudSyncRoundedIcon sx={{ fontSize: 34 }} />
            </Box>

            <Typography
              variant="h3"
              sx={{
                fontWeight: 800,
                letterSpacing: "-1px",
                mb: 2,
              }}
            >
              Offline Sync
            </Typography>

            <Typography
              sx={{
                fontSize: 17,
                lineHeight: 1.7,
                maxWidth: 410,
                color: "rgba(255,255,255,0.86)",
              }}
            >
              Keep your data available everywhere.
              Work offline, synchronize automatically,
              and stay in control of your data.
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              position: "relative",
              zIndex: 1,
            }}
          >
            <Feature
              icon={<SyncRoundedIcon />}
              title="Smart Synchronization"
              description="Sync your changes automatically when you're online."
            />

            <Feature
              icon={<SecurityRoundedIcon />}
              title="Secure by Design"
              description="Your account and synchronized data stay protected."
            />
          </Box>

          <Typography
            sx={{
              fontSize: 12,
              color: "rgba(255,255,255,0.65)",
              position: "relative",
              zIndex: 1,
            }}
          >
            Offline-First Data Synchronization System • v1.0
          </Typography>
        </Box>

        {/* Right login section */}
        <Box
          sx={{
            width: { xs: "100%", md: "50%" },
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            p: { xs: 3, sm: 5, md: 6 },
          }}
        >
          <Box sx={{ width: "100%", maxWidth: 410 }}>
            {/* Mobile logo */}
            <Box
              sx={{
                display: { xs: "flex", md: "none" },
                alignItems: "center",
                gap: 1.5,
                mb: 4,
              }}
            >
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: 2.5,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#ffffff",
                  background:
                    "linear-gradient(135deg, #4f46e5, #06b6d4)",
                }}
              >
                <CloudSyncRoundedIcon />
              </Box>

              <Typography
                variant="h6"
                fontWeight={800}
              >
                Offline Sync
              </Typography>
            </Box>

            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
                color: "#111827",
                mb: 1,
                letterSpacing: "-0.7px",
              }}
            >
              Welcome back
            </Typography>

            <Typography
              sx={{
                color: "#6b7280",
                mb: 4,
              }}
            >
              Sign in to continue to your workspace.
            </Typography>

            {error && (
              <Alert
                severity="error"
                sx={{
                  mb: 3,
                  borderRadius: 2.5,
                }}
              >
                {error}
              </Alert>
            )}

            <Box
              component="form"
              onSubmit={handleSubmit}
            >
              <Typography
                variant="body2"
                fontWeight={700}
                sx={{ mb: 1 }}
              >
                Username
              </Typography>

              <TextField
                fullWidth
                placeholder="Enter your username"
                value={username}
                onChange={(e) =>
                  setUsername(e.target.value)
                }
                required
                autoComplete="username"
                sx={{
                  mb: 2.5,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2.5,
                    backgroundColor: "#f9fafb",
                    "&.Mui-focused fieldset": {
                      borderColor: "#6366f1",
                      borderWidth: 2,
                    },
                  },
                }}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonRoundedIcon
                          sx={{ color: "#6366f1" }}
                        />
                      </InputAdornment>
                    ),
                  },
                }}
              />

              <Typography
                variant="body2"
                fontWeight={700}
                sx={{ mb: 1 }}
              >
                Password
              </Typography>

              <TextField
                fullWidth
                placeholder="Enter your password"
                type="password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                required
                autoComplete="current-password"
                sx={{
                  mb: 3,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2.5,
                    backgroundColor: "#f9fafb",
                    "&.Mui-focused fieldset": {
                      borderColor: "#6366f1",
                      borderWidth: 2,
                    },
                  },
                }}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockRoundedIcon
                          sx={{ color: "#6366f1" }}
                        />
                      </InputAdornment>
                    ),
                  },
                }}
              />

              <Button
                fullWidth
                type="submit"
                variant="contained"
                size="large"
                disabled={loading}
                sx={{
                  height: 52,
                  borderRadius: 2.5,
                  textTransform: "none",
                  fontSize: 16,
                  fontWeight: 700,
                  background:
                    "linear-gradient(135deg, #4f46e5, #6366f1 55%, #06b6d4)",
                  boxShadow:
                    "0 10px 25px rgba(79,70,229,0.25)",
                  "&:hover": {
                    background:
                      "linear-gradient(135deg, #4338ca, #4f46e5 55%, #0891b2)",
                    boxShadow:
                      "0 14px 30px rgba(79,70,229,0.32)",
                  },
                }}
              >
                {loading ? (
                  <>
                    <CircularProgress
                      size={22}
                      sx={{
                        color: "#ffffff",
                        mr: 1.5,
                      }}
                    />
                    Signing in...
                  </>
                ) : (
                  "Sign in"
                )}
              </Button>
            </Box>

            <Divider sx={{ my: 3 }}>
              <Typography
                variant="caption"
                color="text.secondary"
              >
                SECURE ACCESS
              </Typography>
            </Divider>

            <Typography
              textAlign="center"
              color="#6b7280"
              fontSize={14}
            >
              Don't have an account?{" "}
              <Link
                to="/register"
                style={{
                  color: "#4f46e5",
                  fontWeight: 700,
                  textDecoration: "none",
                }}
              >
                Create an account
              </Link>
            </Typography>
          </Box>
        </Box>
      </Card>
    </Box>
  );
}

function Feature({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Box
      sx={{
        display: "flex",
        gap: 2,
        alignItems: "flex-start",
      }}
    >
      <Box
        sx={{
          minWidth: 42,
          height: 42,
          borderRadius: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "rgba(255,255,255,0.14)",
        }}
      >
        {icon}
      </Box>

      <Box>
        <Typography
          fontWeight={700}
          sx={{ mb: 0.3 }}
        >
          {title}
        </Typography>

        <Typography
          fontSize={13}
          sx={{
            color: "rgba(255,255,255,0.72)",
            lineHeight: 1.5,
          }}
        >
          {description}
        </Typography>
      </Box>
    </Box>
  );
}

