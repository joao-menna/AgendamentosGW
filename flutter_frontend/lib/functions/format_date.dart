String formatMonthDate(DateTime date) {
  final year = date.year;
  final month = addZeroToBack(date.month);

  return "$month/$year";
}

String formatFullDate(DateTime date) {
  final year = date.year;
  final month = addZeroToBack(date.month);
  final day = addZeroToBack(date.day);

  return "$day/$month/$year";
}

String addZeroToBack(int timePart) {
  if (timePart < 10) {
    return "0$timePart";
  }

  return "$timePart";
}
