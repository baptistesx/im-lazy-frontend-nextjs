export function capitalizeFirstLetter(string: string | undefined) {
  if (string === undefined) {
    return "";
  }

  return string.charAt(0).toUpperCase() + string.slice(1);
}
