export function truncateMiddle(text?: string, length: number = 9) {
  if (!text) return "";
  if (text?.length > length * 2 + 1) {
    return `${text.slice(0, length)}...${text.slice(-length)}`;
  } else {
    return text;
  }
}
