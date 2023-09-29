import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(utc);
dayjs.extend(relativeTime);

export const getDiffTime = (value: string) => dayjs(value).fromNow().replace("a few seconds ago", "Now");

export { dayjs };
