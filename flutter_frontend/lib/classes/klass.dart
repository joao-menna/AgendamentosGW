class Klass {
  final int id;
  final String name;
  final String period;
  final int teacherId;
  final String createdAt;
  final String updatedAt;

  Klass({
    this.id = 0,
    required this.name,
    required this.period,
    required this.teacherId,
    required this.createdAt,
    required this.updatedAt,
  });

  factory Klass.fromJson(Map<String, dynamic> json) {
    return switch (json) {
      {
        "id": int id,
        "name": String name,
        "period": String period,
        "teacherId": int teacherId,
        "createdAt": String createdAt,
        "updatedAt": String updatedAt,
      } =>
        Klass(
          id: id,
          name: name,
          period: period,
          teacherId: teacherId,
          createdAt: createdAt,
          updatedAt: updatedAt,
        ),
      _ => throw const FormatException("Klass: wrong format")
    };
  }
}
