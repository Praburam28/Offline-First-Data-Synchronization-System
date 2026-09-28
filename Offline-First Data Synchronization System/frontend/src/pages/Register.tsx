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
import PersonAddRoundedIcon from "@mui/icons-material/PersonAddRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import LockRoundedIcon from "@mui/icons-material/LockRounded";
import CloudSyncRoundedIcon from "@mui/icons-material/CloudSyncRounded";
import SecurityRoundedIcon from "@mui/icons-material/SecurityRounded";
import StorageRoundedIcon from "@mui/icons-material/StorageRounded";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      await register(username, email, password);
      navigate("/login");
    } catch (err: any) {
      setError(
        err.response?.data?.detail ||
          "Unable to create your account"
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
      {/* Background decoration */}
      <Box
        sx={{
          position: "absolute",
          width: 420,
          height: 420,
          borderRadius: "50%",
          background:
            "linear-gradient(135deg, rgba(99,102,241,0.25), rgba(139,92,246,0.08))",
          top: -180,
          right: -120,
        }}
      />

      <Box
        sx={{
          position: "absolute",
          width: 350,
          height: 350,
          borderRadius: "50%",
          background:
            "linear-gradient(135deg, rgba(6,182,212,0.20), rgba(59,130,246,0.08))",
          bottom: -150,
          left: -100,
        }}
      />

      <Card
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: 1080,
          minHeight: 650,
          display: "flex",
          overflow: "hidden",
          borderRadius: 5,
          position: "relative",
          zIndex: 1,
          backgroundColor: "rgba(255,255,255,0.94)",
          border: "1px solid rgba(255,255,255,0.8)",
          boxShadow:
            "0 30px 80px rgba(79,70,229,0.16)",
        }}
      >
        {/* Left branding panel */}
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
          <Box
            sx={{
              position: "absolute",
              width: 300,
              height: 300,
              borderRadius: "50%",
              border: "1px solid rgba(255,255,255,0.18)",
              right: -120,
              top: -90,
            }}
          />

          <Box
            sx={{
              position: "absolute",
              width: 200,
              height: 200,
              borderRadius: "50%",
              border: "1px solid rgba(255,255,255,0.15)",
              left: -80,
              bottom: 60,
            }}
          />

          <Box
            sx={{
              position: "relative",
              zIndex: 1,
            }}
          >
            <Box
              sx={{
                width: 58,
                height: 58,
                borderRadius: 3,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor:
                  "rgba(255,255,255,0.16)",
                backdropFilter: "blur(10px)",
                mb: 3,
              }}
            >
              <PersonAddRoundedIcon
                sx={{ fontSize: 34 }}
              />
            </Box>

            <Typography
              variant="h3"
              sx={{
                fontWeight: 800,
                letterSpacing: "-1px",
                mb: 2,
              }}
            >
              Join Offline Sync
            </Typography>

            <Typography
              sx={{
                fontSize: 17,
                lineHeight: 1.7,
                maxWidth: 410,
                color:
                  "rgba(255,255,255,0.86)",
              }}
            >
              Create your account and manage
              your records with reliable
              offline-first synchronization.
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
              icon={<StorageRoundedIcon />}
              title="Work Anywhere"
              description="Access and manage your records even when offline."
            />

            <Feature
              icon={<SecurityRoundedIcon />}
              title="Protected Account"
              description="Your account is secured with authenticated access."
            />
          </Box>

          <Typography
            sx={{
              fontSize: 12,
              color:
                "rgba(255,255,255,0.65)",
              position: "relative",
              zIndex: 1,
            }}
          >
            Offline-First Data Synchronization System • v1.0
          </Typography>
        </Box>

        {/* Registration form */}
        <Box
          sx={{
            width: { xs: "100%", md: "50%" },
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            p: { xs: 3, sm: 5, md: 6 },
          }}
        >
          <Box
            sx={{
              width: "100%",
              maxWidth: 410,
            }}
          >
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
              Create your account
            </Typography>

            <Typography
              sx={{
                color: "#6b7280",
                mb: 4,
              }}
            >
              Get started with your offline-first
              workspace.
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
                placeholder="Choose a username"
                value={username}
                onChange={(e) =>
                  setUsername(e.target.value)
                }
                required
                autoComplete="username"
                sx={fieldStyle}
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
                sx={{
                  mb: 1,
                  mt: 2.5,
                }}
              >
                Email address
              </Typography>

              <TextField
                fullWidth
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                required
                autoComplete="email"
                sx={fieldStyle}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailRoundedIcon
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
                sx={{
                  mb: 1,
                  mt: 2.5,
                }}
              >
                Password
              </Typography>

              <TextField
                fullWidth
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                required
                autoComplete="new-password"
                sx={{ ...fieldStyle, mb: 3 }}
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
                    Creating account...
                  </>
                ) : (
                  "Create account"
                )}
              </Button>
            </Box>

            <Divider sx={{ my: 3 }}>
              <Typography
                variant="caption"
                color="text.secondary"
              >
                SECURE REGISTRATION
              </Typography>
            </Divider>

            <Typography
              textAlign="center"
              color="#6b7280"
              fontSize={14}
            >
              Already have an account?{" "}
              <Link
                to="/login"
                style={{
                  color: "#4f46e5",
                  fontWeight: 700,
                  textDecoration: "none",
                }}
              >
                Sign in
              </Link>
            </Typography>
          </Box>
        </Box>
      </Card>
    </Box>
  );
}

const fieldStyle = {
  mb: 0,
  "& .MuiOutlinedInput-root": {
    borderRadius: 2.5,
    backgroundColor: "#f9fafb",
    "&.Mui-focused fieldset": {
      borderColor: "#6366f1",
      borderWidth: 2,
    },
  },
};

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
          backgroundColor:
            "rgba(255,255,255,0.14)",
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
            color:
              "rgba(255,255,255,0.72)",
            lineHeight: 1.5,
          }}
        >
          {description}
        </Typography>
      </Box>
    </Box>
  );
}

