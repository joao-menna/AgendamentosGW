import 'package:flutter/material.dart';
import 'package:flutter_frontend/screens/login_screen.dart';
import 'package:get/get.dart';

void main() {
  runApp(const MainApp());
}

class MainApp extends StatelessWidget {
  const MainApp({super.key});

  @override
  Widget build(BuildContext context) {
    return GetMaterialApp(
      theme: ThemeData.from(
        colorScheme: ColorScheme.light(
          primary: Colors.blue[800]!,
        ),
      ),
      home: const LoginScreen(),
    );
  }
}
