import 'package:flutter/material.dart';
import 'package:flutter_frontend/functions/format_date.dart';

class AddScheduleScreen extends StatefulWidget {
  const AddScheduleScreen({super.key, required this.date});

  final DateTime date;

  @override
  State<AddScheduleScreen> createState() => _AddScheduleScreenState();
}

class _AddScheduleScreenState extends State<AddScheduleScreen> {
  final _dateTextEditingController = TextEditingController();
  var _date = DateTime.now();

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
                      onPressed: () => _selectDate(),
                    ),
                  )),
            ),
            const Expanded(
              child: SizedBox.expand(),
            ),
            Row(
              children: [
                Expanded(
                  child: ElevatedButton(
                    child: const Text("Enviar"),
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
