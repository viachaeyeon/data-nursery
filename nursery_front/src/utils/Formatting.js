export function NumberFormatting(number) {
  const formatter = Intl.NumberFormat("ko-KR");
  return formatter.format(number);
}
