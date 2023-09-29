export const getShortText = (text?: string, maxLength: number = 100) => {
  if (!text) return "";
  if (text.length < maxLength) return text;
  return text.slice(0, maxLength - 3) + "...";
};
