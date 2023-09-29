export const createGradient = (
  deg: number,
  startColor: string,
  endColor: string,
  start: number = 0,
  end: number = 100
): string => {
  return `linear-gradient(${deg}deg, ${startColor} ${start}%, ${endColor} ${end}%)`;
};
export const primaryGradient = createGradient(94.22, "#FDCD9D", "#F7EF82");
const primary = {
  A100: "#E3F1EC",
  50: "#C6E3D8",
  100: "#AAD6C5",
  200: "#8DC8B2",
  A200: "#8DC8B2",
  300: "#71BA9F",
  400: "#54AC8B",
  A400: "#54AC8B",
  500: "#469175",
  600: "#38745E",
  700: "#2B5847",
  800: "#1D3B30",
  900: "#0F1F19",
  A700: "#0C3A38",
};

const secondary = {
  A100: "#FEFDF0",
  50: "#FDFBE1",
  100: "#FCF9D2",
  200: "#FBF7C3",
  A200: "#FBF7C3",
  300: "#FAF5B4",
  400: "#F9F2A6",
  A400: "#F9F2A6",
  500: "#F8F097",
  600: "#F7EE88",
  700: "#F6EC79",
  800: "#F5EA6A",
  900: "#F4E85B",
  A700: "#F4CB25",
};

const grey = {
  A100: "#F3F3F4",
  50: "#DBDBDE",
  100: "#C3C3C7",
  200: "#ABABB1",
  300: "#93939B",
  400: "#7B7B84",
  500: "#64646C",
  600: "#4E4E54",
  700: "#38383C",
  800: "#212124",
  900: "#0B0B0C",
};

const red = {
  50: "#FEF3F2",
  100: "#FEE4E2",
  200: "#FECDCA",
  300: "#FDA29B",
  500: "#FF3B30",
  600: "#A60901",
  800: "#4D0400",
};

const yellow = {
  50: "#FFFAE5",
  100: "#FFF0B3",
  200: "#FFE680",
  300: "#FFDB4D",
  500: "#F7A609",
  600: "#AC6700",
  800: "#543300",
};
const green = {
  50: "#543300",
  100: "#C2EFCE",
  200: "#9AE5AD",
  300: "#71DA8C",
  500: "#34C759",
  600: "#1A652D",
  800: "#103D1B",
};

const blue = {
  50: "#E5F2FF",
  100: "#B3D7FF",
  200: "#80BCFF",
  300: "#4DA2FF",
  500: "#007AFF",
  600: "#0055B3",
  800: "#00254D",
};

const common = {
  black: "#0B0B0C",
  white: "#FFFFFF",
};

const text = {
  primary: grey[900],
  secondary: grey[500],
  disabled: grey[200],
};

const border = {
  primary: grey[400],
  secondary: grey["A100"],
  disabled: grey[200],
};

const background = {
  paper: common.white,
  default: grey["A100"],
};

const error = {
  light: red[500],
  main: red[600],
  dark: red[800],
  contrastText: red[500],
};
const warning = {
  light: yellow[500],
  main: yellow[600],
  dark: yellow[800],
  contrastText: yellow[500],
};

const info = {
  light: blue[500],
  main: blue[600],
  dark: blue[800],
  contrastText: blue[500],
};

const success = {
  light: green[500],
  main: green[600],
  dark: green[800],
  contrastText: green[500],
};

const palette = {
  primary,
  secondary,
  grey,
  common,
  text,
  background,
  error,
  warning,
  info,
  success,
  border,
  green,
  blue,
  red,
  yellow,
  mode: "light",
};

export default palette;
