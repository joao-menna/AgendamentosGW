class ClassResource {
  int id;
  final int classId;
  final int resourceId;
  final String createdAt;
  final String updatedAt;

  ClassResource({
    this.id = 0,
    required this.classId,
    required this.resourceId,
    required this.createdAt,
    required this.updatedAt,
  });

  factory ClassResource.fromJson(Map<String, dynamic> json) {
    return switch (json) {
      {
        "id": int id,
        "classId": int classId,
        "resourceId": int resourceId,
        "createdAt": String createdAt,
        "updatedAt": String updatedAt,
      } =>
        ClassResource(
          id: id,
          classId: classId,
          resourceId: resourceId,
          createdAt: createdAt,
          updatedAt: updatedAt,
        ),
      _ => throw const FormatException("ClassResource: wrong format"),
    };
  }
}
