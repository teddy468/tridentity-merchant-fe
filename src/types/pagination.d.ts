declare type ORDER_BYS = import("../commons/constants/pagination").ORDER_BYS;

declare interface PaginationQuery {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  orderBy?: ORDER_BYS;
}

declare interface Pagination<T> {
  data: T[];
  metadata?: {
    "x-next-page": number;
    "x-page": number;
    "x-per-page": number;
    "x-total-count": number;
    "x-pages-count": number;
  };
}
