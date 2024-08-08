import 'package:calendar_view/calendar_view.dart';
import 'package:flutter/material.dart';
import 'package:flutter_frontend/functions/format_date.dart';
import 'package:flutter_frontend/screens/add_schedule_screen.dart';
import 'package:get/get.dart';

class DayScheduleScreen extends StatefulWidget {
  const DayScheduleScreen({super.key, required this.date});

  final DateTime date;

  @override
  State<DayScheduleScreen> createState() => _DayScheduleScreenState();
}

class _DayScheduleScreenState extends State<DayScheduleScreen> {
  late DateTime currentDate;

  @override
  void initState() {
    super.initState();

    currentDate = widget.date;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        actions: [
          Padding(
            padding: const EdgeInsets.all(8.0),
            child: IconButton(
              icon: const Icon(Icons.add_circle_outline_outlined),
              onPressed: () {
                Get.to(() => AddScheduleScreen(date: currentDate));
              },
            ),
          )
        ],
      ),
      body: DayView(
        keepScrollOffset: true,
        startHour: 7,
        endHour: 18,
        initialDay: widget.date,
        heightPerMinute: 1.2,
        showHalfHours: true,
        timeStringBuilder: (date, {secondaryDate}) {
          return formatTimeWithoutSeconds(date);
        },
        onPageChange: (date, page) {
          setState(() {
            currentDate = date;
          });
        },
      ),
    );
  }
}
