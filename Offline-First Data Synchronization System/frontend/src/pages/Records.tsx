import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import RefreshIcon from "@mui/icons-material/Refresh";

import {
  createRecord,
  deleteRecord,
  getRecords,
  updateRecord,
} from "../services/recordService";

import type {
  RecordCreate,
  RecordItem,
} from "../types/record";

export default function Records() {
  const [records, setRecords] = useState<RecordItem[]>(
    []
  );

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [dialogOpen, setDialogOpen] =
    useState(false);

  const [editingRecord, setEditingRecord] =
    useState<RecordItem | null>(null);

  const [title, setTitle] = useState("");

  const [content, setContent] = useState("");

  const [saving, setSaving] = useState(false);

  async function loadRecords() {
    setLoading(true);
    setError("");

    try {
      const response = await getRecords();

      setRecords(response.items);
    } catch (err: any) {
      setError(
        err.response?.data?.detail ||
          "Unable to load records"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRecords();
  }, []);

  function openCreateDialog() {
    setEditingRecord(null);
    setTitle("");
    setContent("");
    setDialogOpen(true);
  }

  function openEditDialog(record: RecordItem) {
    setEditingRecord(record);
    setTitle(record.title);
    setContent(record.content);
    setDialogOpen(true);
  }

  function closeDialog() {
    if (!saving) {
      setDialogOpen(false);
    }
  }

  async function handleSave() {
    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    setSaving(true);
    setError("");

    try {
      if (editingRecord) {
        await updateRecord(
          editingRecord.id,
          {
            title: title.trim(),
            content,
            version: editingRecord.version,
          }
        );
      } else {
        const data: RecordCreate = {
          title: title.trim(),
          content,
        };

        await createRecord(data);
      }

      setDialogOpen(false);

      await loadRecords();
    } catch (err: any) {
      setError(
        err.response?.data?.detail ||
          "Unable to save record"
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(
    record: RecordItem
  ) {
    const confirmed = window.confirm(
      `Delete "${record.title}"?`
    );

    if (!confirmed) {
      return;
    }

    setError("");

    try {
      await deleteRecord(
        record.id,
        record.version
      );

      await loadRecords();
    } catch (err: any) {
      setError(
        err.response?.data?.detail ||
          "Unable to delete record"
      );
    }
  }

  return (
    <Box sx={{ p: 4 }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Box>
          <Typography
            variant="h4"
            fontWeight={700}
          >
            Records
          </Typography>

          <Typography color="text.secondary">
            Manage your synchronized records
          </Typography>
        </Box>

        <Stack direction="row" spacing={1}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={loadRecords}
            disabled={loading}
          >
            Refresh
          </Button>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={openCreateDialog}
          >
            Create Record
          </Button>
        </Stack>
      </Stack>

      {error && (
        <Alert
          severity="error"
          sx={{ mb: 3 }}
          onClose={() => setError("")}
        >
          {error}
        </Alert>
      )}

      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            py: 8,
          }}
        >
          <CircularProgress />
        </Box>
      ) : records.length === 0 ? (
        <Card>
          <CardContent>
            <Typography
              textAlign="center"
              color="text.secondary"
            >
              No records found.
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Stack spacing={2}>
          {records.map((record) => (
            <Card key={record.id}>
              <CardContent>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="flex-start"
                >
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      variant="h6"
                      fontWeight={600}
                    >
                      {record.title}
                    </Typography>

                    <Typography
                      color="text.secondary"
                      sx={{
                        mt: 1,
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      {record.content}
                    </Typography>

                    <Typography
                      variant="caption"
                      color="text.secondary"
                      display="block"
                      sx={{ mt: 2 }}
                    >
                      Version: {record.version}
                    </Typography>

                    <Typography
                      variant="caption"
                      color="text.secondary"
                      display="block"
                    >
                      Updated:{" "}
                      {new Date(
                        record.updated_at
                      ).toLocaleString()}
                    </Typography>
                  </Box>

                  <Stack direction="row">
                    <IconButton
                      color="primary"
                      onClick={() =>
                        openEditDialog(record)
                      }
                    >
                      <EditIcon />
                    </IconButton>

                    <IconButton
                      color="error"
                      onClick={() =>
                        handleDelete(record)
                      }
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}

      <Dialog
        open={dialogOpen}
        onClose={closeDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          {editingRecord
            ? "Edit Record"
            : "Create Record"}
        </DialogTitle>

        <DialogContent>
          <TextField
            fullWidth
            label="Title"
            value={title}
            onChange={(event) =>
              setTitle(event.target.value)
            }
            margin="normal"
            required
          />

          <TextField
            fullWidth
            label="Content"
            value={content}
            onChange={(event) =>
              setContent(event.target.value)
            }
            margin="normal"
            multiline
            minRows={6}
          />
        </DialogContent>

        <DialogActions>
          <Button
            onClick={closeDialog}
            disabled={saving}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}