class Resource {
  int id;
  final String name;
  final String createdAt;
  final String updatedAt;

  Resource({
    this.id = 0,
    required this.name,
    required this.createdAt,
    required this.updatedAt,
  });

  factory Resource.fromJson(Map<String, dynamic> json) {
    return switch (json) {
      {
        "id": int id,
        "name": String name,
        "createdAt": String createdAt,
        "updatedAt": String updatedAt,
      } =>
        Resource(
          id: id,
          name: name,
          createdAt: createdAt,
          updatedAt: updatedAt,
        ),
      _ => throw const FormatException("Resource: wrong format"),
    };
  }
}
