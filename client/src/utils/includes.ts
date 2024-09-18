export default function includes(
  mainString: string,
  subString: string
): boolean {
  return mainString.toLowerCase().includes(subString.toLowerCase());
}
