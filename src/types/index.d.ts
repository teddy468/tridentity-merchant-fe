type FormListOperation = import("antd").FormListOperation;

declare interface StringObject {
  [key: string]: string;
}

declare interface MixObject {
  [key: string]: any;
}

declare type Dayjs = import("dayjs").Dayjs;

declare interface Query {
  [key: string]: string | number | boolean | undefined;
}
interface Params extends PaginationQuery {
  [key: string]: string | number | boolean | undefined;
}

interface FetchReturnType<T> {
  data: T[];
  loading: boolean;
  error: string | null;
  initialized: boolean;
  total: number;
  refresh: () => void;
  update: (data: T[] | UpdateParams<T>) => void;
}

declare interface ISocialMedia {
  icon: JSX.Element;
  link: string;
  name: string;
}

declare interface FormListOperationCustom<T = any> extends FormListOperation {
  add: (defaultValue?: T, insertIndex?: number) => void;
}
