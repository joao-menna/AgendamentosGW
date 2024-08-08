import 'package:calendar_view/calendar_view.dart';
import 'package:flutter/material.dart';
import 'package:flutter_frontend/controllers/user_controller.dart';
import 'package:flutter_frontend/functions/format_date.dart';
import 'package:flutter_frontend/functions/reload_events.dart';
import 'package:flutter_frontend/screens/day_schedule_screen.dart';
import 'package:flutter_frontend/widgets/app_drawer.dart';
import 'package:get/get.dart';

class ScheduleScreen extends StatefulWidget {
  const ScheduleScreen({super.key});

  @override
  State<ScheduleScreen> createState() => _ScheduleScreenState();
}

class _ScheduleScreenState extends State<ScheduleScreen> {
  var _isAdmin = false;

  Future<void> loadPrefs() async {
    setState(() {
      _isAdmin = ["admin", "owner"].contains(UserController.to.type.value);
    });

    await reloadEvents(context);
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
        actions: [
          Padding(
            padding: const EdgeInsets.all(8.0),
            child: IconButton(
              icon: const Icon(Icons.refresh_outlined),
              onPressed: loadPrefs,
            ),
          ),
        ],
      ),
      drawer: AppDrawer(
        isAdmin: _isAdmin,
      ),
      body: RefreshIndicator(
        onRefresh: loadPrefs,
        child: Padding(
          padding: const EdgeInsets.all(8.0),
          child: MonthView(
            headerStringBuilder: (date, {secondaryDate}) =>
                formatMonthDate(date),
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
      ),
    );
  }
}
