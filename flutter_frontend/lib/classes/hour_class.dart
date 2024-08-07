class HourClass {
  final int? id;
  final int hourId;
  final int classResourceId;
  final String date;
  final String createdAt;
  final String updatedAt;

  HourClass({
    this.id,
    required this.hourId,
    required this.classResourceId,
    required this.date,
    required this.createdAt,
    required this.updatedAt,
  });

  factory HourClass.fromJson(Map<String, dynamic> json) {
    return switch (json) {
      {
        "id": int id,
        "hourId": int hourId,
        "classResourceId": int classResourceId,
        "date": String date,
        "createdAt": String createdAt,
        "updatedAt": String updatedAt,
      } =>
        HourClass(
          id: id,
          hourId: hourId,
          classResourceId: classResourceId,
          date: date,
          createdAt: createdAt,
          updatedAt: updatedAt,
        ),
      _ => throw const FormatException("HourClass: wrong format"),
    };
  }
}
