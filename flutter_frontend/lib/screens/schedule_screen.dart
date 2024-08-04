import 'package:flutter/material.dart';
import 'package:flutter_frontend/constants/shared_preferences.dart';
import 'package:flutter_frontend/widgets/app_drawer.dart';
import 'package:shared_preferences/shared_preferences.dart';

class ScheduleScreen extends StatefulWidget {
  const ScheduleScreen({super.key});

  @override
  State<ScheduleScreen> createState() => _ScheduleScreenState();
}

class _ScheduleScreenState extends State<ScheduleScreen> {
  var _isAdmin = false;

  Future<void> loadPrefs() async {
    var prefs = await SharedPreferences.getInstance();

    setState(() {
      _isAdmin = prefs.getBool(isAdminKey) ?? false;
    });
  }

  @override
  void initState() {
    super.initState();

    loadPrefs();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Agendamentos GW"),
      ),
      drawer: AppDrawer(
        isAdmin: _isAdmin,
      ),
      body: const Placeholder(),
    );
  }
}
