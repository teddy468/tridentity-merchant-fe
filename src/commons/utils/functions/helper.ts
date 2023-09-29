export const numberInputOnWheelPreventChange = (e: any) => {
  // Prevent the input value change
  e.target.blur();

  // Prevent the page/container scrolling
  e.stopPropagation();

  // Refocus immediately, on the next tick (after the current
  // function is done
  setTimeout(() => {
    e.target.focus();
  }, 0);
};

export function getErroFnc(errors: any, setState: React.Dispatch<React.SetStateAction<boolean>>) {
  const errorFind = errors.find((item: any) => item.errors.length > 0);
  errorFind ? setState(true) : setState(false);
}
