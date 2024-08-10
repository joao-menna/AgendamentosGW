import 'package:calendar_view/calendar_view.dart';
import 'package:flutter/material.dart';
import 'package:flutter_frontend/api/blocks_api.dart';
import 'package:flutter_frontend/api/classes_api.dart';
import 'package:flutter_frontend/api/hours_api.dart';
import 'package:flutter_frontend/api/resources_api.dart';
import 'package:flutter_frontend/api/schedules_api.dart';
import 'package:flutter_frontend/classes/class_resource.dart';
import 'package:flutter_frontend/constants/schedule_colors.dart';
import 'package:flutter_frontend/controllers/schedule_controller.dart';
import 'package:flutter_frontend/controllers/user_controller.dart';

Future<void> reloadEvents(BuildContext context) async {
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

  classes.sort((a, b) => a.name.compareTo(b.name));
  resources.sort((a, b) => a.name.compareTo(b.name));

  ScheduleController.to.blocks.value = blocks;
  ScheduleController.to.schedules.value = schedules;
  ScheduleController.to.hours.value = hours;
  ScheduleController.to.classes.value = classes;
  ScheduleController.to.resources.value = resources;

  final allResources = <ClassResource>[];
  for (final klass in classes) {
    final allResourcesFromClass = await classesApi.getAllResource(klass.id);

    allResources.addAll(allResourcesFromClass);
  }

  ScheduleController.to.classResources.value = allResources;

  for (final schedule in schedules) {
    final resourceUsed = resources.singleWhere(
      (resource) => resource.id == schedule.classResource.resourceId,
    );
    final hourUsed = hours.singleWhere(
      (hour) => hour.id == schedule.hourClass.hourId,
    );

    final date = DateTime.parse(schedule.hourClass.date);
    final dateStr = date.toIso8601String().split("T")[0];
    DateTime startTime = DateTime.parse("$dateStr ${hourUsed.start}:00");
    DateTime endTime = DateTime.parse("$dateStr ${hourUsed.finish}:00");

    if (schedule.klass.period == "vespertine") {
      const duration = Duration(hours: 6);

      startTime = startTime.add(duration);
      endTime = endTime.add(duration);
    }

    addEvent(
      context,
      "${schedule.klass.name} - ${resourceUsed.name}",
      date,
      startTime,
      endTime,
      scheduleColor,
    );
  }

  for (final block in blocks) {
    final hourUsed = hours.singleWhere(
      (hour) => hour.id == block.hourId,
    );

    final date = DateTime.parse(block.date);
    final dateStr = date.toIso8601String().split("T")[0];
    DateTime startTime = DateTime.parse("$dateStr ${hourUsed.start}:00");
    DateTime endTime = DateTime.parse("$dateStr ${hourUsed.finish}:00");

    if (block.period == "vespertine") {
      const duration = Duration(hours: 6);

      startTime = startTime.add(duration);
      endTime = endTime.add(duration);
    }

    addEvent(
      context,
      "Bloqueado",
      date,
      startTime,
      endTime,
      blockColor,
    );
  }
}

void addEvent(
  BuildContext context,
  String title,
  DateTime date,
  DateTime startTime,
  DateTime endTime,
  Color color,
) {
  final event = CalendarEventData(
    title: title,
    date: date,
    startTime: startTime,
    endTime: endTime,
    color: color,
  );

  CalendarControllerProvider.of(context).controller.add(event);
}
