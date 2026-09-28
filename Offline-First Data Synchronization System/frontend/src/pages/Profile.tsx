import { useState } from "react";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";

import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import LockRoundedIcon from "@mui/icons-material/LockRounded";
import SecurityRoundedIcon from "@mui/icons-material/SecurityRounded";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import KeyRoundedIcon from "@mui/icons-material/KeyRounded";

import { useAuth } from "../context/AuthContext";
import {
  updateProfile,
  changePassword,
} from "../services/authService";

export default function Profile() {
  const { user } = useAuth();

  const [email, setEmail] = useState(user?.email || "");

  const [currentPassword, setCurrentPassword] =
    useState("");

  const [newPassword, setNewPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [profileMessage, setProfileMessage] =
    useState("");

  const [passwordMessage, setPasswordMessage] =
    useState("");

  const [profileError, setProfileError] =
    useState("");

  const [passwordError, setPasswordError] =
    useState("");

  const [profileLoading, setProfileLoading] =
    useState(false);

  const [passwordLoading, setPasswordLoading] =
    useState(false);

  async function handleProfileUpdate(
    event: React.FormEvent
  ) {
    event.preventDefault();

    setProfileMessage("");
    setProfileError("");
    setProfileLoading(true);

    try {
      await updateProfile(email);

      setProfileMessage(
        "Profile updated successfully."
      );

      localStorage.setItem(
        "current_user",
        JSON.stringify({
          ...user,
          email,
        })
      );
    } catch (error: any) {
      setProfileError(
        error.response?.data?.detail ||
          "Unable to update profile."
      );
    } finally {
      setProfileLoading(false);
    }
  }

  async function handlePasswordChange(
    event: React.FormEvent
  ) {
    event.preventDefault();

    setPasswordMessage("");
    setPasswordError("");

    if (newPassword !== confirmPassword) {
      setPasswordError(
        "New password and confirm password do not match."
      );
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError(
        "New password must contain at least 8 characters."
      );
      return;
    }

    setPasswordLoading(true);

    try {
      await changePassword(
        currentPassword,
        newPassword
      );

      setPasswordMessage(
        "Password changed successfully."
      );

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      setPasswordError(
        error.response?.data?.detail ||
          "Unable to change password."
      );
    } finally {
      setPasswordLoading(false);
    }
  }

  const username =
    user?.username || "User";

  const role =
    user?.role || "user";

  return (
    <Box
      sx={{
        maxWidth: 1200,
        mx: "auto",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          mb: 3,
          p: { xs: 3, md: 4 },
          borderRadius: 5,
          color: "white",
          background:
            "linear-gradient(135deg, #5429d8 0%, #7c4dff 45%, #00b8d9 100%)",
          boxShadow:
            "0 18px 45px rgba(84,41,216,.20)",
        }}
      >
        <Typography
          variant="h4"
          fontWeight={900}
          sx={{ mb: 0.8 }}
        >
          My Profile
        </Typography>

        <Typography
          sx={{
            color: "rgba(255,255,255,.82)",
          }}
        >
          Manage your account information and
          security settings.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Profile Information */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Card
            sx={{
              height: "100%",
              borderRadius: 4,
              border: "1px solid #eaecf2",
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                height: 90,
                background:
                  "linear-gradient(135deg, #5429d8, #00b8d9)",
              }}
            />

            <CardContent
              sx={{
                px: { xs: 3, md: 4 },
                pb: 4,
                mt: -6,
                position: "relative",
              }}
            >
              <Avatar
                sx={{
                  width: 90,
                  height: 90,
                  bgcolor: "#ffffff",
                  color: "#6c3df5",
                  border:
                    "5px solid rgba(255,255,255,.9)",
                  boxShadow:
                    "0 8px 25px rgba(0,0,0,.15)",
                  fontSize: 40,
                }}
              >
                <PersonRoundedIcon fontSize="inherit" />
              </Avatar>

              <Typography
                variant="h5"
                fontWeight={900}
                sx={{
                  mt: 2,
                  color: "#171925",
                }}
              >
                {username}
              </Typography>

              <Typography
                color="text.secondary"
                sx={{ mb: 2 }}
              >
                {user?.email}
              </Typography>

              <Box
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 1,
                  px: 1.5,
                  py: 0.7,
                  borderRadius: 3,
                  backgroundColor: "#f0ebff",
                  color: "#6335db",
                  fontWeight: 800,
                  fontSize: 13,
                  textTransform: "capitalize",
                }}
              >
                <SecurityRoundedIcon fontSize="small" />
                {role}
              </Box>

              <Divider sx={{ my: 3 }} />

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ lineHeight: 1.8 }}
              >
                Your profile contains the account
                information used by the Offline-First
                Data Synchronization System.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Account Settings */}
        <Grid size={{ xs: 12, md: 7 }}>
          <Card
            sx={{
              borderRadius: 4,
              border: "1px solid #eaecf2",
            }}
          >
            <CardContent sx={{ p: { xs: 3, md: 4 } }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  mb: 3,
                }}
              >
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: 2.5,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#ffffff",
                    background:
                      "linear-gradient(135deg,#5b2be0,#8f5cff)",
                  }}
                >
                  <PersonRoundedIcon />
                </Box>

                <Box>
                  <Typography
                    fontWeight={900}
                    fontSize={19}
                  >
                    Account Information
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    Update your account details.
                  </Typography>
                </Box>
              </Box>

              {profileMessage && (
                <Alert
                  severity="success"
                  sx={{ mb: 2 }}
                >
                  {profileMessage}
                </Alert>
              )}

              {profileError && (
                <Alert
                  severity="error"
                  sx={{ mb: 2 }}
                >
                  {profileError}
                </Alert>
              )}

              <Box
                component="form"
                onSubmit={handleProfileUpdate}
              >
                <TextField
                  fullWidth
                  label="Username"
                  value={username}
                  disabled
                  sx={{ mb: 2 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonRoundedIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  fullWidth
                  label="Email Address"
                  type="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  required
                  sx={{ mb: 2.5 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailRoundedIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                />

                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<SaveRoundedIcon />}
                  disabled={profileLoading}
                  sx={{
                    px: 3,
                    py: 1.2,
                    borderRadius: 2.5,
                    fontWeight: 800,
                    background:
                      "linear-gradient(135deg,#5b2be0,#7c4dff)",
                    boxShadow:
                      "0 8px 20px rgba(91,43,224,.25)",
                    "&:hover": {
                      background:
                        "linear-gradient(135deg,#4c21c7,#693ee8)",
                    },
                  }}
                >
                  {profileLoading
                    ? "Saving..."
                    : "Save Changes"}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Change Password */}
        <Grid size={{ xs: 12 }}>
          <Card
            sx={{
              borderRadius: 4,
              border: "1px solid #eaecf2",
            }}
          >
            <CardContent sx={{ p: { xs: 3, md: 4 } }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  mb: 3,
                }}
              >
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: 2.5,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#ffffff",
                    background:
                      "linear-gradient(135deg,#0084ff,#00c6ff)",
                  }}
                >
                  <KeyRoundedIcon />
                </Box>

                <Box>
                  <Typography
                    fontWeight={900}
                    fontSize={19}
                  >
                    Change Password
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    Keep your account secure with a
                    strong password.
                  </Typography>
                </Box>
              </Box>

              {passwordMessage && (
                <Alert
                  severity="success"
                  sx={{ mb: 2 }}
                >
                  {passwordMessage}
                </Alert>
              )}

              {passwordError && (
                <Alert
                  severity="error"
                  sx={{ mb: 2 }}
                >
                  {passwordError}
                </Alert>
              )}

              <Box
                component="form"
                onSubmit={handlePasswordChange}
              >
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <TextField
                      fullWidth
                      label="Current Password"
                      type="password"
                      value={currentPassword}
                      onChange={(event) =>
                        setCurrentPassword(
                          event.target.value
                        )
                      }
                      required
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockRoundedIcon color="action" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, md: 4 }}>
                    <TextField
                      fullWidth
                      label="New Password"
                      type="password"
                      value={newPassword}
                      onChange={(event) =>
                        setNewPassword(
                          event.target.value
                        )
                      }
                      required
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockRoundedIcon color="action" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, md: 4 }}>
                    <TextField
                      fullWidth
                      label="Confirm New Password"
                      type="password"
                      value={confirmPassword}
                      onChange={(event) =>
                        setConfirmPassword(
                          event.target.value
                        )
                      }
                      required
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockRoundedIcon color="action" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                </Grid>

                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<KeyRoundedIcon />}
                  disabled={passwordLoading}
                  sx={{
                    mt: 3,
                    px: 3,
                    py: 1.2,
                    borderRadius: 2.5,
                    fontWeight: 800,
                    background:
                      "linear-gradient(135deg,#0084ff,#00b8d9)",
                    boxShadow:
                      "0 8px 20px rgba(0,132,255,.22)",
                    "&:hover": {
                      background:
                        "linear-gradient(135deg,#006fd6,#009bb8)",
                    },
                  }}
                >
                  {passwordLoading
                    ? "Updating..."
                    : "Change Password"}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}