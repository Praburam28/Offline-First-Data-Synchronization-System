import api from "./api";
import type {
  RecordCreate,
  RecordItem,
  RecordListResponse,
  RecordUpdate,
} from "../types/record";

export async function createRecord(
  data: RecordCreate
): Promise<RecordItem> {
  const response = await api.post<RecordItem>(
    "/records",
    data
  );

  return response.data;
}

export async function getRecords(
  page = 1,
  pageSize = 20,
  search = "",
  includeDeleted = false
): Promise<RecordListResponse> {
  const response =
    await api.get<RecordListResponse>("/records", {
      params: {
        page,
        page_size: pageSize,
        search: search || undefined,
        include_deleted: includeDeleted,
      },
    });

  return response.data;
}

export async function getRecord(
  recordId: string
): Promise<RecordItem> {
  const response = await api.get<RecordItem>(
    `/records/${recordId}`
  );

  return response.data;
}

export async function updateRecord(
  recordId: string,
  data: RecordUpdate
): Promise<RecordItem> {
  const response = await api.put<RecordItem>(
    `/records/${recordId}`,
    data
  );

  return response.data;
}

export async function deleteRecord(
  recordId: string,
  version: number
): Promise<RecordItem> {
  const response = await api.delete<RecordItem>(
    `/records/${recordId}`,
    {
      params: {
        version,
      },
    }
  );

  return response.data;
}