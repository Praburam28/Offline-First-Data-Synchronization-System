import api from "./api";

export interface SyncHistoryItem {
  id: number;
  sync_id: string;
  record_id: string;
  operation: string;
  status: string;
  error_details: string | null;
  conflict_status: string;
  timestamp: string;
}

export interface SyncBatchOperation {
  sync_id: string;
  record_id: string;
  operation: "create" | "update" | "delete";
  client_version: number;
  payload: Record<string, unknown>;
  client_timestamp?: string | null;
}

export interface SyncBatchResponse {
  results: Array<{
    sync_id: string;
    record_id: string;
    status: string;
    conflict_status: string;
    message: string;
    server_version: number | null;
    error_details: string | null;
  }>;
  total_operations: number;
  successful: number;
  failed: number;
  conflicts: number;
}

export async function getSyncHistory(
  page = 1,
  pageSize = 20,
  syncStatus?: string,
  conflictStatus?: string
): Promise<SyncHistoryItem[]> {
  const response = await api.get<SyncHistoryItem[]>(
    "/sync/history",
    {
      params: {
        page,
        page_size: pageSize,
        status: syncStatus || undefined,
        conflict_status:
          conflictStatus || undefined,
      },
    }
  );

  return response.data;
}

export async function synchronizeBatch(
  operations: SyncBatchOperation[]
): Promise<SyncBatchResponse> {
  const response =
    await api.post<SyncBatchResponse>(
      "/sync/batch",
      {
        operations,
      }
    );

  return response.data;
}
