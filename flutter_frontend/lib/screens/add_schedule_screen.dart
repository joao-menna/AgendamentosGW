import 'package:flutter/material.dart';
import 'package:flutter_frontend/api/schedules_api.dart';
import 'package:flutter_frontend/classes/class_resource.dart';
import 'package:flutter_frontend/classes/klass.dart';
import 'package:flutter_frontend/classes/outputs/schedules_output.dart';
import 'package:flutter_frontend/constants/class_numbers.dart';
import 'package:flutter_frontend/constants/schedule_colors.dart';
import 'package:flutter_frontend/controllers/schedule_controller.dart';
import 'package:flutter_frontend/controllers/user_controller.dart';
import 'package:flutter_frontend/functions/format_date.dart';
import 'package:flutter_frontend/functions/reload_events.dart';
import 'package:get/get.dart';

class AddScheduleScreen extends StatefulWidget {
  const AddScheduleScreen({super.key, required this.date});

  final DateTime date;

  @override
  State<AddScheduleScreen> createState() => _AddScheduleScreenState();
}

class _AddScheduleScreenState extends State<AddScheduleScreen> {
  final _dateTextEditingController = TextEditingController();
  final _resourceTextEditingController = TextEditingController();
  DateTime _date = DateTime.now();
  int? _classResourceId;
  int? _classNumber;
  int? _classId;

  Future<void> _selectDate() async {
    final picked = await showDatePicker(
      context: context,
      firstDate: DateTime.now(),
      lastDate: DateTime.utc(2030, 12, 31),
      initialDate: _date,
    );

    if (picked == null) {
      return;
    }

    _date = picked;
    _dateTextEditingController.text = formatFullDate(_date);
  }

  List<DropdownMenuEntry<int>> _getClassResourcesDropdown() {
    List<ClassResource> classResources =
        ScheduleController.to.classResources.toList();

    classResources.removeWhere(
      (classResource) => classResource.classId != _classId,
    );

    return classResources.map(
      (classResource) {
        final resource = ScheduleController.to.resources.firstWhere(
          (res) => res.id == classResource.resourceId,
        );

        return DropdownMenuEntry<int>(
          value: classResource.id,
          label: resource.name,
        );
      },
    ).toList();
  }

  List<DropdownMenuEntry<int>> _getClassesDropdown() {
    List<Klass> classes = ScheduleController.to.classes.toList();

    if (UserController.to.type.value == "common") {
      var userId = UserController.to.id.value;
      classes.removeWhere((klass) => klass.teacherId != userId);
    }

    return classes.map(
      (klass) {
        return DropdownMenuEntry(value: klass.id, label: klass.name);
      },
    ).toList();
  }

  Future<void> _submitForm() async {
    if (_classResourceId == null || _classNumber == null || _classId == null) {
      const snackBar = SnackBar(
        content: Text("Preencha todos os campos corretamente!"),
      );

      ScaffoldMessenger.of(context).showSnackBar(snackBar);
      return;
    }

    final token = UserController.to.token.value;
    final schedulesApi = SchedulesApi(token: token);

    final date = _date.toIso8601String().split("T")[0];
    final hourId = ScheduleController.to.hours
        .firstWhere(
          (hour) => hour.classNumber == _classNumber,
        )
        .id;
    final classResourceId = _classResourceId!;

    final klass = ScheduleController.to.classes.firstWhere(
      (cl) => cl.id == _classId,
    );

    final classResource = ScheduleController.to.classResources.firstWhere(
      (cr) => cr.id == _classResourceId,
    );

    final block = ScheduleController.to.blocks.firstWhereOrNull(
      (bl) =>
          bl.date == date && bl.hourId == hourId && bl.period == klass.period,
    );

    if (block != null) {
      const snackBar = SnackBar(
        content: Text(
          "Há um bloqueio encontrado para essa data, nessa aula, nesse período",
        ),
      );

      ScaffoldMessenger.of(context).showSnackBar(snackBar);
      return;
    }

    final schedulesOnSameDayHourResource =
        ScheduleController.to.schedules.where(
      (so) =>
          so.hourClass.date == date &&
          so.hourClass.hourId == hourId &&
          so.klass.period == klass.period &&
          so.classResource.resourceId == classResource.resourceId,
    );

    if (schedulesOnSameDayHourResource.isNotEmpty) {
      const snackBar = SnackBar(
        content: Text(
          "Já existe agendamentos desse recurso para esse dia e horário",
        ),
      );

      ScaffoldMessenger.of(context).showSnackBar(snackBar);
      return;
    }

    late final SchedulesOutput schedule;

    try {
      final hourClass = await schedulesApi.insertOne(
        date,
        hourId,
        classResourceId,
      );

      schedule = SchedulesOutput(
        hourClass: hourClass,
        classResource: classResource,
        klass: klass,
      );
    } catch (err) {
      const snackBar = SnackBar(
        content: Text("Não foi possível concluir a operação"),
      );

      ScaffoldMessenger.of(context).showSnackBar(snackBar);
      return;
    }

    final resourceUsed = ScheduleController.to.resources.firstWhere(
      (res) => res.id == schedule.classResource.resourceId,
    );

    final hourUsed = ScheduleController.to.hours.firstWhere(
      (hour) => hour.id == schedule.hourClass.hourId,
    );

    final dateTime = DateTime.parse(schedule.hourClass.date);
    final dateStr = dateTime.toIso8601String().split("T")[0];
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
      dateTime,
      startTime,
      endTime,
      scheduleColor,
    );

    Navigator.of(context).pop();
  }

  @override
  void initState() {
    super.initState();

    _date = widget.date;
    _dateTextEditingController.text = formatFullDate(_date);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Adicionar evento"),
        actions: [
          Padding(
            padding: const EdgeInsets.all(8.0),
            child: IconButton(
              icon: const Icon(Icons.check_outlined),
              onPressed: _submitForm,
            ),
          ),
        ],
      ),
      body: Padding(
        padding: const EdgeInsets.all(8.0),
        child: Column(
          children: [
            TextField(
              controller: _dateTextEditingController,
              readOnly: true,
              decoration: InputDecoration(
                border: const OutlineInputBorder(),
                label: const Text("Data"),
                suffixIcon: Padding(
                  padding: const EdgeInsets.all(4.0),
                  child: IconButton(
                    icon: const Icon(Icons.calendar_month_outlined),
                    onPressed: _selectDate,
                  ),
                ),
              ),
            ),
            const SizedBox(
              height: 8.0,
            ),
            DropdownMenu(
              enableSearch: false,
              label: const Text("Aula"),
              width: MediaQuery.of(context).size.width - 16.0,
              onSelected: (value) {
                setState(() {
                  _classNumber = value;
                });
              },
              dropdownMenuEntries: classNumbers.keys.map((key) {
                return DropdownMenuEntry(
                  value: key,
                  label: classNumbers[key]!,
                );
              }).toList(),
            ),
            const SizedBox(
              height: 8.0,
            ),
            DropdownMenu(
              enableSearch: false,
              label: const Text("Classe"),
              width: MediaQuery.of(context).size.width - 16.0,
              onSelected: (value) {
                setState(() {
                  _classId = value;
                  _classResourceId = null;
                });

                _resourceTextEditingController.text = "";
              },
              dropdownMenuEntries: _getClassesDropdown(),
            ),
            const SizedBox(
              height: 8.0,
            ),
            DropdownMenu(
              enableSearch: false,
              label: const Text("Recurso"),
              width: MediaQuery.of(context).size.width - 16.0,
              controller: _resourceTextEditingController,
              onSelected: (value) {
                setState(() {
                  _classResourceId = value;
                });
              },
              dropdownMenuEntries: _getClassResourcesDropdown(),
            ),
          ],
        ),
      ),
    );
  }
}
