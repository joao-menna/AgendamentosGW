import 'package:get/get.dart';

class UserController extends GetxController {
  static UserController get to => Get.find();

  var id = 0.obs;
  var token = "".obs;
  var type = "common".obs;
}
