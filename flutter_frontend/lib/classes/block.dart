class Block {
  final int id;
  final int hourId;
  final String date;
  final String period;
  final String createdAt;
  final String updatedAt;

  Block({
    required this.id,
    required this.hourId,
    required this.date,
    required this.period,
    required this.createdAt,
    required this.updatedAt,
  });

  factory Block.fromJson(Map<String, dynamic> json) {
    return switch (json) {
      {
        "id": int id,
        "hourId": int hourId,
        "date": String date,
        "period": String period,
        "createdAt": String createdAt,
        "updatedAt": String updatedAt,
      } =>
        Block(
          id: id,
          hourId: hourId,
          date: date,
          period: period,
          createdAt: createdAt,
          updatedAt: updatedAt,
        ),
      _ => throw const FormatException("Block: wrong format")
    };
  }
}
