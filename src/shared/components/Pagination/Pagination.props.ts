export type PaginationProps = {
  totalPages: number;
  curPage: number;
  onPageChange: (page: number) => void;
  disabled?: boolean;
};
