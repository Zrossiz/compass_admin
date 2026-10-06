export type PaginatedResult<T> = {
  items: T[];
  totalPages: number;
  curPage: number;
};
