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

export function DateFormatting(date) {
  // 날짜 옵션
  const options = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    weekday: "short",
    timeZone: "Asia/Seoul",
    calendar: "korean",
  };

  if (!!date) {
    const changeDate = new Intl.DateTimeFormat("ko-KR", options).format(new Date(date)).replaceAll(".", "/").split(" ");
    return changeDate[0] + changeDate[1] + changeDate[2].replace("/", " ") + changeDate[3];
  }
}
