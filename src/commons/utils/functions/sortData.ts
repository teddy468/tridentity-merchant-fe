import moment from "moment";

export function sortDate(a: Date | string, b: Date | string) {
  console.log(a, b);
  return moment(a, "DD-MM-YYYY").unix() - moment(b, "DD-MM-YYYY").unix();
}

export function sortNumber(a: number, b: number) {
  return a - b;
}

export function sortString(a: string, b: string) {
  return a.localeCompare(b);
}

export function sortDateInSecond(a: Date | string, b: Date | string) {
  return moment(a, "DD-MM-YYYY HH:mm:ss").unix() - moment(b, "DD-MM-YYYY HH:mm:ss").unix();
}
