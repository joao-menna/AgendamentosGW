import 'package:flutter_frontend/classes/block.dart';
import 'package:flutter_frontend/classes/hour.dart';
import 'package:flutter_frontend/classes/klass.dart';
import 'package:flutter_frontend/classes/resource.dart';
import 'package:get/get.dart';

class ScheduleController extends GetxController {
  static ScheduleController get to => Get.find();

  List<Block> blocks = <Block>[].obs;
  // TODO: change this to schedule type
  List<dynamic> schedules = <dynamic>[].obs;
  List<Hour> hours = <Hour>[].obs;
  List<Klass> classes = <Klass>[].obs;
  List<Resource> resources = <Resource>[].obs;
  // TODO: change this to classResource type
  List<dynamic> classResources = <dynamic>[].obs;
}
