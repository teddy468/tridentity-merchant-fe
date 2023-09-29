import { UploadFile } from "antd";
import { BASE_URL } from "../../constants";

export const getImage = (url?: string) => {
  return `${BASE_URL}/api/image/${url}`;
};
export const getThumbnail = (url?: string, width: number = 100, height: number = width) => {
  return `${BASE_URL}/api/image/${url}?width=${width}&height=${height}`;
};

export const getUploadFile = (url?: string): UploadFile[] => {
  if (!url) return [];
  return [
    {
      uid: url,
      name: url,
      status: "done",
      url: getImage(url),
      thumbUrl: getThumbnail(url),
    },
  ];
};
