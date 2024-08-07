import 'package:calendar_view/calendar_view.dart';
import 'package:flutter/material.dart';
import 'package:flutter_frontend/api/blocks_api.dart';
import 'package:flutter_frontend/api/classes_api.dart';
import 'package:flutter_frontend/api/hours_api.dart';
import 'package:flutter_frontend/api/resources_api.dart';
import 'package:flutter_frontend/api/schedules_api.dart';
import 'package:flutter_frontend/classes/class_resource.dart';
import 'package:flutter_frontend/controllers/schedule_controller.dart';
import 'package:flutter_frontend/controllers/user_controller.dart';
import 'package:flutter_frontend/functions/format_date.dart';
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

    final token = UserController.to.token.value;
    final blocksApi = BlocksApi(token: token);
    final schedulesApi = SchedulesApi(token: token);
    final hoursApi = HoursApi(token: token);
    final classesApi = ClassesApi(token: token);
    final resourcesApi = ResourcesApi(token: token);

    final blocks = (await blocksApi.getAll());
    final schedules = (await schedulesApi.getAll());
    final hours = (await hoursApi.getAll());
    final classes = (await classesApi.getAll());
    final resources = (await resourcesApi.getAll());

    ScheduleController.to.blocks = blocks.obs;
    ScheduleController.to.schedules = schedules.obs;
    ScheduleController.to.hours = hours.obs;
    ScheduleController.to.classes = classes.obs;
    ScheduleController.to.resources = resources.obs;

    final allResources = <ClassResource>[];
    for (final klass in classes) {
      final allResourcesFromClass = await classesApi.getAllResource(klass.id);

      allResources.addAll(allResourcesFromClass);
    }

    ScheduleController.to.classResources = allResources.obs;

    for (final schedule in schedules) {
      final resourceUsed = resources.singleWhere(
        (resource) => resource.id == schedule.classResource.resourceId,
      );
      final hourUsed = hours.singleWhere(
        (hour) => hour.id == schedule.hourClass.hourId,
      );

      final date = DateTime.parse(schedule.hourClass.date);
      final startTime = DateTime.parse("$date ${hourUsed.start}:00");
      final endTime = DateTime.parse("$date ${hourUsed.finish}:00");

      final event = CalendarEventData(
        title: "${schedule.klass.name} - ${resourceUsed.name}",
        date: date,
        startTime: startTime,
        endTime: endTime,
      );

      CalendarControllerProvider.of(context).controller.add(event);
    }
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
