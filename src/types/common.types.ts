export interface IQueryParams {
  page: number;
  limit: number;
  search?: string;
  sortOrder?: string;
  [key: string]: unknown;
}
