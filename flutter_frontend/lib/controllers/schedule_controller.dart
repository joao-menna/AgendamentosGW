import 'package:flutter_frontend/classes/block.dart';
import 'package:flutter_frontend/classes/class_resource.dart';
import 'package:flutter_frontend/classes/hour.dart';
import 'package:flutter_frontend/classes/klass.dart';
import 'package:flutter_frontend/classes/outputs/schedules_output.dart';
import 'package:flutter_frontend/classes/resource.dart';
import 'package:get/get.dart';

class ScheduleController extends GetxController {
  static ScheduleController get to => Get.find();

  var blocks = <Block>[].obs;
  var schedules = <SchedulesOutput>[].obs;
  var hours = <Hour>[].obs;
  var classes = <Klass>[].obs;
  var resources = <Resource>[].obs;
  var classResources = <ClassResource>[].obs;
}
