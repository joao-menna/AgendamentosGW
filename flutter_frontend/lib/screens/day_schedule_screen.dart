import 'package:calendar_view/calendar_view.dart';
import 'package:flutter/material.dart';
import 'package:flutter_frontend/api/schedules_api.dart';
import 'package:flutter_frontend/constants/schedule_colors.dart';
import 'package:flutter_frontend/controllers/schedule_controller.dart';
import 'package:flutter_frontend/controllers/user_controller.dart';
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

  Future<void> _removeEvent(
    String name,
    DateTime date,
    DateTime startTime,
    DateTime endTime,
  ) async {
    final splitted = name.split(" - ");

    final klass = ScheduleController.to.classes.firstWhere(
      (k) => k.name == splitted[0],
    );

    final resource = ScheduleController.to.resources.firstWhere(
      (r) => r.name == splitted[1],
    );

    if (UserController.to.type.value == "common" &&
        klass.teacherId != UserController.to.id.value) {
      const snackBar = SnackBar(
        content: Text(
          "Você não tem permissão para remover esse agendamento",
        ),
      );

      ScaffoldMessenger.of(context).showSnackBar(snackBar);
      return;
    }

    final newStartTime = startTime;
    final newEndTime = endTime;

    if (klass.period == "vespertine") {
      const duration = Duration(hours: 6);

      newStartTime.subtract(duration);
      newEndTime.subtract(duration);
    }

    final hour = ScheduleController.to.hours.firstWhere(
      (h) =>
          h.start == formatTimeWithoutSeconds(newStartTime) &&
          h.finish == formatTimeWithoutSeconds(newEndTime),
    );

    final schedule = ScheduleController.to.schedules.firstWhere(
      (so) =>
          so.classResource.classId == klass.id &&
          so.classResource.resourceId == resource.id &&
          so.hourClass.hourId == hour.id &&
          so.hourClass.date == date.toIso8601String().split("T")[0],
    );

    final token = UserController.to.token.value;
    final schedulesApi = SchedulesApi(token: token);

    try {
      await schedulesApi.deleteOne(schedule.hourClass.id!);
    } catch (err) {
      const snackBar = SnackBar(
        content: Text("Não foi possível desmarcar o agendamento"),
      );

      ScaffoldMessenger.of(context).showSnackBar(snackBar);
      return;
    }

    CalendarControllerProvider.of(context).controller.removeWhere(
          (ev) =>
              ev.date == date &&
              ev.startTime == startTime &&
              ev.endTime == endTime &&
              ev.color == scheduleColor,
        );
  }

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
        onEventTap: (events, date) {
          showDialog(
            context: context,
            builder: (context) {
              return Dialog(
                child: Padding(
                  padding: const EdgeInsets.all(8.0),
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Text("Nome: ${events[0].title}"),
                      const SizedBox(
                        height: 8.0,
                      ),
                      ElevatedButton(
                        onPressed: () async {
                          await _removeEvent(
                            events[0].title,
                            events[0].date,
                            events[0].startTime!,
                            events[0].endTime!,
                          );

                          Navigator.of(context).pop();
                        },
                        child: const Text("Desmarcar"),
                      ),
                    ],
                  ),
                ),
              );
            },
          );
        },
      ),
    );
  }
}
