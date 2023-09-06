export function NumberFormatting(number) {
  const formatter = Intl.NumberFormat("ko-KR");
  return formatter.format(number);
}

export function ImagePathCheck(imagePath) {
  const path = imagePath?.match(/^https?:\/\/[^/]*(\/[^?#]*)/i);

  if (path) {
    return imagePath;
  } else {
    return process.env.NEXT_PUBLIC_END_POINT + imagePath;
  }
}
