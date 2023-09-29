export const createFormData = <T>(data: T & MixObject, fileField: string = "file") => {
  const { [fileField]: files, imageType, ...body } = data;
  const formData = new FormData();
  if (files?.length) {
    for (const file of files) {
      formData.append(fileField, file, file.name || `File-${Math.floor(Math.random() * 10000)}.${imageType || "png"}`);
    }
  }
  for (const field in body) {
    formData.append(field, body[field]);
  }
  return formData;
};
