class Hour {
  final int id;
  final String start;
  final String finish;
  final int classNumber;
  final String createdAt;
  final String updatedAt;

  Hour({
    this.id = 0,
    required this.start,
    required this.finish,
    required this.classNumber,
    required this.createdAt,
    required this.updatedAt,
  });

  factory Hour.fromJson(Map<String, dynamic> json) {
    return switch (json) {
      {
        "id": int id,
        "start": String start,
        "finish": String finish,
        "classNumber": int classNumber,
        "createdAt": String createdAt,
        "updatedAt": String updatedAt,
      } =>
        Hour(
          id: id,
          start: start,
          finish: finish,
          classNumber: classNumber,
          createdAt: createdAt,
          updatedAt: updatedAt,
        ),
      _ => throw const FormatException("Hour: wrong format")
    };
  }
}
