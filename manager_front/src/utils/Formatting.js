// 금액 , 찍기
export function PriceFormatting(number) {
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