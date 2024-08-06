import 'package:calendar_view/calendar_view.dart';
import 'package:flutter/material.dart';
import 'package:flutter_frontend/controllers/schedule_controller.dart';
import 'package:flutter_frontend/controllers/user_controller.dart';
import 'package:flutter_frontend/screens/login_screen.dart';
import 'package:get/get.dart';

void main() {
  runApp(const MainApp());
}

class MainApp extends StatelessWidget {
  const MainApp({super.key});

  @override
  Widget build(BuildContext context) {
    Get.put(UserController());
    Get.put(ScheduleController());

    return CalendarControllerProvider(
      controller: EventController(),
      child: GetMaterialApp(
        locale: const Locale("pt", "BR"),
        debugShowCheckedModeBanner: false,
        theme: ThemeData.from(
          colorScheme: ColorScheme.light(
            primary: Colors.blue[800]!,
          ),
        ),
        home: const LoginScreen(),
      ),
    );
  }
}
