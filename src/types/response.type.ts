export interface IMeta {
  totalItems?: number;
  itemCount?: number;
  itemsPerPage?: number;
  totalPages?: number;
  currentPage?: number;
}

export interface IResponseSuccess {
  statusCode: number;
  success: boolean;
  message: string;
  data: unknown;
  meta?: IMeta;
}

export interface IGenericErrorResponse {
  statusCode: number;
  message: string;
  errorMessages: string[] | string;
  success: boolean; //* ADD THIS PROPERTY
  timestamp?: string;
  path?: string;
}

export interface IGenericResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T; // This is the actual array/object you want
}