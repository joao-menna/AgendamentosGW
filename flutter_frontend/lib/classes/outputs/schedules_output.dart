import 'package:flutter_frontend/classes/class_resource.dart';
import 'package:flutter_frontend/classes/hour_class.dart';
import 'package:flutter_frontend/classes/klass.dart';

class SchedulesOutput {
  final HourClass hourClass;
  final ClassResource classResource;
  final Klass klass;

  SchedulesOutput({
    required this.hourClass,
    required this.classResource,
    required this.klass,
  });

  factory SchedulesOutput.fromJson(Map<String, dynamic> json) {
    return switch (json) {
      {
        "hour_class": Map<String, dynamic> hourClass,
        "class_resource": Map<String, dynamic> classResource,
        "class": Map<String, dynamic> klass,
      } =>
        SchedulesOutput(
          hourClass: HourClass.fromJson(hourClass),
          classResource: ClassResource.fromJson(classResource),
          klass: Klass.fromJson(klass),
        ),
      _ => throw const FormatException("SchedulesOutput: wrong format"),
    };
  }
}
