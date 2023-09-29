interface SuccessResponse {
  success: true;
  message: string;
}

interface ErrorExpect {
  success: boolean;
  message: string;
  errors: StringObject;
  error: string;
}

type UpdateParams<T> = (newData: T[]) => T[];
