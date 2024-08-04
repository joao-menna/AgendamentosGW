import 'package:calendar_view/calendar_view.dart';
import 'package:flutter/material.dart';
import 'package:flutter_frontend/constants/shared_preferences.dart';
import 'package:flutter_frontend/functions/format_date.dart';
import 'package:flutter_frontend/screens/day_schedule_screen.dart';
import 'package:flutter_frontend/widgets/app_drawer.dart';
import 'package:get/get.dart';
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
      body: Padding(
        padding: const EdgeInsets.all(8.0),
        child: MonthView(
          headerStringBuilder: (date, {secondaryDate}) => formatMonthDate(date),
          startDay: WeekDays.sunday,
          weekDayStringBuilder: (day) {
            return switch (day) {
              0 => "Seg",
              1 => "Ter",
              2 => "Qua",
              3 => "Qui",
              4 => "Sex",
              5 => "Sab",
              6 => "Dom",
              _ => "",
            };
          },
          onCellTap: (events, date) {
            Get.to(() => DayScheduleScreen(date: date));
          },
        ),
      ),
    );
  }
}
