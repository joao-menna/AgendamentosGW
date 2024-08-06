import 'package:flutter/material.dart';
import 'package:flutter_frontend/classes/klass.dart';
import 'package:flutter_frontend/constants/class_numbers.dart';
import 'package:flutter_frontend/controllers/schedule_controller.dart';
import 'package:flutter_frontend/controllers/user_controller.dart';
import 'package:flutter_frontend/functions/format_date.dart';

class AddScheduleScreen extends StatefulWidget {
  const AddScheduleScreen({super.key, required this.date});

  final DateTime date;

  @override
  State<AddScheduleScreen> createState() => _AddScheduleScreenState();
}

class _AddScheduleScreenState extends State<AddScheduleScreen> {
  final _dateTextEditingController = TextEditingController();
  bool _loadingResourcesDropdown = false;
  DateTime _date = DateTime.now();
  int? _classNumber;
  int? _classId;

  Future<void> _selectDate() async {
    final picked = await showDatePicker(
      context: context,
      firstDate: DateTime.utc(2024, 1, 1),
      lastDate: DateTime.utc(2030, 12, 31),
      initialDate: _date,
    );

    if (picked == null) {
      return;
    }

    _date = picked;
    _dateTextEditingController.text = formatFullDate(_date);
  }

  List<DropdownMenuEntry<int>> _getClassesDropdown() {
    List<Klass> classes = ScheduleController.to.classes;

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

  Future<void> _getResourcesDropdown() async {}

  Future<void> _addEvent() async {}

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
                  )),
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
            DropdownMenu(
              enableSearch: false,
              label: const Text("Classe"),
              width: MediaQuery.of(context).size.width - 16.0,
              onSelected: (value) => _classId = value,
              dropdownMenuEntries: _getClassesDropdown(),
            ),
            const Expanded(
              child: SizedBox.expand(),
            ),
            Row(
              children: [
                Expanded(
                  child: ElevatedButton(
                    child: const Text("Criar"),
                    onPressed: () {},
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
