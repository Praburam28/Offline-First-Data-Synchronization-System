export interface RecordItem {
  id: string;
  owner_id: number;
  title: string;
  content: string;
  version: number;
  updated_at: string;
  deleted: boolean;
}

export interface RecordCreate {
  id?: string;
  title: string;
  content: string;
}

export interface RecordUpdate {
  title?: string;
  content?: string;
  version: number;
}

export interface RecordListResponse {
  items: RecordItem[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}