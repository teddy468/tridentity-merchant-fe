import { AxiosError, AxiosResponse } from "axios";
import { uploadAxios } from "../axios";
import { UPLOAD_FILE_URL } from "../../constants/api-urls";

const handleUploadImageToServer = async (file: string) => {
  const formData = new FormData();
  formData.append("file", file);
  try {
    const result = uploadAxios.post<FormData, AxiosResponse<ImageItem>>(UPLOAD_FILE_URL, formData).then(result1 => {
      if (result1.data.file_url) {
        const url = result1.data.file_url;
        const fileName = url.split("/").pop() || "";
        const fullPath = process.env.REACT_APP_BASE_URL + url;
        return { url, fileName, fullPath };
      } else throw new Error("Upload failed");
    });
    return (await result).url;
  } catch (err: any) {
    const error = (err as AxiosError<any>)?.response?.data;
    const message =
      typeof error?.error.message === "string"
        ? error?.error.message
        : typeof error?.error.message?.[0] === "string"
        ? error.error.message[0]
        : "Upload failed";
    throw new Error(message);
  }
};

export const uploadImageToServer = async (fileListForm: string[] | string) => {
  if (Array.isArray(fileListForm)) {
    const uploadPromises = fileListForm.map(file => handleUploadImageToServer(file));
    return await Promise.all(uploadPromises);
  } else {
    return await handleUploadImageToServer(fileListForm);
  }
};
