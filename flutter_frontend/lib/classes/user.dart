class User {
  int id;
  final String name;
  final String email;
  final String type;
  final DateTime? createdAt;
  final DateTime? updatedAt;

  User({
    this.id = 0,
    this.type = "common",
    required this.name,
    required this.email,
    this.createdAt,
    this.updatedAt,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    return switch (json) {
      {
        "id": int id,
        "name": String name,
        "type": String type,
        "email": String email,
        "createdAt": String createdAt,
        "updatedAt": String updatedAt,
      } =>
        User(
          id: id,
          name: name,
          email: email,
          type: type,
          createdAt: DateTime.parse(createdAt),
          updatedAt: DateTime.parse(updatedAt),
        ),
      {
        "id": int id,
        "name": String name,
        "type": String type,
        "email": String email,
      } =>
        User(
          id: id,
          name: name,
          type: type,
          email: email,
        ),
      _ => throw const FormatException("User: wrong format"),
    };
  }
}
