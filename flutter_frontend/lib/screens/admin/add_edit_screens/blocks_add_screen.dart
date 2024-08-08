import 'package:calendar_view/calendar_view.dart';
import 'package:flutter/material.dart';
import 'package:flutter_frontend/api/blocks_api.dart';
import 'package:flutter_frontend/constants/class_numbers.dart';
import 'package:flutter_frontend/constants/schedule_colors.dart';
import 'package:flutter_frontend/controllers/schedule_controller.dart';
import 'package:flutter_frontend/controllers/user_controller.dart';
import 'package:flutter_frontend/functions/format_date.dart';

class BlocksAddScreen extends StatefulWidget {
  const BlocksAddScreen({super.key});

  @override
  State<BlocksAddScreen> createState() => _BlocksAddScreenState();
}

class _BlocksAddScreenState extends State<BlocksAddScreen> {
  final _dateTextEditingController = TextEditingController();
  final _formKey = GlobalKey<FormState>();
  String _period = "matutine";
  int? _classNumber = 0;
  DateTime? _date;

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
    _dateTextEditingController.text = formatFullDate(picked);
  }

  Future<void> _submitForm() async {
    final token = UserController.to.token.value;
    final blocksApi = BlocksApi(token: token);

    if (_classNumber == null || _date == null) {
      return;
    }

    try {
      final hourUsed = ScheduleController.to.hours.singleWhere(
        (hour) => hour.classNumber == _classNumber,
      );

      final block = await blocksApi.insertOne(
        hourUsed.id,
        _date!.toIso8601String().split("T")[0],
        _period,
      );

      ScheduleController.to.blocks.add(block);

      final date = DateTime.parse(block.date);
      final dateStr = date.toIso8601String().split("T")[0];
      DateTime startTime = DateTime.parse("$dateStr ${hourUsed.start}:00");
      DateTime endTime = DateTime.parse("$dateStr ${hourUsed.finish}:00");

      if (_period == "vespertine") {
        const duration = Duration(hours: 6);

        startTime = startTime.add(duration);
        endTime = endTime.add(duration);
      }

      final event = CalendarEventData(
        title: "Bloqueado",
        date: _date!,
        startTime: startTime,
        endTime: endTime,
        color: blockColor,
      );

      CalendarControllerProvider.of(context).controller.add(event);
    } catch (err) {
      const snackBar = SnackBar(
        content: Text("Erro ao adicionar bloqueio"),
      );

      ScaffoldMessenger.of(context).showSnackBar(snackBar);
      return;
    }

    Navigator.of(context).pop();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        actions: [
          Padding(
            padding: const EdgeInsets.all(8.0),
            child: IconButton(
              onPressed: _submitForm,
              icon: const Icon(Icons.check_outlined),
            ),
          ),
        ],
      ),
      body: Padding(
        padding: const EdgeInsets.all(8.0),
        child: Form(
          key: _formKey,
          child: Column(
            children: [
              TextFormField(
                controller: _dateTextEditingController,
                readOnly: true,
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return "Campo inválido";
                  }

                  return null;
                },
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
                onSelected: (value) => _classNumber = value,
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
              const Text(
                "Período:",
              ),
              ListView(
                shrinkWrap: true,
                children: [
                  ListTile(
                    title: const Text("Matutino"),
                    leading: Radio<String>(
                      value: "matutine",
                      groupValue: _period,
                      onChanged: (value) {
                        setState(() {
                          _period = value!;
                        });
                      },
                    ),
                  ),
                  ListTile(
                    title: const Text("Vespertino"),
                    leading: Radio<String>(
                      value: "vespertine",
                      groupValue: _period,
                      onChanged: (value) {
                        setState(() {
                          _period = value!;
                        });
                      },
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}
