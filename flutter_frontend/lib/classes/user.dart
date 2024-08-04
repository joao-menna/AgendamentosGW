class User {
  int id;
  final String name;
  final String email;
  final String type;
  final String createdAt;
  final String updatedAt;

  User({
    this.id = 0,
    required this.name,
    required this.email,
    required this.type,
    required this.createdAt,
    required this.updatedAt,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    return switch (json) {
      {
        "id": int id,
        "name": String name,
        "email": String email,
        "type": String type,
        "createdAt": String createdAt,
        "updatedAt": String updatedAt,
      } =>
        User(
          id: id,
          name: name,
          email: email,
          type: type,
          createdAt: createdAt,
          updatedAt: updatedAt,
        ),
      _ => throw const FormatException("User: wrong format"),
    };
  }
}
