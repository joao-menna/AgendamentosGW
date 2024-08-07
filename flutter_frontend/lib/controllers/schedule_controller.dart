import 'package:flutter_frontend/classes/block.dart';
import 'package:flutter_frontend/classes/class_resource.dart';
import 'package:flutter_frontend/classes/hour.dart';
import 'package:flutter_frontend/classes/klass.dart';
import 'package:flutter_frontend/classes/outputs/schedules_output.dart';
import 'package:flutter_frontend/classes/resource.dart';
import 'package:get/get.dart';

class ScheduleController extends GetxController {
  static ScheduleController get to => Get.find();

  List<Block> blocks = <Block>[].obs;
  List<SchedulesOutput> schedules = <SchedulesOutput>[].obs;
  List<Hour> hours = <Hour>[].obs;
  List<Klass> classes = <Klass>[].obs;
  List<Resource> resources = <Resource>[].obs;
  List<ClassResource> classResources = <ClassResource>[].obs;
}
