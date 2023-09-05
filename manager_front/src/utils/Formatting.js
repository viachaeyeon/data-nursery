// 금액 , 찍기
export function NumberCommaFormatting(number) {
  const formatter = Intl.NumberFormat("ko-KR");
  return formatter.format(number);
}

// 단위
export function NumberUnitFormatting(number) {
  let format_number = number;

  // 100이상 1.00M
  if (number >= 1000000) {
    format_number = Math.floor(number * 0.000001 * 100) / 100;

    return format_number + "M";
  }
  // 1000이상 1.00K
  else if (number >= 1000) {
    format_number = Math.floor(number * 0.001 * 100) / 100;

    return format_number + "K";
  } else {
    return number;
  }
}

//99999 넘으면 +표시 , 3자리수마다 comma 표시
export function CountPlusFormatting(number) {
  if (number > 99999) {
    return "99,999+";
  } else if (number <= 99999) {
    const formatter = Intl.NumberFormat("ko-KR");
    return formatter.format(number);
  }
}

//날짜 0000/00/00 형식으로
export function YYYYMMDDSlash(dateString) {
  const options = { year: "numeric", month: "2-digit", day: "2-digit" };
  const date = new Date(dateString);
  return date
    .toLocaleDateString(undefined, options)
    .replace(/. /g, "/")
    .slice(0, 10);
}
